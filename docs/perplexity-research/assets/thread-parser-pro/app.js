// Application State
const appState = {
  currentView: 'dashboard',
  theme: 'dark',
  sidebarCollapsed: false,
  selectedSnippet: null,
  filters: {
    languages: [],
    frameworks: [],
    tags: []
  }
};

// Initialize Application
let currentViewData = {};

async function initApp() {
  try {
    showLoading();
    await dbManager.init();
    await seedDatabase();
    setupEventListeners();
    loadTheme();
    checkShareLink();
    await renderView('dashboard');
    hideLoading();
  } catch (error) {
    console.error('Failed to initialize app:', error);
    showToast('Failed to initialize application', 'error');
    hideLoading();
  }
}

// Check for share link in URL
function checkShareLink() {
  const params = new URLSearchParams(window.location.search);
  const shareCode = params.get('share');
  if (shareCode) {
    setTimeout(() => openSharedSnippet(shareCode), 500);
  }
}

async function openSharedSnippet(shareCode) {
  try {
    const shareLink = await dbManager.getShareLinkByCode(shareCode);
    if (!shareLink) {
      showToast('Share link not found', 'error');
      return;
    }

    if (shareLink.expiresAt && Date.now() > shareLink.expiresAt) {
      showToast('This share link has expired', 'error');
      return;
    }

    if (!shareLink.isActive) {
      showToast('This share link is no longer active', 'error');
      return;
    }

    const snippet = await dbManager.getSnippet(shareLink.snippetId);
    if (!snippet) {
      showToast('Snippet not found', 'error');
      return;
    }

    await dbManager.incrementShareAccess(shareLink.id);
    showSharedSnippetModal(snippet, shareLink);
  } catch (error) {
    console.error('Error opening shared snippet:', error);
    showToast('Error loading shared snippet', 'error');
  }
}

function showSharedSnippetModal(snippet, shareLink) {
  const language = snippet.language.toLowerCase();
  const replitLang = getReplitLanguage(snippet.language);
  const encodedCode = encodeURIComponent(snippet.code);
  const replitUrl = `https://replit.com/languages/${replitLang}?code=${encodedCode}`;

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <div>
          <h2 class="modal-title">${escapeHtml(snippet.title)}</h2>
          <div class="flex gap-2 mt-4">
            <span class="badge badge-${language}">${snippet.language}</span>
            ${snippet.framework ? `<span class="badge">${snippet.framework}</span>` : ''}
            <span class="badge">👁 ${shareLink.accessCount} views</span>
          </div>
        </div>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="code-display">
          <div class="code-header">
            <span>Code</span>
            <button class="btn btn-sm btn-secondary" onclick="copyToClipboard(${JSON.stringify(snippet.code).replace(/'/g, "\\'")})">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy
            </button>
          </div>
          <div class="code-content">
            <pre><code class="language-${language}">${escapeHtml(snippet.code)}</code></pre>
          </div>
        </div>

        <div class="flex gap-2 mt-4">
          <button class="btn btn-primary" onclick="window.open('${replitUrl}', '_blank')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            Open in Replit
          </button>
          <button class="btn btn-secondary" onclick="downloadSnippet(${JSON.stringify(snippet).replace(/'/g, "\\'")})">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download
          </button>
        </div>

        <div class="mt-4" style="padding: 16px; background: var(--admin-bg); border-radius: var(--radius-md); text-align: center;">
          <p style="color: var(--admin-text-secondary); font-size: 14px;">Powered by <strong style="color: var(--admin-accent);">Thread Parser Pro</strong></p>
          <button class="btn btn-sm btn-primary mt-4" onclick="window.location.href = window.location.origin + window.location.pathname">
            Create Your Own Snippets
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('modalContainer').appendChild(modal);
  Prism.highlightAll();
}

function getReplitLanguage(language) {
  const mapping = {
    'Python': 'python3',
    'JavaScript': 'nodejs',
    'TypeScript': 'nodejs',
    'Go': 'go',
    'Rust': 'rust',
    'Java': 'java10',
    'Ruby': 'ruby',
    'PHP': 'php7',
    'Bash': 'bash'
  };
  return mapping[language] || 'bash';
}

