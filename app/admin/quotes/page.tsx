'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/lib/lang';

type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected';

interface Quote {
  id: string;
  displayId: string;
  customer: string;
  amount: string;
  status: QuoteStatus;
  date: string;
}

const mockQuotes: Quote[] = [
  { id: 'q-1', displayId: 'Q-2024-001', customer: 'Acme Corp', amount: 'HK$45,200', status: 'accepted', date: '2024-01-15' },
  { id: 'q-2', displayId: 'Q-2024-002', customer: 'Global Trade Ltd', amount: 'HK$12,800', status: 'sent', date: '2024-01-18' },
  { id: 'q-3', displayId: 'Q-2024-003', customer: 'Pacific Imports', amount: 'HK$78,500', status: 'draft', date: '2024-01-20' },
  { id: 'q-4', displayId: 'Q-2024-004', customer: 'Dragon Supplies', amount: 'HK$23,400', status: 'rejected', date: '2024-01-22' },
  { id: 'q-5', displayId: 'Q-2024-005', customer: 'Asia Electronics', amount: 'HK$156,000', status: 'sent', date: '2024-01-25' },
];

const statusConfig: Record<QuoteStatus, { bg: string; color: string; label: string }> = {
  draft: { bg: '#F3F4F6', color: '#6B7280', label: 'Draft' },
  sent: { bg: '#DBEAFE', color: '#2563EB', label: 'Sent' },
  accepted: { bg: '#D1FAE5', color: '#059669', label: 'Accepted' },
  rejected: { bg: '#FEE2E2', color: '#DC2626', label: 'Rejected' },
};

const tabs: { key: QuoteStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Draft' },
  { key: 'sent', label: 'Sent' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'rejected', label: 'Rejected' },
];

export default function QuotesPage() {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState<QuoteStatus | 'all'>('all');
  const filtered = activeTab === 'all' ? mockQuotes : mockQuotes.filter((q) => q.status === activeTab);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-[20px] md:text-[24px] font-semibold tracking-[-0.5px]">{t('Quotes', '報價')}</h1>
          <p className="text-[13px] md:text-[14px] mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('Manage and track customer quotes', '管理和追踪客戶報價')}
          </p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-1 mb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="px-3 py-1.5 rounded-[4px] text-[13px] font-medium whitespace-nowrap transition-colors"
            style={{
              background: activeTab === tab.key ? 'var(--accent)' : 'var(--surface)',
              color: activeTab === tab.key ? '#fff' : 'var(--text-muted)',
              border: `1px solid ${activeTab === tab.key ? 'var(--accent)' : 'var(--border)'}`,
            }}
          >
            {t(tab.label, tab.label === 'All' ? '全部' : tab.label === 'Draft' ? '草稿' : tab.label === 'Sent' ? '已發送' : tab.label === 'Accepted' ? '已接受' : '已拒絕')}
          </button>
        ))}
      </div>

      {/* Quotes table */}
      <section className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Quote ID', '報價編號')}
                </th>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Customer', '客戶')}
                </th>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Amount', '金額')}
                </th>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Status', '狀態')}
                </th>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Date', '日期')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((quote) => {
                const cfg = statusConfig[quote.status];
                return (
                  <tr key={quote.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-3">
                      <Link href={`/admin/quotes/${quote.id}`} className="text-[13px] font-medium" style={{ color: 'var(--accent)' }}>
                        {quote.displayId}
                      </Link>
                    </td>
                    <td className="py-3 text-[13px]">{quote.customer}</td>
                    <td className="py-3 text-[13px] font-medium">{quote.amount}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ background: cfg.bg, color: cfg.color }}>
                        {t(cfg.label, cfg.label === 'Draft' ? '草稿' : cfg.label === 'Sent' ? '已發送' : cfg.label === 'Accepted' ? '已接受' : '已拒絕')}
                      </span>
                    </td>
                    <td className="py-3 text-[13px]" style={{ color: 'var(--text-muted)' }}>{quote.date}</td>
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
              {t('Quotes shown are mock data for demonstration purposes.', '顯示的報價為示範用途的模擬數據。')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
