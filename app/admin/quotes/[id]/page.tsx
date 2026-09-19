'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { useDemo } from '@/lib/mock-store';
import { useLang } from '@/lib/lang';
import type { Quote } from '@/lib/mock-data';
import { MOCK_SUPPLIERS } from '@/lib/mock-data';

const statusConfig: Record<Quote['status'], { bg: string; color: string; label: string }> = {
  draft: { bg: '#F3F4F6', color: '#6B7280', label: 'Draft' },
  in_review: { bg: '#FEF3C7', color: '#92400E', label: 'In Review' },
  approved: { bg: '#D1FAE5', color: '#059669', label: 'Approved' },
  sent: { bg: '#DBEAFE', color: '#2563EB', label: 'Sent' },
  accepted: { bg: '#D1FAE5', color: '#059669', label: 'Accepted' },
  rejected: { bg: '#FEE2E2', color: '#DC2626', label: 'Rejected' },
  negotiating: { bg: '#FEF3C7', color: '#92400E', label: 'Negotiating' },
  expired: { bg: '#F3F4F6', color: '#6B7280', label: 'Expired' },
};

const statusLabels: Record<Quote['status'], string> = {
  draft: '草稿',
  in_review: '審查中',
  approved: '已批准',
  sent: '已發送',
  accepted: '已接受',
  rejected: '已拒絕',
  negotiating: '議價中',
  expired: '已過期',
};

const sourceConfig: Record<string, { bg: string; color: string; label: string }> = {
  supplier_quoted: { bg: '#D1FAE5', color: '#059669', label: 'Supplier quoted' },
  user_entered: { bg: '#DBEAFE', color: '#2563EB', label: 'User entered' },
  system_estimate: { bg: '#FEF3C7', color: '#92400E', label: 'System estimate' },
  external_data: { bg: '#E0E7FF', color: '#4F46E5', label: 'External data' },
  assumption: { bg: '#FEE2E2', color: '#DC2626', label: 'Assumption' },
  unverified: { bg: '#FEE2E2', color: '#DC2626', label: 'Unverified' },
};

const certStatusConfig: Record<string, { bg: string; color: string; label: string }> = {
  claimed: { bg: '#FEF3C7', color: '#92400E', label: 'Claimed' },
  documents_available: { bg: '#DBEAFE', color: '#2563EB', label: 'Docs available' },
  reviewed: { bg: '#D1FAE5', color: '#059669', label: 'Reviewed' },
  verified: { bg: '#D1FAE5', color: '#059669', label: 'Verified' },
  not_confirmed: { bg: '#FEE2E2', color: '#DC2626', label: 'Not confirmed' },
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} at ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}

