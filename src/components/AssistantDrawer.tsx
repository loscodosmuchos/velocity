/**
 * VINessa AI Assistant Drawer
 * Floating chat interface for contextual procurement guidance
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAssistant } from '@/contexts/AssistantContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  Trash2,
  Minimize2,
  Bot,
  User,
  Loader2,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AssistantDrawer() {
  const { 
    isOpen, 
    setIsOpen, 
    messages, 
    isLoading, 
    sendMessage, 
    clearConversation,
    screenContext 
  } = useAssistant();
  
  const [input, setInput] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const message = input;
    setInput('');
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    { label: 'Summarize this view', icon: Zap },
    { label: 'What needs attention?', icon: Sparkles },
    { label: 'Explain these metrics', icon: Bot },
  ];

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-cyan-700 hover:from-blue-500 hover:to-cyan-600 shadow-lg shadow-blue-500/30 border border-blue-400/20"
        size="icon"
      >
        <MessageCircle className="h-6 w-6 text-white" />
        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] max-h-[80vh] bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-blue-500/10 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-gradient-to-r from-blue-900/50 to-cyan-900/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">VINessa</h3>
            <p className="text-xs text-slate-400">Procurement AI Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={clearConversation}
            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
            title="Clear conversation"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {screenContext && (
        <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-700/30">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="h-3 w-3 text-cyan-400" />
            <span>Viewing: <span className="text-cyan-300">{screenContext.pageName}</span></span>
          </div>
        </div>
      )}

      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-600/20 flex items-center justify-center mb-4">
              <Bot className="h-8 w-8 text-cyan-400" />
            </div>
            <h4 className="text-lg font-medium text-white mb-2">How can I help?</h4>
            <p className="text-sm text-slate-400 mb-6 max-w-[250px]">
              Ask me about contracts, budgets, contractors, or anything on your screen.
            </p>
            <div className="space-y-2 w-full">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => sendMessage(prompt.label)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 text-sm text-slate-300 hover:text-white transition-colors text-left"
                >
                  <prompt.icon className="h-4 w-4 text-cyan-400" />
                  {prompt.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  msg.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {msg.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[280px] rounded-2xl px-4 py-2.5 text-sm",
                    msg.role === 'user'
                      ? "bg-gradient-to-br from-blue-600 to-cyan-700 text-white rounded-br-md"
                      : "bg-slate-800/80 text-slate-200 rounded-bl-md border border-slate-700/50"
                  )}
                >
                  <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                </div>
                {msg.role === 'user' && (
                  <div className="h-8 w-8 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-slate-300" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-slate-800/80 rounded-2xl rounded-bl-md px-4 py-3 border border-slate-700/50">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about procurement..."
            className="flex-1 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