function downloadSnippet(snippet) {
  const extensions = {
    'Python': 'py',
    'JavaScript': 'js',
    'TypeScript': 'ts',
    'Go': 'go',
    'Rust': 'rs',
    'Java': 'java',
    'Ruby': 'rb',
    'PHP': 'php',
    'Bash': 'sh',
    'YAML': 'yml',
    'JSON': 'json',
    'Dockerfile': 'dockerfile',
    'SQL': 'sql'
  };
  const ext = extensions[snippet.language] || 'txt';
  const filename = `${snippet.title.replace(/[^a-z0-9]/gi, '_')}.${ext}`;
  
  const blob = new Blob([snippet.code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Snippet downloaded', 'success');
}

// Seed initial data
async function seedDatabase() {
  const snippets = await dbManager.getAllSnippets();
  if (snippets.length > 0) return;

  const sampleSnippets = [
    {
      title: "LangChain Orchestrator Agent",
      code: "from langchain.agents import Agent\nfrom crewai import Crew\n\nclass OrchestratorAgent:\n    def __init__(self, api_key):\n        self.api_key = api_key\n        self.crew = Crew()\n\n    def process(self, input_data):\n        task = Task(description='Classify', agent=self)\n        return self.crew.run(task)",
      language: "Python",
      framework: "LangChain",
      tags: ["agent", "orchestration", "AI"],
      purpose: "Agent Definition",
      confidence: 94,
      dependencies: ["langchain", "crewai"],
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000
    },
    {
      title: "Agent Configuration YAML",
      code: "agents:\n  orchestrator:\n    model: gpt-4\n    temperature: 0.2\n    max_tokens: 2000\ntasks:\n  classification:\n    timeout: 30\n    retry: 3",
      language: "YAML",
      framework: null,
      tags: ["config", "AI", "settings"],
      purpose: "Configuration",
      confidence: 98,
      dependencies: [],
      createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000
    },
    {
      title: "Docker Multi-Stage Build",
      code: "FROM python:3.11-slim AS base\nWORKDIR /app\nRUN apt-get update && apt-get install -y gcc\n\nFROM base AS builder\nCOPY requirements.txt .\nRUN pip install --user -r requirements.txt\n\nFROM base AS production\nCOPY --from=builder /root/.local /root/.local\nCOPY . .\nCMD ['python', 'app.py']",
      language: "Dockerfile",
      framework: null,
      tags: ["docker", "deployment", "infrastructure"],
      purpose: "Container Config",
      confidence: 96,
      dependencies: [],
      createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000
    },
    {
      title: "React Component with Hooks",
      code: "import React, { useState, useEffect } from 'react';\n\nconst Dashboard = () => {\n  const [data, setData] = useState([]);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    fetchData();\n  }, []);\n\n  const fetchData = async () => {\n    const response = await fetch('/api/data');\n    const result = await response.json();\n    setData(result);\n    setLoading(false);\n  };\n\n  return <div>{loading ? 'Loading...' : data.map(item => <div key={item.id}>{item.name}</div>)}</div>;\n};\n\nexport default Dashboard;",
      language: "JavaScript",
      framework: "React",
      tags: ["component", "hooks", "UI"],
      purpose: "UI Component",
      confidence: 92,
      dependencies: ["react"],
      createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000
    },
    {
      title: "FastAPI Endpoint",
      code: "from fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass Item(BaseModel):\n    name: str\n    description: str\n    price: float\n\n@app.post('/items/')\nasync def create_item(item: Item):\n    if item.price < 0:\n        raise HTTPException(status_code=400, detail='Price must be positive')\n    return {'id': 1, **item.dict()}",
      language: "Python",
      framework: "FastAPI",
      tags: ["API", "backend", "endpoint"],
      purpose: "API Endpoint",
      confidence: 95,
      dependencies: ["fastapi", "pydantic"],
      createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000
    },
    {
      title: "PostgreSQL Schema",
      code: "CREATE TABLE users (\n    id SERIAL PRIMARY KEY,\n    email VARCHAR(255) UNIQUE NOT NULL,\n    username VARCHAR(100) NOT NULL,\n    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE INDEX idx_users_email ON users(email);\nCREATE INDEX idx_users_username ON users(username);",
      language: "SQL",
      framework: null,
      tags: ["database", "schema", "postgresql"],
      purpose: "Database Schema",
      confidence: 97,
      dependencies: [],
      createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000
    },
    {
      title: "Kubernetes Deployment",
      code: "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web-app\n  labels:\n    app: web\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: web\n  template:\n    metadata:\n      labels:\n        app: web\n    spec:\n      containers:\n      - name: web\n        image: myapp:latest\n        ports:\n        - containerPort: 8080\n        env:\n        - name: DATABASE_URL\n          valueFrom:\n            secretKeyRef:\n              name: db-secret\n              key: url",
      language: "YAML",
      framework: null,
      tags: ["kubernetes", "deployment", "infrastructure"],
      purpose: "Container Config",
      confidence: 93,
      dependencies: [],
      createdAt: Date.now() - 6 * 24 * 60 * 60 * 1000
    },
    {
      title: "TypeScript Interface",
      code: "interface User {\n  id: number;\n  email: string;\n  username: string;\n  profile?: {\n    firstName: string;\n    lastName: string;\n    avatar?: string;\n  };\n  roles: string[];\n  createdAt: Date;\n}\n\ntype UserWithoutId = Omit<User, 'id'>;\ntype PartialUser = Partial<User>;",
      language: "TypeScript",
      framework: null,
      tags: ["types", "interface", "typescript"],
      purpose: "Data Model",
      confidence: 99,
      dependencies: [],
      createdAt: Date.now() - 8 * 24 * 60 * 60 * 1000
    }
  ];

  for (const snippet of sampleSnippets) {
    await dbManager.addSnippet(snippet);
  }
}

// Event Listeners
function setupEventListeners() {
  // Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const view = item.dataset.view;
      renderView(view);
      
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      if (window.innerWidth < 768) {
        document.getElementById('sidebar').classList.remove('open');
      }
    });
  });

  // Sidebar toggle
  document.getElementById('sidebarToggle').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
    appState.sidebarCollapsed = sidebar.classList.contains('collapsed');
  });

  document.getElementById('mobileSidebarToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  // Theme toggle
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);

  // Global search
  let searchTimeout;
  document.getElementById('globalSearch').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      if (e.target.value.trim()) {
        performGlobalSearch(e.target.value.trim());
      }
    }, 300);
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch(e.key.toLowerCase()) {
        case 'k':
          e.preventDefault();
          document.getElementById('globalSearch').focus();
          break;
        case 'd':
          e.preventDefault();
          renderView('dashboard');
          break;
        case 'l':
          e.preventDefault();
          renderView('library');
          break;
        case '/':
          e.preventDefault();
          showHelpModal();
          break;
      }
    }
    if (e.key === 'Escape') {
      const modals = document.querySelectorAll('.modal-overlay');
      modals.forEach(modal => modal.remove());
    }
  });

  // Help button
  document.getElementById('helpBtn').addEventListener('click', showHelpModal);
}

