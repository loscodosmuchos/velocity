// IndexedDB Database Manager
class DatabaseManager {
  constructor() {
    this.dbName = 'ThreadParserDB';
    this.version = 1;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Snippets store
        if (!db.objectStoreNames.contains('snippets')) {
          const snippetStore = db.createObjectStore('snippets', {
            keyPath: 'id',
            autoIncrement: true
          });
          snippetStore.createIndex('language', 'language', { unique: false });
          snippetStore.createIndex('createdAt', 'createdAt', { unique: false });
          snippetStore.createIndex('tags', 'tags', { unique: false, multiEntry: true });
          snippetStore.createIndex('framework', 'framework', { unique: false });
        }

        // Projects store
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', {
            keyPath: 'id',
            autoIncrement: true
          });
        }

        // Share Links store
        if (!db.objectStoreNames.contains('shareLinks')) {
          const shareStore = db.createObjectStore('shareLinks', {
            keyPath: 'id',
            autoIncrement: true
          });
          shareStore.createIndex('shortUrl', 'shortUrl', { unique: true });
          shareStore.createIndex('snippetId', 'snippetId', { unique: false });
        }
      };
    });
  }

  async addSnippet(snippet) {
    const transaction = this.db.transaction(['snippets'], 'readwrite');
    const store = transaction.objectStore('snippets');
    const snippetData = {
      ...snippet,
      createdAt: snippet.createdAt || Date.now(),
      updatedAt: Date.now(),
      shareCount: 0
    };
    return new Promise((resolve, reject) => {
      const request = store.add(snippetData);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getSnippet(id) {
    const transaction = this.db.transaction(['snippets'], 'readonly');
    const store = transaction.objectStore('snippets');
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllSnippets() {
    const transaction = this.db.transaction(['snippets'], 'readonly');
    const store = transaction.objectStore('snippets');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async updateSnippet(id, updates) {
    const snippet = await this.getSnippet(id);
    if (!snippet) throw new Error('Snippet not found');
    
    const updatedSnippet = {
      ...snippet,
      ...updates,
      updatedAt: Date.now()
    };

    const transaction = this.db.transaction(['snippets'], 'readwrite');
    const store = transaction.objectStore('snippets');
    return new Promise((resolve, reject) => {
      const request = store.put(updatedSnippet);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteSnippet(id) {
    const transaction = this.db.transaction(['snippets'], 'readwrite');
    const store = transaction.objectStore('snippets');
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async searchSnippets(query) {
    const allSnippets = await this.getAllSnippets();
    const lowerQuery = query.toLowerCase();
    return allSnippets.filter(snippet => 
      snippet.title.toLowerCase().includes(lowerQuery) ||
      snippet.code.toLowerCase().includes(lowerQuery) ||
      snippet.language.toLowerCase().includes(lowerQuery) ||
      (snippet.tags && snippet.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );
  }

  async filterSnippets(filters) {
    const allSnippets = await this.getAllSnippets();
    return allSnippets.filter(snippet => {
      if (filters.languages && filters.languages.length > 0) {
        if (!filters.languages.includes(snippet.language)) return false;
      }
      if (filters.frameworks && filters.frameworks.length > 0) {
        if (!filters.frameworks.includes(snippet.framework)) return false;
      }
      if (filters.tags && filters.tags.length > 0) {
        if (!snippet.tags || !filters.tags.some(tag => snippet.tags.includes(tag))) return false;
      }
      return true;
    });
  }

  async createShareLink(snippetId, expiryDays = 30) {
    const shortUrl = this.generateShortCode();
    const shareLink = {
      snippetId,
      shortUrl,
      accessCount: 0,
      createdAt: Date.now(),
      expiresAt: expiryDays ? Date.now() + (expiryDays * 24 * 60 * 60 * 1000) : null,
      isActive: true
    };

    const transaction = this.db.transaction(['shareLinks'], 'readwrite');
    const store = transaction.objectStore('shareLinks');
    return new Promise((resolve, reject) => {
      const request = store.add(shareLink);
      request.onsuccess = () => resolve({ ...shareLink, id: request.result });
      request.onerror = () => reject(request.error);
    });
  }

  async getShareLinkByCode(shortUrl) {
    const transaction = this.db.transaction(['shareLinks'], 'readonly');
    const store = transaction.objectStore('shareLinks');
    const index = store.index('shortUrl');
    return new Promise((resolve, reject) => {
      const request = index.get(shortUrl);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async incrementShareAccess(shareId) {
    const transaction = this.db.transaction(['shareLinks'], 'readwrite');
    const store = transaction.objectStore('shareLinks');
    
    return new Promise((resolve, reject) => {
      const getRequest = store.get(shareId);
      getRequest.onsuccess = () => {
        const shareLink = getRequest.result;
        if (shareLink) {
          shareLink.accessCount++;
          const putRequest = store.put(shareLink);
          putRequest.onsuccess = () => resolve(shareLink);
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          reject(new Error('Share link not found'));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async getAllShareLinks() {
    const transaction = this.db.transaction(['shareLinks'], 'readonly');
    const store = transaction.objectStore('shareLinks');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addProject(project) {
    const transaction = this.db.transaction(['projects'], 'readwrite');
    const store = transaction.objectStore('projects');
    const projectData = {
      ...project,
      createdAt: Date.now()
    };
    return new Promise((resolve, reject) => {
      const request = store.add(projectData);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllProjects() {
    const transaction = this.db.transaction(['projects'], 'readonly');
    const store = transaction.objectStore('projects');
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async exportDatabase() {
    const snippets = await this.getAllSnippets();
    const projects = await this.getAllProjects();
    const shareLinks = await this.getAllShareLinks();
    
    return {
      version: this.version,
      exportDate: new Date().toISOString(),
      data: {
        snippets,
        projects,
        shareLinks
      }
    };
  }

  async importDatabase(data) {
    const snippetPromises = data.snippets.map(snippet => this.addSnippet(snippet));
    const projectPromises = data.projects.map(project => this.addProject(project));
    
    await Promise.all([...snippetPromises, ...projectPromises]);
  }

  generateShortCode(length = 8) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async getStatistics() {
    const snippets = await this.getAllSnippets();
    const projects = await this.getAllProjects();
    const shareLinks = await this.getAllShareLinks();

    const languageCounts = {};
    const frameworkCounts = {};
    const purposeCounts = {};

    snippets.forEach(snippet => {
      languageCounts[snippet.language] = (languageCounts[snippet.language] || 0) + 1;
      if (snippet.framework) {
        frameworkCounts[snippet.framework] = (frameworkCounts[snippet.framework] || 0) + 1;
      }
      if (snippet.purpose) {
        purposeCounts[snippet.purpose] = (purposeCounts[snippet.purpose] || 0) + 1;
      }
    });

    return {
      totalSnippets: snippets.length,
      totalProjects: projects.length,
      totalShares: shareLinks.length,
      activeShares: shareLinks.filter(s => s.isActive).length,
      languageCounts,
      frameworkCounts,
      purposeCounts,
      averageConfidence: snippets.reduce((sum, s) => sum + s.confidence, 0) / snippets.length || 0
    };
  }
}

const dbManager = new DatabaseManager();