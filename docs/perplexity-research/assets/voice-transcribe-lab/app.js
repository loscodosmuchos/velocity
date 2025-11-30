// Application State
const state = {
  clips: [],
  isRecording: false,
  recordingStartTime: null,
  recordingInterval: null,
  audioMeterInterval: null,
  settings: {
    model: 'base',
    audioQuality: 'medium',
    mcpEndpoint: '',
    elevenLabsKey: '',
    privacyMode: true,
    elevenLabsEnabled: false
  },
  searchQuery: '',
  filterType: 'all'
};

// Sample clips data
const sampleClips = [
  {
    id: "clip-001",
    timestamp: "2025-11-16T17:30:00Z",
    duration: 12,
    transcription: "This is a test transcription of a voice recording. The Whisper model accurately captured the spoken words.",
    wordCount: 17,
    retryCount: 0,
    model: "base",
    tags: ["test", "demo"],
    starred: false
  },
  {
    id: "clip-002",
    timestamp: "2025-11-16T17:35:00Z",
    duration: 8,
    transcription: "Quick note about the project deadline being next Friday.",
    wordCount: 9,
    retryCount: 1,
    model: "small",
    tags: ["work", "deadline"],
    starred: true
  }
];

// Initialize app with sample data
state.clips = [...sampleClips];

// DOM Elements
const recordBtn = document.getElementById('recordBtn');
const recordBtnText = document.getElementById('recordBtnText');
const recordIcon = document.getElementById('recordIcon');
const audioMeterFill = document.getElementById('audioMeterFill');
const recordingDuration = document.getElementById('recordingDuration');
const clipsContainer = document.getElementById('clipsContainer');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const filterSelect = document.getElementById('filterSelect');
const logContent = document.getElementById('logContent');
const logPanel = document.getElementById('logPanel');
const settingsModal = document.getElementById('settingsModal');
const clipModal = document.getElementById('clipModal');
const totalClipsEl = document.getElementById('totalClips');
const storageUsedEl = document.getElementById('storageUsed');
const currentModelEl = document.getElementById('currentModel');

// Utility Functions
function generateUUID() {
  return 'clip-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatTimestamp(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function calculateStorageUsed() {
  const jsonString = JSON.stringify(state.clips);
  const bytes = new Blob([jsonString]).size;
  return (bytes / 1024).toFixed(2);
}

// Logging Functions
function addLog(message, level = 'info') {
  const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
  const logEntry = document.createElement('div');
  logEntry.className = `log-entry log-${level}`;
  logEntry.innerHTML = `
    <span class="log-time">[${timestamp}]</span>
    <span class="log-message">${message}</span>
  `;
  logContent.appendChild(logEntry);
  logContent.scrollTop = logContent.scrollHeight;
}

// Recording Functions
function startRecording() {
  state.isRecording = true;
  state.recordingStartTime = Date.now();
  
  recordBtn.classList.add('recording');
  recordBtnText.textContent = 'Stop Recording';
  
  addLog('Recording started', 'info');
  
  // Update duration display
  state.recordingInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - state.recordingStartTime) / 1000);
    recordingDuration.textContent = formatTime(elapsed);
  }, 1000);
  
  // Simulate audio level meter
  state.audioMeterInterval = setInterval(() => {
    const randomLevel = Math.random() * 100;
    audioMeterFill.style.width = randomLevel + '%';
  }, 100);
}

function stopRecording() {
  state.isRecording = false;
  const duration = Math.floor((Date.now() - state.recordingStartTime) / 1000);
  
  clearInterval(state.recordingInterval);
  clearInterval(state.audioMeterInterval);
  
  recordBtn.classList.remove('recording');
  recordBtnText.textContent = 'Start Recording';
  recordingDuration.textContent = '00:00';
  audioMeterFill.style.width = '0%';
  
  addLog(`Recording stopped (${duration}s)`, 'info');
  
  // Process transcription
  processTranscription(duration);
}

