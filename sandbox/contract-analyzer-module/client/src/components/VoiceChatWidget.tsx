import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Headphones, 
  ExternalLink, 
  Mic,
  MessageSquare,
  Sparkles,
  X
} from 'lucide-react';

const VoiceChatWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const openVoiceChat = () => {
    const voiceChatHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Voice Assistant - ATS Platform Guide</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 500px;
            width: 100%;
            text-align: center;
        }
        .header {
            margin-bottom: 30px;
        }
        .title {
            color: #333;
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #666;
            font-size: 16px;
            line-height: 1.5;
        }
        .badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #e0f2fe;
            color: #0277bd;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 500;
            margin: 10px 5px;
        }
        .widget-container {
            margin: 20px 0;
            padding: 20px;
            border: 2px dashed #e0e0e0;
            border-radius: 15px;
            background: #fafafa;
        }
        .instructions {
            background: #f8f9ff;
            border: 1px solid #e3e8ff;
            border-radius: 12px;
            padding: 20px;
            margin-top: 20px;
            text-align: left;
        }
        .instructions h3 {
            margin: 0 0 15px 0;
            color: #4f46e5;
            font-size: 16px;
        }
        .instructions ul {
            margin: 0;
            padding-left: 20px;
            color: #555;
        }
        .instructions li {
            margin-bottom: 8px;
            line-height: 1.4;
        }
        .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #888;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="title">🎤 AI Voice Assistant</h1>
            <p class="subtitle">Your intelligent guide for ATS platform development and contract analysis</p>
            
            <div style="margin: 15px 0;">
                <span class="badge">
                    <span style="width: 8px; height: 8px; background: #4ade80; border-radius: 50%; display: inline-block;"></span>
                    Live Voice Chat
                </span>
                <span class="badge">
                    <span style="width: 8px; height: 8px; background: #3b82f6; border-radius: 50%; display: inline-block;"></span>
                    Contract Expert
                </span>
                <span class="badge">
                    <span style="width: 8px; height: 8px; background: #8b5cf6; border-radius: 50%; display: inline-block;"></span>
                    ATS Specialist
                </span>
            </div>
        </div>
        
        <div class="widget-container">
            <elevenlabs-convai agent-id="agent_6401k25pzf10e6r8wagmnvghjyv9"></elevenlabs-convai>
        </div>
        
        <div class="instructions">
            <h3>🚀 How to Use Your Voice Assistant</h3>
            <ul>
                <li><strong>Click the microphone</strong> to start voice conversation</li>
                <li><strong>Ask about contracts:</strong> "Analyze the HAEA MSP contract terms"</li>
                <li><strong>Get ATS guidance:</strong> "What are the latest ATS innovations for 2025?"</li>
                <li><strong>Scenario planning:</strong> "How would changing the SLA impact costs?"</li>
                <li><strong>Technical help:</strong> "Explain the AI voice implementation requirements"</li>
                <li><strong>Strategic insights:</strong> "What's the ROI for upgrading our ATS platform?"</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>💡 <strong>Tip:</strong> Keep this window open while browsing the main site for continuous AI support</p>
        </div>
    </div>
    
    <script src="https://unpkg.com/@elevenlabs/convai-widget-embed" async type="text/javascript"></script>
</body>
</html>
    `;

    const blob = new Blob([voiceChatHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const newWindow = window.open(
      url, 
      'VoiceChat', 
      'width=600,height=700,scrollbars=yes,resizable=yes,status=yes,location=no,toolbar=no,menubar=no'
    );
    
    if (newWindow) {
      newWindow.document.title = 'AI Voice Assistant - ATS Platform Guide';
      // Clean up the blob URL after a delay
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } else {
      alert('Please allow pop-ups to open the voice chat window');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Compact floating button */}
      {!isExpanded && (
        <Button
          onClick={() => setIsExpanded(true)}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-white"
          size="lg"
        >
          <Headphones className="w-6 h-6 text-white" />
        </Button>
      )}

      {/* Expanded widget */}
      {isExpanded && (
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 w-80 max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Headphones className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Voice Assistant</h3>
                <p className="text-xs text-gray-500">Contract & ATS Expert</p>
              </div>
            </div>
            <Button
              onClick={() => setIsExpanded(false)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-1">
              <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Live Chat
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                <Mic className="w-3 h-3 mr-1" />
                Voice Ready
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
            </div>

            <div className="text-sm text-gray-600 leading-relaxed">
              Get instant voice support for contract analysis, ATS planning, and technical guidance. 
              Ask about scenarios, calculations, or implementation details.
            </div>

            <Button
              onClick={openVoiceChat}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Voice Chat Window
            </Button>

            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-3 h-3" />
                <span>Ask: "Analyze contract terms"</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-3 h-3" />
                <span>Try: "What-if scenarios for costs"</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-3 h-3" />
                <span>Get: "ATS innovation insights"</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceChatWidget;