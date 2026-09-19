'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/lib/lang';
import { useDemo } from '@/lib/mock-store';

export default function QuotesPage() {
  const { t } = useLang();
  const { quotes } = useDemo();
  const [activeTab, setActiveTab] = useState<string>('all');

  const tabs = [
    { key: 'all', label: 'All', zh: '全部' },
    { key: 'draft', label: 'Draft', zh: '草稿' },
    { key: 'in_review', label: 'In Review', zh: '審查中' },
    { key: 'sent', label: 'Sent', zh: '已發送' },
    { key: 'accepted', label: 'Accepted', zh: '已接受' },
    { key: 'rejected', label: 'Rejected', zh: '已拒絕' },
  ];

  const filtered = activeTab === 'all' ? quotes : quotes.filter((q) => q.status === activeTab);

  const statusColors: Record<string, { bg: string; color: string }> = {
    draft: { bg: '#F3F4F6', color: '#6B7280' },
    in_review: { bg: '#FEF3C7', color: '#D97706' },
    approved: { bg: '#D1FAE5', color: '#059669' },
    sent: { bg: '#DBEAFE', color: '#2563EB' },
    accepted: { bg: '#D1FAE5', color: '#059669' },
    rejected: { bg: '#FEE2E2', color: '#DC2626' },
    negotiating: { bg: '#FED7AA', color: '#EA580C' },
    expired: { bg: '#F3F4F6', color: '#6B7280' },
  };

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
            {t(tab.label, tab.zh)}
          </button>
        ))}
      </div>

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
                  {t('Product', '產品')}
                </th>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Amount', '金額')}
                </th>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Status', '狀態')}
                </th>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Margin', '利潤率')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((quote) => {
                const sc = statusColors[quote.status];
                return (
                  <tr key={quote.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-3">
                      <Link href={`/admin/quotes/${quote.id}`} className="text-[13px] font-medium" style={{ color: 'var(--accent)' }}>
                        {quote.displayId}
                      </Link>
                    </td>
                    <td className="py-3 text-[13px]">
                      <p className="font-medium">{quote.customer}</p>
                      <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{quote.company}</p>
                    </td>
                    <td className="py-3 text-[13px]">{quote.product}</td>
                    <td className="py-3 text-[13px] font-medium">{quote.currency} ${quote.customerPrice.toLocaleString()}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ background: sc.bg, color: sc.color }}>
                        {quote.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 text-[13px]">{quote.marginPercent}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