function processTranscription(duration) {
  addLog('Processing transcription...', 'info');
  
  // Simulate processing delay
  setTimeout(() => {
    const transcriptions = [
      "This is a simulated transcription of the voice recording. In production, this would use Whisper AI to convert speech to text.",
      "Meeting notes: Discussed project timeline and deliverables for next quarter. Need to follow up with team leads.",
      "Reminder to check the documentation and update the API endpoints before the release.",
      "Quick idea for improving the user interface: add more keyboard shortcuts and improve the search functionality.",
      "Personal note: Don't forget to review the pull requests and schedule the team sync meeting."
    ];
    
    const transcription = transcriptions[Math.floor(Math.random() * transcriptions.length)];
    const wordCount = transcription.split(' ').length;
    
    const newClip = {
      id: generateUUID(),
      timestamp: new Date().toISOString(),
      duration: duration,
      transcription: transcription,
      wordCount: wordCount,
      retryCount: 0,
      model: state.settings.model,
      tags: [],
      starred: false
    };
    
    state.clips.unshift(newClip);
    
    addLog(`Transcription complete (${wordCount} words, ${duration}s)`, 'success');
    
    renderClips();
    updateStatusBar();
  }, 2000);
}

// Clip Rendering
function renderClips() {
  const filteredClips = filterClips();
  
  if (filteredClips.length === 0) {
    clipsContainer.style.display = 'none';
    emptyState.classList.add('visible');
    return;
  }
  
  clipsContainer.style.display = 'grid';
  emptyState.classList.remove('visible');
  
  clipsContainer.innerHTML = filteredClips.map(clip => `
    <div class="clip-card" data-clip-id="${clip.id}">
      <div class="clip-header">
        <div class="clip-meta">
          <div class="clip-timestamp">${formatTimestamp(clip.timestamp)}</div>
          <div class="clip-stats">
            <span>⏱️ ${clip.duration}s</span>
            <span>📝 ${clip.wordCount} words</span>
            <span>🤖 ${clip.model}</span>
          </div>
        </div>
        <div class="clip-actions">
          <button class="btn-icon" onclick="toggleStar('${clip.id}')" title="${clip.starred ? 'Unstar' : 'Star'}">
            ${clip.starred ? '⭐' : '☆'}
          </button>
          <button class="btn-icon" onclick="copyClipText('${clip.id}')" title="Copy to clipboard">
            📋
          </button>
        </div>
      </div>
      <div class="clip-transcription">${clip.transcription}</div>
      ${clip.tags.length > 0 ? `
        <div class="clip-tags">
          ${clip.tags.map(tag => `<span class="clip-tag">#${tag}</span>`).join('')}
        </div>
      ` : ''}
    </div>
  `).join('');
  
  // Add click listeners to clip cards
  document.querySelectorAll('.clip-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.btn-icon')) {
        const clipId = card.dataset.clipId;
        showClipDetail(clipId);
      }
    });
  });
}

