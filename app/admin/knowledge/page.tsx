'use client';

import { useState } from 'react';
import { useLang } from '@/lib/lang';
import { useToast } from '@/components/Toast';
import { MOCK_KNOWLEDGE_DOCUMENTS, MOCK_AI_GOALS, type KnowledgeDocument, type AiGoal } from '@/lib/mock-data';
import {
  FileText,
  Globe,
  Trash2,
  ChevronDown,
  ChevronRight,
  Plus,
  Zap,
} from 'lucide-react';

export default function KnowledgePage() {
  const { t } = useLang();
  const { showToast } = useToast();
  const [documents, setDocuments] = useState<KnowledgeDocument[]>(MOCK_KNOWLEDGE_DOCUMENTS);
  const [goals, setGoals] = useState<AiGoal[]>(MOCK_AI_GOALS);
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState('');

  const handleDeleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    showToast(t('Document removed', '文件已刪除'), 'success');
  };

  const handleAddDocument = () => {
    const newDoc: KnowledgeDocument = {
      id: `k${Date.now()}`,
      name: 'New_Document.txt',
      type: 'text',
      content: 'Document content would be parsed here.',
      addedAt: new Date().toISOString().split('T')[0],
      size: '1.2 KB',
    };
    setDocuments(prev => [...prev, newDoc]);
    showToast(t('Document added', '文件已新增'), 'success');
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
    setGoals(prev =>
      prev.map(g => (g.id === id ? { ...g, enabled: !g.enabled } : g))
    );
  };

  const handleAddGoal = () => {
    const newGoal: AiGoal = {
      id: `g${Date.now()}`,
      title: 'New Goal',
      description: 'Describe what this goal should accomplish.',
      enabled: false,
      greeting: 'Hello! How can I help you today?',
      flow_steps: [],
      handoff_message: 'Let me connect you with our team.',
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

  return (
    <div>
      <h1 className="text-[22px] font-semibold mb-1">{t('Knowledge Base', '知識庫')}</h1>
      <p className="text-[13px] mb-6" style={{ color: 'var(--text-muted)' }}>
        {t('Upload documents and configure AI goals to help your assistant respond accurately.', '上傳文件並配置 AI 目標，幫助您的助手準確回覆。')}
      </p>

      {/* Documents Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold">{t('Documents', '文件')}</h2>
          <button
            onClick={handleAddDocument}
            className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-[4px] text-white"
            style={{ background: 'var(--accent)' }}
          >
            <Plus size={14} />
            {t('Add File', '新增文件')}
          </button>
        </div>

        {documents.length === 0 ? (
          <div className="border-2 border-dashed rounded-[4px] p-8 text-center" style={{ borderColor: 'var(--border)' }}>
            <FileText size={32} style={{ color: 'var(--text-muted)' }} className="mx-auto mb-3" />
            <p className="text-[13px] mb-1">{t('No documents yet', '尚無文件')}</p>
            <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
              {t('Upload files or scrape websites to build your knowledge base', '上傳文件或擷取網站內容以建立知識庫')}
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
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center"
                    style={{ background: 'var(--accent-light)' }}
                  >
                    <FileText size={16} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium">{doc.name}</p>
                    <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      {doc.type} · {doc.size} · {t('Added', '新增於')} {doc.addedAt}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteDocument(doc.id)}
                  className="p-1.5 rounded hover:bg-red-50"
                  style={{ color: 'var(--error, #ef4444)' }}
                >
                  <Trash2 size={14} />
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
            {t('Enter your website URL to automatically extract product information and content.', '輸入您的網址以自動擷取產品資訊和內容。')}
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com/products"
              className="flex-1 border rounded-[4px] px-3 py-2 text-[13px] focus:outline-none"
              style={{ borderColor: 'var(--border)' }}
            />
            <button
              onClick={handleScrapeWebsite}
              className="flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-[4px] text-white"
              style={{ background: 'var(--accent)' }}
            >
              <Globe size={14} />
              {t('Scrape', '擷取')}
            </button>
          </div>
        </div>
      </section>

      {/* AI Goals Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[15px] font-semibold">{t('AI Goals', 'AI 目標')}</h2>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {t('Define conversation flows and triggers for your AI assistant', '為您的 AI 助手定義對話流程和觸發條件')}
            </p>
          </div>
          <button
            onClick={handleAddGoal}
            className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-[4px] text-white"
            style={{ background: 'var(--accent)' }}
          >
            <Plus size={14} />
            {t('Add Goal', '新增目標')}
          </button>
        </div>

        {goals.length === 0 ? (
          <div className="border-2 border-dashed rounded-[4px] p-8 text-center" style={{ borderColor: 'var(--border)' }}>
            <Zap size={32} style={{ color: 'var(--text-muted)' }} className="mx-auto mb-3" />
            <p className="text-[13px] mb-1">{t('No goals configured', '尚無配置目標')}</p>
            <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
              {t('Add goals to define how your AI should handle different scenarios', '新增目標以定義 AI 如何處理不同情境')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {goals.map(goal => (
              <div
                key={goal.id}
                className="border rounded-[4px] overflow-hidden"
                style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
              >
                <div
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => setExpandedGoal(expandedGoal === goal.id ? null : goal.id)}
                >
                  <div className="flex items-center gap-3">
                    {expandedGoal === goal.id ? (
                      <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />
                    ) : (
                      <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                    )}
                    <div>
                      <p className="text-[13px] font-medium">{goal.title}</p>
                      <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                        {goal.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
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
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGoal(goal.id);
                      }}
                      className="p-1.5 rounded hover:bg-red-50"
                      style={{ color: 'var(--error, #ef4444)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {expandedGoal === goal.id && (
                  <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
                    {/* Greeting */}
                    <div className="mb-4">
                      <label className="text-[12px] font-medium block mb-1.5" style={{ color: 'var(--text-muted)' }}>
                        {t('Greeting Message', '問候訊息')}
                      </label>
                      <input
                        type="text"
                        value={goal.greeting}
                        onChange={(e) =>
                          setGoals(prev =>
                            prev.map(g => (g.id === goal.id ? { ...g, greeting: e.target.value } : g))
                          )
                        }
                        className="w-full border rounded-[4px] px-3 py-2 text-[13px] focus:outline-none"
                        style={{ borderColor: 'var(--border)' }}
                      />
                    </div>

                    {/* Flow Steps */}
                    <div className="mb-4">
                      <label className="text-[12px] font-medium block mb-2" style={{ color: 'var(--text-muted)' }}>
                        {t('Conversation Flow', '對話流程')}
                      </label>
                      {goal.flow_steps.length === 0 ? (
                        <p className="text-[12px] p-3 rounded" style={{ color: 'var(--text-muted)', background: 'var(--bg)' }}>
                          {t('No flow steps defined', '未定義流程步驟')}
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {goal.flow_steps.map((step, idx) => (
                            <div
                              key={step.id}
                              className="p-3 rounded border"
                              style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
                            >
                              <div className="flex items-start gap-2">
                                <span
                                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0 mt-0.5"
                                  style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                                >
                                  {idx + 1}
                                </span>
                                <div className="flex-1">
                                  <p className="text-[12px] font-medium" style={{ color: 'var(--accent)' }}>
                                    {t('When:', '當：')} {step.trigger}
                                  </p>
                                  <p className="text-[12px] mt-1">{t('AI responds:', 'AI 回覆：')} {step.response}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Handoff Message */}
                    <div>
                      <label className="text-[12px] font-medium block mb-1.5" style={{ color: 'var(--text-muted)' }}>
                        {t('Handoff Message', '轉接訊息')}
                      </label>
                      <input
                        type="text"
                        value={goal.handoff_message}
                        onChange={(e) =>
                          setGoals(prev =>
                            prev.map(g => (g.id === goal.id ? { ...g, handoff_message: e.target.value } : g))
                          )
                        }
                        className="w-full border rounded-[4px] px-3 py-2 text-[13px] focus:outline-none"
                        style={{ borderColor: 'var(--border)' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
