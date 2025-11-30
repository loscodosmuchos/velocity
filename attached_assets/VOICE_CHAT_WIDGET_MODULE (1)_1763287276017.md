# ElevenLabs Voice Chat Widget Module

## Overview
This module provides a complete implementation of an ElevenLabs voice chat widget with support button integration. It creates side-by-side popup windows with instructions and the actual voice chat widget for optimal user experience.

## Module Files

### 1. VoiceChatButton Component

```tsx
// components/VoiceChatButton.tsx
import React from 'react';
import { Button } from '@/components/ui/button'; // Adjust import path as needed

interface VoiceChatButtonProps {
  buttonText?: string;
  className?: string;
  agentId?: string; // ElevenLabs agent ID
}

export default function VoiceChatButton({ 
  buttonText = "AI Support", 
  className = "",
  agentId = "your-agent-id" // Replace with your actual agent ID
}: VoiceChatButtonProps) {
  
  const handleAISupport = () => {
    console.log('AI Support button clicked');
    
    // Calculate screen position for side-by-side windows
    const screenWidth = window.screen.width;
    const windowWidth = 450;
    const windowHeight = 750;
    const leftPosition = Math.max(0, (screenWidth - (windowWidth * 2 + 50)) / 2);
    const rightPosition = leftPosition + windowWidth + 50;
    
    // Create instructions window (left side)
    const instructionsWindow = window.open(
      '',
      'ai-instructions-popup',
      `width=${windowWidth},height=${windowHeight},left=${leftPosition},top=100,resizable=yes,scrollbars=yes,location=no,toolbar=no,menubar=no,status=no`
    );
    
    // Create widget window (right side)
    const widgetWindow = window.open(
      '',
      'ai-widget-popup',
      `width=${windowWidth},height=${windowHeight},left=${rightPosition},top=100,resizable=yes,scrollbars=yes,location=no,toolbar=no,menubar=no,status=no`
    );
    
    // Check if popups were blocked
    if (!instructionsWindow || !widgetWindow) {
      console.error('Popup windows were blocked by browser. Please allow popups for this site.');
      alert('Popup windows were blocked. Please allow popups for this site and try again.');
      return;
    }
    
    // Instructions window content
    if (instructionsWindow) {
      instructionsWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AI Assistant - Instructions</title>
            <style>
                body {
                    margin: 0;
                    padding: 20px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: white;
                    color: #000;
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .header h1 {
                    color: #003082;
                    font-size: 18px;
                    margin: 0 0 10px 0;
                }
                .instructions {
                    background: #f0f7ff;
                    border: 1px solid #d4edda;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 20px;
                    font-size: 13px;
                }
                .instructions li {
                    color: #333;
                    margin: 5px 0;
                }
                .description {
                    background: #fff8dc;
                    border: 1px solid #f0c14b;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 20px;
                    font-size: 14px;
                    color: #333;
                }
                .close-button {
                    background: #dc3545;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 25px;
                    font-size: 14px;
                    cursor: pointer;
                    display: block;
                    margin: 20px auto;
                    min-width: 150px;
                }
                .close-button:hover {
                    background: #c82333;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>AI Assistant Instructions</h1>
                <p>Read these instructions, then close this window</p>
            </div>
            
            <div class="instructions">
                <h3 style="color: #003082; margin: 0 0 10px 0; font-size: 14px;">What you can ask:</h3>
                <ul style="margin: 0 0 15px 0; padding-left: 20px;">
                    <li>Demo walkthrough in any language</li>
                    <li>Feature explanations</li>
                    <li>Technical implementation details</li>
                    <li>Business value propositions</li>
                    <li>Competitive analysis insights</li>
                    <li>Integration requirements</li>
                </ul>
                
                <h3 style="color: #003082; margin: 0 0 10px 0; font-size: 14px;">Feedback you can give:</h3>
                <ul style="margin: 0; padding-left: 20px;">
                    <li>Feature requests</li>
                    <li>Improvement suggestions</li>
                    <li>Problem reports</li>
                    <li>Performance feedback</li>
                </ul>
            </div>
            
            <div class="description">
                <strong>How it works:</strong> The AI assistant will guide you through the platform features, answer technical questions, and provide implementation support. You can speak naturally or type your questions. The assistant adapts to your communication style and technical level.
            </div>
            
            <button class="close-button" onclick="window.close()">
                Close Instructions
            </button>
        </body>
        </html>
      `);
    }
    
    // Widget window content
    if (widgetWindow) {
      widgetWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>AI Voice Assistant</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background: #f8f9fa;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                }
                .header {
                    background: linear-gradient(135deg, #003082, #4C6EA7);
                    color: white;
                    padding: 15px;
                    text-align: center;
                }
                .header h1 {
                    margin: 0;
                    font-size: 18px;
                }
                .widget-container {
                    flex: 1;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                }
                .loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    color: #666;
                }
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #003082;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-bottom: 20px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .fallback {
                    text-align: center;
                    padding: 20px;
                    background: white;
                    border-radius: 8px;
                    margin: 20px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .fallback button {
                    background: #003082;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    font-size: 14px;
                    cursor: pointer;
                    margin: 5px;
                }
                .fallback button:hover {
                    background: #4C6EA7;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>AI Voice Assistant</h1>
                <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Initializing voice chat...</p>
            </div>
            
            <div class="widget-container">
                <div id="elevenlabs-convai-widget" class="loading">
                    <div class="spinner"></div>
                    <p>Loading AI Assistant...</p>
                    <p style="font-size: 12px; opacity: 0.7;">Please wait while we connect to the voice service</p>
                </div>
            </div>
            
            <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" defer></script>
            <script>
                let loadTimeout;
                let widgetInitialized = false;
                
                function initializeWidget() {
                    if (typeof window.ElevenLabs !== 'undefined' && window.ElevenLabs.ConvAI && !widgetInitialized) {
                        try {
                            window.ElevenLabs.ConvAI.widget.init({
                                agentId: "${agentId}", // Your actual agent ID here
                                container: document.getElementById('elevenlabs-convai-widget'),
                                theme: 'light',
                                fullScreen: false,
                                defaultOpen: true
                            });
                            
                            widgetInitialized = true;
                            clearTimeout(loadTimeout);
                            console.log('ElevenLabs widget initialized successfully');
                        } catch (error) {
                            console.error('Error initializing ElevenLabs widget:', error);
                            showFallback();
                        }
                    }
                }
                
                function showFallback() {
                    const container = document.getElementById('elevenlabs-convai-widget');
                    container.innerHTML = \`
                        <div class="fallback">
                            <h3 style="color: #003082; margin-bottom: 15px;">Voice Chat Unavailable</h3>
                            <p style="margin-bottom: 20px; color: #666;">The voice assistant is temporarily unavailable. You can:</p>
                            <button onclick="window.open('https://elevenlabs.io/docs/conversational-ai/overview', '_blank')">
                                📖 View Documentation
                            </button>
                            <button onclick="window.location.reload()">
                                🔄 Try Again
                            </button>
                            <button onclick="window.close()" style="background: #dc3545;">
                                ✕ Close Window
                            </button>
                        </div>
                    \`;
                }
                
                // Try to initialize immediately if script is already loaded
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', function() {
                        setTimeout(initializeWidget, 500);
                    });
                } else {
                    setTimeout(initializeWidget, 500);
                }
                
                // Set timeout for fallback
                loadTimeout = setTimeout(() => {
                    if (!widgetInitialized) {
                        console.log('Widget load timeout, showing fallback');
                        showFallback();
                    }
                }, 10000); // 10 second timeout
                
                // Retry logic
                let retryCount = 0;
                const maxRetries = 3;
                
                function retryInitialization() {
                    if (retryCount < maxRetries && !widgetInitialized) {
                        retryCount++;
                        console.log(\`Retrying widget initialization (attempt \${retryCount})\`);
                        setTimeout(initializeWidget, 2000 * retryCount);
                    }
                }
                
                // Auto-retry if not loaded within 3 seconds
                setTimeout(() => {
                    if (!widgetInitialized) {
                        retryInitialization();
                    }
                }, 3000);
            </script>
        </body>
        </html>
      `);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className={`h-6 px-2 text-xs border-white bg-gradient-to-b from-white to-gray-100 text-blue-800 hover:from-blue-100 hover:to-blue-200 hover:text-blue-900 font-medium shadow-md transition-all duration-200 rounded-md ${className}`}
      onClick={handleAISupport}
    >
      {buttonText}
    </Button>
  );
}
```

### 2. Usage Examples

#### Basic Implementation
```tsx
import VoiceChatButton from './components/VoiceChatButton';

