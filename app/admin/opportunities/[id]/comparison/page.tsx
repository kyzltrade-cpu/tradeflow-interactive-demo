'use client';

import { useState } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { useDemo } from '@/lib/mock-store';
import { useLang } from '@/lib/lang';

const ICONS = {
  warn: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
  info: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z',
  check: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  star: 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
};

function CompStatusBadge({ status, t }: { status: string; t: (en: string, zh: string) => string }) {
  const map: Record<string, { label: string; zh: string; bg: string; fg: string; border: string }> = {
    comparable: { label: 'Comparable', zh: '可比较', bg: '#ECFDF5', fg: '#038153', border: '#A7F3D0' },
    partially_comparable: { label: 'Partially Comparable', zh: '部分可比较', bg: '#FFFBEB', fg: '#AD5918', border: '#FDE68A' },
    not_comparable: { label: 'Not Comparable', zh: '不可比较', bg: '#FEF2F2', fg: '#CC3340', border: '#FECACA' },
  };
  const b = map[status] ?? map.not_comparable;
  return (
    <span
      className="inline-flex items-center rounded-md px-2.5 py-0.5 text-[12px] font-semibold"
      style={{ background: b.bg, color: b.fg, border: `1px solid ${b.border}` }}
    >
      {t(b.label, b.zh)}
    </span>
  );
}