function filterClips() {
  let filtered = [...state.clips];
  
  // Apply search filter
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    filtered = filtered.filter(clip => 
      clip.transcription.toLowerCase().includes(query) ||
      clip.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
  
  // Apply type filter
  switch (state.filterType) {
    case 'starred':
      filtered = filtered.filter(clip => clip.starred);
      break;
    case 'today':
      const today = new Date().toDateString();
      filtered = filtered.filter(clip => 
        new Date(clip.timestamp).toDateString() === today
      );
      break;
    case 'week':
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(clip => 
        new Date(clip.timestamp) >= weekAgo
      );
      break;
  }
  
  return filtered;
}

function showClipDetail(clipId) {
  const clip = state.clips.find(c => c.id === clipId);
  if (!clip) return;
  
  const modalBody = document.getElementById('clipModalBody');
  modalBody.innerHTML = `
    <div class="clip-detail">
      <div class="clip-detail-header">
        <div class="clip-detail-meta">
          <h3>Clip Details</h3>
          <div class="clip-timestamp">${formatDate(clip.timestamp)}</div>
          <div class="clip-stats" style="margin-top: 8px;">
            <span>⏱️ Duration: ${clip.duration}s</span> &nbsp;
            <span>📝 Words: ${clip.wordCount}</span> &nbsp;
            <span>🤖 Model: ${clip.model}</span> &nbsp;
            <span>🔄 Retries: ${clip.retryCount}</span>
          </div>
        </div>
      </div>
      <div class="clip-detail-transcription">${clip.transcription}</div>
      <div class="clip-detail-actions">
        <button class="btn btn--primary" onclick="copyClipText('${clip.id}')">
          📋 Copy Text
        </button>
        <button class="btn btn--secondary" onclick="retryTranscription('${clip.id}')">
          🔄 Retry Transcription
        </button>
        <button class="btn btn--secondary" onclick="sendToMCP('${clip.id}')">
          📤 Send to MCP
        </button>
        <button class="btn btn--secondary" onclick="deleteClip('${clip.id}')">
          🗑️ Delete
        </button>
      </div>
    </div>
  `;
  
  clipModal.classList.add('visible');
}

// Clip Actions
function toggleStar(clipId) {
  const clip = state.clips.find(c => c.id === clipId);
  if (clip) {
    clip.starred = !clip.starred;
    addLog(`Clip ${clip.starred ? 'starred' : 'unstarred'}`, 'info');
    renderClips();
  }
}

function copyClipText(clipId) {
  const clip = state.clips.find(c => c.id === clipId);
  if (clip) {
    // Create a temporary textarea to copy text
    const textarea = document.createElement('textarea');
    textarea.value = clip.transcription;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      addLog('Clip text copied to clipboard', 'success');
    } catch (err) {
      addLog('Failed to copy text', 'error');
    }
    
    document.body.removeChild(textarea);
  }
}

function retryTranscription(clipId) {
  const clip = state.clips.find(c => c.id === clipId);
  if (clip) {
    addLog(`Retrying transcription for clip ${clipId}...`, 'info');
    clip.retryCount++;
    
    setTimeout(() => {
      addLog('Transcription retry complete', 'success');
      clipModal.classList.remove('visible');
      renderClips();
    }, 1500);
  }
}

function sendToMCP(clipId) {
  const clip = state.clips.find(c => c.id === clipId);
  if (!clip) return;
  
  if (!state.settings.mcpEndpoint) {
    addLog('MCP endpoint not configured', 'warning');
    return;
  }
  
  addLog(`Sending clip ${clipId} to MCP server...`, 'info');
  
  setTimeout(() => {
    addLog('Clip sent to MCP server successfully', 'success');
  }, 1000);
}

function deleteClip(clipId) {
  const index = state.clips.findIndex(c => c.id === clipId);
  if (index !== -1) {
    state.clips.splice(index, 1);
    addLog(`Clip ${clipId} deleted`, 'info');
    clipModal.classList.remove('visible');
    renderClips();
    updateStatusBar();
  }
}

