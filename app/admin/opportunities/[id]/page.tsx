'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useDemo } from '@/lib/mock-store';
import { useLang } from '@/lib/lang';

type Stage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
type Priority = 'low' | 'medium' | 'high';

const STAGES: Stage[] = ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];

const stageConfig: Record<Stage, { bg: string; color: string; label: string }> = {
  lead: { bg: '#F3F4F6', color: '#6B7280', label: 'Lead' },
  qualified: { bg: '#DBEAFE', color: '#2563EB', label: 'Qualified' },
  proposal: { bg: '#FEF3C7', color: '#92400E', label: 'Proposal' },
  negotiation: { bg: '#FED7AA', color: '#C2410C', label: 'Negotiation' },
  won: { bg: '#D1FAE5', color: '#059669', label: 'Won' },
  lost: { bg: '#FEE2E2', color: '#DC2626', label: 'Lost' },
};

const priorityConfig: Record<Priority, { bg: string; color: string; label: string }> = {
  low: { bg: '#F3F4F6', color: '#6B7280', label: 'Low' },
  medium: { bg: '#DBEAFE', color: '#2563EB', label: 'Medium' },
  high: { bg: '#FEE2E2', color: '#DC2626', label: 'High' },
};

const stageLabels: Record<string, string> = {
  Lead: '潛在客戶',
  Qualified: '已資格審核',
  Proposal: '提議中',
  Negotiation: '談判中',
  Won: '已成交',
  Lost: '已流失',
};

const priorityLabels: Record<string, string> = {
  Low: '低',
  Medium: '中',
  High: '高',
};