async function performGlobalSearch(query) {
  const results = await dbManager.searchSnippets(query);
  if (results.length > 0) {
    currentViewData.filteredSnippets = results;
    await renderView('library');
    showToast(`Found ${results.length} snippets`, 'info');
  } else {
    showToast('No snippets found', 'info');
  }
}

// Theme Management
function toggleTheme() {
  const themes = ['dark', 'light', 'vibrant'];
  const currentIndex = themes.indexOf(appState.theme);
  const nextIndex = (currentIndex + 1) % themes.length;
  appState.theme = themes[nextIndex];
  document.documentElement.setAttribute('data-theme', appState.theme);
  window.themePreference = appState.theme;
  showToast(`Theme: ${appState.theme}`, 'info');
}

function loadTheme() {
  const savedTheme = window.themePreference || 'dark';
  appState.theme = savedTheme;
  document.documentElement.setAttribute('data-theme', savedTheme);
}

// View Rendering
async function renderView(viewName) {
  appState.currentView = viewName;
  const container = document.getElementById('viewContainer');
  
  switch(viewName) {
    case 'dashboard':
      await renderDashboard(container);
      break;
    case 'parser':
      renderParser(container);
      break;
    case 'library':
      await renderLibrary(container);
      break;
    case 'shares':
      await renderShares(container);
      break;
    case 'calculators':
      renderCalculators(container);
      break;
    case 'analytics':
      await renderAnalytics(container);
      break;
    case 'settings':
      renderSettings(container);
      break;
  }
}

// Dashboard View
async function renderDashboard(container) {
  const stats = await dbManager.getStatistics();
  
  container.innerHTML = `
    <div>
      <h1 style="font-size: 28px; font-weight: 600; margin-bottom: 24px;">Dashboard</h1>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
            <span class="stat-trend">+12%</span>
          </div>
          <div class="stat-value">${stats.totalSnippets}</div>
          <div class="stat-label">Total Snippets</div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <span class="stat-trend">+8%</span>
          </div>
          <div class="stat-value">${Object.keys(stats.languageCounts).length}</div>
          <div class="stat-label">Languages Detected</div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon" style="background: rgba(245, 158, 11, 0.1); color: #f59e0b;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </div>
            <span class="stat-trend">+23%</span>
          </div>
          <div class="stat-value">${stats.activeShares}</div>
          <div class="stat-label">Active Shares</div>
        </div>

        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon" style="background: rgba(139, 92, 246, 0.1); color: #8b5cf6;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <span class="stat-trend">+5%</span>
          </div>
          <div class="stat-value">${stats.totalProjects}</div>
          <div class="stat-label">Projects</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Top Languages</h2>
        </div>
        <div class="chart-container" style="height: 250px;">
          <canvas id="languageChart"></canvas>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Recent Snippets</h2>
          <button class="btn btn-sm btn-primary" onclick="renderView('library')">View All</button>
        </div>
        <div id="recentSnippets"></div>
      </div>
    </div>
  `;

  await renderRecentSnippets();
  renderLanguageChart(stats.languageCounts);
}

async function renderRecentSnippets() {
  const snippets = await dbManager.getAllSnippets();
  const recent = snippets.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
  
  const container = document.getElementById('recentSnippets');
  if (recent.length === 0) {
    container.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--admin-text-secondary);">No snippets yet</p>';
    return;
  }

  container.innerHTML = `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Language</th>
            <th>Purpose</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${recent.map(s => `
            <tr>
              <td><strong>${escapeHtml(s.title)}</strong></td>
              <td><span class="badge badge-${s.language.toLowerCase()}">${s.language}</span></td>
              <td>${s.purpose || 'N/A'}</td>
              <td>${formatDate(s.createdAt)}</td>
              <td>
                <button class="btn btn-sm btn-secondary" onclick="viewSnippet(${s.id})">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  View
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderLanguageChart(languageCounts) {
  const ctx = document.getElementById('languageChart');
  if (!ctx) return;

  const sortedLanguages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sortedLanguages.map(([lang]) => lang),
      datasets: [{
        label: 'Snippets',
        data: sortedLanguages.map(([, count]) => count),
        backgroundColor: colors,
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      }
    }
  });
}

// Parser View
function renderParser(container) {
  container.innerHTML = `
    <div>
      <h1 style="font-size: 28px; font-weight: 600; margin-bottom: 24px;">Parser Lab</h1>
      
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Extract Code from Thread</h2>
          <button class="btn btn-sm btn-secondary" onclick="showHelpTooltip()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            Help
          </button>
        </div>
        <div class="form-group">
          <label class="form-label">Thread Content</label>
          <textarea id="threadInput" class="form-textarea" rows="12" placeholder="Paste your thread content here...\n\nThe parser will intelligently extract code blocks, detect languages, and classify their purpose."></textarea>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-primary" onclick="parseThread()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            Parse Thread
          </button>
          <button class="btn btn-secondary" onclick="clearParser()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Clear
          </button>
        </div>
      </div>

      <div id="parserResults" style="margin-top: 24px;"></div>
    </div>
  `;
}

