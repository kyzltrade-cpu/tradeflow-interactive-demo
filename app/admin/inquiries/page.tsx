'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLang } from '@/lib/lang';
import { useDemo } from '@/lib/mock-store';

export default function InquiriesPage() {
  const { t } = useLang();
  const { inquiries } = useDemo();
  const [activeTab, setActiveTab] = useState<string>('all');

  const tabs = [
    { key: 'all', label: 'All', zh: '全部' },
    { key: 'received', label: 'Received', zh: '已接收' },
    { key: 'reviewing', label: 'Reviewing', zh: '審核中' },
    { key: 'quoted', label: 'Quoted', zh: '已報價' },
    { key: 'converted', label: 'Converted', zh: '已轉化' },
  ];

  const filtered = activeTab === 'all' ? inquiries : inquiries.filter((inq) => inq.status === activeTab);

  const statusColors: Record<string, { bg: string; color: string }> = {
    received: { bg: '#DBEAFE', color: '#2563EB' },
    reviewing: { bg: '#FEF3C7', color: '#D97706' },
    extracting: { bg: '#F3F4F6', color: '#6B7280' },
    quoted: { bg: '#D1FAE5', color: '#059669' },
    converted: { bg: '#D1FAE5', color: '#059669' },
    closed: { bg: '#F3F4F6', color: '#6B7280' },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-[20px] md:text-[24px] font-semibold tracking-[-0.5px]">{t('Inquiries', '詢價')}</h1>
          <p className="text-[13px] md:text-[14px] mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('Track incoming customer inquiries', '追踪收到的客戶詢價')}
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
                  {t('Inquiry ID', '詢價編號')}
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
                const sc = statusColors[inq.status] || statusColors.received;
                return (
                  <tr key={inq.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-3">
                      <Link href={`/admin/inquiries/${inq.id}`} className="text-[13px] font-medium" style={{ color: 'var(--accent)' }}>
                        {inq.displayId}
                      </Link>
                    </td>
                    <td className="py-3 text-[13px]">
                      <p className="font-medium">{inq.customer}</p>
                      <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{inq.company}</p>
                    </td>
                    <td className="py-3 text-[13px]">{inq.channel}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ background: sc.bg, color: sc.color }}>
                        {inq.status}
                      </span>
                    </td>
                    <td className="py-3 text-[13px]" style={{ color: 'var(--text-muted)' }}>
                      {new Date(inq.receivedAt).toLocaleDateString()}
                    </td>
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
