'use client';

import { use, useMemo } from 'react';
import Link from 'next/link';
import { useDemo } from '@/lib/mock-store';
import { useLang } from '@/lib/lang';

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.3;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= full || (i === full + 1 && hasHalf);
        return (
          <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={filled ? '#F59E0B' : 'none'} stroke={filled ? '#F59E0B' : '#D1D5DB'} strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
      })}
      <span className="text-[13px] font-medium ml-1" style={{ color: 'var(--text-muted)' }}>{rating}</span>
    </div>
  );
}

const certStatusConfig: Record<string, { bg: string; color: string; label: string }> = {
  claimed: { bg: '#FEF3C7', color: '#92400E', label: 'Claimed' },
  documents_available: { bg: '#DBEAFE', color: '#2563EB', label: 'Docs available' },
  reviewed: { bg: '#D1FAE5', color: '#059669', label: 'Reviewed' },
  verified: { bg: '#D1FAE5', color: '#059669', label: 'Verified' },
  not_confirmed: { bg: '#FEE2E2', color: '#DC2626', label: 'Not confirmed' },
};

const rfqStatusConfig: Record<string, { bg: string; color: string }> = {
  draft: { bg: '#F3F4F6', color: '#6B7280' },
  sent: { bg: '#DBEAFE', color: '#2563EB' },
  partially_received: { bg: '#FEF3C7', color: '#D97706' },
  received: { bg: '#D1FAE5', color: '#059669' },
  closed: { bg: '#F3F4F6', color: '#6B7280' },
};

const responseStatusConfig: Record<string, { bg: string; color: string }> = {
  pending: { bg: '#F3F4F6', color: '#6B7280' },
  received: { bg: '#DBEAFE', color: '#2563EB' },
  selected: { bg: '#D1FAE5', color: '#059669' },
  rejected: { bg: '#FEE2E2', color: '#DC2626' },
};