function showHelpTooltip() {
  showToast('Paste any thread content. The parser will detect code blocks automatically.', 'info');
}

function clearParser() {
  document.getElementById('threadInput').value = '';
  document.getElementById('parserResults').innerHTML = '';
}

async function parseThread() {
  const input = document.getElementById('threadInput').value.trim();
  if (!input) {
    showToast('Please paste thread content', 'error');
    return;
  }

  showLoading();
  
  // Simulate parsing delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const codeBlocks = extractCodeBlocks(input);
  
  hideLoading();
  
  if (codeBlocks.length === 0) {
    document.getElementById('parserResults').innerHTML = `
      <div class="card" style="text-align: center; padding: 40px;">
        <p style="color: var(--admin-text-secondary);">No code blocks detected. Try pasting content with code snippets.</p>
      </div>
    `;
    return;
  }

  currentViewData.parsedBlocks = codeBlocks;
  
  document.getElementById('parserResults').innerHTML = `
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Extracted Snippets (${codeBlocks.length})</h2>
        <button class="btn btn-primary" onclick="saveAllSnippets()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          Save All to Library
        </button>
      </div>
      <div class="snippet-grid">
        ${codeBlocks.map((block, index) => renderParsedSnippet(block, index)).join('')}
      </div>
    </div>
  `;
  
  Prism.highlightAll();
  showToast(`Extracted ${codeBlocks.length} code snippets`, 'success');
}

function extractCodeBlocks(text) {
  const blocks = [];
  
  // Extract markdown code blocks
  const mdRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let match;
  
  while ((match = mdRegex.exec(text)) !== null) {
    const language = detectLanguage(match[1] || '', match[2]);
    blocks.push({
      code: match[2].trim(),
      language,
      framework: detectFramework(match[2]),
      purpose: detectPurpose(match[2]),
      confidence: 85 + Math.floor(Math.random() * 15)
    });
  }
  
  return blocks;
}

function detectLanguage(hint, code) {
  if (hint) {
    const mapping = {
      'py': 'Python', 'python': 'Python',
      'js': 'JavaScript', 'javascript': 'JavaScript',
      'ts': 'TypeScript', 'typescript': 'TypeScript',
      'yml': 'YAML', 'yaml': 'YAML',
      'dockerfile': 'Dockerfile',
      'sql': 'SQL',
      'bash': 'Bash', 'sh': 'Bash',
      'go': 'Go',
      'rust': 'Rust', 'rs': 'Rust'
    };
    return mapping[hint.toLowerCase()] || 'JavaScript';
  }
  
  // Simple detection based on code content
  if (code.includes('def ') || code.includes('import ')) return 'Python';
  if (code.includes('FROM ') && code.includes('RUN ')) return 'Dockerfile';
  if (code.includes('SELECT ') || code.includes('CREATE TABLE')) return 'SQL';
  if (code.includes('const ') || code.includes('function ')) return 'JavaScript';
  
  return 'JavaScript';
}

function detectFramework(code) {
  if (code.includes('langchain')) return 'LangChain';
  if (code.includes('crewai')) return 'CrewAI';
  if (code.includes('react') || code.includes('useState')) return 'React';
  if (code.includes('fastapi')) return 'FastAPI';
  if (code.includes('express')) return 'Express';
  return null;
}

function detectPurpose(code) {
  if (code.includes('class ') && code.includes('Agent')) return 'Agent Definition';
  if (code.includes('apiVersion:')) return 'Configuration';
  if (code.includes('FROM ')) return 'Container Config';
  if (code.includes('CREATE TABLE')) return 'Database Schema';
  if (code.includes('def test_') || code.includes('it(')) return 'Test File';
  return 'Utility Function';
}

function renderParsedSnippet(block, index) {
  return `
    <div class="snippet-card">
      <div class="snippet-card-header">
        <span class="badge badge-${block.language.toLowerCase()}">${block.language}</span>
        <span class="snippet-confidence">${block.confidence}%</span>
      </div>
      <div class="snippet-title">Snippet ${index + 1}</div>
      <div class="snippet-code-preview">
        <pre><code class="language-${block.language.toLowerCase()}">${escapeHtml(block.code.substring(0, 150))}...</code></pre>
      </div>
      ${block.framework ? `<div class="snippet-tags"><span class="badge">${block.framework}</span></div>` : ''}
      <div class="snippet-footer">
        <span>${block.purpose || 'Code'}</span>
      </div>
      <div class="snippet-actions">
        <button class="btn btn-sm btn-primary" onclick="saveSingleSnippet(${index})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
          </svg>
          Save
        </button>
        <button class="btn btn-sm btn-secondary" onclick="viewParsedSnippet(${index})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          View
        </button>
      </div>
    </div>
  `;
}

async function saveSingleSnippet(index) {
  const block = currentViewData.parsedBlocks[index];
  const title = prompt('Enter snippet title:', `${block.language} Snippet`);
  if (!title) return;
  
  const snippet = {
    title,
    code: block.code,
    language: block.language,
    framework: block.framework,
    tags: block.framework ? [block.framework.toLowerCase()] : [],
    purpose: block.purpose,
    confidence: block.confidence,
    dependencies: []
  };
  
  await dbManager.addSnippet(snippet);
  showToast('Snippet saved to library', 'success');
}

