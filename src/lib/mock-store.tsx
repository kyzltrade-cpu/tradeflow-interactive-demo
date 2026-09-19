'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import {
  MOCK_COMPANY,
  MOCK_PRODUCTS,
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES,
  MOCK_FAQ_RULES,
  MOCK_SETTINGS,
} from './mock-data';
import type { Product, Conversation, Message, FaqRule, CompanySettings, KnowledgeDocument, AiGoal } from './mock-data';

export type { Product, Conversation, Message, FaqRule, CompanySettings, KnowledgeDocument, AiGoal };
import { generateAIResponse } from './mock-ai';
import { MOCK_KNOWLEDGE_DOCUMENTS, MOCK_AI_GOALS } from './mock-data';

interface DemoContextValue {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  products: Product[];
  faqRules: FaqRule[];
  settings: CompanySettings;
  companyName: string;
  knowledgeDocuments: KnowledgeDocument[];
  aiGoals: AiGoal[];

  // Conversation actions
  takeOver: (id: string) => void;
  releaseToAI: (id: string) => void;
  bookmark: (id: string) => void;
  stopAI: (id: string) => void;
  resumeAI: (id: string) => void;
  sendHumanMessage: (conversationId: string, content: string) => void;

  // Product actions
  addProduct: (product: { name: string; description: string; moq: string; price_range: string; category: string; photos?: string[] }) => void;
  updateProduct: (id: string, product: { name: string; description: string; moq: string; price_range: string; category: string; photos?: string[] }) => void;
  deleteProduct: (id: string) => void;

  // Settings actions
  updateSettings: (settings: Partial<CompanySettings>) => void;

  // WhatsApp simulator
  sendWhatsAppMessage: (content: string) => string;

  // Reset
  resetDemo: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(() => deepClone(MOCK_CONVERSATIONS));
  const [messages, setMessages] = useState<Record<string, Message[]>>(() => deepClone(MOCK_MESSAGES));
  const [products, setProducts] = useState<Product[]>(() => deepClone(MOCK_PRODUCTS));
  const [faqRules] = useState<FaqRule[]>(() => deepClone(MOCK_FAQ_RULES));
  const [settings, setSettings] = useState<CompanySettings>(() => deepClone(MOCK_SETTINGS));
  const [knowledgeDocuments] = useState<KnowledgeDocument[]>(() => deepClone(MOCK_KNOWLEDGE_DOCUMENTS));
  const [aiGoals] = useState<AiGoal[]>(() => deepClone(MOCK_AI_GOALS));

  const takeOver = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'human' } : c))
    );
  }, []);

  const releaseToAI = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'ai' } : c))
    );
    // Auto-respond to last user message
    const convMessages = messages[id] || [];
    const lastMsg = convMessages[convMessages.length - 1];
    if (lastMsg && lastMsg.role === 'user') {
      setTimeout(() => {
        const response = generateAIResponse(lastMsg.content);
        const aiMsg: Message = {
          id: `ai_release_${Date.now()}`,
          role: 'assistant',
          content: response,
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => ({
          ...prev,
          [id]: [...(prev[id] || []), aiMsg],
        }));
        setConversations((prev) =>
          prev.map((c) =>
            c.id === id
              ? { ...c, updated_at: new Date().toISOString(), last_message: { content: response, role: 'assistant', created_at: new Date().toISOString() } }
              : c
          )
        );
      }, 1500);
    }
  }, [messages]);

  const bookmark = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'bookmarked' } : c))
    );
  }, []);

  const stopAI = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'ai_paused' } : c))
    );
  }, []);

  const resumeAI = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'ai' } : c))
    );
  }, []);

  const sendHumanMessage = useCallback((conversationId: string, content: string) => {
    const newMsg: Message = {
      id: `h_${Date.now()}`,
      role: 'human',
      content,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMsg],
    }));
    setConversations((prev) =>
      prev.map((c) =>
        c.id === conversationId
          ? { ...c, updated_at: new Date().toISOString(), last_message: { content, role: 'human', created_at: new Date().toISOString() } }
          : c
      )
    );
  }, []);

  const updateSettings = useCallback((partial: Partial<CompanySettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const addProduct = useCallback((product: { name: string; description: string; moq: string; price_range: string; category: string; photos?: string[] }) => {
    const newProduct: Product = {
      id: `p${Date.now()}`,
      ...product,
    };
    setProducts((prev) => [...prev, newProduct]);
  }, []);

  const updateProduct = useCallback((id: string, product: { name: string; description: string; moq: string; price_range: string; category: string; photos?: string[] }) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...product } : p))
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const sendWhatsAppMessage = useCallback((content: string): string => {
    const response = generateAIResponse(content);
    return response;
  }, []);

  const resetDemo = useCallback(() => {
    setConversations(deepClone(MOCK_CONVERSATIONS));
    setMessages(deepClone(MOCK_MESSAGES));
    setProducts(deepClone(MOCK_PRODUCTS));
    setSettings(deepClone(MOCK_SETTINGS));
  }, []);

  return (
    <DemoContext.Provider
      value={{
        conversations,
        messages,
        products,
        faqRules,
        settings,
        companyName: MOCK_COMPANY.name,
        knowledgeDocuments,
        aiGoals,
        takeOver,
        releaseToAI,
        bookmark,
        stopAI,
        resumeAI,
        sendHumanMessage,
        addProduct,
        updateProduct,
        deleteProduct,
        updateSettings,
        sendWhatsAppMessage,
        resetDemo,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoProvider');
  return ctx;
}
