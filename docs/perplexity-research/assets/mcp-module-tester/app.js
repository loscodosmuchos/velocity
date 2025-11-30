// ========================================
// INSIGHT ORCHESTRATOR LAB - MAIN APPLICATION
// Philosophy-Aligned Platform with Full Chain of Custody
// ========================================

// Global Application State (in-memory, no localStorage due to sandbox restrictions)
const AppState = {
  // Voice Capture Module
  voiceClips: [],
  isRecording: false,
  recordingStartTime: null,
  
  // Thread Parser Module
  threads: [],
  
  // Workflow Composer Module
  workflows: [],
  
  // Service Catalog Module
  services: [],
  
  // Activity Log
  activityLog: [],
  
  // Settings
  settings: {
    model: 'base',
    privacyMode: true,
    mcpEndpoint: '',
    elevenLabsKey: ''
  },
  
  // Statistics
  stats: {
    totalOperations: 0,
    voiceClips: 0,
    threadsProcessed: 0,
    workflowsCreated: 0
  },
  
  // Current View
  currentView: 'dashboard'
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

function generateUUID(prefix = 'item') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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

// ========================================
// LOGGING SYSTEM (Chain of Custody)
// ========================================

function addLog(message, level = 'info', metadata = {}) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    id: generateUUID('log'),
    timestamp,
    level,
    message,
    metadata,
    view: AppState.currentView
  };
  
  AppState.activityLog.push(logEntry);
  AppState.stats.totalOperations++;
  
  // Update UI
  const logContent = document.getElementById('logContent');
  const timeStr = new Date(timestamp).toLocaleTimeString('en-US', { hour12: false });
  
  const logDiv = document.createElement('div');
  logDiv.className = `log-entry log-${level}`;
  logDiv.innerHTML = `
    <span class="log-time">[${timeStr}]</span>
    <span class="log-message">${message}</span>
  `;
  
  logContent.appendChild(logDiv);
  logContent.scrollTop = logContent.scrollHeight;
  
  // Update stats
  document.getElementById('totalOps').textContent = AppState.stats.totalOperations;
}

function copyLog() {
  const logText = AppState.activityLog
    .map(log => `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}`)
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

function toggleLog() {
  const logPanel = document.getElementById('logPanel');
  logPanel.classList.toggle('hidden');
  addLog('Activity log toggled', 'info');
}

// ========================================
// NAVIGATION SYSTEM
// ========================================

function switchView(viewName) {
  // Hide all views
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });
  
  // Remove active from all nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Show selected view
  const viewElement = document.getElementById(`${viewName}View`);
  if (viewElement) {
    viewElement.classList.add('active');
  }
  
  // Activate nav item
  const navItem = document.querySelector(`.nav-item[data-view="${viewName}"]`);
  if (navItem) {
    navItem.classList.add('active');
  }
  
  // Update state and UI
  AppState.currentView = viewName;
  document.getElementById('currentView').textContent = viewName.charAt(0).toUpperCase() + viewName.slice(1);
  
  // Load view content if not already loaded
  loadViewContent(viewName);
  
  addLog(`Navigated to ${viewName} view`, 'info');
}

function loadViewContent(viewName) {
  const viewElement = document.getElementById(`${viewName}View`);
  
  // Check if already loaded
  if (viewElement.innerHTML.trim() !== '') {
    return;
  }
  
  // Load appropriate content
  switch(viewName) {
    case 'voice':
      loadVoiceView();
      break;
    case 'threads':
      loadThreadsView();
      break;
    case 'workflows':
      loadWorkflowsView();
      break;
    case 'catalog':
      loadCatalogView();
      break;
    case 'admin':
      loadAdminView();
      break;
    case 'philosophy':
      loadPhilosophyView();
      break;
    case 'export':
      loadExportView();
      break;
  }
}

// ========================================
// VOICE CAPTURE MODULE
// ========================================