function formatCurrency(amount: number, currency: string) {
  const prefix = currency === 'HKD' ? 'HK$' : '$';
  return `${prefix}${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { quotes, approveQuote, rejectQuote, sendQuote, simulateCustomerReply } = useDemo();
  const { t } = useLang();
  const [confirmAction, setConfirmAction] = useState<string | null>(null);

  const quote = quotes.find((q) => q.id === id);

  if (!quote) {
    return (
      <div>
        <nav className="mb-6 flex items-center gap-2 text-[13px]" style={{ color: 'var(--text-muted)' }}>
          <Link href="/admin/quotes" style={{ color: 'var(--accent)' }}>Quotes</Link>
          <span>/</span>
          <span>Not Found</span>
        </nav>
        <div className="border rounded-[4px] p-12 text-center" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <p className="text-[14px]" style={{ color: 'var(--text-muted)' }}>Quote not found.</p>
        </div>
      </div>
    );
  }

  const cfg = statusConfig[quote.status];
  const hasBlockedFields = quote.blockedByMissingFields.length > 0;
  const selectedSupplier = MOCK_SUPPLIERS.find((s) => s.id === quote.supplierId);

  function openPdfPreview() {
    if (!quote) return;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>${quote.displayId}</title><style>
      body{font-family:Helvetica,Arial,sans-serif;margin:40px;color:#1a1a1a;line-height:1.6}
      h1{font-size:20px;margin:0 0 4px}
      h2{font-size:14px;font-weight:600;margin:24px 0 8px;border-bottom:1px solid #e5e7eb;padding-bottom:4px}
      .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px}
      .badge{display:inline-block;padding:2px 10px;border-radius:9999px;font-size:11px;font-weight:600}
      table{width:100%;border-collapse:collapse;margin:8px 0}
      th,td{padding:8px 12px;text-align:left;border-bottom:1px solid #e5e7eb;font-size:13px}
      th{font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#6b7280}
      .right{text-align:right}
      .total-row{font-weight:700;border-top:2px solid #1a1a1a;font-size:14px}
      .assumptions{list-style:disc;padding-left:20px;font-size:13px;color:#4b5563}
      .footer{margin-top:40px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:11px;color:#9ca3af}
    </style></head><body>
      <div class="header"><div><h1>Pacific Trading Co.</h1><div style="font-size:12px;color:#6b7280">Hong Kong &bull; Steel & Metal Trading</div></div>
      <div style="text-align:right"><div style="font-size:22px;font-weight:700">${quote.displayId}</div>
      <div style="font-size:12px;color:#6b7280;margin-top:2px">Date: ${new Date(quote.createdAt).toLocaleDateString()}<br>Valid until: ${new Date(quote.validUntil).toLocaleDateString()}</div></div></div>
      <div style="background:#f9fafb;padding:16px;border-radius:6px;margin-bottom:20px">
        <div style="display:flex;gap:40px;flex-wrap:wrap"><div><strong>Customer:</strong> ${quote.customer}</div><div><strong>Company:</strong> ${quote.company}</div><div><strong>Product:</strong> ${quote.product}</div><div><strong>Quantity:</strong> ${quote.quantity}</div></div>
      </div>
      <h2>Cost Breakdown</h2>
      <table><thead><tr><th>Item</th><th>Details</th><th class="right">Amount</th></tr></thead><tbody>
      ${quote.costBreakdown.map((c) => `<tr><td>${c.label}</td><td style="color:#6b7280">${c.notes || ''}</td><td class="right">${formatCurrency(c.amount, quote.currency)}</td></tr>`).join('')}
      <tr class="total-row"><td>Total Cost</td><td></td><td class="right">${formatCurrency(quote.totalCost, quote.currency)}</td></tr>
      <tr><td>Margin (${quote.marginPercent}%)</td><td></td><td class="right">${formatCurrency(quote.customerPrice - quote.totalCost, quote.currency)}</td></tr>
      <tr class="total-row"><td>Customer Price</td><td></td><td class="right">${formatCurrency(quote.customerPrice, quote.currency)}</td></tr>
      </tbody></table>
      <h2>Notes</h2><p style="font-size:13px;color:#4b5563">${quote.notes}</p>
      <h2>Assumptions</h2><ul class="assumptions">${quote.assumptions.map((a) => `<li>${a}</li>`).join('')}</ul>
      <div class="footer">This quote is valid until ${new Date(quote.validUntil).toLocaleDateString()}. Pacific Trading Co. &copy; ${new Date().getFullYear()}</div>
    </body></html>`);
    w.document.close();
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-[13px]" style={{ color: 'var(--text-muted)' }}>
        <Link href="/admin/quotes" style={{ color: 'var(--accent)' }}>Quotes</Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span style={{ color: 'var(--text)' }}>{quote.displayId}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[20px] md:text-[24px] font-semibold tracking-[-0.5px]">{quote.displayId}</h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: cfg.bg, color: cfg.color }}>
              {t(cfg.label, statusLabels[quote.status])}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2 text-[13px]" style={{ color: 'var(--text-muted)' }}>
            <span>{quote.customer}</span>
            <span style={{ color: 'var(--border)' }}>|</span>
            <span>{quote.company}</span>
            <span style={{ color: 'var(--border)' }}>|</span>
            <span>Created {formatDate(quote.createdAt)}</span>
          </div>
        </div>
      </div>

      {hasBlockedFields && (
        <div className="border rounded-[4px] p-4 mb-6" style={{ borderColor: '#FCA5A5', background: '#FEF2F2' }}>
          <div className="flex items-start gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>
              <p className="text-[12px] font-semibold" style={{ color: '#991B1B' }}>
                Cannot send quote — missing customer-confirmed fields
              </p>
              <p className="text-[12px] mt-1" style={{ color: '#7F1D1D' }}>
                {quote.blockedByMissingFields.join(', ')} — must be confirmed with customer before approval.
              </p>
            </div>
          </div>
        </div>
      )}

      {quote.warnings.length > 0 && !hasBlockedFields && (
        <div className="border rounded-[4px] p-4 mb-6" style={{ borderColor: '#FDE68A', background: '#FFFBEB' }}>
          <div className="flex items-start gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <div>
              <p className="text-[12px] font-semibold" style={{ color: '#92400E' }}>
                {quote.warnings.length} warnings — review before sending
              </p>
              <ul className="mt-1 space-y-0.5">
                {quote.warnings.slice(0, 3).map((w, i) => (
                  <li key={i} className="text-[12px]" style={{ color: '#78350F' }}>{w}</li>
                ))}
                {quote.warnings.length > 3 && (
                  <li className="text-[12px]" style={{ color: '#78350F' }}>...and {quote.warnings.length - 3} more</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Summary */}
          <section className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <h2 className="text-[14px] font-semibold mb-4 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              Product Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Product</p>
                <p className="text-[13px] font-medium">{quote.product}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Quantity</p>
                <p className="text-[13px] font-medium">{quote.quantity}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Delivery Terms</p>
                <p className="text-[13px] font-medium">CIF London</p>
              </div>
            </div>
            <div className="mt-3 text-[12px]" style={{ color: 'var(--text-muted)' }}>{quote.notes}</div>
          </section>

          {/* Cost Breakdown */}
          <section className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <h2 className="text-[14px] font-semibold mb-4 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}>
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
              </svg>
              Cost Breakdown
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Item</th>
                    <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Source</th>
                    <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Details</th>
                    <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider text-right" style={{ color: 'var(--text-muted)' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.costBreakdown.map((c, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td className="py-2.5 text-[13px]">
                        {c.label}
                        {!c.confirmed && <span className="ml-1 text-[10px] px-1 py-0.5 rounded" style={{ background: '#FEF3C7', color: '#92400E' }}>unconfirmed</span>}
                      </td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ background: sourceConfig[c.source]?.bg || '#F3F4F6', color: sourceConfig[c.source]?.color || '#6B7280' }}>
                          {sourceConfig[c.source]?.label || c.source}
                        </span>
                      </td>
                      <td className="py-2.5 text-[12px]" style={{ color: 'var(--text-muted)' }}>{c.sourceDetail || c.notes || '-'}</td>
                      <td className="py-2.5 text-[13px] font-medium text-right">{formatCurrency(c.amount, quote.currency)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: '2px solid var(--border)' }}>
                    <td className="pt-3 pb-1 text-[13px] font-semibold">Total Cost</td>
                    <td></td>
                    <td className="pt-3 pb-1 text-[13px] font-semibold text-right">{formatCurrency(quote.totalCost, quote.currency)}</td>
                  </tr>
                  <tr>
                    <td className="pb-1 text-[13px]" style={{ color: 'var(--text-muted)' }}>Margin ({quote.marginPercent}%)</td>
                    <td></td>
                    <td className="pb-1 text-[13px] text-right" style={{ color: 'var(--text-muted)' }}>{formatCurrency(quote.customerPrice - quote.totalCost, quote.currency)}</td>
                  </tr>
                  <tr>
                    <td className="text-[14px] font-bold">Customer Price</td>
                    <td></td>
                    <td className="text-[14px] font-bold text-right">{formatCurrency(quote.customerPrice, quote.currency)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {/* Supplier Comparison */}
          <section className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <h2 className="text-[14px] font-semibold mb-4 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}>
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
              Supplier Comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Supplier</th>
                    <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider text-right" style={{ color: 'var(--text-muted)' }}>Price</th>
                    <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider text-right" style={{ color: 'var(--text-muted)' }}>MOQ</th>
                    <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider text-right" style={{ color: 'var(--text-muted)' }}>Lead Time</th>
                    <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Certs</th>
                    <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Validity</th>
                    <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border)', background: quote.supplierId === 's1' ? 'var(--accent)08' : 'transparent' }}>
                    <td className="py-2.5 text-[13px] font-medium">
                      Shenzhen Steel Works
                      {quote.supplierId === 's1' && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded font-semibold" style={{ background: '#D1FAE5', color: '#059669' }}>SELECTED</span>}
                    </td>
                    <td className="py-2.5 text-[13px] text-right">$2.80/pc</td>
                    <td className="py-2.5 text-[13px] text-right">5,000</td>
                    <td className="py-2.5 text-[13px] text-right">28 days</td>
                    <td className="py-2.5 text-[12px]">
                      <div className="flex flex-wrap gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: '#D1FAE5', color: '#059669' }}>ISO 9001: Verified</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: '#DBEAFE', color: '#2563EB' }}>FDA: Docs available</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-[12px]">7 days</td>
                    <td className="py-2.5"><span className="text-[11px] px-1.5 py-0.5 rounded font-medium" style={{ background: '#D1FAE5', color: '#059669' }}>Low</span></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-2.5 text-[13px]">Guangdong Metal Co.</td>
                    <td className="py-2.5 text-[13px] text-right">$2.55/pc</td>
                    <td className="py-2.5 text-[13px] text-right">10,000</td>
                    <td className="py-2.5 text-[13px] text-right">42 days</td>
                    <td className="py-2.5 text-[12px]">
                      <div className="flex flex-wrap gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: '#FEF3C7', color: '#92400E' }}>ISO 9001: Claimed</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: '#FEE2E2', color: '#DC2626' }}>FDA: Not confirmed</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-[12px]">3 days</td>
                    <td className="py-2.5"><span className="text-[11px] px-1.5 py-0.5 rounded font-medium" style={{ background: '#FEF3C7', color: '#92400E' }}>Medium</span></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-2.5 text-[13px]">Dongguan Drinkware</td>
                    <td className="py-2.5 text-[13px] text-right">$3.10/pc</td>
                    <td className="py-2.5 text-[13px] text-right">3,000</td>
                    <td className="py-2.5 text-[13px] text-right">21 days</td>
                    <td className="py-2.5 text-[12px]">
                      <div className="flex flex-wrap gap-1">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: '#D1FAE5', color: '#059669' }}>ISO 9001: Verified</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: '#D1FAE5', color: '#059669' }}>FDA: Reviewed</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: '#FEF3C7', color: '#92400E' }}>BSCI: Claimed</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-[12px]">14 days</td>
                    <td className="py-2.5"><span className="text-[11px] px-1.5 py-0.5 rounded font-medium" style={{ background: '#D1FAE5', color: '#059669' }}>Low</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Assumptions */}
          <section className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <h2 className="text-[14px] font-semibold mb-3 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              Assumptions
            </h2>
            <ul className="space-y-2">
              {quote.assumptions.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px]" style={{ color: 'var(--text-muted)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {a}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right column: sidebar */}
        <div className="space-y-6">
          {/* Total Cost Card */}
          <section className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <p className="text-[11px] uppercase tracking-wider font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>Customer Price</p>
            <p className="text-[24px] font-bold" style={{ color: 'var(--accent)' }}>{formatCurrency(quote.customerPrice, quote.currency)}</p>
            <div className="flex items-center gap-4 mt-3 text-[12px]" style={{ color: 'var(--text-muted)' }}>
              <div>
                <p>Cost</p>
                <p className="font-medium" style={{ color: 'var(--text)' }}>{formatCurrency(quote.totalCost, quote.currency)}</p>
              </div>
              <div>
                <p>Margin</p>
                <p className="font-medium" style={{ color: '#059669' }}>{quote.marginPercent}%</p>
              </div>
            </div>
            <div className="mt-3 text-[12px]" style={{ color: 'var(--text-muted)' }}>
              <p>Valid until: <span style={{ color: 'var(--text)' }}>{new Date(quote.validUntil).toLocaleDateString()}</span></p>
            </div>
          </section>

          {/* Action Buttons */}
          <section className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <p className="text-[11px] uppercase tracking-wider font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>Actions</p>

            {/* Approval gate: in_review */}
            {quote.status === 'in_review' && (
              <div className="space-y-2">
                {hasBlockedFields ? (
                  <div className="border rounded-[4px] p-3" style={{ borderColor: '#FCA5A5', background: '#FEF2F2' }}>
                    <p className="text-[12px]" style={{ color: '#991B1B' }}>
                      Approval blocked. Confirm missing fields with customer first.
                    </p>
                  </div>
                ) : confirmAction === 'approve' ? (
                  <div className="border rounded-[4px] p-3" style={{ borderColor: '#D1FAE5', background: '#F0FDF4' }}>
                    <p className="text-[12px] mb-2" style={{ color: '#166534' }}>Approve this quote?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { approveQuote(quote.id); setConfirmAction(null); }}
                        className="flex-1 px-3 py-1.5 rounded-[4px] text-[12px] font-medium text-white"
                        style={{ background: '#059669' }}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmAction(null)}
                        className="px-3 py-1.5 rounded-[4px] text-[12px] font-medium"
                        style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmAction('approve')}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-[4px] text-[13px] font-medium text-white transition-colors"
                    style={{ background: '#059669' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Approve
                  </button>
                )}
                {confirmAction === 'reject' ? (
                  <div className="border rounded-[4px] p-3" style={{ borderColor: '#FEE2E2', background: '#FEF2F2' }}>
                    <p className="text-[12px] mb-2" style={{ color: '#991B1B' }}>Reject this quote?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { rejectQuote(quote.id); setConfirmAction(null); }}
                        className="flex-1 px-3 py-1.5 rounded-[4px] text-[12px] font-medium text-white"
                        style={{ background: '#DC2626' }}
                      >
                        Confirm Reject
                      </button>
                      <button
                        onClick={() => setConfirmAction(null)}
                        className="px-3 py-1.5 rounded-[4px] text-[12px] font-medium"
                        style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmAction('reject')}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-[4px] text-[13px] font-medium transition-colors"
                    style={{ border: '1px solid #DC2626', color: '#DC2626' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    Reject
                  </button>
                )}
              </div>
            )}

            {/* Send button: approved */}
            {quote.status === 'approved' && (
              <div className="space-y-2">
                {confirmAction === 'send' ? (
                  <div className="border rounded-[4px] p-3" style={{ borderColor: '#DBEAFE', background: '#EFF6FF' }}>
                    <p className="text-[12px] mb-2" style={{ color: '#1E40AF' }}>Send quote to customer?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { sendQuote(quote.id); setConfirmAction(null); }}
                        className="flex-1 px-3 py-1.5 rounded-[4px] text-[12px] font-medium text-white"
                        style={{ background: '#2563EB' }}
                      >
                        Confirm Send
                      </button>
                      <button
                        onClick={() => setConfirmAction(null)}
                        className="px-3 py-1.5 rounded-[4px] text-[12px] font-medium"
                        style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmAction('send')}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-[4px] text-[13px] font-medium text-white transition-colors"
                    style={{ background: '#2563EB' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    Send to customer
                  </button>
                )}
              </div>
            )}

            {/* Simulate customer reply: sent */}
            {quote.status === 'sent' && (
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-wider font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Simulate Customer Reply</p>
                <button
                  onClick={() => simulateCustomerReply(quote.id, 'accept')}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-[4px] text-[13px] font-medium text-white transition-colors"
                  style={{ background: '#059669' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Accept
                </button>
                <button
                  onClick={() => simulateCustomerReply(quote.id, 'negotiate')}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-[4px] text-[13px] font-medium transition-colors"
                  style={{ border: '1px solid #2563EB', color: '#2563EB' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                  </svg>
                  Negotiate (request lower price)
                </button>
                <button
                  onClick={() => simulateCustomerReply(quote.id, 'reject')}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-[4px] text-[13px] font-medium transition-colors"
                  style={{ border: '1px solid #DC2626', color: '#DC2626' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  Reject
                </button>
              </div>
            )}

            {/* Read-only states */}
            {(quote.status === 'accepted' || quote.status === 'rejected' || quote.status === 'negotiating') && (
              <p className="text-[13px] text-center py-2" style={{ color: 'var(--text-muted)' }}>
                {quote.status === 'accepted' && 'This quote has been accepted.'}
                {quote.status === 'rejected' && 'This quote was rejected.'}
                {quote.status === 'negotiating' && 'Customer has requested a lower price.'}
              </p>
            )}

            {/* PDF preview (always available) */}
            <button
              onClick={openPdfPreview}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-[4px] text-[13px] font-medium mt-3 transition-colors"
              style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              Preview PDF
            </button>
          </section>

          {/* Audit Trail */}
          <section className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <h2 className="text-[14px] font-semibold mb-4 flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}>
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              Audit Trail
            </h2>
            <div className="space-y-4">
              {quote.auditTrail.map((entry, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: i === quote.auditTrail.length - 1 ? 'var(--accent)' : 'var(--border)' }} />
                    {i < quote.auditTrail.length - 1 && <div className="w-px flex-1" style={{ background: 'var(--border)' }} />}
                  </div>
                  <div className="pb-2">
                    <p className="text-[13px] font-medium">{entry.action}</p>
                    <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{entry.details}</p>
                    <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>{entry.user} &middot; {formatDate(entry.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}