function FlagIcon({ severity }: { severity: string }) {
  const color = severity === 'error' ? '#CC3340' : severity === 'warning' ? '#D97706' : '#2563EB';
  const d = severity === 'error' || severity === 'warning' ? ICONS.warn : ICONS.info;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 shrink-0" style={{ color }}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

function Section({ title, titleZh }: { title: string; titleZh: string }) {
  const { t } = useLang();
  return (
    <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
      {t(title, titleZh)}
    </h2>
  );
}

export default function ComparisonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useLang();
  const { suppliers, rfqs, opportunities } = useDemo();

  const rfq = rfqs.find((r) => r.id === id || r.displayId === id);
  const opportunity = opportunities.find((o) => o.id === rfq?.opportunityId);
  const responses = rfq?.responses ?? [];

  const [selectedSupplier, setSelectedSupplier] = useState<string>(
    responses.find((r) => r.status === 'received')?.supplierId ?? responses[0]?.supplierId ?? ''
  );

  // Derive comparability from responses
  const hasIncomplete = responses.some((r) => r.status === 'pending');
  const hasCurrencyDiff = responses.length > 1 && new Set(responses.map((r) => r.currency)).size > 1;
  const hasIncotermDiff = responses.length > 1 && new Set(responses.map((r) => r.incoterm)).size > 1;
  const comparabilityStatus = hasIncomplete
    ? 'partially_comparable'
    : hasCurrencyDiff || hasIncotermDiff
    ? 'partially_comparable'
    : 'comparable';

  const respSupplierMap = responses.map((r) => ({
    response: r,
    supplier: suppliers.find((s) => s.id === r.supplierId),
  }));

  // Generate flags
  const flags: { description: string; descriptionZh: string; severity: string }[] = [];
  if (hasIncomplete) {
    flags.push({ description: 'Some supplier responses are still pending', descriptionZh: '部分供应商回复仍在等待中', severity: 'warning' });
  }
  if (hasCurrencyDiff) {
    flags.push({ description: 'Different currencies across responses \u2014 convert before comparing', descriptionZh: '各供应商报价货币不同 \u2014 比较前请先转换', severity: 'warning' });
  }
  if (hasIncotermDiff) {
    flags.push({ description: 'Different incoterms across responses \u2014 not directly comparable', descriptionZh: '各供应商贸易术语不同 \u2014 无法直接比较', severity: 'warning' });
  }
  responses.forEach((r) => {
    if (r.incoterm.toLowerCase().includes('fob')) {
      flags.push({ description: `${r.incoterm} \u2014 does not include freight to destination`, descriptionZh: `${r.incoterm} \u2014 不含至目的地运费`, severity: 'info' });
    }
  });

  const validResponses = respSupplierMap.filter((r) => r.response.status === 'received');
  const selectedResp = respSupplierMap.find((r) => r.response.supplierId === selectedSupplier);

  const comparisonRows = [
    {
      label: 'Unit Price', zh: '单价',
      values: respSupplierMap.map((r) => r.response.status === 'received' ? `$${r.response.price}` : '—'),
    },
    {
      label: 'Currency', zh: '货币',
      values: respSupplierMap.map((r) => r.response.status === 'received' ? r.response.currency : '—'),
    },
    {
      label: 'MOQ', zh: '最低起订量',
      values: respSupplierMap.map((r) => r.response.status === 'received' ? `${r.response.moq.toLocaleString()} pcs` : '—'),
    },
    {
      label: 'Lead Time', zh: '交货期',
      values: respSupplierMap.map((r) => r.response.status === 'received' ? `${r.response.leadTime} ${r.response.leadTimeUnit}` : '—'),
    },
    {
      label: 'Incoterm', zh: '贸易术语',
      values: respSupplierMap.map((r) => r.response.status === 'received' ? r.response.incoterm : '—'),
    },
    {
      label: 'Packaging', zh: '包装',
      values: respSupplierMap.map((r) => r.response.status === 'received' ? r.response.packaging : '—'),
    },
    {
      label: 'Logo Printing', zh: '印刷',
      values: respSupplierMap.map((r) => r.response.status === 'received' ? r.response.logoPrinting : '—'),
    },
    {
      label: 'Payment Terms', zh: '付款条件',
      values: respSupplierMap.map((r) => r.response.status === 'received' ? r.response.paymentTerms : '—'),
    },
    {
      label: 'Certifications', zh: '认证',
      values: respSupplierMap.map((r) => r.response.status === 'received'
        ? r.response.certifications.map((c) => c.name).join(', ') || '—'
        : '—'),
    },
    {
      label: 'Quote Validity', zh: '报价有效期',
      values: respSupplierMap.map((r) => r.response.status === 'received'
        ? new Date(r.response.validUntil).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '—'),
    },
  ];

  // Recommendation logic
  const received = validResponses.map((r) => r.response);
  const bestPrice = received.length > 0 ? Math.min(...received.map((r) => r.price)) : null;
  const fastestLead = received.length > 0 ? Math.min(...received.map((r) => r.leadTime)) : null;
  const recommended = received.find((r) => r.price === bestPrice && r.leadTime === fastestLead) || received.find((r) => r.price === bestPrice) || received[0];

  return (
    <div className="space-y-6">
      <Link href={`/admin/opportunities/${opportunity?.id ?? ''}`} className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors" style={{ color: 'var(--text-muted)' }}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        {t('Back to Opportunity', '返回商机')}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold" style={{ color: 'var(--text)' }}>
            {t('Supplier Comparison', '供应商比较')}
          </h1>
          <div className="mt-1 flex items-center gap-3">
            <span className="text-[13px] font-medium" style={{ color: 'var(--text-muted)' }}>
              {rfq?.displayId ?? '—'}
            </span>
            <CompStatusBadge status={comparabilityStatus} t={t} />
          </div>
        </div>
      </div>

      <Section title="Side-by-Side Comparison" titleZh="并排比较" />
      <div className="rounded-[4px] border overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                <th className="px-4 py-3 text-left font-semibold min-w-[140px]" style={{ color: 'var(--text-muted)' }}>
                  {t('Field', '字段')}
                </th>
                {respSupplierMap.map((r) => (
                  <th key={r.response.id} className="px-4 py-3 text-left font-semibold min-w-[180px]" style={{ color: 'var(--text)' }}>
                    <div>{r.supplier?.name ?? '\u2014'}</div>
                    <div className="text-[10px] font-normal" style={{ color: 'var(--text-muted)' }}>{r.supplier?.location}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.label} className="border-b last:border-b-0" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-4 py-2.5 font-medium" style={{ color: 'var(--text)' }}>{t(row.label, row.zh)}</td>
                  {row.values.map((val, i) => {
                    const isMissing = val === null;
                    return (
                      <td key={i} className="px-4 py-2.5">
                        {isMissing ? (
                          <span className="inline-flex items-center gap-1 text-[12px] font-medium" style={{ color: '#D97706' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3.5 w-3.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d={ICONS.warn} />
                            </svg>
                            {t('Missing', '缺失')}
                          </span>
                        ) : (
                          <span className="text-[12px]" style={{ color: 'var(--text)' }}>{val}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {flags.length > 0 && (
        <>
          <Section title="Flags" titleZh="标记" />
          <div className="rounded-[4px] border divide-y" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            {flags.map((flag, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3">
                <FlagIcon severity={flag.severity} />
                <span className="text-[13px]" style={{ color: 'var(--text)' }}>{t(flag.description, flag.descriptionZh)}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <Section title="Recommendation" titleZh="推荐" />
      <div className="rounded-[4px] border p-4 space-y-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        {recommended ? (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4" style={{ color: '#038153' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d={ICONS.check} />
              </svg>
              <span className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>{t('Recommended Supplier', '推荐供应商')}:</span>
              <span className="text-[13px] font-semibold" style={{ color: 'var(--accent)' }}>
                {suppliers.find((s) => s.id === recommended.supplierId)?.name}
              </span>
            </div>
            <ul className="mt-1 space-y-0.5 ml-6">
              <li className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                Best price: ${recommended.price} {recommended.currency} per unit
              </li>
              <li className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                Fastest lead time: {recommended.leadTime} {recommended.leadTimeUnit}
              </li>
              <li className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                Certifications: {recommended.certifications.map((c) => c.name).join(', ') || 'None listed'}
              </li>
            </ul>
          </div>
        ) : (
          <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>{t('No supplier responses received yet.', '尚未收到供应商回复。')}</p>
        )}

        {received.length > 1 && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>{t('Alternatives', '备选')}:</span>
            </div>
            <ul className="mt-1 space-y-0.5 ml-6">
              {received
                .filter((r) => r.supplierId !== recommended?.supplierId)
                .map((r) => (
                  <li key={r.id} className="text-[12px]" style={{ color: 'var(--text-muted)' }}>
                    {suppliers.find((s) => s.id === r.supplierId)?.name}: ${r.price} {r.currency} / {r.leadTime} {r.leadTimeUnit}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>

      <Section title="Decision" titleZh="决策" />
      <div className="rounded-[4px] border p-4 space-y-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>{t('Select a supplier to proceed:', '选择供应商以继续：')}</p>
        <div className="space-y-2">
          {respSupplierMap.map((r) => r.supplier && (
            <label key={r.response.id} className="flex items-center gap-3 rounded-[4px] border p-3 cursor-pointer transition-all" style={{ borderColor: selectedSupplier === r.response.supplierId ? 'var(--accent)' : 'var(--border)', background: selectedSupplier === r.response.supplierId ? 'var(--accent-light)' : 'transparent' }}>
              <input type="radio" name="supplier" value={r.response.supplierId} checked={selectedSupplier === r.response.supplierId} onChange={() => setSelectedSupplier(r.response.supplierId)} className="accent-current" style={{ color: 'var(--accent)' }} />
              <div className="min-w-0 flex-1">
                <span className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>{r.supplier.name}</span>
                <span className="ml-2 text-[12px]" style={{ color: 'var(--text-muted)' }}>{r.supplier.location}</span>
              </div>
              {r.response.supplierId === recommended?.supplierId && (
                <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold" style={{ background: '#ECFDF5', color: '#038153', border: '1px solid #A7F3D0' }}>
                  {t('Recommended', '推荐')}
                </span>
              )}
            </label>
          ))}
        </div>

        <button
          className="rounded-[4px] px-5 py-2.5 text-[13px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: 'var(--accent)' }}
        >
          {t('Select Supplier', '选择供应商')}
        </button>
      </div>
    </div>
  );
}