// Export Functions
function exportClips() {
  const filteredClips = filterClips();
  
  if (filteredClips.length === 0) {
    addLog('No clips to export', 'warning');
    return;
  }
  
  let exportText = 'VoiceFlow Transcription Export\n';
  exportText += '================================\n\n';
  
  filteredClips.forEach((clip, index) => {
    exportText += `Clip ${index + 1}\n`;
    exportText += `Timestamp: ${formatDate(clip.timestamp)}\n`;
    exportText += `Duration: ${clip.duration}s\n`;
    exportText += `Word Count: ${clip.wordCount}\n`;
    exportText += `Model: ${clip.model}\n`;
    exportText += `\nTranscription:\n${clip.transcription}\n`;
    exportText += '\n---\n\n';
  });
  
  // Create blob and download
  const blob = new Blob([exportText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `voiceflow-export-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  addLog(`Exported ${filteredClips.length} clips`, 'success');
}

function copyLog() {
  const logText = Array.from(logContent.children)
    .map(entry => entry.textContent)
    .join('\n');
  
  const textarea = document.createElement('textarea');
  textarea.value = logText;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    document.execCommand('copy');
    addLog('Log copied to clipboard', 'success');
  } catch (err) {
    addLog('Failed to copy log', 'error');
  }
  
  document.body.removeChild(textarea);
}

// Settings Functions
function openSettings() {
  document.getElementById('modelSelect').value = state.settings.model;
  document.getElementById('audioQualitySelect').value = state.settings.audioQuality;
  document.getElementById('mcpEndpoint').value = state.settings.mcpEndpoint;
  document.getElementById('elevenLabsKey').value = state.settings.elevenLabsKey;
  document.getElementById('privacyMode').checked = state.settings.privacyMode;
  document.getElementById('elevenLabsToggle').checked = state.settings.elevenLabsEnabled;
  
  settingsModal.classList.add('visible');
}

function saveSettings() {
  state.settings.model = document.getElementById('modelSelect').value;
  state.settings.audioQuality = document.getElementById('audioQualitySelect').value;
  state.settings.mcpEndpoint = document.getElementById('mcpEndpoint').value;
  state.settings.elevenLabsKey = document.getElementById('elevenLabsKey').value;
  state.settings.privacyMode = document.getElementById('privacyMode').checked;
  state.settings.elevenLabsEnabled = document.getElementById('elevenLabsToggle').checked;
  
  settingsModal.classList.remove('visible');
  addLog('Settings saved', 'success');
  updateStatusBar();
}

function testMCPConnection() {
  const endpoint = document.getElementById('mcpEndpoint').value;
  
  if (!endpoint) {
    addLog('Please enter an MCP endpoint', 'warning');
    return;
  }
  
  addLog(`Testing connection to ${endpoint}...`, 'info');
  
  setTimeout(() => {
    const success = Math.random() > 0.3;
    if (success) {
      addLog('MCP connection successful', 'success');
    } else {
      addLog('MCP connection failed', 'error');
    }
  }, 1000);
}

// Status Bar Update
function updateStatusBar() {
  totalClipsEl.textContent = state.clips.length;
  storageUsedEl.textContent = calculateStorageUsed() + ' KB';
  currentModelEl.textContent = state.settings.model;
}

// Keyboard Shortcuts
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl+Shift+R - Start/Stop Recording
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
      e.preventDefault();
      recordBtn.click();
    }
    
    // Ctrl+F - Focus Search
    if (e.ctrlKey && e.key === 'f') {
      e.preventDefault();
      searchInput.focus();
    }
    
    // Ctrl+E - Export
    if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      exportClips();
    }
    
    // Ctrl+L - Toggle Log
    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      logPanel.classList.toggle('hidden');
    }
    
    // Ctrl+, - Settings
    if (e.ctrlKey && e.key === ',') {
      e.preventDefault();
      openSettings();
    }
    
    // Escape - Close modals
    if (e.key === 'Escape') {
      settingsModal.classList.remove('visible');
      clipModal.classList.remove('visible');
    }
  });
}

// Event Listeners
recordBtn.addEventListener('click', () => {
  if (state.isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
});

searchInput.addEventListener('input', (e) => {
  state.searchQuery = e.target.value;
  renderClips();
});

filterSelect.addEventListener('change', (e) => {
  state.filterType = e.target.value;
  renderClips();
});

document.getElementById('settingsBtn').addEventListener('click', openSettings);
document.getElementById('exportBtn').addEventListener('click', exportClips);
document.getElementById('toggleLogBtn').addEventListener('click', () => {
  logPanel.classList.toggle('hidden');
});

document.getElementById('copyLogBtn').addEventListener('click', copyLog);

document.getElementById('closeSettingsBtn').addEventListener('click', () => {
  settingsModal.classList.remove('visible');
});

document.getElementById('cancelSettingsBtn').addEventListener('click', () => {
  settingsModal.classList.remove('visible');
});

document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);

document.getElementById('testMcpBtn').addEventListener('click', testMCPConnection);

document.getElementById('closeClipBtn').addEventListener('click', () => {
  clipModal.classList.remove('visible');
});

// Close modals on backdrop click
settingsModal.addEventListener('click', (e) => {
  if (e.target === settingsModal) {
    settingsModal.classList.remove('visible');
  }
});

clipModal.addEventListener('click', (e) => {
  if (e.target === clipModal) {
    clipModal.classList.remove('visible');
  }
});

// Initialize
function init() {
  addLog('VoiceFlow initialized', 'success');
  addLog('Ready to record', 'info');
  renderClips();
  updateStatusBar();
  setupKeyboardShortcuts();
}

// Start the application
init();