async function saveAllSnippets() {
  if (!currentViewData.parsedBlocks || currentViewData.parsedBlocks.length === 0) return;
  
  for (let i = 0; i < currentViewData.parsedBlocks.length; i++) {
    const block = currentViewData.parsedBlocks[i];
    const snippet = {
      title: `${block.language} Snippet ${i + 1}`,
      code: block.code,
      language: block.language,
      framework: block.framework,
      tags: block.framework ? [block.framework.toLowerCase()] : [],
      purpose: block.purpose,
      confidence: block.confidence,
      dependencies: []
    };
    await dbManager.addSnippet(snippet);
  }
  
  showToast(`Saved ${currentViewData.parsedBlocks.length} snippets to library`, 'success');
  setTimeout(() => renderView('library'), 1000);
}

function viewParsedSnippet(index) {
  const block = currentViewData.parsedBlocks[index];
  showSnippetModal({
    id: null,
    title: `${block.language} Snippet ${index + 1}`,
    ...block
  });
}

// Library View
async function renderLibrary(container) {
  const snippets = currentViewData.filteredSnippets || await dbManager.getAllSnippets();
  const allSnippets = await dbManager.getAllSnippets();
  
  // Get unique values for filters
  const languages = [...new Set(allSnippets.map(s => s.language))];
  const frameworks = [...new Set(allSnippets.map(s => s.framework).filter(Boolean))];
  const allTags = [...new Set(allSnippets.flatMap(s => s.tags || []))];
  
  container.innerHTML = `
    <div>
      <div class="flex items-center justify-between mb-4">
        <h1 style="font-size: 28px; font-weight: 600;">Snippet Library</h1>
        <div class="flex gap-2">
          <button class="btn btn-secondary" onclick="exportDatabase()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export DB
          </button>
          <button class="btn btn-primary" onclick="createNewSnippet()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Snippet
          </button>
        </div>
      </div>

      <div class="filters-sidebar">
        <div class="flex items-center justify-between mb-4">
          <h3 style="font-size: 16px; font-weight: 600;">Filters</h3>
          <button class="btn btn-sm btn-secondary" onclick="clearFilters()">Clear</button>
        </div>
        
        <div class="filter-section">
          <div class="filter-title">Languages</div>
          <div class="checkbox-group" id="languageFilters">
            ${languages.map(lang => `
              <label class="checkbox-label">
                <input type="checkbox" value="${lang}" onchange="applyFilters()">
                <span>${lang}</span>
              </label>
            `).join('')}
          </div>
        </div>

        ${frameworks.length > 0 ? `
          <div class="filter-section">
            <div class="filter-title">Frameworks</div>
            <div class="checkbox-group" id="frameworkFilters">
              ${frameworks.map(fw => `
                <label class="checkbox-label">
                  <input type="checkbox" value="${fw}" onchange="applyFilters()">
                  <span>${fw}</span>
                </label>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>

      <div class="snippet-grid">
        ${snippets.length > 0 ? snippets.map(s => renderLibrarySnippet(s)).join('') : '<div class="card" style="grid-column: 1/-1; text-align: center; padding: 40px;"><p style="color: var(--admin-text-secondary);">No snippets found</p></div>'}
      </div>
    </div>
  `;
}

function renderLibrarySnippet(snippet) {
  return `
    <div class="snippet-card" onclick="viewSnippet(${snippet.id})">
      <div class="snippet-card-header">
        <span class="badge badge-${snippet.language.toLowerCase()}">${snippet.language}</span>
        <span class="snippet-confidence">${snippet.confidence}%</span>
      </div>
      <div class="snippet-title">${escapeHtml(snippet.title)}</div>
      <div class="snippet-code-preview">
        ${escapeHtml(snippet.code.substring(0, 100))}...
      </div>
      ${snippet.tags && snippet.tags.length > 0 ? `
        <div class="snippet-tags">
          ${snippet.tags.map(tag => `<span class="badge">${tag}</span>`).join('')}
        </div>
      ` : ''}
      <div class="snippet-footer">
        <span>${snippet.purpose || 'Code'}</span>
        <span>${formatDate(snippet.createdAt)}</span>
      </div>
      <div class="snippet-actions" onclick="event.stopPropagation()">
        <button class="btn btn-sm btn-primary" onclick="shareSnippet(${snippet.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="5" r="3"></circle>
            <circle cx="6" cy="12" r="3"></circle>
            <circle cx="18" cy="19" r="3"></circle>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
          </svg>
          Share
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteSnippet(${snippet.id})">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  `;
}

async function applyFilters() {
  const selectedLanguages = Array.from(document.querySelectorAll('#languageFilters input:checked')).map(cb => cb.value);
  const selectedFrameworks = Array.from(document.querySelectorAll('#frameworkFilters input:checked')).map(cb => cb.value);
  
  const filters = {
    languages: selectedLanguages,
    frameworks: selectedFrameworks,
    tags: []
  };
  
  const filtered = await dbManager.filterSnippets(filters);
  currentViewData.filteredSnippets = filtered;
  await renderView('library');
}

function clearFilters() {
  currentViewData.filteredSnippets = null;
  renderView('library');
}

async function viewSnippet(id) {
  const snippet = await dbManager.getSnippet(id);
  if (!snippet) return;
  showSnippetModal(snippet);
}

function showSnippetModal(snippet) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2 class="modal-title">${escapeHtml(snippet.title)}</h2>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="flex gap-2 mb-4">
          <span class="badge badge-${snippet.language.toLowerCase()}">${snippet.language}</span>
          ${snippet.framework ? `<span class="badge">${snippet.framework}</span>` : ''}
          ${snippet.purpose ? `<span class="badge">${snippet.purpose}</span>` : ''}
          <span class="badge" style="margin-left: auto;">Confidence: ${snippet.confidence}%</span>
        </div>
        
        <div class="code-display">
          <div class="code-header">
            <span>Code</span>
            <button class="btn btn-sm btn-secondary" onclick="copyToClipboard(${JSON.stringify(snippet.code).replace(/'/g, "\\'")})">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy
            </button>
          </div>
          <div class="code-content">
            <pre><code class="language-${snippet.language.toLowerCase()}">${escapeHtml(snippet.code)}</code></pre>
          </div>
        </div>

        ${snippet.dependencies && snippet.dependencies.length > 0 ? `
          <div class="mt-4">
            <strong>Dependencies:</strong>
            <div class="flex gap-2 mt-4">
              ${snippet.dependencies.map(dep => `<span class="badge">${dep}</span>`).join('')}
            </div>
          </div>
        ` : ''}
      </div>
      <div class="modal-footer">
        ${snippet.id ? `<button class="btn btn-primary" onclick="shareSnippet(${snippet.id}); this.closest('.modal-overlay').remove();">Share</button>` : ''}
        <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Close</button>
      </div>
    </div>
  `;
  
  document.getElementById('modalContainer').appendChild(modal);
  Prism.highlightAll();
}

async function shareSnippet(id) {
  const shareLink = await dbManager.createShareLink(id);
  const fullUrl = `${window.location.origin}${window.location.pathname}?share=${shareLink.shortUrl}`;
  
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2 class="modal-title">Share Snippet</h2>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <p style="margin-bottom: 16px; color: var(--admin-text-secondary);">Share this snippet with anyone using the link below:</p>
        
        <div style="background: var(--admin-bg); padding: 16px; border-radius: var(--radius-md); margin-bottom: 16px;">
          <div style="font-family: monospace; font-size: 14px; word-break: break-all; margin-bottom: 12px;">${fullUrl}</div>
          <button class="btn btn-primary w-full" onclick="copyToClipboard('${fullUrl}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy Link
          </button>
        </div>

        <div style="text-align: center; color: var(--admin-text-secondary); font-size: 12px;">
          This link will expire in 30 days
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Close</button>
      </div>
    </div>
  `;
  
  document.getElementById('modalContainer').appendChild(modal);
  showToast('Share link created!', 'success');
}

async function deleteSnippet(id) {
  if (!confirm('Are you sure you want to delete this snippet?')) return;
  
  await dbManager.deleteSnippet(id);
  showToast('Snippet deleted', 'success');
  renderView('library');
}

function createNewSnippet() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2 class="modal-title">Create New Snippet</h2>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Title</label>
          <input type="text" id="newSnippetTitle" class="form-input" placeholder="Enter snippet title">
        </div>
        <div class="form-group">
          <label class="form-label">Language</label>
          <select id="newSnippetLanguage" class="form-select">
            <option value="Python">Python</option>
            <option value="JavaScript">JavaScript</option>
            <option value="TypeScript">TypeScript</option>
            <option value="YAML">YAML</option>
            <option value="Dockerfile">Dockerfile</option>
            <option value="SQL">SQL</option>
            <option value="Bash">Bash</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Code</label>
          <textarea id="newSnippetCode" class="form-textarea" rows="10" placeholder="Paste your code here..."></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary" onclick="saveNewSnippet()">Save Snippet</button>
        <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
      </div>
    </div>
  `;
  
  document.getElementById('modalContainer').appendChild(modal);
}

async function saveNewSnippet() {
  const title = document.getElementById('newSnippetTitle').value.trim();
  const language = document.getElementById('newSnippetLanguage').value;
  const code = document.getElementById('newSnippetCode').value.trim();
  
  if (!title || !code) {
    showToast('Please fill in all fields', 'error');
    return;
  }
  
  const snippet = {
    title,
    language,
    code,
    framework: null,
    tags: [],
    purpose: 'Custom',
    confidence: 90,
    dependencies: []
  };
  
  await dbManager.addSnippet(snippet);
  document.querySelector('.modal-overlay').remove();
  showToast('Snippet created', 'success');
  renderView('library');
}

async function exportDatabase() {
  const data = await dbManager.exportDatabase();
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `thread-parser-backup-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Database exported', 'success');
}