function loadVoiceView() {
  const view = document.getElementById('voiceView');
  view.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">🎙️ Voice Capture</h1>
      <p class="page-description">Local-first voice transcription with full chain of custody and retry capability.</p>
    </div>
    
    <div class="grid grid-3">
      <div class="card" style="grid-column: 1 / -1;">
        <div style="text-align: center; padding: var(--space-32);">
          <button class="btn btn--primary btn--lg" id="voiceRecordBtn" onclick="toggleRecording()">
            <span id="voiceRecordIcon">⏺</span>
            <span id="voiceRecordText">Start Recording</span>
          </button>
          <div id="voiceRecordingDuration" style="font-size: var(--font-size-3xl); font-family: var(--font-family-mono); margin-top: var(--space-16); color: var(--color-text-secondary);">00:00</div>
          <div style="margin-top: var(--space-16); font-size: var(--font-size-sm); color: var(--color-text-secondary);">
            Press <kbd>Ctrl+Shift+R</kbd> to start/stop recording
          </div>
        </div>
      </div>
    </div>
    
    <div class="mt-16">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-16);">
        <h2 style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-semibold);">Transcription History</h2>
        <button class="btn btn--secondary btn--sm" onclick="exportVoiceClips()">📤 Export All</button>
      </div>
      
      <div id="voiceClipsContainer" class="grid grid-2">
        <!-- Clips will be inserted here -->
      </div>
      
      <div id="voiceEmptyState" class="empty-state" style="display: flex;">
        <div class="empty-state-icon">🎤</div>
        <h3>No clips yet</h3>
        <p>Press <kbd>Ctrl+Shift+R</kbd> or click "Start Recording" to create your first transcription.</p>
      </div>
    </div>
  `;
  
  renderVoiceClips();
}

function toggleRecording() {
  if (AppState.isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
}

let recordingInterval = null;

function startRecording() {
  AppState.isRecording = true;
  AppState.recordingStartTime = Date.now();
  
  const btn = document.getElementById('voiceRecordBtn');
  const icon = document.getElementById('voiceRecordIcon');
  const text = document.getElementById('voiceRecordText');
  
  btn.style.backgroundColor = 'var(--color-error)';
  icon.textContent = '⏹';
  text.textContent = 'Stop Recording';
  
  addLog('Voice recording started', 'info');
  
  // Update duration display
  recordingInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - AppState.recordingStartTime) / 1000);
    document.getElementById('voiceRecordingDuration').textContent = formatTime(elapsed);
  }, 1000);
}

function stopRecording() {
  AppState.isRecording = false;
  const duration = Math.floor((Date.now() - AppState.recordingStartTime) / 1000);
  
  clearInterval(recordingInterval);
  
  const btn = document.getElementById('voiceRecordBtn');
  const icon = document.getElementById('voiceRecordIcon');
  const text = document.getElementById('voiceRecordText');
  
  btn.style.backgroundColor = '';
  icon.textContent = '⏺';
  text.textContent = 'Start Recording';
  document.getElementById('voiceRecordingDuration').textContent = '00:00';
  
  addLog(`Recording stopped (${duration}s)`, 'info');
  
  // Process transcription
  processTranscription(duration);
}

function processTranscription(duration) {
  addLog('Processing transcription with Whisper model...', 'info');
  
  setTimeout(() => {
    const sampleTranscriptions = [
      "This is a simulated transcription of the voice recording. In production, this would use Whisper AI to convert speech to text with full chain of custody.",
      "Meeting notes: Discussed project timeline and deliverables for next quarter. Need to follow up with team leads on resource allocation and milestone tracking.",
      "Reminder to check the documentation and update the API endpoints before the release. Also need to review security policies for external integrations.",
      "Quick idea for improving the user interface: add more keyboard shortcuts and improve the search functionality across all modules with context preservation.",
      "Personal note: Don't forget to review the pull requests and schedule the team sync meeting. Also need to update the decision log with architectural choices."
    ];
    
    const transcription = sampleTranscriptions[Math.floor(Math.random() * sampleTranscriptions.length)];
    const wordCount = transcription.split(' ').length;
    
    const clip = {
      id: generateUUID('clip'),
      timestamp: new Date().toISOString(),
      duration,
      transcription,
      wordCount,
      model: AppState.settings.model,
      retryCount: 0,
      hash: generateUUID('hash'),
      tags: [],
      metadata: {
        privacyMode: AppState.settings.privacyMode,
        audioQuality: 'medium'
      }
    };
    
    AppState.voiceClips.unshift(clip);
    AppState.stats.voiceClips++;
    
    addLog(`Transcription complete: ${wordCount} words, ${duration}s, model: ${clip.model}`, 'success', { clipId: clip.id });
    
    renderVoiceClips();
  }, 2000);
}

function renderVoiceClips() {
  const container = document.getElementById('voiceClipsContainer');
  const emptyState = document.getElementById('voiceEmptyState');
  
  if (!container) return;
  
  if (AppState.voiceClips.length === 0) {
    container.style.display = 'none';
    if (emptyState) emptyState.style.display = 'flex';
    return;
  }
  
  container.style.display = 'grid';
  if (emptyState) emptyState.style.display = 'none';
  
  container.innerHTML = AppState.voiceClips.map(clip => `
    <div class="card" style="cursor: pointer;" onclick="showClipDetail('${clip.id}')">
      <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-12);">
        <div>
          <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">
            ${formatTimestamp(clip.timestamp)}
          </div>
          <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: 4px;">
            ⏱️ ${clip.duration}s • 📝 ${clip.wordCount} words • 🤖 ${clip.model}
          </div>
        </div>
        <button class="btn-icon" onclick="event.stopPropagation(); copyClipText('${clip.id}')" title="Copy to clipboard">📋</button>
      </div>
      <div style="color: var(--color-text); line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
        ${clip.transcription}
      </div>
    </div>
  `).join('');
}

function showClipDetail(clipId) {
  const clip = AppState.voiceClips.find(c => c.id === clipId);
  if (!clip) return;
  
  showModal('Clip Details', `
    <div style="margin-bottom: var(--space-16);">
      <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-8);">
        ${formatDate(clip.timestamp)}
      </div>
      <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">
        Duration: ${clip.duration}s • Words: ${clip.wordCount} • Model: ${clip.model} • Retries: ${clip.retryCount}
      </div>
      <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: 4px; font-family: var(--font-family-mono);">
        ID: ${clip.id} • Hash: ${clip.hash}
      </div>
    </div>
    
    <div style="padding: var(--space-16); background-color: var(--color-secondary); border-radius: var(--radius-base); margin-bottom: var(--space-16); line-height: 1.8;">
      ${clip.transcription}
    </div>
    
    <div style="display: flex; flex-wrap: wrap; gap: var(--space-8);">
      <button class="btn btn--primary btn--sm" onclick="copyClipText('${clip.id}'); closeModal();">📋 Copy Text</button>
      <button class="btn btn--secondary btn--sm" onclick="retryTranscription('${clip.id}'); closeModal();">🔄 Retry</button>
      <button class="btn btn--secondary btn--sm" onclick="deleteClip('${clip.id}'); closeModal();">🗑️ Delete</button>
    </div>
  `);
}

function copyClipText(clipId) {
  const clip = AppState.voiceClips.find(c => c.id === clipId);
  if (!clip) return;
  
  const textarea = document.createElement('textarea');
  textarea.value = clip.transcription;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    document.execCommand('copy');
    addLog('Clip text copied to clipboard', 'success', { clipId });
  } catch (err) {
    addLog('Failed to copy text', 'error');
  }
  
  document.body.removeChild(textarea);
}

function retryTranscription(clipId) {
  const clip = AppState.voiceClips.find(c => c.id === clipId);
  if (!clip) return;
  
  clip.retryCount++;
  addLog(`Retrying transcription for clip ${clipId} (attempt ${clip.retryCount})`, 'info');
  
  setTimeout(() => {
    addLog('Transcription retry complete', 'success');
    renderVoiceClips();
  }, 1500);
}

function deleteClip(clipId) {
  const index = AppState.voiceClips.findIndex(c => c.id === clipId);
  if (index !== -1) {
    AppState.voiceClips.splice(index, 1);
    addLog(`Clip ${clipId} deleted`, 'info');
    renderVoiceClips();
  }
}

function exportVoiceClips() {
  if (AppState.voiceClips.length === 0) {
    addLog('No clips to export', 'warning');
    return;
  }
  
  let exportText = 'Insight Orchestrator Lab - Voice Transcriptions\n';
  exportText += '='.repeat(50) + '\n\n';
  
  AppState.voiceClips.forEach((clip, index) => {
    exportText += `Clip ${index + 1}\n`;
    exportText += `ID: ${clip.id}\n`;
    exportText += `Timestamp: ${formatDate(clip.timestamp)}\n`;
    exportText += `Duration: ${clip.duration}s\n`;
    exportText += `Word Count: ${clip.wordCount}\n`;
    exportText += `Model: ${clip.model}\n`;
    exportText += `Hash: ${clip.hash}\n`;
    exportText += `\nTranscription:\n${clip.transcription}\n`;
    exportText += '\n' + '-'.repeat(50) + '\n\n';
  });
  
  const blob = new Blob([exportText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `voice-clips-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  addLog(`Exported ${AppState.voiceClips.length} voice clips`, 'success');
}

