'use client';

import { useDemo } from '@/lib/mock-store';
import { useLang } from '@/lib/lang';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  received: { bg: '#DBEAFE', color: '#2563EB', label: 'Received' },
  reviewing: { bg: '#FEF3C7', color: '#92400E', label: 'Reviewing' },
  needs_information: { bg: '#FEE2E2', color: '#DC2626', label: 'Needs Information' },
  ready_for_rfq: { bg: '#D1FAE5', color: '#059669', label: 'Ready for RFQ' },
  converted: { bg: '#D1FAE5', color: '#059669', label: 'Converted' },
  closed: { bg: '#F3F4F6', color: '#6B7280', label: 'Closed' },
};

const fieldStatusConfig: Record<string, { bg: string; color: string; label: string }> = {
  extracted: { bg: '#DBEAFE', color: '#2563EB', label: 'Extracted' },
  confirmed: { bg: '#D1FAE5', color: '#059669', label: 'Confirmed' },
  missing: { bg: '#FEE2E2', color: '#DC2626', label: 'Missing' },
  inferred: { bg: '#FEF3C7', color: '#92400E', label: 'Inferred' },
  conflicting: { bg: '#FEE2E2', color: '#DC2626', label: 'Conflicting' },
};

const sourceConfig: Record<string, { bg: string; color: string; label: string }> = {
  customer_stated: { bg: '#D1FAE5', color: '#059669', label: 'Customer stated' },
  inferred_from_supplier: { bg: '#FEF3C7', color: '#92400E', label: 'Inferred from supplier' },
  system_default: { bg: '#E0E7FF', color: '#4F46E5', label: 'System default' },
  user_confirmed: { bg: '#D1FAE5', color: '#059669', label: 'User confirmed' },
  missing: { bg: '#FEE2E2', color: '#DC2626', label: 'Not provided' },
};

const confidenceConfig: Record<string, { bg: string; color: string; label: string }> = {
  high: { bg: '#D1FAE5', color: '#059669', label: 'High' },
  medium: { bg: '#FEF3C7', color: '#92400E', label: 'Medium' },
  low: { bg: '#FEE2E2', color: '#DC2626', label: 'Low' },
};

export default function InquiryDetailPage() {
  const { t } = useLang();
  const params = useParams();
  const { inquiries, opportunities, quotes } = useDemo();
  const inquiry = inquiries.find((i) => i.id === params.id);

  if (!inquiry) {
    return (
      <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
        <p className="text-[14px]">{t('Inquiry not found', '查詢未找到')}</p>
      </div>
    );
  }

  const st = statusConfig[inquiry.status] || statusConfig.received;
  const opp = opportunities.find((o) => o.id === inquiry.opportunityId);
  const quote = quotes.find((q) => q.id === inquiry.quoteId);
  const missingCount = inquiry.extractedFields.filter((f) => f.status === 'missing').length;
  const inferredCount = inquiry.extractedFields.filter((f) => f.status === 'inferred').length;

  return (
    <div>
      <nav className="flex items-center gap-1.5 mb-6 text-[13px]" style={{ color: 'var(--text-muted)' }}>
        <Link href="/admin/inquiries" className="hover:underline" style={{ color: 'var(--accent)' }}>
          {t('Inquiries', '查詢')}
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--foreground)' }}>{inquiry.displayId}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0 space-y-6">
          <div className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-[20px] md:text-[24px] font-semibold tracking-[-0.5px]">{inquiry.customer}</h1>
                <p className="text-[13px] md:text-[14px] mt-1" style={{ color: 'var(--text-muted)' }}>
                  {inquiry.company}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-medium" style={{ background: st.bg, color: st.color }}>
                {st.label}
              </span>
            </div>
          </div>

          {inquiry.status === 'needs_information' && (
            <div className="border rounded-[4px] p-4" style={{ borderColor: '#FCA5A5', background: '#FEF2F2' }}>
              <div className="flex items-start gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div>
                  <p className="text-[12px] font-semibold" style={{ color: '#991B1B' }}>
                    {t('Missing required fields — quote cannot be sent', '缺少必填欄位 — 報價無法發送')}
                  </p>
                  <p className="text-[12px] mt-1" style={{ color: '#7F1D1D' }}>
                    {missingCount} missing, {inferredCount} inferred from supplier. Customer must confirm before quoting.
                  </p>
                </div>
              </div>
            </div>
          )}

          {inquiry.subject && (
            <div className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
              <h2 className="text-[14px] font-semibold mb-2">{t('Subject', '主旨')}</h2>
              <p className="text-[13px]">{inquiry.subject}</p>
            </div>
          )}

          <div className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <h2 className="text-[14px] font-semibold mb-3">{t('Original Message', '原始訊息')}</h2>
            <div className="rounded-[4px] p-4 text-[13px] leading-relaxed" style={{ background: 'var(--background)', border: '1px solid var(--border)' }}>
              {inquiry.originalMessage}
            </div>
            <div className="flex items-center gap-4 mt-3 text-[12px]" style={{ color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                {inquiry.channel}
              </span>
              <span className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                {new Date(inquiry.receivedAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {inquiry.attachments.length > 0 && (
            <div className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
              <h2 className="text-[14px] font-semibold mb-3">{t('Attachments', '附件')}</h2>
              <div className="flex flex-wrap gap-2">
                {inquiry.attachments.map((file) => (
                  <div key={file} className="flex items-center gap-2 px-3 py-2 rounded-[4px] text-[13px]" style={{ background: 'var(--background)', border: '1px solid var(--border)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    {file}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <h2 className="text-[14px] font-semibold mb-3">{t('Extracted Fields', '提取的欄位')}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{t('Field', '欄位')}</th>
                    <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{t('Value', '數值')}</th>
                    <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{t('Status', '狀態')}</th>
                    <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{t('Source', '來源')}</th>
                    <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{t('Confidence', '信心')}</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiry.extractedFields.map((field, i) => {
                    const fs = fieldStatusConfig[field.status];
                    const sc = sourceConfig[field.source] || sourceConfig.missing;
                    const cc = confidenceConfig[field.confidence];
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td className="py-2.5 text-[13px] font-medium">{field.field}</td>
                        <td className="py-2.5 text-[13px]" style={{ color: field.value ? 'var(--foreground)' : 'var(--text-muted)' }}>
                          {field.value || '\u2014'}
                          {field.confirmedBy && field.confirmedAt && (
                            <span className="block text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                              Confirmed by {field.confirmedBy} on {new Date(field.confirmedAt).toLocaleDateString()}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ background: fs.bg, color: fs.color }}>
                            {fs.label}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ background: sc.bg, color: sc.color }}>
                            {sc.label}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ background: cc.bg, color: cc.color }}>
                            {cc.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {inquiry.clarificationDraft && (
            <div className="border rounded-[4px] p-5" style={{ borderColor: inquiry.clarificationSent ? '#86EFAC' : '#FDE68A', background: inquiry.clarificationSent ? '#F0FDF4' : '#FFFBEB' }}>
              <div className="flex items-start gap-2 mb-3">
                {inquiry.clarificationSent ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                )}
                <div className="flex-1">
                  <p className="text-[12px] font-semibold" style={{ color: inquiry.clarificationSent ? '#166534' : '#92400E' }}>
                    {inquiry.clarificationSent
                      ? t('Clarification sent — awaiting customer reply', '已發送澄清 — 等待客戶回覆')
                      : t('AI Clarification Draft', 'AI 澄清草稿')}
                  </p>
                  <p className="text-[13px] mt-2 leading-relaxed whitespace-pre-line" style={{ color: inquiry.clarificationSent ? '#14532D' : '#78350F' }}>
                    {inquiry.clarificationDraft}
                  </p>
                </div>
              </div>
              {!inquiry.clarificationSent && (
                <div className="flex items-center gap-2 mt-3">
                  <button className="px-3 py-1.5 rounded-[4px] text-[12px] font-medium text-white transition-colors" style={{ background: 'var(--accent)' }}>
                    {t('Send to customer', '發送給客戶')}
                  </button>
                  <button className="px-3 py-1.5 rounded-[4px] text-[12px] font-medium transition-colors" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                    {t('Edit', '編輯')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="w-full lg:w-72 flex-shrink-0 space-y-6">
          <div className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <h2 className="text-[14px] font-semibold mb-4">{t('Linked Records', '關聯記錄')}</h2>
            <div className="space-y-3">
              {opp && (
                <Link href={`/admin/opportunities/${opp.id}`} className="block rounded-[4px] p-3 transition-colors hover:opacity-80" style={{ background: 'var(--background)', border: '1px solid var(--border)' }}>
                  <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    {t('Opportunity', '機會')}
                  </p>
                  <p className="text-[13px] font-medium mt-1" style={{ color: 'var(--accent)' }}>
                    {opp.displayId}
                  </p>
                  <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {opp.stage.replace(/_/g, ' ')} &middot; {opp.currency} {opp.estimatedValue.toLocaleString()}
                  </p>
                </Link>
              )}
              {quote && (
                <Link href={`/admin/quotes/${quote.id}`} className="block rounded-[4px] p-3 transition-colors hover:opacity-80" style={{ background: 'var(--background)', border: '1px solid var(--border)' }}>
                  <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    {t('Quote', '報價')}
                  </p>
                  <p className="text-[13px] font-medium mt-1" style={{ color: 'var(--accent)' }}>
                    {quote.displayId}
                  </p>
                  <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {quote.status} &middot; {quote.currency} {quote.customerPrice.toLocaleString()}
                  </p>
                </Link>
              )}
              {!opp && !quote && (
                <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                  {t('No linked records yet', '尚無關聯記錄')}
                </p>
              )}
            </div>
          </div>

          <div className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <h2 className="text-[14px] font-semibold mb-4">{t('Actions', '操作')}</h2>
            <div className="space-y-2">
              {inquiry.status === 'needs_information' && (
                <button className="w-full px-3 py-2 rounded-[4px] text-[13px] font-medium text-white transition-colors text-left" style={{ background: 'var(--accent)' }}>
                  <span className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    {t('Send clarification request', '發送澄清請求')}
                  </span>
                </button>
              )}
              <button className="w-full px-3 py-2 rounded-[4px] text-[13px] font-medium transition-colors text-left" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                <span className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                  {t('Convert to opportunity', '轉化為機會')}
                </span>
              </button>
              <button className="w-full px-3 py-2 rounded-[4px] text-[13px] font-medium transition-colors text-left" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                <span className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  {t('Request supplier RFQ', '請求供應商報價')}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