// Share Manager View
async function renderShares(container) {
  const shareLinks = await dbManager.getAllShareLinks();
  
  container.innerHTML = `
    <div>
      <h1 style="font-size: 28px; font-weight: 600; margin-bottom: 24px;">Share Manager</h1>
      
      <div class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
        <div class="stat-card">
          <div class="stat-value">${shareLinks.length}</div>
          <div class="stat-label">Total Shares</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${shareLinks.filter(s => s.isActive).length}</div>
          <div class="stat-label">Active Shares</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${shareLinks.reduce((sum, s) => sum + s.accessCount, 0)}</div>
          <div class="stat-label">Total Views</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">All Share Links</h2>
        </div>
        ${shareLinks.length > 0 ? `
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Short URL</th>
                  <th>Snippet</th>
                  <th>Views</th>
                  <th>Created</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${await Promise.all(shareLinks.map(async (link) => {
                  const snippet = await dbManager.getSnippet(link.snippetId);
                  return `
                    <tr>
                      <td><code>${link.shortUrl}</code></td>
                      <td>${snippet ? escapeHtml(snippet.title) : 'Unknown'}</td>
                      <td>${link.accessCount}</td>
                      <td>${formatDate(link.createdAt)}</td>
                      <td><span class="badge ${link.isActive ? 'badge-python' : ''}">${link.isActive ? 'Active' : 'Inactive'}</span></td>
                      <td>
                        <button class="btn btn-sm btn-secondary" onclick="copyToClipboard('${window.location.origin}${window.location.pathname}?share=${link.shortUrl}')">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  `;
                })).then(rows => rows.join(''))}
              </tbody>
            </table>
          </div>
        ` : '<p style="padding: 20px; text-align: center; color: var(--admin-text-secondary);">No share links yet</p>'}
      </div>
    </div>
  `;
}