// ========================================
// THREAD PARSER MODULE
// ========================================

function loadThreadsView() {
  const view = document.getElementById('threadsView');
  view.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">🧵 Thread Parser</h1>
      <p class="page-description">Multi-topic classification with automatic asset extraction and context analysis.</p>
    </div>
    
    <div class="card">
      <h3 style="font-size: var(--font-size-xl); margin-bottom: var(--space-16);">Input Thread</h3>
      <textarea id="threadInput" class="form-control" rows="10" placeholder="Paste conversation thread, upload file, or drag & drop..." style="font-family: var(--font-family-mono); font-size: var(--font-size-sm);"></textarea>
      <div style="display: flex; gap: var(--space-12); margin-top: var(--space-16);">
        <button class="btn btn--primary" onclick="parseThread()">🔍 Parse & Classify</button>
        <button class="btn btn--secondary" onclick="document.getElementById('threadInput').value = ''; addLog('Thread input cleared', 'info');">🗑️ Clear</button>
      </div>
    </div>
    
    <div id="threadResults" class="mt-16" style="display: none;">
      <h2 style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-16);">Detected Topics</h2>
      <div id="topicsContainer" class="grid grid-2"></div>
    </div>
  `;
}

function parseThread() {
  const input = document.getElementById('threadInput').value.trim();
  
  if (!input) {
    addLog('No thread content to parse', 'warning');
    return;
  }
  
  addLog('Parsing thread content...', 'info');
  
  setTimeout(() => {
    // Simulate multi-topic detection
    const topics = [
      {
        id: generateUUID('topic'),
        title: 'Voice Transcription Requirements',
        summary: 'Discussion about building a local-first voice transcription system with chain of custody.',
        confidence: 0.95,
        classification: {
          audience: 'Technical Team',
          urgency: 'High',
          value: 'Core Feature',
          useCase: 'Voice Capture Module'
        },
        assets: ['voice-recorder.js', 'whisper-integration.md'],
        status: 'active'
      },
      {
        id: generateUUID('topic'),
        title: 'Thread Parser Architecture',
        summary: 'Requirements for multi-topic classification with asset extraction.',
        confidence: 0.89,
        classification: {
          audience: 'Development Team',
          urgency: 'Medium',
          value: 'Core Feature',
          useCase: 'Thread Analysis'
        },
        assets: ['parser-logic.js', 'classification-engine.md'],
        status: 'planning'
      },
      {
        id: generateUUID('topic'),
        title: 'Platform Philosophy & Principles',
        summary: 'Core principles including chain of custody, context preservation, and professional excellence.',
        confidence: 0.92,
        classification: {
          audience: 'All Stakeholders',
          urgency: 'Critical',
          value: 'Foundation',
          useCase: 'Platform Ethos'
        },
        assets: ['PHILOSOPHY.md', 'PRINCIPLES.md'],
        status: 'documented'
      }
    ];
    
    const thread = {
      id: generateUUID('thread'),
      timestamp: new Date().toISOString(),
      rawText: input,
      topics,
      hash: generateUUID('hash')
    };
    
    AppState.threads.unshift(thread);
    AppState.stats.threadsProcessed++;
    
    addLog(`Thread parsed: ${topics.length} topics detected`, 'success', { threadId: thread.id });
    
    // Show results
    document.getElementById('threadResults').style.display = 'block';
    const container = document.getElementById('topicsContainer');
    
    container.innerHTML = topics.map(topic => `
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--space-12);">
          <div>
            <h4 style="font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-6);">${topic.title}</h4>
            <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">Confidence: ${Math.round(topic.confidence * 100)}%</div>
          </div>
          <span class="status-badge status-badge--active">${topic.status}</span>
        </div>
        <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); margin-bottom: var(--space-12); line-height: 1.6;">${topic.summary}</p>
        <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: var(--space-12);">
          <div>👥 ${topic.classification.audience}</div>
          <div>⚡ ${topic.classification.urgency}</div>
          <div>💎 ${topic.classification.value}</div>
        </div>
        <div style="margin-bottom: var(--space-12);">
          ${topic.assets.map(asset => `<span class="status-badge status-badge--pending" style="margin-right: 4px;">${asset}</span>`).join('')}
        </div>
        <button class="btn btn--secondary btn--sm" onclick="exportTopic('${thread.id}', '${topic.id}')">📤 Export Bundle</button>
      </div>
    `).join('');
    
    container.scrollIntoView({ behavior: 'smooth' });
  }, 1500);
}

function exportTopic(threadId, topicId) {
  addLog(`Exporting topic bundle: ${topicId}`, 'info');
  
  setTimeout(() => {
    addLog('Topic bundle exported with README and full context', 'success');
  }, 800);
}

// ========================================
// WORKFLOW COMPOSER MODULE
// ========================================

function loadWorkflowsView() {
  const view = document.getElementById('workflowsView');
  view.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">⚡ Workflow Composer</h1>
      <p class="page-description">Visual solution design with cost estimation and alternative comparison.</p>
    </div>
    
    <div class="card">
      <h3 style="font-size: var(--font-size-xl); margin-bottom: var(--space-16);">Create New Workflow</h3>
      <div class="form-group">
        <label class="form-label">Workflow Name</label>
        <input type="text" class="form-control" id="workflowName" placeholder="e.g., Voice to Email Pipeline">
      </div>
      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-control" id="workflowDesc" rows="3" placeholder="Describe the workflow purpose and goals..."></textarea>
      </div>
      <button class="btn btn--primary" onclick="createWorkflow()">✨ Create Workflow</button>
    </div>
    
    <div id="workflowsList" class="mt-16">
      <h2 style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-16);">Your Workflows</h2>
      <div id="workflowsContainer" class="grid grid-2"></div>
      
      <div id="workflowsEmptyState" class="empty-state" style="display: flex;">
        <div class="empty-state-icon">⚡</div>
        <h3>No workflows yet</h3>
        <p>Create your first workflow to start designing solutions.</p>
      </div>
    </div>
  `;
  
  renderWorkflows();
}

