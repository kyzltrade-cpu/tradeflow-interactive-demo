'use client';

import { useState, useRef } from 'react';
import { useLang } from '@/lib/lang';
import { useToast } from '@/components/Toast';
import {
  MOCK_KNOWLEDGE_DOCUMENTS,
  MOCK_AI_GOALS,
  type KnowledgeDocument,
  type AiGoal,
  type FlowStep,
} from '@/lib/mock-data';

const GOAL_TEMPLATES: Omit<AiGoal, 'id' | 'enabled'>[] = [
  {
    title: 'The Concierge',
    description: 'Warm welcome greeting. Parses customer intent naturally, then routes to the right specialist.',
    greeting: "Hi there! Thanks for reaching out to {company}. I'm here to help. Could you tell me a bit about what you're looking to source today?",
    flow_steps: [
      { id: 't1', trigger: 'product inquiry', response: "Got it. Could you share more detail — quantity, specs, and whether you have a tech pack ready?" },
      { id: 't2', trigger: 'pricing question', response: "Pricing depends on quantity, specs, and materials. Could you share a few details about what you need?" },
    ],
    handoff_message: "New Lead: {client_info} | {product} | {volume}",
    triggers: ['hello', 'hi', 'hey', 'inquiry', 'interested'],
  },
  {
    title: 'Automated KYC & Onboarding',
    description: 'Collects client requirements, compliance needs, and target pricing through a structured conversational flow.',
    greeting: "Welcome to {company}! I'd love to help you find the right products. To get started, could you tell me what industry you're in?",
    flow_steps: [
      { id: 't3', trigger: 'industry / product type', response: "Great, {industry} is one of our specialties. A few quick questions:\n1. Target order quantity?\n2. Need certifications (CE, FDA, UL)?\n3. Ideal price range per unit?" },
      { id: 't4', trigger: 'budget / price range', response: "Perfect, I've noted your budget. This looks like a {priority} priority project. Connecting you with our {specialist} team now." },
    ],
    handoff_message: "New KYC Lead: {client_info} | Industry: {industry} | Products: {products} | Budget: {budget}",
    triggers: ['new customer', 'registration', 'sign up', 'onboard'],
  },
  {
    title: 'Instant Quote Generation',
    description: 'Generates preliminary quotes by asking for quantity, specs, and delivery requirements.',
    greeting: "Hi! I can help you get a quick quote. What product are you interested in, and how many units do you need?",
    flow_steps: [
      { id: 't5', trigger: 'product + quantity', response: "Thanks! For {quantity} units of {product}, the estimated range is {price_range}. Need any custom branding or special packaging?" },
      { id: 't6', trigger: 'shipping / delivery', response: "For shipping, I need to know:\n1. Destination country?\n2. Preferred method (sea freight, air, express)?\n3. Required delivery date?" },
    ],
    handoff_message: "Quote Request: {client_info} | Product: {product} | Qty: {quantity} | Est: {price_range}",
    triggers: ['price', 'quote', 'cost', 'how much', 'pricing'],
  },
  {
    title: '24/7 Multilingual Support',
    description: 'Handles inquiries in English, Chinese (Simplified & Traditional), and Cantonese. Detects language naturally.',
    greeting: "Hi! Welcome to {company}. How can I help you today? / 你好！歡迎來到 {company}。有什麼可以幫到你？",
    flow_steps: [
      { id: 't7', trigger: 'Chinese language detected', response: "您好！感謝您聯繫 {company}。請問有什麼可以幫到您？" },
      { id: 't8', trigger: 'English language detected', response: "Hi there! Thanks for reaching out. I can help with product info, pricing, or orders. What are you looking for?" },
    ],
    handoff_message: "Multilingual Lead: {client_info} | Language: {language} | Product: {product}",
    triggers: ['你好', '中文', 'chinese', 'multilingual'],
  },
  {
    title: 'Order Tracking & Updates',
    description: 'Provides real-time order status, shipping tracking, and delivery estimates.',
    greeting: "Hi! I can help you track your order. Could you share your order number or the email address used?",
    flow_steps: [
      { id: 't9', trigger: 'order number provided', response: "Let me look that up for you. One moment...\n\nOrder #{order_number}\nStatus: {status}\nEstimated delivery: {eta}" },
      { id: 't10', trigger: 'shipping delay', response: "I see there's a delay. Here's what I know:\n- Original ETA: {original_eta}\n- Updated ETA: {new_eta}\nI've flagged this for priority follow-up." },
    ],
    handoff_message: "Order Inquiry: {client_info} | Order: {order_number} | Status: {status}",
    triggers: ['track', 'order', 'shipping', 'delivery', 'where is'],
  },
];