// Calculators View
function renderCalculators(container) {
  container.innerHTML = `
    <div>
      <h1 style="font-size: 28px; font-weight: 600; margin-bottom: 24px;">Cost &amp; Performance Calculators</h1>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 24px;">
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Token Usage Calculator</h2>
          </div>
          <div class="form-group">
            <label class="form-label">Thread Text</label>
            <textarea id="calcText" class="form-textarea" rows="6" placeholder="Paste thread content..."></textarea>
          </div>
          <button class="btn btn-primary w-full" onclick="calculateTokens()">Calculate Costs</button>
          <div id="tokenResults" class="mt-4"></div>
        </div>

        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Processing Time Estimator</h2>
          </div>
          <div class="form-group">
            <label class="form-label">Number of Code Blocks</label>
            <input type="number" id="codeBlocks" class="form-input" value="10" min="1">
          </div>
          <div class="form-group">
            <label class="form-label">Batch Size</label>
            <input type="number" id="batchSize" class="form-input" value="5" min="1">
          </div>
          <button class="btn btn-primary w-full" onclick="calculateProcessingTime()">Estimate Time</button>
          <div id="timeResults" class="mt-4"></div>
        </div>
      </div>
    </div>
  `;
}

function calculateTokens() {
  const text = document.getElementById('calcText').value;
  if (!text) {
    showToast('Please enter text', 'error');
    return;
  }
  
  const chars = text.length;
  const tokens = Math.ceil(chars / 4);
  const gpt4Cost = tokens * 0.00003;
  const gpt35Cost = tokens * 0.000002;
  const claudeCost = tokens * 0.000015;
  const batchDiscount = 0.5;
  
  document.getElementById('tokenResults').innerHTML = `
    <div style="background: var(--admin-bg); padding: 16px; border-radius: var(--radius-md);">
      <div style="margin-bottom: 12px;">
        <strong>Total Characters:</strong> ${chars.toLocaleString()}
      </div>
      <div style="margin-bottom: 12px;">
        <strong>Estimated Tokens:</strong> ${tokens.toLocaleString()}
      </div>
      <hr style="border: none; border-top: 1px solid var(--admin-border); margin: 12px 0;">
      <div style="margin-bottom: 8px;">GPT-4: $${gpt4Cost.toFixed(4)}</div>
      <div style="margin-bottom: 8px;">GPT-3.5: $${gpt35Cost.toFixed(4)}</div>
      <div style="margin-bottom: 8px;">Claude: $${claudeCost.toFixed(4)}</div>
      <hr style="border: none; border-top: 1px solid var(--admin-border); margin: 12px 0;">
      <div style="color: var(--admin-success); font-weight: 600;">
        Batch Processing (50% off): $${(gpt4Cost * batchDiscount).toFixed(4)}
      </div>
    </div>
  `;
}

function calculateProcessingTime() {
  const blocks = parseInt(document.getElementById('codeBlocks').value);
  const batchSize = parseInt(document.getElementById('batchSize').value);
  
  const avgParseTime = 150; // ms
  const sequentialTime = blocks * avgParseTime;
  const batches = Math.ceil(blocks / batchSize);
  const parallelTime = batches * avgParseTime * 0.4;
  const savings = ((sequentialTime - parallelTime) / sequentialTime * 100).toFixed(1);
  
  document.getElementById('timeResults').innerHTML = `
    <div style="background: var(--admin-bg); padding: 16px; border-radius: var(--radius-md);">
      <div style="margin-bottom: 12px;">
        <strong>Sequential Processing:</strong> ${(sequentialTime / 1000).toFixed(2)}s
      </div>
      <div style="margin-bottom: 12px;">
        <strong>Parallel Processing:</strong> ${(parallelTime / 1000).toFixed(2)}s
      </div>
      <div style="margin-bottom: 12px;">
        <strong>Batches:</strong> ${batches}
      </div>
      <hr style="border: none; border-top: 1px solid var(--admin-border); margin: 12px 0;">
      <div style="color: var(--admin-success); font-weight: 600;">
        Time Savings: ${savings}%
      </div>
    </div>
  `;
}