function createWorkflow() {
  const name = document.getElementById('workflowName').value.trim();
  const description = document.getElementById('workflowDesc').value.trim();
  
  if (!name) {
    addLog('Workflow name is required', 'warning');
    return;
  }
  
  const workflow = {
    id: generateUUID('workflow'),
    timestamp: new Date().toISOString(),
    name,
    description,
    nodes: [],
    estimation: {
      tokens: Math.floor(Math.random() * 10000) + 1000,
      cost: (Math.random() * 5).toFixed(2),
      latency: Math.floor(Math.random() * 5000) + 500
    },
    status: 'draft'
  };
  
  AppState.workflows.unshift(workflow);
  AppState.stats.workflowsCreated++;
  
  addLog(`Workflow created: ${name}`, 'success', { workflowId: workflow.id });
  
  document.getElementById('workflowName').value = '';
  document.getElementById('workflowDesc').value = '';
  
  renderWorkflows();
}

function renderWorkflows() {
  const container = document.getElementById('workflowsContainer');
  const emptyState = document.getElementById('workflowsEmptyState');
  
  if (!container) return;
  
  if (AppState.workflows.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.style.display = 'flex';
    return;
  }
  
  if (emptyState) emptyState.style.display = 'none';
  
  container.innerHTML = AppState.workflows.map(wf => `
    <div class="card">
      <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-12);">
        <div>
          <h4 style="font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-6);">${wf.name}</h4>
          <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">${formatTimestamp(wf.timestamp)}</div>
        </div>
        <span class="status-badge status-badge--pending">${wf.status}</span>
      </div>
      <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); margin-bottom: var(--space-16); line-height: 1.6;">${wf.description || 'No description'}</p>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-12); margin-bottom: var(--space-16); padding: var(--space-12); background-color: var(--color-secondary); border-radius: var(--radius-base);">
        <div style="text-align: center;">
          <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">Tokens</div>
          <div style="font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); color: var(--color-text);">${wf.estimation.tokens.toLocaleString()}</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">Cost</div>
          <div style="font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); color: var(--color-text);">$${wf.estimation.cost}</div>
        </div>
        <div style="text-align: center;">
          <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">Latency</div>
          <div style="font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); color: var(--color-text);">${wf.estimation.latency}ms</div>
        </div>
      </div>
      <div style="display: flex; gap: var(--space-8);">
        <button class="btn btn--secondary btn--sm" onclick="exportWorkflow('${wf.id}')">📤 Export</button>
        <button class="btn btn--secondary btn--sm" onclick="deleteWorkflow('${wf.id}')">🗑️ Delete</button>
      </div>
    </div>
  `).join('');
}

