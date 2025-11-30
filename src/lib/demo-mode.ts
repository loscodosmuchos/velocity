/**
 * DEMO MODE CONTROLLER
 * Admin-toggleable demo mode - no dev changes required
 * 
 * Toggle from: Admin → Settings or use keyboard shortcut Ctrl+Shift+D
 */

const DEMO_MODE_KEY = 'velocity_demo_mode';
const DEMO_MODE_LISTENERS: Set<(enabled: boolean) => void> = new Set();

/**
 * Check if demo mode is enabled
 * Priority: localStorage (admin toggle) > env var (dev fallback)
 */
export function isDemoMode(): boolean {
  const localSetting = localStorage.getItem(DEMO_MODE_KEY);
  if (localSetting !== null) {
    return localSetting === 'true';
  }
  return import.meta.env.VITE_DEMO_MODE === 'true';
}

/**
 * Enable demo mode (admin action)
 */
export function enableDemoMode(): void {
  localStorage.setItem(DEMO_MODE_KEY, 'true');
  notifyListeners(true);
  console.log('🎭 Demo mode ENABLED - page will reload');
  window.location.reload();
}

/**
 * Disable demo mode (admin action)
 */
export function disableDemoMode(): void {
  localStorage.setItem(DEMO_MODE_KEY, 'false');
  notifyListeners(false);
  console.log('🚀 Demo mode DISABLED - page will reload');
  window.location.reload();
}

/**
 * Toggle demo mode
 */
export function toggleDemoMode(): void {
  if (isDemoMode()) {
    disableDemoMode();
  } else {
    enableDemoMode();
  }
}

/**
 * Subscribe to demo mode changes
 */
export function onDemoModeChange(callback: (enabled: boolean) => void): () => void {
  DEMO_MODE_LISTENERS.add(callback);
  return () => DEMO_MODE_LISTENERS.delete(callback);
}

function notifyListeners(enabled: boolean): void {
  DEMO_MODE_LISTENERS.forEach(cb => cb(enabled));
}

/**
 * Suppress 401 console errors in demo mode
 * Call this once at app initialization
 */
export function suppressAuthErrorsInDemoMode(): void {
  if (!isDemoMode()) return;
  
  const originalError = console.error;
  console.error = (...args) => {
    const message = args.join(' ');
    if (message.includes('401') || message.includes('Unauthorized')) {
      return;
    }
    originalError.apply(console, args);
  };
}

/**
 * Keyboard shortcut: Ctrl+Shift+D to toggle demo mode
 */
export function initDemoModeShortcut(): void {
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      toggleDemoMode();
    }
  });
}
