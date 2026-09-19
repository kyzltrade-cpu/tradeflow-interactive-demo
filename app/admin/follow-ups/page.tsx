'use client';

import { useState } from 'react';
import { useLang } from '@/lib/lang';

type SequenceStatus = 'active' | 'paused' | 'completed';

interface Sequence {
  id: string;
  name: string;
  status: SequenceStatus;
  steps: number;
  lastTriggered: string;
}

const mockSequences: Sequence[] = [
  { id: 'seq-1', name: 'Post-inquiry follow-up', status: 'active', steps: 4, lastTriggered: '2 hours ago' },
  { id: 'seq-2', name: 'Quote follow-up', status: 'active', steps: 3, lastTriggered: '5 hours ago' },
  { id: 'seq-3', name: 'Re-engagement', status: 'paused', steps: 5, lastTriggered: '2 days ago' },
];

const statusConfig: Record<SequenceStatus, { bg: string; color: string; label: string }> = {
  active: { bg: '#D1FAE5', color: '#059669', label: 'Active' },
  paused: { bg: '#FEF3C7', color: '#92400E', label: 'Paused' },
  completed: { bg: '#F3F4F6', color: '#6B7280', label: 'Completed' },
};

export default function FollowUpsPage() {
  const { t } = useLang();
  const [sequences] = useState<Sequence[]>(mockSequences);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-[20px] md:text-[24px] font-semibold tracking-[-0.5px]">{t('Follow-up Sequences', '跟進序列')}</h1>
          <p className="text-[13px] md:text-[14px] mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('Automated follow-up workflows for leads and customers', '用於潛在客戶和客戶的自動跟進工作流')}
          </p>
        </div>
        <button
          className="inline-flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-[4px] text-white"
          style={{ background: 'var(--accent)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          {t('Add sequence', '新增序列')}
        </button>
      </div>

      <section className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Sequence Name', '序列名稱')}
                </th>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Status', '狀態')}
                </th>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Steps', '步驟')}
                </th>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Last Triggered', '最後觸發')}
                </th>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Actions', '操作')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sequences.map((seq) => {
                const cfg = statusConfig[seq.status];
                return (
                  <tr key={seq.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-3 text-[13px] font-medium">{seq.name}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ background: cfg.bg, color: cfg.color }}>
                        {t(cfg.label, cfg.label === 'Active' ? '啟用中' : cfg.label === 'Paused' ? '已暫停' : '已完成')}
                      </span>
                    </td>
                    <td className="py-3 text-[13px]">{seq.steps}</td>
                    <td className="py-3 text-[13px]" style={{ color: 'var(--text-muted)' }}>{seq.lastTriggered}</td>
                    <td className="py-3">
                      <button className="text-[12px] font-medium" style={{ color: 'var(--accent)' }}>
                        {t('Edit', '編輯')}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Demo note */}
      <div className="border rounded-[4px] p-4 mt-6" style={{ borderColor: '#FDE68A', background: '#FFFBEB' }}>
        <div className="flex items-start gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div>
            <p className="text-[12px] font-semibold" style={{ color: '#92400E' }}>{t('Demo Mode', '示範模式')}</p>
            <p className="text-[12px] mt-0.5" style={{ color: '#78350F' }}>
              {t('Follow-up data is mock data and does not trigger real messages.', '跟進數據為模擬數據，不會觸發真實訊息。')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