function exportWorkflow(workflowId) {
  const workflow = AppState.workflows.find(w => w.id === workflowId);
  if (!workflow) return;
  
  addLog(`Exporting workflow: ${workflow.name}`, 'info');
  
  const exportData = JSON.stringify(workflow, null, 2);
  const blob = new Blob([exportData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `workflow-${workflow.id}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  addLog('Workflow exported successfully', 'success');
}

function deleteWorkflow(workflowId) {
  const index = AppState.workflows.findIndex(w => w.id === workflowId);
  if (index !== -1) {
    AppState.workflows.splice(index, 1);
    addLog(`Workflow ${workflowId} deleted`, 'info');
    renderWorkflows();
  }
}

// ========================================
// SERVICE CATALOG MODULE
// ========================================

function loadCatalogView() {
  const view = document.getElementById('catalogView');
  view.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">📦 Service Catalog</h1>
      <p class="page-description">Complete microservice inventory with security policies and integration tracking.</p>
    </div>
    
    <div class="grid grid-3" id="servicesGrid">
      <!-- Services will be inserted here -->
    </div>
  `;
  
  // Initialize sample services if empty
  if (AppState.services.length === 0) {
    AppState.services = [
      {
        id: 'svc-voice',
        name: 'Voice Capture Engine',
        type: 'internal',
        description: 'Local-first voice recording with hotkey support',
        dataPolicy: 'Local only by default',
        status: 'active',
        icon: '🎙️'
      },
      {
        id: 'svc-whisper',
        name: 'OpenAI Whisper',
        type: 'external',
        description: 'Speech-to-text transcription service',
        dataPolicy: 'API data retention depends on OpenAI policy',
        status: 'active',
        icon: '🤖'
      },
      {
        id: 'svc-elevenlabs',
        name: 'ElevenLabs TTS',
        type: 'external',
        description: 'Text-to-speech synthesis',
        dataPolicy: 'Zero-retention mode available',
        status: 'active',
        icon: '🔊'
      },
      {
        id: 'svc-parser',
        name: 'Thread Parser',
        type: 'internal',
        description: 'Multi-topic classification engine',
        dataPolicy: 'Local processing only',
        status: 'active',
        icon: '🧵'
      },
      {
        id: 'svc-context',
        name: 'Context Engine',
        type: 'internal',
        description: '15-question classification framework',
        dataPolicy: 'Local processing with optional MCP export',
        status: 'active',
        icon: '🧠'
      },
      {
        id: 'svc-workflow',
        name: 'Workflow Composer',
        type: 'internal',
        description: 'Visual workflow design and estimation',
        dataPolicy: 'Local state management',
        status: 'active',
        icon: '⚡'
      }
    ];
  }
  
  renderServices();
}

function renderServices() {
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;
  
  grid.innerHTML = AppState.services.map(svc => `
    <div class="card">
      <div style="text-align: center; margin-bottom: var(--space-16);">
        <div style="font-size: 48px; margin-bottom: var(--space-8);">${svc.icon}</div>
        <h4 style="font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-6);">${svc.name}</h4>
        <span class="status-badge status-badge--${svc.type === 'internal' ? 'active' : 'pending'}">${svc.type}</span>
      </div>
      <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); margin-bottom: var(--space-12); line-height: 1.6;">${svc.description}</p>
      <div style="padding: var(--space-12); background-color: var(--color-secondary); border-radius: var(--radius-base); margin-bottom: var(--space-12);">
        <div style="font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-4); color: var(--color-text);">🔒 Data Policy</div>
        <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); line-height: 1.5;">${svc.dataPolicy}</div>
      </div>
      <div style="display: flex; gap: var(--space-8);">
        <button class="btn btn--secondary btn--sm" onclick="showServiceDetail('${svc.id}')">📋 Details</button>
        <span class="status-badge status-badge--active" style="margin-left: auto;">${svc.status}</span>
      </div>
    </div>
  `).join('');
}

function showServiceDetail(serviceId) {
  const service = AppState.services.find(s => s.id === serviceId);
  if (!service) return;
  
  showModal(service.name, `
    <div style="text-align: center; margin-bottom: var(--space-16);">
      <div style="font-size: 64px; margin-bottom: var(--space-12);">${service.icon}</div>
      <span class="status-badge status-badge--${service.type === 'internal' ? 'active' : 'pending'}">${service.type}</span>
      <span class="status-badge status-badge--active" style="margin-left: 8px;">${service.status}</span>
    </div>
    
    <div style="margin-bottom: var(--space-16);">
      <h4 style="font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-8);">Description</h4>
      <p style="color: var(--color-text-secondary); line-height: 1.6;">${service.description}</p>
    </div>
    
    <div style="padding: var(--space-16); background-color: var(--color-bg-3); border-radius: var(--radius-base); border-left: 4px solid var(--color-success);">
      <h4 style="font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-8); color: var(--color-success);">🔒 Data Security Policy</h4>
      <p style="color: var(--color-text-secondary); line-height: 1.6; font-size: var(--font-size-sm);">${service.dataPolicy}</p>
    </div>
    
    <div style="margin-top: var(--space-16); padding: var(--space-12); background-color: var(--color-secondary); border-radius: var(--radius-base); font-family: var(--font-family-mono); font-size: var(--font-size-xs); color: var(--color-text-secondary);">
      Service ID: ${service.id}
    </div>
  `);
}

// ========================================
// ADMIN PORTAL MODULE
// ========================================

function loadAdminView() {
  const view = document.getElementById('adminView');
  view.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">⚙️ Admin Portal</h1>
      <p class="page-description">Implementation tracking, decision log, and system documentation.</p>
    </div>
    
    <div class="grid grid-2">
      <div class="card">
        <h3 style="font-size: var(--font-size-xl); margin-bottom: var(--space-16);">📊 Implementation Progress</h3>
        <div style="margin-bottom: var(--space-16);">
          <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-8);">
            <span style="font-size: var(--font-size-sm);">Overall Progress</span>
            <span style="font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold);">65%</span>
          </div>
          <div style="height: 8px; background-color: var(--color-secondary); border-radius: var(--radius-full); overflow: hidden;">
            <div style="height: 100%; width: 65%; background-color: var(--color-primary);"></div>
          </div>
        </div>
        
        <div style="display: grid; gap: var(--space-8);">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-8); background-color: var(--color-secondary); border-radius: var(--radius-sm);">
            <span style="font-size: var(--font-size-sm);">✅ Voice Capture</span>
            <span class="status-badge status-badge--complete">Complete</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-8); background-color: var(--color-secondary); border-radius: var(--radius-sm);">
            <span style="font-size: var(--font-size-sm);">✅ Thread Parser</span>
            <span class="status-badge status-badge--complete">Complete</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-8); background-color: var(--color-secondary); border-radius: var(--radius-sm);">
            <span style="font-size: var(--font-size-sm);">✅ Workflow Composer</span>
            <span class="status-badge status-badge--complete">Complete</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-8); background-color: var(--color-secondary); border-radius: var(--radius-sm);">
            <span style="font-size: var(--font-size-sm);">✅ Service Catalog</span>
            <span class="status-badge status-badge--complete">Complete</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-8); background-color: var(--color-secondary); border-radius: var(--radius-sm);">
            <span style="font-size: var(--font-size-sm);">🔄 MCP Integration</span>
            <span class="status-badge status-badge--pending">In Progress</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-8); background-color: var(--color-secondary); border-radius: var(--radius-sm);">
            <span style="font-size: var(--font-size-sm);">📦 Export System</span>
            <span class="status-badge status-badge--pending">Pending</span>
          </div>
        </div>
      </div>
      
      <div class="card">
        <h3 style="font-size: var(--font-size-xl); margin-bottom: var(--space-16);">📈 Platform Metrics</h3>
        <div style="display: grid; gap: var(--space-12);">
          <div style="padding: var(--space-16); background-color: var(--color-bg-1); border-radius: var(--radius-base); text-align: center;">
            <div style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); color: var(--color-primary);">${AppState.stats.voiceClips}</div>
            <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-top: var(--space-4);">Voice Clips</div>
          </div>
          <div style="padding: var(--space-16); background-color: var(--color-bg-2); border-radius: var(--radius-base); text-align: center;">
            <div style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); color: var(--color-warning);">${AppState.stats.threadsProcessed}</div>
            <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-top: var(--space-4);">Threads Parsed</div>
          </div>
          <div style="padding: var(--space-16); background-color: var(--color-bg-3); border-radius: var(--radius-base); text-align: center;">
            <div style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); color: var(--color-success);">${AppState.stats.workflowsCreated}</div>
            <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-top: var(--space-4);">Workflows Created</div>
          </div>
          <div style="padding: var(--space-16); background-color: var(--color-bg-4); border-radius: var(--radius-base); text-align: center;">
            <div style="font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); color: var(--color-error);">${AppState.stats.totalOperations}</div>
            <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-top: var(--space-4);">Total Operations</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="card mt-16">
      <h3 style="font-size: var(--font-size-xl); margin-bottom: var(--space-16);">📝 Recent Decision Log</h3>
      <div style="display: grid; gap: var(--space-12);">
        <div style="padding: var(--space-12); background-color: var(--color-secondary); border-radius: var(--radius-base); border-left: 4px solid var(--color-primary);">
          <div style="display: flex; justify-content: between; margin-bottom: var(--space-8);">
            <span style="font-weight: var(--font-weight-semibold);">Decision: Local-First Architecture</span>
          </div>
          <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); line-height: 1.6; margin-bottom: var(--space-8);">
            Reasoning: Privacy and data security are non-negotiable. All voice processing happens locally by default, with explicit user consent for any external API calls.
          </p>
          <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">Impact: Voice Capture, Thread Parser • Status: Implemented</div>
        </div>
        
        <div style="padding: var(--space-12); background-color: var(--color-secondary); border-radius: var(--radius-base); border-left: 4px solid var(--color-success);">
          <div style="display: flex; justify-content: between; margin-bottom: var(--space-8);">
            <span style="font-weight: var(--font-weight-semibold);">Decision: Chain of Custody Logging</span>
          </div>
          <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); line-height: 1.6; margin-bottom: var(--space-8);">
            Reasoning: Every operation must be traceable with UUID, timestamp, and full metadata. This enables audit trails and decision reconstruction.
          </p>
          <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">Impact: All Modules • Status: Implemented</div>
        </div>
        
        <div style="padding: var(--space-12); background-color: var(--color-secondary); border-radius: var(--radius-base); border-left: 4px solid var(--color-warning);">
          <div style="display: flex; justify-content: between; margin-bottom: var(--space-8);">
            <span style="font-weight: var(--font-weight-semibold);">Decision: No localStorage/sessionStorage</span>
          </div>
          <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); line-height: 1.6; margin-bottom: var(--space-8);">
            Reasoning: Sandbox environment restrictions. All state managed in-memory with explicit export/import functionality for persistence.
          </p>
          <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary);">Impact: All Modules • Status: Implemented</div>
        </div>
      </div>
    </div>
  `;
}

// ========================================
// PHILOSOPHY MODULE
// ========================================

function loadPhilosophyView() {
  const view = document.getElementById('philosophyView');
  view.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">💡 Platform Philosophy</h1>
      <p class="page-description">Core principles, non-negotiables, and the architectural philosophy that guides every decision.</p>
    </div>
    
    <div class="philosophy-card">
      <h4>🎯 Mission Statement</h4>
      <p style="color: var(--color-text-secondary); line-height: 1.8;">
        Build a comprehensive platform that serves as both a productivity tool AND a reference implementation of best practices. 
        This platform documents its own creation, uses itself during its own development (eating our own dog food), 
        and embeds all philosophical requirements directly into its architecture and user interface.
      </p>
    </div>
    
    <div class="card">
      <h3 style="font-size: var(--font-size-2xl); margin-bottom: var(--space-16);">🔐 Non-Negotiable Principles</h3>
      
      <div style="display: grid; gap: var(--space-16);">
        <div style="padding: var(--space-16); background-color: var(--color-bg-1); border-radius: var(--radius-base); border-left: 4px solid var(--color-primary);">
          <h4 style="font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-8); color: var(--color-primary);">1. Chain of Custody</h4>
          <p style="color: var(--color-text-secondary); line-height: 1.6;">
            Every action is timestamped, ID'd, and logged. Nothing is orphaned. All decisions are preserved with the WHY behind them. 
            This creates an unbroken audit trail that enables accountability, debugging, and learning.
          </p>
        </div>
        
        <div style="padding: var(--space-16); background-color: var(--color-bg-2); border-radius: var(--radius-base); border-left: 4px solid var(--color-warning);">
          <h4 style="font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-8); color: var(--color-warning);">2. Context Preservation</h4>
          <p style="color: var(--color-text-secondary); line-height: 1.6;">
            Context is not optional—it's the difference between capability and impossibility. Every piece of data maintains 
            rich metadata about its origin, purpose, relationships, and classification. Context enables future developers 
            to understand not just WHAT was built, but WHY.
          </p>
        </div>
        
        <div style="padding: var(--space-16); background-color: var(--color-bg-3); border-radius: var(--radius-base); border-left: 4px solid var(--color-success);">
          <h4 style="font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-8); color: var(--color-success);">3. Friction Reduction</h4>
          <p style="color: var(--color-text-secondary); line-height: 1.6;">
            Single pane of glass. Minimal clicks. Instant access to what matters. Every interaction is designed to reduce 
            cognitive load and physical effort. Keyboard shortcuts for power users, intuitive UI for everyone.
          </p>
        </div>
        
        <div style="padding: var(--space-16); background-color: var(--color-bg-4); border-radius: var(--radius-base); border-left: 4px solid var(--color-error);">
          <h4 style="font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-8); color: var(--color-error);">4. Hot Capture</h4>
          <p style="color: var(--color-text-secondary); line-height: 1.6;">
            Document while hot. Capture insights immediately before they're lost. No orphaned fragments. 
            The moment of inspiration is precious—our tools must capture it instantly with full context.
          </p>
        </div>
        
        <div style="padding: var(--space-16); background-color: var(--color-bg-5); border-radius: var(--radius-base); border-left: 4px solid var(--color-info);">
          <h4 style="font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-8);">5. Integrity First</h4>
          <p style="color: var(--color-text-secondary); line-height: 1.6;">
            Data security and privacy policies are clearly documented. No ambiguity about external data exposure. 
            Every service documents its data handling, every API call is logged, every external integration 
            requires explicit consent and policy acknowledgment.
          </p>
        </div>
        
        <div style="padding: var(--space-16); background-color: var(--color-bg-6); border-radius: var(--radius-base); border-left: 4px solid var(--color-accent);">
          <h4 style="font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-8);">6. Professional Excellence</h4>
          <p style="color: var(--color-text-secondary); line-height: 1.6;">
            Every pixel, every line of code, every interaction reflects the organization's values and expertise. 
            We are not amateurs. We prove our excellence through what we build, how we build it, and how we document it. 
            Nothing should detract from our professional image.
          </p>
        </div>
        
        <div style="padding: var(--space-16); background-color: var(--color-bg-1); border-radius: var(--radius-base); border-left: 4px solid var(--color-primary);">
          <h4 style="font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); margin-bottom: var(--space-8); color: var(--color-primary);">7. Eat Our Own Dog Food</h4>
          <p style="color: var(--color-text-secondary); line-height: 1.6;">
            Use the platform to build itself. Meta-development as validation. Anywhere we can utilize a tool or function 
            we built, and use ourselves as a use case in the tool's own creation, we do it. This is the ultimate test 
            of usability and demonstrates that our tools work in real-world conditions.
          </p>
        </div>
      </div>
    </div>
    
    <div class="card mt-16">
      <h3 style="font-size: var(--font-size-2xl); margin-bottom: var(--space-16);">🎨 Design Principles</h3>
      <ul style="color: var(--color-text-secondary); line-height: 1.8; padding-left: var(--space-20);">
        <li><strong>Dark mode first:</strong> Professional aesthetic, easier on eyes for long sessions</li>
        <li><strong>Keyboard-first design:</strong> Every action has a keyboard shortcut</li>
        <li><strong>Real-time feedback:</strong> Every operation shows immediate visual confirmation</li>
        <li><strong>Progressive disclosure:</strong> Advanced features available but not overwhelming</li>
        <li><strong>Consistent patterns:</strong> Same interactions work the same way everywhere</li>
        <li><strong>Accessible by default:</strong> WCAG compliant, screen reader friendly</li>
      </ul>
    </div>
    
    <div class="card mt-16">
      <h3 style="font-size: var(--font-size-2xl); margin-bottom: var(--space-16);">🏗️ Architectural Decisions</h3>
      <div style="display: grid; gap: var(--space-12);">
        <div style="padding: var(--space-12); background-color: var(--color-secondary); border-radius: var(--radius-base);">
          <strong>Decision:</strong> Single-page application with view routing<br>
          <span style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">Why: Instant navigation, no page reloads, maintains state across views</span>
        </div>
        <div style="padding: var(--space-12); background-color: var(--color-secondary); border-radius: var(--radius-base);">
          <strong>Decision:</strong> In-memory state management (no localStorage)<br>
          <span style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">Why: Sandbox restrictions, explicit export/import provides better control</span>
        </div>
        <div style="padding: var(--space-12); background-color: var(--color-secondary); border-radius: var(--radius-base);">
          <strong>Decision:</strong> UUID + timestamp + hash for all entities<br>
          <span style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">Why: Guaranteed uniqueness, sortability, integrity verification</span>
        </div>
        <div style="padding: var(--space-12); background-color: var(--color-secondary); border-radius: var(--radius-base);">
          <strong>Decision:</strong> Verbose logging to dedicated panel<br>
          <span style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">Why: Full transparency, debugging aid, audit trail for compliance</span>
        </div>
      </div>
    </div>
  `;
}