export default function SupplierDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { suppliers, rfqs } = useDemo();
  const { t } = useLang();

  const supplier = useMemo(() => suppliers.find((s) => s.id === id), [suppliers, id]);

  const supplierRfqs = useMemo(() => {
    return rfqs
      .filter((r) => r.suppliers.includes(id))
      .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
  }, [rfqs, id]);

  const supplierResponses = useMemo(() => {
    const results: { rfq: typeof rfqs[0]; response: typeof rfqs[0]['responses'][0] }[] = [];
    for (const rfq of rfqs) {
      for (const resp of rfq.responses) {
        if (resp.supplierId === id) {
          results.push({ rfq, response: resp });
        }
      }
    }
    return results.sort((a, b) => new Date(b.response.receivedAt).getTime() - new Date(a.response.receivedAt).getTime());
  }, [rfqs, id]);

  if (!supplier) {
    return (
      <div className="text-center py-16">
        <p className="text-[14px]" style={{ color: 'var(--text-muted)' }}>
          {t('Supplier not found.', '找不到供應商。')}
        </p>
        <Link href="/admin/suppliers" className="text-[13px] font-medium mt-4 inline-block" style={{ color: 'var(--accent)' }}>
          {t('Back to suppliers', '返回供應商列表')}
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 mb-6 text-[13px]" style={{ color: 'var(--text-muted)' }}>
        <Link href="/admin/suppliers" className="hover:underline">{t('Suppliers', '供應商')}</Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
        <span style={{ color: 'var(--text)' }}>{supplier.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 md:mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] md:text-[24px] font-semibold tracking-[-0.5px]">{supplier.name}</h1>
            {supplier.verified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ background: '#D1FAE5', color: '#059669' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                {t('Verified', '已驗證')}
              </span>
            )}
          </div>
          <p className="text-[13px] md:text-[14px] mt-1 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            {supplier.location}
          </p>
        </div>
        <Link
          href="/admin/suppliers"
          className="text-[13px] font-medium px-4 py-2 rounded-[4px] border inline-flex items-center gap-1.5"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          {t('Back', '返回')}
        </Link>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Rating & Specialty */}
        <div className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <h2 className="text-[14px] font-semibold mb-3">{t('Overview', '概覽')}</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>{t('Rating', '評級')}</span>
              <Stars rating={supplier.rating} />
            </div>
            <div className="flex items-center justify-between" style={{ borderTop: '1px solid var(--border)', paddingTop: 8 }}>
              <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>{t('Specialty', '專長')}</span>
              <span className="text-[13px] font-medium">{supplier.specialty}</span>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <h2 className="text-[14px] font-semibold mb-3">{t('Contact Information', '聯絡資訊')}</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              <span className="text-[13px] font-medium">{supplier.contact}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>{supplier.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="border rounded-[4px] p-5 mb-6" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <h2 className="text-[14px] font-semibold mb-3">{t('Certifications', '認證')}</h2>
        <div className="space-y-3">
          {supplier.certifications.map((cert) => {
            const cs = certStatusConfig[cert.status] || certStatusConfig.claimed;
            return (
              <div key={cert.name} className="flex items-start justify-between p-3 rounded-[4px]" style={{ background: 'var(--background)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  <span className="text-[13px] font-medium">{cert.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ background: cs.bg, color: cs.color }}>
                    {cs.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {supplier.verificationDate && (
          <p className="text-[12px] mt-3" style={{ color: 'var(--text-muted)' }}>
            Last verified: {new Date(supplier.verificationDate).toLocaleDateString()}
          </p>
        )}
        {supplier.verificationNotes && (
          <p className="text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>
            {supplier.verificationNotes}
          </p>
        )}
      </div>

      {/* RFQ History */}
      <div className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <h2 className="text-[14px] font-semibold mb-4">{t('RFQ History', 'RFQ 歷史')}</h2>

        {supplierResponses.length === 0 ? (
          <p className="text-[13px] py-4 text-center" style={{ color: 'var(--text-muted)' }}>
            {t('No RFQ history found for this supplier.', '未找到此供應商的 RFQ 歷史。')}
          </p>
        ) : (
          <div className="space-y-4">
            {supplierResponses.map(({ rfq, response }) => {
              const rsCfg = rfqStatusConfig[rfq.status] || rfqStatusConfig.draft;
              const respCfg = responseStatusConfig[response.status] || responseStatusConfig.pending;
              return (
                <div key={response.id} className="border rounded-[4px] p-4" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold" style={{ color: 'var(--accent)' }}>{rfq.displayId}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: rsCfg.bg, color: rsCfg.color }}>
                        {rfq.status.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                      {new Date(response.receivedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{t('Price', '價格')}</p>
                      <p className="text-[13px] font-medium mt-0.5">{response.currency} ${response.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{t('MOQ', '最低訂量')}</p>
                      <p className="text-[13px] font-medium mt-0.5">{response.moq.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{t('Lead Time', '交貨期')}</p>
                      <p className="text-[13px] font-medium mt-0.5">{response.leadTime} {response.leadTimeUnit}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{t('Status', '狀態')}</p>
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium mt-0.5" style={{ background: respCfg.bg, color: respCfg.color }}>
                        {response.status}
                      </span>
                    </div>
                  </div>
                  {response.notes && (
                    <p className="text-[12px] border-t pt-2 mt-2" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                      {response.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* RFQs sent to supplier (without responses from them) */}
        {supplierRfqs.length > 0 && supplierResponses.length === 0 && (
          <div className="space-y-2">
            {supplierRfqs.map((rfq) => {
              const cfg = rfqStatusConfig[rfq.status] || rfqStatusConfig.draft;
              return (
                <div key={rfq.id} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium" style={{ color: 'var(--accent)' }}>{rfq.displayId}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: cfg.bg, color: cfg.color }}>
                      {rfq.status.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                    {new Date(rfq.sentAt).toLocaleDateString()}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Demo note */}
      <div className="border rounded-[4px] p-4 mt-6" style={{ borderColor: '#FDE68A', background: '#FFFBEB' }}>
        <div className="flex items-start gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>
            <p className="text-[12px] font-semibold" style={{ color: '#92400E' }}>{t('Demo Mode', '示範模式')}</p>
            <p className="text-[12px] mt-0.5" style={{ color: '#78350F' }}>
              {t('Supplier data is mock data for demonstration purposes.', '供應商數據為示範用途的模擬數據。')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