function App() {
  return (
    <div>
      <VoiceChatButton 
        buttonText="Get AI Help"
        agentId="your-elevenlabs-agent-id"
      />
    </div>
  );
}
```

#### In Header/Navigation
```tsx
function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <h1>My App</h1>
      <div className="flex items-center space-x-3">
        <VoiceChatButton 
          buttonText="AI Support"
          agentId="your-elevenlabs-agent-id"
          className="border-gray-300"
        />
      </div>
    </header>
  );
}
```

## Installation Instructions

### 1. Prerequisites
- React/Next.js project with TypeScript
- shadcn/ui components installed (or modify Button import)
- ElevenLabs account with ConvAI agent

### 2. Setup Steps

1. **Install dependencies** (if using shadcn/ui):
```bash
npx shadcn-ui@latest add button
```

2. **Add the VoiceChatButton component** to your project:
```bash
# Create components directory if it doesn't exist
mkdir -p components
# Copy the VoiceChatButton.tsx file to components/
```

3. **Get your ElevenLabs Agent ID**:
   - Sign up at https://elevenlabs.io
   - Create a ConvAI agent
   - Copy your agent ID from the dashboard

4. **Update the component**:
   - Replace `"your-agent-id"` with your actual ElevenLabs agent ID
   - Customize the styling and text as needed

### 3. Configuration Options

```tsx
interface VoiceChatButtonProps {
  buttonText?: string;     // Button display text
  className?: string;      // Additional CSS classes
  agentId?: string;        // ElevenLabs agent ID
  windowWidth?: number;    // Popup window width (default: 450)
  windowHeight?: number;   // Popup window height (default: 750)
  theme?: 'light' | 'dark'; // Widget theme
}
```

### 4. Environment Variables (Optional)
Create a `.env.local` file:
```env
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id_here
```

Then use in component:
```tsx
agentId={process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID || "fallback-agent-id"}
```

## Features

### ✅ What This Module Provides:
- Side-by-side popup windows (instructions + widget)
- Automatic ElevenLabs widget loading and initialization  
- Fallback handling for script loading failures
- Responsive design and proper error states
- Professional styling and user experience
- Retry logic and timeout handling
- Popup blocker detection and user guidance

### 🔧 Customization Options:
- Button styling and text
- Window dimensions and positioning
- Instructions content and branding
- Fallback behavior and error messages
- Widget theme and configuration

## Browser Compatibility

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (with popup support)
- ⚠️ Popup blockers may prevent window opening
- ⚠️ Some corporate firewalls may block ElevenLabs CDN

## Troubleshooting

### Common Issues:

1. **Popup windows blocked**:
   - Add instructions for users to allow popups
   - The component automatically detects and alerts users

2. **ElevenLabs script fails to load**:
   - Check network connectivity
   - Verify ElevenLabs CDN access
   - Component shows fallback with retry options

3. **Agent ID not working**:
   - Verify agent ID is correct
   - Ensure agent is published in ElevenLabs dashboard
   - Check agent permissions and settings

4. **TypeScript errors**:
   - Ensure Button component import path is correct
   - Install required UI library dependencies
   - Add type declarations if needed

### Debug Mode:
Enable console logging by opening browser dev tools. The component logs initialization steps and any errors.

## Security Considerations

- Agent ID is public (frontend visible)
- No API keys exposed in frontend code
- ElevenLabs handles authentication on their end
- Popup windows are same-origin

## Support

For ElevenLabs-specific issues:
- Documentation: https://elevenlabs.io/docs/conversational-ai/overview
- Support: https://elevenlabs.io/support

For implementation issues:
- Check browser console for error messages
- Verify agent ID and ElevenLabs account status
- Test with different browsers and network conditions