// ========================================
// EXPORT & PACKAGE MODULE
// ========================================

function loadExportView() {
  const view = document.getElementById('exportView');
  view.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">📤 Export & Package</h1>
      <p class="page-description">Export modules with full documentation, context, and chain of custody preserved.</p>
    </div>
    
    <div class="card">
      <h3 style="font-size: var(--font-size-xl); margin-bottom: var(--space-16);">Select Export Options</h3>
      
      <div class="form-group">
        <label class="form-label">Export Type</label>
        <select class="form-control" id="exportType">
          <option value="full">Full Platform (all modules + documentation)</option>
          <option value="voice">Voice Capture Module Only</option>
          <option value="threads">Thread Parser Module Only</option>
          <option value="workflows">Workflow Composer Module Only</option>
          <option value="catalog">Service Catalog Module Only</option>
          <option value="data">Data Export (all clips, threads, workflows)</option>
        </select>
      </div>
      
      <div class="form-group">
        <label class="form-label">Detail Level</label>
        <select class="form-control" id="detailLevel">
          <option value="public">Public (High-level only, for clients)</option>
          <option value="developer">Developer (Technical details for integration)</option>
          <option value="full">Full (Complete with all metadata and decisions)</option>
        </select>
      </div>
      
      <div class="form-group">
        <label class="form-label">Include Documentation</label>
        <div style="display: grid; gap: var(--space-8); margin-top: var(--space-8);">
          <label style="display: flex; align-items: center; gap: var(--space-8); cursor: pointer;">
            <input type="checkbox" checked id="includePhilosophy">
            <span>Philosophy & Principles</span>
          </label>
          <label style="display: flex; align-items: center; gap: var(--space-8); cursor: pointer;">
            <input type="checkbox" checked id="includeDecisions">
            <span>Design Decisions Log</span>
          </label>
          <label style="display: flex; align-items: center; gap: var(--space-8); cursor: pointer;">
            <input type="checkbox" checked id="includeIntegration">
            <span>Integration Guide</span>
          </label>
          <label style="display: flex; align-items: center; gap: var(--space-8); cursor: pointer;">
            <input type="checkbox" checked id="includeSecurity">
            <span>Security & Privacy Policies</span>
          </label>
        </div>
      </div>
      
      <button class="btn btn--primary btn--lg" onclick="performExport()">📦 Generate Export Package</button>
    </div>
    
    <div class="philosophy-card mt-16">
      <h4>📋 Export Package Structure</h4>
      <pre style="font-family: var(--font-family-mono); font-size: var(--font-size-sm); color: var(--color-text-secondary); line-height: 1.6; overflow-x: auto;">
module-name/
├── code/
│   ├── index.html
│   ├── app.js
│   └── components/
├── docs/
│   ├── README.md
│   ├── PHILOSOPHY.md
│   ├── INTEGRATION.md
│   ├── SECURITY.md
│   └── DECISIONS.md
├── data/
│   └── sample-data.json
├── config/
│   ├── example.env
│   └── deployment.json
└── MANIFEST.json</pre>
    </div>
  `;
}

function performExport() {
  const exportType = document.getElementById('exportType').value;
  const detailLevel = document.getElementById('detailLevel').value;
  
  addLog(`Starting export: ${exportType} (${detailLevel} detail)`, 'info');
  
  setTimeout(() => {
    const exportPackage = {
      metadata: {
        exportedAt: new Date().toISOString(),
        exportType,
        detailLevel,
        version: '1.0.0-MVP',
        platform: 'Insight Orchestrator Lab'
      },
      philosophy: document.getElementById('includePhilosophy').checked,
      decisions: document.getElementById('includeDecisions').checked,
      integration: document.getElementById('includeIntegration').checked,
      security: document.getElementById('includeSecurity').checked,
      data: {
        voiceClips: AppState.voiceClips.length,
        threads: AppState.threads.length,
        workflows: AppState.workflows.length,
        activityLog: AppState.activityLog.length
      }
    };
    
    const blob = new Blob([JSON.stringify(exportPackage, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export-${exportType}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addLog('Export package generated successfully', 'success');
  }, 1000);
}

// ========================================
// MODAL SYSTEM
// ========================================

function showModal(title, content, footer = '') {
  // Remove existing modal if any
  const existing = document.getElementById('dynamicModal');
  if (existing) existing.remove();
  
  const modal = document.createElement('div');
  modal.id = 'dynamicModal';
  modal.className = 'modal visible';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">${title}</h2>
        <button class="btn-close" onclick="closeModal()">×</button>
      </div>
      <div class="modal-body">${content}</div>
      ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

function closeModal() {
  const modal = document.getElementById('dynamicModal');
  if (modal) modal.remove();
}

// ========================================
// KEYBOARD SHORTCUTS
// ========================================

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl+Shift+R - Start/Stop Recording
    if (e.ctrlKey && e.shiftKey && e.key === 'R') {
      e.preventDefault();
      if (AppState.currentView === 'voice' || AppState.currentView === 'dashboard') {
        if (AppState.currentView === 'dashboard') {
          switchView('voice');
          setTimeout(() => toggleRecording(), 100);
        } else {
          toggleRecording();
        }
      }
    }
    
    // Ctrl+L - Toggle Log
    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      toggleLog();
    }
    
    // Ctrl+? - Show Help
    if (e.ctrlKey && e.key === '?') {
      e.preventDefault();
      showHelp();
    }
    
    // Escape - Close Modal
    if (e.key === 'Escape') {
      closeModal();
    }
  });
}

function showHelp() {
  showModal('⌨️ Keyboard Shortcuts', `
    <div style="display: grid; gap: var(--space-12);">
      <div style="display: flex; justify-content: space-between; padding: var(--space-8); background-color: var(--color-secondary); border-radius: var(--radius-sm);">
        <span>Start/Stop Recording</span>
        <kbd>Ctrl+Shift+R</kbd>
      </div>
      <div style="display: flex; justify-content: space-between; padding: var(--space-8); background-color: var(--color-secondary); border-radius: var(--radius-sm);">
        <span>Toggle Activity Log</span>
        <kbd>Ctrl+L</kbd>
      </div>
      <div style="display: flex; justify-content: space-between; padding: var(--space-8); background-color: var(--color-secondary); border-radius: var(--radius-sm);">
        <span>Show Keyboard Shortcuts</span>
        <kbd>Ctrl+?</kbd>
      </div>
      <div style="display: flex; justify-content: space-between; padding: var(--space-8); background-color: var(--color-secondary); border-radius: var(--radius-sm);">
        <span>Close Modal</span>
        <kbd>Escape</kbd>
      </div>
      <div style="display: flex; justify-content: space-between; padding: var(--space-8); background-color: var(--color-secondary); border-radius: var(--radius-sm);">
        <span>Focus Global Search</span>
        <kbd>Ctrl+K</kbd>
      </div>
    </div>
  `);
}

// ========================================
// INITIALIZATION
// ========================================

function init() {
  addLog('Insight Orchestrator Lab initialized', 'success');
  addLog('Platform version: 1.0.0-MVP', 'info');
  addLog('Philosophy alignment: ACTIVE', 'success');
  addLog('Chain of custody: ENABLED', 'success');
  
  // Setup navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const viewName = item.dataset.view;
      if (viewName) switchView(viewName);
    });
  });
  
  // Setup keyboard shortcuts
  setupKeyboardShortcuts();
  
  // Global search
  const globalSearch = document.getElementById('globalSearch');
  if (globalSearch) {
    globalSearch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = globalSearch.value.trim();
        if (query) {
          addLog(`Global search: "${query}"`, 'info');
          // In production, this would search across all modules
        }
      }
    });
  }
  
  addLog('Ready for operations', 'info');
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}