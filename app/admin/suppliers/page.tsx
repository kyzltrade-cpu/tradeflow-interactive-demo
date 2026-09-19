'use client';

import Link from 'next/link';
import { useLang } from '@/lib/lang';
import { useDemo } from '@/lib/mock-store';

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= count ? '#F59E0B' : 'none'} stroke={i <= count ? '#F59E0B' : '#D1D5DB'} strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function SuppliersPage() {
  const { t } = useLang();
  const { suppliers } = useDemo();

  return (
    <div>
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-[20px] md:text-[24px] font-semibold tracking-[-0.5px]">{t('Suppliers', '供應商')}</h1>
          <p className="text-[13px] md:text-[14px] mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('Your supplier directory and contacts', '您的供應商目錄和聯絡資訊')}
          </p>
        </div>
        <button
          className="inline-flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-[4px] text-white"
          style={{ background: 'var(--accent)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          {t('Add supplier', '新增供應商')}
        </button>
      </div>

      <section className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Supplier Name', '供應商名稱')}
                </th>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Location', '位置')}
                </th>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Specialty', '專長')}
                </th>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Rating', '評級')}
                </th>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Certifications', '認證')}
                </th>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Verified', '已驗證')}
                </th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((sup) => (
                <tr key={sup.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td className="py-3">
                    <Link href={`/admin/suppliers/${sup.id}`} className="text-[13px] font-medium" style={{ color: 'var(--accent)' }}>
                      {sup.name}
                    </Link>
                  </td>
                  <td className="py-3 text-[13px]" style={{ color: 'var(--text-muted)' }}>{sup.location}</td>
                  <td className="py-3 text-[13px]">{sup.specialty}</td>
                  <td className="py-3"><Stars count={Math.round(sup.rating)} /></td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-1">
                      {sup.certifications.map((cert) => (
                        <span key={cert.name} className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: '#DBEAFE', color: '#2563EB' }}>
                          {cert.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3">
                    {sup.verified && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#059669" stroke="#059669" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
