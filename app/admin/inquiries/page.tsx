'use client';

import { useState } from 'react';
import { useLang } from '@/lib/lang';

type InquiryStatus = 'received' | 'quoting' | 'converted';

interface Inquiry {
  id: string;
  displayId: string;
  customer: string;
  channel: string;
  status: InquiryStatus;
  date: string;
}

const mockInquiries: Inquiry[] = [
  { id: 'inq-1', displayId: 'INQ-2024-001', customer: 'Acme Corp', channel: 'WhatsApp', status: 'converted', date: '2024-01-14' },
  { id: 'inq-2', displayId: 'INQ-2024-002', customer: 'Global Trade Ltd', channel: 'Email', status: 'quoting', date: '2024-01-17' },
  { id: 'inq-3', displayId: 'INQ-2024-003', customer: 'Pacific Imports', channel: 'WhatsApp', status: 'received', date: '2024-01-21' },
  { id: 'inq-4', displayId: 'INQ-2024-004', customer: 'Asia Electronics', channel: 'WeChat', status: 'quoting', date: '2024-01-24' },
];

const statusConfig: Record<InquiryStatus, { bg: string; color: string; label: string }> = {
  received: { bg: '#DBEAFE', color: '#2563EB', label: 'Received' },
  quoting: { bg: '#FEF3C7', color: '#92400E', label: 'Quoting' },
  converted: { bg: '#D1FAE5', color: '#059669', label: 'Converted' },
};

const tabs: { key: InquiryStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'received', label: 'Received' },
  { key: 'quoting', label: 'Quoting' },
  { key: 'converted', label: 'Converted' },
];

const tabLabels: Record<string, string> = {
  All: '全部',
  Received: '已接收',
  Quoting: '報價中',
  Converted: '已轉化',
};

export default function InquiriesPage() {
  const { t } = useLang();
  const [activeTab, setActiveTab] = useState<InquiryStatus | 'all'>('all');
  const filtered = activeTab === 'all' ? mockInquiries : mockInquiries.filter((inq) => inq.status === activeTab);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-[20px] md:text-[24px] font-semibold tracking-[-0.5px]">{t('Inquiries', '查詢')}</h1>
          <p className="text-[13px] md:text-[14px] mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('Track incoming customer inquiries', '追踪收到的客戶查詢')}
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
            {t(tab.label, tabLabels[tab.label])}
          </button>
        ))}
      </div>

      {/* Inquiries table */}
      <section className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Inquiry ID', '查詢編號')}
                </th>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Customer', '客戶')}
                </th>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Channel', '渠道')}
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
              {filtered.map((inq) => {
                const cfg = statusConfig[inq.status];
                return (
                  <tr key={inq.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-3 text-[13px] font-medium">{inq.displayId}</td>
                    <td className="py-3 text-[13px]">{inq.customer}</td>
                    <td className="py-3 text-[13px]">{inq.channel}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ background: cfg.bg, color: cfg.color }}>
                        {t(cfg.label, tabLabels[cfg.label])}
                      </span>
                    </td>
                    <td className="py-3 text-[13px]" style={{ color: 'var(--text-muted)' }}>{inq.date}</td>
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
              {t('Inquiry data shown is for demonstration only.', '顯示的查詢數據僅供示範。')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}