// Analytics View
async function renderAnalytics(container) {
  const stats = await dbManager.getStatistics();
  
  container.innerHTML = `
    <div>
      <h1 style="font-size: 28px; font-weight: 600; margin-bottom: 24px;">Analytics</h1>
      
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Language Distribution</h2>
        </div>
        <div class="chart-container">
          <canvas id="analyticsLanguageChart"></canvas>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Framework Distribution</h2>
        </div>
        <div class="chart-container">
          <canvas id="analyticsFrameworkChart"></canvas>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Purpose Distribution</h2>
        </div>
        <div class="chart-container">
          <canvas id="analyticsPurposeChart"></canvas>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    renderAnalyticsCharts(stats);
  }, 100);
}

function renderAnalyticsCharts(stats) {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  // Language chart
  const langCtx = document.getElementById('analyticsLanguageChart');
  if (langCtx) {
    new Chart(langCtx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(stats.languageCounts),
        datasets: [{
          data: Object.values(stats.languageCounts),
          backgroundColor: colors
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  // Framework chart
  const fwCtx = document.getElementById('analyticsFrameworkChart');
  if (fwCtx && Object.keys(stats.frameworkCounts).length > 0) {
    new Chart(fwCtx, {
      type: 'bar',
      data: {
        labels: Object.keys(stats.frameworkCounts),
        datasets: [{
          label: 'Snippets',
          data: Object.values(stats.frameworkCounts),
          backgroundColor: colors
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  // Purpose chart
  const purposeCtx = document.getElementById('analyticsPurposeChart');
  if (purposeCtx && Object.keys(stats.purposeCounts).length > 0) {
    new Chart(purposeCtx, {
      type: 'pie',
      data: {
        labels: Object.keys(stats.purposeCounts),
        datasets: [{
          data: Object.values(stats.purposeCounts),
          backgroundColor: colors
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}

// Settings View
function renderSettings(container) {
  container.innerHTML = `
    <div>
      <h1 style="font-size: 28px; font-weight: 600; margin-bottom: 24px;">Settings</h1>
      
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Theme Settings</h2>
        </div>
        <div class="form-group">
          <label class="form-label">Color Theme</label>
          <select class="form-select" onchange="changeTheme(this.value)">
            <option value="dark" ${appState.theme === 'dark' ? 'selected' : ''}>Dark</option>
            <option value="light" ${appState.theme === 'light' ? 'selected' : ''}>Light</option>
            <option value="vibrant" ${appState.theme === 'vibrant' ? 'selected' : ''}>Vibrant</option>
          </select>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Database Management</h2>
        </div>
        <p style="color: var(--admin-text-secondary); margin-bottom: 16px;">Manage your snippet database</p>
        <div class="flex gap-2">
          <button class="btn btn-secondary" onclick="exportDatabase()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export Database
          </button>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Keyboard Shortcuts</h2>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Shortcut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>Ctrl+K</code></td><td>Search snippets</td></tr>
              <tr><td><code>Ctrl+D</code></td><td>Toggle dashboard</td></tr>
              <tr><td><code>Ctrl+L</code></td><td>Open library</td></tr>
              <tr><td><code>Ctrl+/</code></td><td>Show help</td></tr>
              <tr><td><code>Esc</code></td><td>Close modal</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function changeTheme(theme) {
  appState.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  window.themePreference = theme;
  showToast(`Theme changed to ${theme}`, 'success');
}

// Utility Functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return date.toLocaleDateString();
}

function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  showToast('Copied to clipboard', 'success');
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icons = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
  };
  
  toast.innerHTML = `
    <div class="toast-icon" style="color: var(--admin-${type});">${icons[type]}</div>
    <div class="toast-message">${escapeHtml(message)}</div>
  `;
  
  document.getElementById('toastContainer').appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function showLoading() {
  document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoading() {
  document.getElementById('loadingOverlay').style.display = 'none';
}

function showHelpModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2 class="modal-title">Help &amp; Keyboard Shortcuts</h2>
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <h3 style="margin-bottom: 16px;">Keyboard Shortcuts</h3>
        <div class="table-container">
          <table>
            <tbody>
              <tr><td><code>Ctrl+K</code></td><td>Global search</td></tr>
              <tr><td><code>Ctrl+D</code></td><td>Go to Dashboard</td></tr>
              <tr><td><code>Ctrl+L</code></td><td>Open Snippet Library</td></tr>
              <tr><td><code>Ctrl+/</code></td><td>Show this help</td></tr>
              <tr><td><code>Esc</code></td><td>Close modal</td></tr>
            </tbody>
          </table>
        </div>
        
        <h3 style="margin: 24px 0 16px;">Features</h3>
        <ul style="line-height: 2; color: var(--admin-text-secondary);">
          <li><strong>Parser Lab:</strong> Extract code from threads automatically</li>
          <li><strong>Snippet Library:</strong> Browse, filter, and manage all snippets</li>
          <li><strong>Share Manager:</strong> Generate shareable links for snippets</li>
          <li><strong>Calculators:</strong> Estimate API costs and processing times</li>
          <li><strong>Analytics:</strong> View insights on your snippet collection</li>
        </ul>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Close</button>
      </div>
    </div>
  `;
  
  document.getElementById('modalContainer').appendChild(modal);
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}