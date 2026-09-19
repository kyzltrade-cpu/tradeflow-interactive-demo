'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLang } from '@/lib/lang';
import { useDemo } from '@/lib/mock-store';

function formatTimeAgo(dateStr: string, now: number): string {
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatCurrency(amount: number, currency: string): string {
  return `${currency} $${amount.toLocaleString()}`;
}

export default function AdminPage() {
  const { t } = useLang();
  const { conversations, quotes, inquiries, opportunities, followups, suppliers } = useDemo();
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(0);

  useEffect(() => {
    setNow(Date.now());
    setMounted(true);
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Pipeline KPIs
  const pendingApproval = quotes.filter((q) => q.status === 'pending_approval').length;
  const sentQuotes = quotes.filter((q) => q.status === 'sent').length;
  const activeInquiries = inquiries.filter((i) => ['received', 'reviewing', 'extracting'].includes(i.status)).length;
  const activeOpps = opportunities.filter((o) => ['lead', 'qualified', 'proposal', 'negotiation'].includes(o.stage)).length;
  const dueFollowups = followups.filter((f) => f.status === 'pending').length;
  const totalPipelineValue = opportunities
    .filter((o) => ['lead', 'qualified', 'proposal', 'negotiation'].includes(o.stage))
    .reduce((sum, o) => sum + o.estimatedValue, 0);

  const stageColors: Record<string, { bg: string; color: string }> = {
    lead: { bg: '#F3F4F6', color: '#6B7280' },
    qualified: { bg: '#DBEAFE', color: '#2563EB' },
    proposal: { bg: '#FEF3C7', color: '#D97706' },
    negotiation: { bg: '#FED7AA', color: '#EA580C' },
    won: { bg: '#D1FAE5', color: '#059669' },
    lost: { bg: '#FEE2E2', color: '#DC2626' },
  };

  const quoteStatusColors: Record<string, { bg: string; color: string }> = {
    draft: { bg: '#F3F4F6', color: '#6B7280' },
    pending_approval: { bg: '#FEF3C7', color: '#D97706' },
    approved: { bg: '#D1FAE5', color: '#059669' },
    sent: { bg: '#DBEAFE', color: '#2563EB' },
    accepted: { bg: '#D1FAE5', color: '#059669' },
    rejected: { bg: '#FEE2E2', color: '#DC2626' },
    negotiating: { bg: '#FED7AA', color: '#EA580C' },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-[20px] md:text-[24px] font-semibold tracking-[-0.5px]">{t('Dashboard', '控制台')}</h1>
          <p className="text-[13px] md:text-[14px] mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('Overview of your trading pipeline and quote operations', '交易管道和報價操作概覽')}
          </p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="border rounded-[4px] p-4 md:p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <p className="text-[11px] md:text-[12px] font-medium uppercase tracking-[0.05em] mb-1.5 md:mb-2" style={{ color: 'var(--text-muted)' }}>
            {t('Pending approval', '待審批')}
          </p>
          <p className="text-[22px] md:text-[28px] font-semibold tracking-[-0.5px]" style={{ color: pendingApproval > 0 ? '#D97706' : 'inherit' }}>{pendingApproval}</p>
        </div>
        <div className="border rounded-[4px] p-4 md:p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <p className="text-[11px] md:text-[12px] font-medium uppercase tracking-[0.05em] mb-1.5 md:mb-2" style={{ color: 'var(--text-muted)' }}>
            {t('Active inquiries', '進行中詢價')}
          </p>
          <p className="text-[22px] md:text-[28px] font-semibold tracking-[-0.5px]">{activeInquiries}</p>
        </div>
        <div className="border rounded-[4px] p-4 md:p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <p className="text-[11px] md:text-[12px] font-medium uppercase tracking-[0.05em] mb-1.5 md:mb-2" style={{ color: 'var(--text-muted)' }}>
            {t('Pipeline value', '管道價值')}
          </p>
          <p className="text-[22px] md:text-[28px] font-semibold tracking-[-0.5px]">{formatCurrency(totalPipelineValue, 'USD')}</p>
        </div>
        <div className="border rounded-[4px] p-4 md:p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <p className="text-[11px] md:text-[12px] font-medium uppercase tracking-[0.05em] mb-1.5 md:mb-2" style={{ color: 'var(--text-muted)' }}>
            {t('Due follow-ups', '待跟進')}
          </p>
          <p className="text-[22px] md:text-[28px] font-semibold tracking-[-0.5px]" style={{ color: dueFollowups > 0 ? '#2563EB' : 'inherit' }}>{dueFollowups}</p>
        </div>
      </div>

      {/* Quotes pending approval */}
      {pendingApproval > 0 && (
        <div className="border rounded-[4px] mb-4" style={{ borderColor: '#FDE68A', background: '#FFFBEB' }}>
          <div className="px-4 md:px-5 py-3 md:py-4 border-b flex items-center justify-between" style={{ borderColor: '#FDE68A' }}>
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <h2 className="text-[14px] md:text-[15px] font-semibold" style={{ color: '#92400E' }}>{t('Quotes awaiting approval', '待審批報價')}</h2>
            </div>
            <Link href="/admin/quotes" className="text-[12px] md:text-[13px] font-medium" style={{ color: '#D97706' }}>
              {t('View all', '查看全部')}
            </Link>
          </div>
          <div>
            {quotes.filter((q) => q.status === 'pending_approval').map((quote) => {
              const sc = quoteStatusColors[quote.status];
              return (
                <Link
                  key={quote.id}
                  href={`/admin/quotes/${quote.id}`}
                  className="flex items-center justify-between px-4 md:px-5 py-3 border-b last:border-b-0 hover:bg-[#FFF9E6]"
                  style={{ borderColor: '#FDE68A' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium" style={{ background: '#FEF3C7', color: '#92400E' }}>
                      {quote.displayId.slice(-3)}
                    </div>
                    <div>
                      <p className="text-[13px] md:text-[14px] font-medium">{quote.customer}</p>
                      <p className="text-[12px] md:text-[13px]" style={{ color: 'var(--text-muted)' }}>{quote.product} · {quote.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[13px] md:text-[14px] font-semibold">{formatCurrency(quote.customerPrice, quote.currency)}</p>
                    <span className="text-[10px] md:text-[11px] px-2 py-0.5 rounded font-medium" style={{ background: sc.bg, color: sc.color }}>
                      {quote.status.replace('_', ' ')}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Active opportunities */}
      <div className="border rounded-[4px] mb-4" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <div className="px-4 md:px-5 py-3 md:py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <h2 className="text-[14px] md:text-[15px] font-semibold">{t('Active opportunities', '進行中商機')}</h2>
            <span className="text-[11px] md:text-[12px] px-2 py-0.5 rounded font-medium" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              {activeOpps}
            </span>
          </div>
          <Link href="/admin/opportunities" className="text-[12px] md:text-[13px] font-medium" style={{ color: 'var(--accent)' }}>
            {t('View all', '查看全部')}
          </Link>
        </div>
        <div>
          {opportunities.filter((o) => ['lead', 'qualified', 'proposal', 'negotiation'].includes(o.stage)).map((opp) => {
            const sc = stageColors[opp.stage];
            return (
              <Link
                key={opp.id}
                href={`/admin/opportunities/${opp.id}`}
                className="flex items-center justify-between px-4 md:px-5 py-3 border-b last:border-b-0 hover:bg-[#FEFBFB]"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium" style={{ background: sc.bg, color: sc.color }}>
                    {opp.displayId.slice(-3)}
                  </div>
                  <div>
                    <p className="text-[13px] md:text-[14px] font-medium">{opp.company}</p>
                    <p className="text-[12px] md:text-[13px]" style={{ color: 'var(--text-muted)' }}>{opp.contact} · {opp.nextAction}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[13px] md:text-[14px] font-semibold">{formatCurrency(opp.estimatedValue, opp.currency)}</p>
                  <span className="text-[10px] md:text-[11px] px-2 py-0.5 rounded font-medium" style={{ background: sc.bg, color: sc.color }}>
                    {opp.stage}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent inquiries */}
      <div className="border rounded-[4px] mb-4" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <div className="px-4 md:px-5 py-3 md:py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-[14px] md:text-[15px] font-semibold">{t('Recent inquiries', '最近詢價')}</h2>
          <Link href="/admin/inquiries" className="text-[12px] md:text-[13px] font-medium" style={{ color: 'var(--accent)' }}>
            {t('View all', '查看全部')}
          </Link>
        </div>
        <div>
          {inquiries.map((inq) => (
            <Link
              key={inq.id}
              href={`/admin/inquiries/${inq.id}`}
              className="flex items-center justify-between px-4 md:px-5 py-3 border-b last:border-b-0 hover:bg-[#FEFBFB]"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium" style={{ background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                  {inq.displayId.slice(-3)}
                </div>
                <div>
                  <p className="text-[13px] md:text-[14px] font-medium">{inq.customer} · {inq.company}</p>
                  <p className="text-[12px] md:text-[13px] truncate max-w-[300px]" style={{ color: 'var(--text-muted)' }}>{inq.originalMessage}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <span className="text-[10px] md:text-[11px] px-2 py-0.5 rounded font-medium" style={{ background: '#FEF3C7', color: '#92400E' }}>
                  {inq.status}
                </span>
                <p className="text-[11px] md:text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>{mounted ? formatTimeAgo(inq.receivedAt, now) : ''}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Link href="/admin/quotes" className="border rounded-[4px] p-4 hover:shadow-sm transition-shadow" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <p className="text-[13px] font-medium">{t('Quotes', '報價')}</p>
          <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{quotes.length} {t('total', '總計')}</p>
        </Link>
        <Link href="/admin/suppliers" className="border rounded-[4px] p-4 hover:shadow-sm transition-shadow" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
          <p className="text-[13px] font-medium">{t('Suppliers', '供應商')}</p>
          <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{suppliers.length} {t('verified', '已驗證')}</p>
        </Link>
        <Link href="/admin/follow-ups" className="border rounded-[4px] p-4 hover:shadow-sm transition-shadow" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p className="text-[13px] font-medium">{t('Follow-ups', '跟進')}</p>
          <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{dueFollowups} {t('due', '到期')}</p>
        </Link>
        <Link href="/admin/conversations" className="border rounded-[4px] p-4 hover:shadow-sm transition-shadow" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
          <p className="text-[13px] font-medium">{t('Conversations', '對話')}</p>
          <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{conversations.length} {t('active', '活躍')}</p>
        </Link>
      </div>
    </div>
  );
}