export default function KnowledgePage() {
  const { t } = useLang();
  const { showToast } = useToast();
  const [documents, setDocuments] = useState<KnowledgeDocument[]>(MOCK_KNOWLEDGE_DOCUMENTS);
  const [goals, setGoals] = useState<AiGoal[]>(MOCK_AI_GOALS);
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [newTrigger, setNewTrigger] = useState('');
  const [newStepTrigger, setNewStepTrigger] = useState('');
  const [newStepResponse, setNewStepResponse] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    showToast(t('Document removed', '文件已刪除'), 'success');
  };

  const handleFiles = (files: FileList | File[]) => {
    for (const file of Array.from(files)) {
      const newDoc: KnowledgeDocument = {
        id: `k${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: file.name,
        type: file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.xlsx') || file.name.endsWith('.csv') ? 'spreadsheet' : 'text',
        content: 'Document content would be parsed here in production.',
        addedAt: new Date().toISOString().split('T')[0],
        size: `${(file.size / 1024).toFixed(1)} KB`,
      };
      setDocuments(prev => [...prev, newDoc]);
    }
    showToast(t('Files added', '檔案已新增'), 'success');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const handleScrapeWebsite = () => {
    if (!websiteUrl) {
      showToast(t('Please enter a URL', '請輸入網址'), 'error');
      return;
    }
    const newDoc: KnowledgeDocument = {
      id: `k${Date.now()}`,
      name: new URL(websiteUrl).hostname + '.txt',
      type: 'website',
      content: `Scraped content from ${websiteUrl}`,
      addedAt: new Date().toISOString().split('T')[0],
      size: '8.5 KB',
    };
    setDocuments(prev => [...prev, newDoc]);
    setWebsiteUrl('');
    showToast(t('Website scraped successfully', '網站內容已擷取'), 'success');
  };

  const handleToggleGoal = (id: string) => {
    setGoals(prev => prev.map(g => (g.id === id ? { ...g, enabled: !g.enabled } : g)));
  };

  const handleAddGoalFromTemplate = (template: Omit<AiGoal, 'id' | 'enabled'>) => {
    if (goals.some(g => g.title === template.title)) {
      showToast(t('Goal already added', '目標已存在'), 'error');
      return;
    }
    const newGoal: AiGoal = {
      ...template,
      id: `g${Date.now()}`,
      enabled: true,
    };
    setGoals(prev => [...prev, newGoal]);
    setExpandedGoal(newGoal.id);
    showToast(t('Goal activated', '目標已啟用'), 'success');
  };

  const handleRemoveGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    if (expandedGoal === id) setExpandedGoal(null);
    showToast(t('Goal removed', '目標已移除'), 'success');
  };

  const handleAddCustomGoal = () => {
    const newGoal: AiGoal = {
      id: `g${Date.now()}`,
      title: 'New Goal',
      description: 'Describe what this goal should accomplish.',
      enabled: false,
      greeting: 'Hello! How can I help you today?',
      flow_steps: [],
      handoff_message: 'Let me connect you with our team.',
      triggers: [],
    };
    setGoals(prev => [...prev, newGoal]);
    setExpandedGoal(newGoal.id);
    showToast(t('Goal created', '目標已建立'), 'success');
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    if (expandedGoal === id) setExpandedGoal(null);
    showToast(t('Goal deleted', '目標已刪除'), 'success');
  };

  const updateGoal = (id: string, updates: Partial<AiGoal>) => {
    setGoals(prev => prev.map(g => (g.id === id ? { ...g, ...updates } : g)));
  };

  const addFlowStep = (goalId: string) => {
    if (!newStepTrigger.trim() || !newStepResponse.trim()) return;
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    updateGoal(goalId, {
      flow_steps: [...goal.flow_steps, { id: `fs${Date.now()}`, trigger: newStepTrigger.trim(), response: newStepResponse.trim() }],
    });
    setNewStepTrigger('');
    setNewStepResponse('');
  };

  const removeFlowStep = (goalId: string, stepId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    updateGoal(goalId, { flow_steps: goal.flow_steps.filter(s => s.id !== stepId) });
  };

  const addTrigger = (goalId: string) => {
    const val = newTrigger.trim();
    if (!val) return;
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    if (goal.triggers.includes(val)) return;
    updateGoal(goalId, { triggers: [...goal.triggers, val] });
    setNewTrigger('');
  };

  const removeTrigger = (goalId: string, trigger: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    updateGoal(goalId, { triggers: goal.triggers.filter(t => t !== trigger) });
  };

  const templateGoals = goals.filter(g => GOAL_TEMPLATES.some(t => t.title === g.title));
  const customGoals = goals.filter(g => !GOAL_TEMPLATES.some(t => t.title === g.title));

  const renderGoalEditor = (goal: AiGoal) => (
    <div className="p-4 border-t space-y-4" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
      {/* Greeting */}
      <div>
        <label className="text-[12px] font-medium block mb-1.5" style={{ color: 'var(--text-muted)' }}>
          {t('Opening message', '問候語')}
        </label>
        <textarea
          value={goal.greeting}
          onChange={(e) => updateGoal(goal.id, { greeting: e.target.value })}
          rows={2}
          className="w-full border rounded-[4px] px-3 py-2 text-[13px] focus:outline-none resize-none"
          style={{ borderColor: 'var(--border)' }}
          placeholder={t('What the AI says first', 'AI 第一句說什麼')}
        />
      </div>

      {/* Flow steps */}
      <div>
        <label className="text-[12px] font-medium block mb-2" style={{ color: 'var(--text-muted)' }}>
          {t('Flow steps (trigger + response)', '流程步驟（觸發 + 回覆）')}
        </label>
        {goal.flow_steps.length > 0 && (
          <div className="space-y-2 mb-2">
            {goal.flow_steps.map((step, idx) => (
              <div key={step.id} className="flex items-start gap-2 p-2 rounded border" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 mt-0.5" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <input
                    value={step.trigger}
                    onChange={(e) => {
                      const updated = goal.flow_steps.map(s => s.id === step.id ? { ...s, trigger: e.target.value } : s);
                      updateGoal(goal.id, { flow_steps: updated });
                    }}
                    className="w-full border rounded px-2 py-1 text-[11px] focus:outline-none mb-1"
                    style={{ borderColor: 'var(--border)' }}
                    placeholder="Trigger"
                  />
                  <textarea
                    value={step.response}
                    onChange={(e) => {
                      const updated = goal.flow_steps.map(s => s.id === step.id ? { ...s, response: e.target.value } : s);
                      updateGoal(goal.id, { flow_steps: updated });
                    }}
                    rows={2}
                    className="w-full border rounded px-2 py-1 text-[11px] focus:outline-none resize-none"
                    style={{ borderColor: 'var(--border)' }}
                    placeholder="Response"
                  />
                </div>
                <button
                  onClick={() => removeFlowStep(goal.id, step.id)}
                  className="text-[11px] mt-1 shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-red-50"
                  style={{ color: 'var(--error, #ef4444)' }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-1.5">
          <input
            value={newStepTrigger}
            onChange={(e) => setNewStepTrigger(e.target.value)}
            className="flex-1 border rounded px-2 py-1.5 text-[11px] focus:outline-none"
            style={{ borderColor: 'var(--border)' }}
            placeholder={t('Trigger', '觸發詞')}
          />
          <input
            value={newStepResponse}
            onChange={(e) => setNewStepResponse(e.target.value)}
            className="flex-1 border rounded px-2 py-1.5 text-[11px] focus:outline-none"
            style={{ borderColor: 'var(--border)' }}
            placeholder={t('Response', '回覆')}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFlowStep(goal.id); } }}
          />
          <button
            onClick={() => addFlowStep(goal.id)}
            className="text-[11px] px-2 py-1 rounded shrink-0"
            style={{ background: 'var(--accent)', color: 'white' }}
          >
            +
          </button>
        </div>
      </div>

      {/* Handoff */}
      <div>
        <label className="text-[12px] font-medium block mb-1.5" style={{ color: 'var(--text-muted)' }}>
          {t('Handoff message', '轉接訊息')}
        </label>
        <input
          value={goal.handoff_message}
          onChange={(e) => updateGoal(goal.id, { handoff_message: e.target.value })}
          className="w-full border rounded-[4px] px-3 py-2 text-[13px] focus:outline-none"
          style={{ borderColor: 'var(--border)' }}
          placeholder={t('Message when transferring to human', '轉接真人時的訊息')}
        />
      </div>

      {/* Trigger keywords */}
      <div>
        <label className="text-[12px] font-medium block mb-1.5" style={{ color: 'var(--text-muted)' }}>
          {t('Trigger keywords', '觸發關鍵字')}
          <span className="font-normal ml-1" style={{ color: 'var(--text-muted)' }}>
            {t('(activates when these words appear)', '（當這些字詞出現時啟動）')}
          </span>
        </label>
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          {goal.triggers.map((trigger) => (
            <span
              key={trigger}
              className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border"
              style={{ borderColor: 'var(--accent)', color: 'var(--accent)', background: 'var(--accent-light)' }}
            >
              {trigger}
              <button onClick={() => removeTrigger(goal.id, trigger)} className="text-[10px] leading-none">×</button>
            </span>
          ))}
        </div>
        <input
          value={newTrigger}
          onChange={(e) => setNewTrigger(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              addTrigger(goal.id);
            }
          }}
          className="w-full border rounded px-2 py-1.5 text-[11px] focus:outline-none"
          style={{ borderColor: 'var(--border)' }}
          placeholder={t('Type keyword, press Enter', '輸入關鍵字，按 Enter')}
        />
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-[22px] font-semibold mb-1">{t('Knowledge Base', '知識庫')}</h1>
      <p className="text-[13px] mb-6" style={{ color: 'var(--text-muted)' }}>
        {t('Upload documents and configure AI goals to help your assistant respond accurately.', '上傳文件並配置 AI 目標，幫助您的助手準確回覆。')}
      </p>

      {/* Drag-and-drop file upload */}
      <section className="mb-8">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed rounded-[4px] p-8 text-center cursor-pointer transition-colors"
          style={{
            borderColor: dragOver ? 'var(--accent)' : 'var(--border)',
            background: dragOver ? 'var(--accent-light)' : 'transparent',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".xlsx,.xls,.csv,.txt,.md,.pdf,.docx,.doc"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            className="hidden"
          />
          <svg className="mx-auto mb-3" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="text-[13px] font-medium mb-1">
            {dragOver
              ? t('Drop files here', '放開以上傳檔案')
              : t('Drop files here or click to upload', '拖放檔案到此處或點擊上傳')}
          </p>
          <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
            {t('Supports Excel, CSV, TXT, MD, PDF, Word', '支援 Excel、CSV、TXT、MD、PDF、Word')}
          </p>
        </div>
      </section>

      {/* Documents Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold">{t('Documents', '文件')}</h2>
          <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{documents.length}</span>
        </div>

        {documents.length === 0 ? (
          <div className="border-2 border-dashed rounded-[4px] p-8 text-center" style={{ borderColor: 'var(--border)' }}>
            <svg className="mx-auto mb-3" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <p className="text-[13px] mb-1">{t('No documents yet', '尚無文件')}</p>
            <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
              {t('Upload files to build your knowledge base', '上傳文件以建立知識庫')}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map(doc => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-[4px] border"
                style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: 'var(--accent-light)' }}>
                    {doc.type === 'website' ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    ) : doc.type === 'spreadsheet' ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" />
                      </svg>
                    ) : doc.type === 'pdf' ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--error, #ef4444)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium">{doc.name}</p>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      {doc.type} · {doc.size} · {doc.addedAt}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteDocument(doc.id)}
                  className="p-1.5 rounded hover:bg-red-50"
                  style={{ color: 'var(--error, #ef4444)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Website Scraping Section */}
      <section className="mb-8">
        <h2 className="text-[15px] font-semibold mb-3">{t('Website Scraping', '網站擷取')}</h2>
        <div className="border rounded-[4px] p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <p className="text-[13px] mb-3" style={{ color: 'var(--text-muted)' }}>
            {t('Enter your website URL to automatically extract product information.', '輸入網址以自動擷取產品資訊。')}
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com/products"
              className="flex-1 border rounded-[4px] px-3 py-2 text-[13px] focus:outline-none"
              style={{ borderColor: 'var(--border)' }}
              onKeyDown={(e) => e.key === 'Enter' && handleScrapeWebsite()}
            />
            <button
              onClick={handleScrapeWebsite}
              className="flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-[4px] text-white"
              style={{ background: 'var(--accent)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              {t('Scrape', '擷取')}
            </button>
          </div>
        </div>
      </section>

      {/* AI Goals Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[15px] font-semibold">{t('AI Goals', 'AI 目標')}</h2>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {t('Define conversation flows and triggers for your AI assistant', '為 AI 助手定義對話流程和觸發條件')}
            </p>
          </div>
        </div>

        {/* Goal Templates */}
        <div className="mb-6">
          <p className="text-[12px] font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
            {t('Quick-start templates:', '快速開始範本：')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {GOAL_TEMPLATES.map((template, i) => {
              const activeGoal = goals.find(g => g.title === template.title);
              const isActive = !!activeGoal;
              const isExpanded = isActive && expandedGoal === activeGoal.id;

              return (
                <div key={i}>
                  <button
                    onClick={() => {
                      if (!isActive) {
                        handleAddGoalFromTemplate(template);
                      } else {
                        setExpandedGoal(isExpanded ? null : activeGoal.id);
                      }
                    }}
                    className="w-full text-left border rounded-[4px] p-3 transition-all duration-200"
                    style={{
                      borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                      background: isActive ? 'var(--accent-light)' : 'transparent',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {isActive ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveGoal(activeGoal.id);
                          }}
                          className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-200"
                          style={{ borderColor: 'var(--accent)', background: 'var(--accent)' }}
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                        </button>
                      ) : (
                        <div className="w-4 h-4 rounded border-2 shrink-0" style={{ borderColor: 'var(--border)' }} />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium" style={{ color: isActive ? 'var(--accent)' : 'var(--text)' }}>
                          {template.title}
                        </p>
                        <p className="text-[11px] mt-0.5 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                          {template.description}
                        </p>
                      </div>
                      {isActive && (
                        <svg
                          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"
                          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      )}
                    </div>
                  </button>
                  {isActive && isExpanded && (
                    <div className="border border-t-0 rounded-b-[4px] overflow-hidden" style={{ borderColor: 'var(--accent)' }}>
                      {renderGoalEditor(activeGoal)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Goals */}
        {customGoals.length > 0 && (
          <div className="mb-4">
            <p className="text-[12px] font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
              {t('Custom goals:', '自訂目標：')}
            </p>
            <div className="space-y-2">
              {customGoals.map((goal) => {
                const isExpanded = expandedGoal === goal.id;
                return (
                  <div key={goal.id}>
                    <div
                      className="border rounded-[4px] p-3 cursor-pointer transition-all duration-200"
                      style={{
                        borderColor: goal.enabled ? 'var(--accent)' : 'var(--border)',
                        background: goal.enabled ? 'var(--accent-light)' : 'transparent',
                      }}
                      onClick={() => setExpandedGoal(isExpanded ? null : goal.id)}
                    >
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleGoal(goal.id);
                          }}
                          className="relative w-10 h-5 rounded-full transition-colors shrink-0"
                          style={{ background: goal.enabled ? 'var(--accent)' : 'var(--border)' }}
                        >
                          <div
                            className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                            style={{ left: goal.enabled ? '22px' : '2px' }}
                          />
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium" style={{ color: goal.enabled ? 'var(--accent)' : 'var(--text)' }}>
                            {goal.title || t('Untitled goal', '未命名目標')}
                          </p>
                          {goal.triggers && goal.triggers.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {goal.triggers.map((tr) => (
                                <span key={tr} className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                                  {tr}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteGoal(goal.id);
                          }}
                          className="p-1.5 rounded hover:bg-red-50 shrink-0"
                          style={{ color: 'var(--error, #ef4444)' }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="border border-t-0 rounded-b-[4px] overflow-hidden" style={{ borderColor: 'var(--accent)' }}>
                        {renderGoalEditor(goal)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add custom goal */}
        <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={handleAddCustomGoal}
            className="flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-[4px] border"
            style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {t('Add custom goal', '新增自訂目標')}
          </button>
        </div>
      </section>
    </div>
  );
}
