'use client';

import Link from 'next/link';
import { useLang } from '@/lib/lang';
import { useDemo } from '@/lib/mock-store';

export default function OpportunitiesPage() {
  const { t } = useLang();
  const { opportunities } = useDemo();

  const stageColors: Record<string, { bg: string; color: string }> = {
    new: { bg: '#F3F4F6', color: '#6B7280' },
    needs_information: { bg: '#FEF3C7', color: '#92400E' },
    qualified: { bg: '#DBEAFE', color: '#2563EB' },
    sourcing: { bg: '#D1FAE5', color: '#059669' },
    quote_draft: { bg: '#E0E7FF', color: '#4F46E5' },
    pending_approval: { bg: '#FEF3C7', color: '#D97706' },
    sent: { bg: '#DBEAFE', color: '#2563EB' },
    negotiating: { bg: '#FED7AA', color: '#EA580C' },
    won: { bg: '#D1FAE5', color: '#059669' },
    lost: { bg: '#FEE2E2', color: '#DC2626' },
    expired: { bg: '#F3F4F6', color: '#6B7280' },
  };

  const priorityColors: Record<string, { bg: string; color: string }> = {
    low: { bg: '#F3F4F6', color: '#6B7280' },
    medium: { bg: '#DBEAFE', color: '#2563EB' },
    high: { bg: '#FEE2E2', color: '#DC2626' },
  };

  const totalValue = opportunities
    .filter((o) => ['new', 'needs_information', 'qualified', 'sourcing', 'quote_draft', 'pending_approval', 'sent', 'negotiating'].includes(o.stage))
    .reduce((sum, o) => sum + o.estimatedValue, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-[20px] md:text-[24px] font-semibold tracking-[-0.5px]">{t('Opportunities', '商機')}</h1>
          <p className="text-[13px] md:text-[14px] mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('Track and manage your sales pipeline', '追踪和管理銷售管道')}
          </p>
        </div>
      </div>

      <div className="border rounded-[4px] p-4 mb-4" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <p className="text-[12px] uppercase tracking-[0.05em] font-medium" style={{ color: 'var(--text-muted)' }}>
          {t('Total Pipeline Value', '管道總價值')}
        </p>
        <p className="text-[24px] font-bold mt-0.5">USD ${totalValue.toLocaleString()}</p>
      </div>

      <section className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('ID', '編號')}
                </th>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Company', '公司')}
                </th>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Stage', '階段')}
                </th>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Priority', '優先級')}
                </th>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Value', '價值')}
                </th>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Next Action', '下一步')}
                </th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((opp) => {
                const sc = stageColors[opp.stage];
                const pc = priorityColors[opp.priority];
                return (
                  <tr key={opp.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-3">
                      <Link href={`/admin/opportunities/${opp.id}`} className="text-[13px] font-medium" style={{ color: 'var(--accent)' }}>
                        {opp.displayId}
                      </Link>
                    </td>
                    <td className="py-3 text-[13px]">
                      <p className="font-medium">{opp.company}</p>
                      <p className="text-[12px]" style={{ color: 'var(--text-muted)' }}>{opp.contact}</p>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ background: sc.bg, color: sc.color }}>
                        {opp.stage}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ background: pc.bg, color: pc.color }}>
                        {opp.priority}
                      </span>
                    </td>
                    <td className="py-3 text-[13px] font-medium">{opp.currency} ${opp.estimatedValue.toLocaleString()}</td>
                    <td className="py-3 text-[13px] max-w-[200px] truncate" style={{ color: 'var(--text-muted)' }}>{opp.nextAction}</td>
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
