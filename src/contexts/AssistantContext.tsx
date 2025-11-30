/**
 * Context-Aware AI Assistant Provider
 * Manages assistant state, conversation history, and screen context
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useLocation } from 'react-router';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  contextSnapshot?: ScreenContext;
}

interface ScreenContext {
  pageName: string;
  route: string;
  userRole?: string;
  summary?: string;
  visibleData?: Record<string, unknown>;
  availableActions?: string[];
}

interface AssistantContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  messages: Message[];
  isLoading: boolean;
  sendMessage: (message: string) => Promise<void>;
  clearConversation: () => void;
  screenContext: ScreenContext | null;
  setScreenContext: (context: ScreenContext) => void;
  conversationId: string | null;
}

const AssistantContext = createContext<AssistantContextType | null>(null);

export function useAssistant() {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error('useAssistant must be used within AssistantProvider');
  }
  return context;
}

interface AssistantProviderProps {
  children: ReactNode;
}

export function AssistantProvider({ children }: AssistantProviderProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [screenContext, setScreenContext] = useState<ScreenContext | null>(null);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      
      const currentContext: ScreenContext = screenContext || {
        pageName: getPageName(location.pathname),
        route: location.pathname,
      };

      const response = await fetch('/api/ai/assistant/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message,
          conversationId,
          contextSnapshot: currentContext,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      if (data.conversationId && !conversationId) {
        setConversationId(data.conversationId);
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: Date.now(),
        contextSnapshot: currentContext,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Assistant error:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, conversationId, screenContext, location.pathname]);

  const clearConversation = useCallback(() => {
    setMessages([]);
    setConversationId(null);
  }, []);

  return (
    <AssistantContext.Provider
      value={{
        isOpen,
        setIsOpen,
        messages,
        isLoading,
        sendMessage,
        clearConversation,
        screenContext,
        setScreenContext,
        conversationId,
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
}

function getPageName(pathname: string): string {
  const routes: Record<string, string> = {
    '/': 'Dashboard',
    '/dashboard': 'Dashboard',
    '/contractors': 'Contractors List',
    '/purchase-orders': 'Purchase Orders',
    '/statement-of-works': 'Statements of Work',
    '/statementofworks': 'Statements of Work',
    '/sow-command-center': 'SOW Command Center',
    '/invoices': 'Invoices',
    '/timecards': 'Timecards',
    '/documents/upload': 'Contract Analysis',
    '/analytics-hub': 'Analytics Hub',
    '/triage-room': 'Triage Room',
  };

  for (const [route, name] of Object.entries(routes)) {
    if (pathname === route || pathname.startsWith(route + '/')) {
      return name;
    }
  }

  const lastSegment = pathname.split('/').filter(Boolean).pop() || 'Page';
  return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, ' ');
}

export function useProcurementContext() {
  const { setScreenContext } = useAssistant();
  const location = useLocation();

  const updateContext = useCallback((data: {
    summary?: string;
    visibleData?: Record<string, unknown>;
    availableActions?: string[];
    userRole?: string;
  }) => {
    setScreenContext({
      pageName: getPageName(location.pathname),
      route: location.pathname,
      ...data,
    });
  }, [setScreenContext, location.pathname]);

  return { updateContext };
}