export default function OpportunityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLang();
  const { opportunities, inquiries, quotes } = useDemo();

  const opp = opportunities.find((o) => o.id === id || o.displayId === id);
  const inquiry = opp ? inquiries.find((i) => i.id === opp.inquiryId) : null;
  const quote = opp?.quoteId ? quotes.find((q) => q.id === opp.quoteId) : null;

  if (!opp) {
    return (
      <div>
        <div className="mb-6">
          <Link
            href="/admin/opportunities"
            className="text-[13px] font-medium"
            style={{ color: 'var(--accent)' }}
          >
            {t('← Back to Opportunities', '← 返回機會')}
          </Link>
        </div>
        <div
          className="border rounded-[4px] p-8 text-center"
          style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
        >
          <p className="text-[14px]" style={{ color: 'var(--text-muted)' }}>
            {t('Opportunity not found', '找不到該機會')}
          </p>
        </div>
      </div>
    );
  }

  const sc = stageConfig[opp.stage];
  const pc = priorityConfig[opp.priority];
  const currentStageIndex = STAGES.indexOf(opp.stage);

  const formatValue = (value: number, currency: string) => {
    return `${currency} $${value.toLocaleString()}`;
  };

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 mb-6 text-[13px]" style={{ color: 'var(--text-muted)' }}>
        <Link href="/admin/opportunities" className="hover:underline" style={{ color: 'var(--accent)' }}>
          {t('Opportunities', '機會')}
        </Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span style={{ color: 'var(--text)' }}>{opp.displayId}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 md:mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[20px] md:text-[24px] font-semibold tracking-[-0.5px]">
            {opp.company}
          </h1>
          <p className="text-[13px] md:text-[14px] mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('Contact', '聯絡人')}: {opp.contact}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="px-2.5 py-1 rounded-full text-[12px] font-medium"
            style={{ background: sc.bg, color: sc.color }}
          >
            {t(sc.label, stageLabels[sc.label])}
          </span>
          <span
            className="px-2.5 py-1 rounded-full text-[12px] font-medium"
            style={{ background: pc.bg, color: pc.color }}
          >
            {t(pc.label, priorityLabels[pc.label])}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Main content — left 2 columns */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Stage Progression */}
          <section
            className="border rounded-[4px] p-5"
            style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
          >
            <h2 className="text-[14px] font-semibold mb-4">{t('Stage Progression', '階段進度')}</h2>
            <div className="flex items-center gap-0 overflow-x-auto pb-2">
              {STAGES.map((stage, index) => {
                const isActive = index === currentStageIndex;
                const isPast = index < currentStageIndex;
                const isTerminalStage = stage === 'won' || stage === 'lost';
                const cfg = stageConfig[stage];

                // For terminal stages, only show if it matches current stage
                if (isTerminalStage && !isActive) {
                  return null;
                }

                return (
                  <div key={stage} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold flex-shrink-0"
                        style={{
                          background: isActive ? cfg.color : isPast ? cfg.color : '#E5E7EB',
                          color: isActive || isPast ? '#fff' : '#9CA3AF',
                        }}
                      >
                        {isPast ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span
                        className="text-[11px] font-medium mt-1.5 text-center whitespace-nowrap"
                        style={{ color: isActive ? cfg.color : isPast ? cfg.color : 'var(--text-muted)' }}
                      >
                        {t(cfg.label, stageLabels[cfg.label])}
                      </span>
                    </div>
                    {index < STAGES.length - 1 && !(isTerminalStage && !isActive) && (
                      <div
                        className="h-[2px] w-8 md:w-12 flex-shrink-0 mx-1 mt-[-18px]"
                        style={{
                          background: isPast ? stageConfig[STAGES[index + 1]]?.color || '#E5E7EB' : '#E5E7EB',
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Next Action */}
          <section
            className="border rounded-[4px] p-5"
            style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
          >
            <h2 className="text-[14px] font-semibold mb-3">{t('Next Action', '下一步行動')}</h2>
            <div
              className="flex items-start gap-2 p-3 rounded-[4px]"
              style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <p className="text-[13px]" style={{ color: '#1E40AF' }}>{opp.nextAction}</p>
            </div>
          </section>

          {/* Missing Information */}
          <section
            className="border rounded-[4px] p-5"
            style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
          >
            <h2 className="text-[14px] font-semibold mb-3">{t('Missing Information', '缺少的資訊')}</h2>
            {opp.missingInformation.length > 0 ? (
              <ul className="space-y-2">
                {opp.missingInformation.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-[13px]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    <span style={{ color: 'var(--text)' }}>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
                {t('No missing information', '沒有缺少的資訊')}
              </p>
            )}
          </section>
        </div>

        {/* Sidebar — right column */}
        <div className="space-y-4 md:space-y-6">
          {/* Estimated Value */}
          <section
            className="border rounded-[4px] p-5"
            style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
          >
            <h2 className="text-[12px] uppercase tracking-[0.05em] font-medium" style={{ color: 'var(--text-muted)' }}>
              {t('Estimated Value', '預估價值')}
            </h2>
            <p className="text-[28px] font-bold mt-1" style={{ color: 'var(--text)' }}>
              {formatValue(opp.estimatedValue, opp.currency)}
            </p>
          </section>

          {/* Owner */}
          <section
            className="border rounded-[4px] p-5"
            style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
          >
            <h2 className="text-[12px] uppercase tracking-[0.05em] font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
              {t('Owner', '負責人')}
            </h2>
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold text-white flex-shrink-0"
                style={{ background: '#6366F1' }}
              >
                {opp.owner.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <span className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>
                {opp.owner}
              </span>
            </div>
          </section>

          {/* Linked Records */}
          <section
            className="border rounded-[4px] p-5"
            style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
          >
            <h2 className="text-[12px] uppercase tracking-[0.05em] font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
              {t('Linked Records', '關聯記錄')}
            </h2>
            <div className="space-y-2">
              {inquiry && (
                <Link
                  href={`/admin/inquiries`}
                  className="flex items-center gap-2.5 p-2.5 rounded-[4px] border text-[13px] font-medium transition-colors hover:opacity-80"
                  style={{ borderColor: 'var(--border)', color: 'var(--accent)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  <span>{t('Inquiry', '查詢')}: {inquiry.displayId}</span>
                </Link>
              )}
              {quote && (
                <Link
                  href={`/admin/quotes`}
                  className="flex items-center gap-2.5 p-2.5 rounded-[4px] border text-[13px] font-medium transition-colors hover:opacity-80"
                  style={{ borderColor: 'var(--border)', color: 'var(--accent)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  <span>{t('Quote', '報價')}: {quote.displayId}</span>
                </Link>
              )}
              {!inquiry && !quote && (
                <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
                  {t('No linked records', '沒有關聯記錄')}
                </p>
              )}
            </div>
          </section>

          {/* Created At */}
          <section
            className="border rounded-[4px] p-5"
            style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
          >
            <h2 className="text-[12px] uppercase tracking-[0.05em] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              {t('Created', '建立時間')}
            </h2>
            <p className="text-[13px]" style={{ color: 'var(--text)' }}>
              {new Date(opp.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </section>
        </div>
      </div>

      {/* Demo note */}
      <div className="border rounded-[4px] p-4 mt-6" style={{ borderColor: '#FDE68A', background: '#FFFBEB' }}>
        <div className="flex items-start gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <p className="text-[12px] font-semibold" style={{ color: '#92400E' }}>{t('Demo Mode', '示範模式')}</p>
            <p className="text-[12px] mt-0.5" style={{ color: '#78350F' }}>
              {t('Opportunity data is mock data for demonstration purposes.', '機會資料為示範用的模擬資料。')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
