import { useState, useCallback } from 'react';

export interface Message {
  id: string;
  type: 'user' | 'ai' | 'suggestion' | 'json';
  content: string;
  timestamp: Date;
  originalText?: string;
  suggestion?: string;
  status?: 'pending' | 'accepted' | 'rejected';
  jsonContent?: any;
  jsonTitle?: string;
}

export const useConversationHistory = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };
    
    console.log("💬 Adding message to conversation:", newMessage);
    setMessages(prev => {
      const updated = [...prev, newMessage];
      console.log("💬 Updated messages array:", updated);
      return updated;
    });
    return newMessage.id;
  }, []);

  const addSuggestion = useCallback((originalText: string, suggestion: string) => {
    console.log("💡 Adding suggestion:", { originalText, suggestion });
    return addMessage({
      type: 'suggestion',
      content: `I've rephrased your text: "${originalText}"`,
      originalText,
      suggestion,
      status: 'pending'
    });
  }, [addMessage]);

  const updateSuggestionStatus = useCallback((messageId: string, status: 'accepted' | 'rejected') => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, status }
          : msg
      )
    );
  }, []);

  const addUserMessage = useCallback((content: string) => {
    return addMessage({
      type: 'user',
      content
    });
  }, [addMessage]);

  const addAIMessage = useCallback((content: string) => {
    return addMessage({
      type: 'ai',
      content
    });
  }, [addMessage]);

  const addJsonMessage = useCallback((content: string, jsonContent: any, jsonTitle?: string) => {
    console.log("📄 Adding JSON message:", { content, jsonContent, jsonTitle });
    return addMessage({
      type: 'json',
      content,
      jsonContent,
      jsonTitle
    });
  }, [addMessage]);

  const clearHistory = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    addMessage,
    addSuggestion,
    updateSuggestionStatus,
    addUserMessage,
    addAIMessage,
    addJsonMessage,
    clearHistory
  };
};
