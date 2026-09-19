'use client';

import { useState } from 'react';
import { useLang } from '@/lib/lang';

interface FaqRule {
  id: string;
  question_pattern: string;
  keywords: string[];
  answer: string;
  priority: number;
}

const INITIAL_RULES: FaqRule[] = [
  {
    id: 'f1',
    question_pattern: 'pricing',
    keywords: ['price', 'cost', 'how much'],
    answer: 'Our pricing depends on quantity, material, and customization. Contact us for a detailed quote tailored to your needs.',
    priority: 1,
  },
  {
    id: 'f2',
    question_pattern: 'moq',
    keywords: ['moq', 'minimum order'],
    answer: 'Our MOQ varies by product and material. Typically ranges from 500 to 5,000 units. Contact us for specific product MOQs.',
    priority: 2,
  },
  {
    id: 'f3',
    question_pattern: 'shipping',
    keywords: ['shipping', 'delivery', 'lead time'],
    answer: 'We typically ship within 15–25 business days depending on order size and destination. FOB and CIF options available.',
    priority: 3,
  },
];

export default function FaqPage() {
  const { t } = useLang();
  const [rules, setRules] = useState<FaqRule[]>(INITIAL_RULES);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formName, setFormName] = useState('');
  const [formKeywords, setFormKeywords] = useState('');
  const [formAnswer, setFormAnswer] = useState('');
  const [formPriority, setFormPriority] = useState<number>(0);

  const resetForm = () => {
    setFormName('');
    setFormKeywords('');
    setFormAnswer('');
    setFormPriority(0);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (rule: FaqRule) => {
    setEditingId(rule.id);
    setFormName(rule.question_pattern);
    setFormKeywords(rule.keywords.join(', '));
    setFormAnswer(rule.answer);
    setFormPriority(rule.priority);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formAnswer.trim()) return;
    const keywords = formKeywords.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);

    if (editingId) {
      setRules(rules.map(r =>
        r.id === editingId
          ? { ...r, question_pattern: formName.trim(), keywords, answer: formAnswer.trim(), priority: formPriority || r.priority }
          : r
      ));
    } else {
      const newRule: FaqRule = {
        id: `f_${Date.now()}`,
        question_pattern: formName.trim(),
        keywords,
        answer: formAnswer.trim(),
        priority: formPriority || rules.length + 1,
      };
      setRules([...rules, newRule]);
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
    setDeleteConfirmId(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-[20px] md:text-[24px] font-semibold tracking-[-0.5px]">{t('FAQ Rules', 'FAQ 規則')}</h1>
          <p className="text-[13px] md:text-[14px] mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('Business rules the AI follows — keywords trigger matching answers', 'AI 遵守的業務規則——關鍵詞觸發匹配答案')}
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="text-[13px] md:text-[14px] font-medium px-4 py-2.5 rounded-[4px] text-white w-full sm:w-auto inline-flex items-center gap-2"
          style={{ background: 'var(--accent)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {t('Add rule', '新增規則')}
        </button>
      </div>

      {showForm && (
        <div className="border rounded-[4px] p-5 mb-6" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <h2 className="text-[15px] font-semibold mb-4">{editingId ? t('Edit rule', '編輯規則') : t('New rule', '新規則')}</h2>
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-[13px] font-medium mb-1">{t('Rule name', '規則名稱')}</label>
              <input
                placeholder={t('e.g. pricing, moq, shipping', '例如：pricing, moq, shipping')}
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full border rounded-[4px] px-3 py-2 text-[14px] focus:outline-none"
                style={{ borderColor: 'var(--border)' }}
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium mb-1">{t('Trigger keywords (comma-separated)', '觸發關鍵詞（逗號分隔）')}</label>
              <input
                placeholder={t('e.g. price, cost, how much', '例如：price, cost, how much')}
                value={formKeywords}
                onChange={(e) => setFormKeywords(e.target.value)}
                className="w-full border rounded-[4px] px-3 py-2 text-[14px] focus:outline-none"
                style={{ borderColor: 'var(--border)' }}
              />
              <p className="text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>
                {t('When these words appear in a message, this rule fires', '當訊息中出現這些詞時，此規則會觸發')}
              </p>
            </div>
            <div>
              <label className="block text-[13px] font-medium mb-1">{t('AI response', 'AI 回覆')}</label>
              <textarea
                placeholder={t('The AI should answer...', 'AI 應該回答...')}
                value={formAnswer}
                onChange={(e) => setFormAnswer(e.target.value)}
                className="w-full border rounded-[4px] px-3 py-2 text-[14px] h-24 focus:outline-none"
                style={{ borderColor: 'var(--border)' }}
              />
            </div>
            <div>
              <label className="block text-[13px] font-medium mb-1">{t('Priority (higher = used first)', '優先級（越高越優先）')}</label>
              <input
                type="number"
                placeholder="10"
                value={formPriority || ''}
                onChange={(e) => setFormPriority(parseInt(e.target.value) || 0)}
                className="w-48 border rounded-[4px] px-3 py-2 text-[14px] focus:outline-none"
                style={{ borderColor: 'var(--border)' }}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={resetForm}
              className="text-[13px] px-4 py-2 rounded-[4px] border"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            >
              {t('Cancel', '取消')}
            </button>
            <button
              onClick={handleSave}
              className="text-[13px] font-medium px-4 py-2 rounded-[4px] text-white"
              style={{ background: 'var(--accent)' }}
            >
              {editingId ? t('Save', '儲存') : t('Add rule', '新增規則')}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {rules.map((rule) => (
          <div key={rule.id} className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className="text-[11px] px-2 py-0.5 rounded font-medium"
                  style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                >
                  {t('Priority', '優先級')} {rule.priority}
                </span>
                <p className="text-[14px] md:text-[15px] font-medium">{rule.question_pattern}</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEdit(rule)}
                  className="text-[13px] px-3 py-1 rounded inline-flex items-center gap-1"
                  style={{ color: 'var(--accent)' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  {t('Edit', '編輯')}
                </button>
                {deleteConfirmId === rule.id ? (
                  <div className="flex items-center gap-1 ml-1">
                    <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{t('Delete?', '刪除？')}</span>
                    <button
                      onClick={() => handleDelete(rule.id)}
                      className="text-[12px] font-medium px-2 py-0.5 rounded"
                      style={{ color: 'var(--error, #e53e3e)' }}
                    >
                      {t('Yes', '是')}
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(null)}
                      className="text-[12px] px-2 py-0.5 rounded"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {t('No', '否')}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirmId(rule.id)}
                    className="text-[13px] px-3 py-1 rounded inline-flex items-center gap-1"
                    style={{ color: 'var(--error, #e53e3e)' }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    {t('Delete', '刪除')}
                  </button>
                )}
              </div>
            </div>
            {rule.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {rule.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="text-[11px] px-2 py-0.5 rounded font-medium"
                    style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}
            <p className="text-[13px] md:text-[14px] leading-[1.5] whitespace-pre-wrap" style={{ color: 'var(--text-muted)' }}>
              {rule.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
