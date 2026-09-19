'use client';

import { useState } from 'react';
import { useLang } from '@/lib/lang';

type Stage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
type Priority = 'low' | 'medium' | 'high';

interface Opportunity {
  id: string;
  name: string;
  company: string;
  stage: Stage;
  priority: Priority;
  estimatedValue: string;
  valueNum: number;
}

const mockOpps: Opportunity[] = [
  { id: 'opp-1', name: 'Bulk tumbler order', company: 'Acme Corp', stage: 'proposal', priority: 'high', estimatedValue: 'HK$125,000', valueNum: 125000 },
  { id: 'opp-2', name: 'USB-C charger line', company: 'Global Trade Ltd', stage: 'qualified', priority: 'medium', estimatedValue: 'HK$48,000', valueNum: 48000 },
  { id: 'opp-3', name: 'Ceramic mug series', company: 'Pacific Imports', stage: 'negotiation', priority: 'high', estimatedValue: 'HK$230,000', valueNum: 230000 },
  { id: 'opp-4', name: 'Steel water bottles', company: 'Dragon Supplies', stage: 'won', priority: 'medium', estimatedValue: 'HK$67,500', valueNum: 67500 },
  { id: 'opp-5', name: 'Laptop stand project', company: 'Asia Electronics', stage: 'lead', priority: 'low', estimatedValue: 'HK$15,000', valueNum: 15000 },
];

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
  Lead: '\u6F5B\u5728\u5BA2\u6237',
  Qualified: '\u5DF2\u8CC7\u683C\u5BE9\u6838',
  Proposal: '\u63D0\u6848\u4E2D',
  Negotiation: '\u8ACB\u5224\u4E2D',
  Won: '\u5DF2\u6210\u4EA4',
  Lost: '\u5DF2\u6D41\u5931',
};
const priorityLabels: Record<string, string> = {
  Low: '\u4F4E',
  Medium: '\u4E2D',
  High: '\u9AD8',
};

export default function OpportunitiesPage() {
  const { t } = useLang();
  const [opps] = useState<Opportunity[]>(mockOpps);
  const totalValue = opps.reduce((sum, o) => sum + o.valueNum, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-[20px] md:text-[24px] font-semibold tracking-[-0.5px]">
            {t('Opportunities', '\u92B7\u552E\u6A5F\u6703')}
          </h1>
          <p className="text-[13px] md:text-[14px] mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('Track and manage your sales pipeline', '\u8FFD\u8E64\u548C\u7BA1\u7406\u60A8\u7684\u92B7\u552E\u7BA1\u9053')}
          </p>
        </div>
      </div>

      <div className="border rounded-[4px] p-4 mb-4" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <p className="text-[12px] uppercase tracking-[0.05em] font-medium" style={{ color: 'var(--text-muted)' }}>
          {t('Total Pipeline Value', '\u7BA1\u9053\u7E3D\u503C')}
        </p>
        <p className="text-[24px] font-bold mt-0.5">HK${totalValue.toLocaleString()}</p>
      </div>

      <section className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Opportunity', '\u6A5F\u6703')}
                </th>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Company', '\u516C\u53F8')}
                </th>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Stage', '\u968E\u6BB5')}
                </th>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Priority', '\u512A\u5148\u7D1A')}
                </th>
                <th className="pb-3 text-[12px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t('Estimated Value', '\u9810\u4F30\u503C')}
                </th>
              </tr>
            </thead>
            <tbody>
              {opps.map((opp) => {
                const sc = stageConfig[opp.stage];
                const pc = priorityConfig[opp.priority];
                return (
                  <tr key={opp.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="py-3 text-[13px] font-medium">{opp.name}</td>
                    <td className="py-3 text-[13px]">{opp.company}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ background: sc.bg, color: sc.color }}>
                        {t(sc.label, stageLabels[sc.label])}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ background: pc.bg, color: pc.color }}>
                        {t(pc.label, priorityLabels[pc.label])}
                      </span>
                    </td>
                    <td className="py-3 text-[13px] font-medium">{opp.estimatedValue}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="border rounded-[4px] p-4 mt-6" style={{ borderColor: '#FDE68A', background: '#FFFBEB' }}>
        <div className="flex items-start gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div>
            <p className="text-[12px] font-semibold" style={{ color: '#92400E' }}>{t('Demo Mode', '\u793A\u7BC4\u6A21\u5F0F')}</p>
            <p className="text-[12px] mt-0.5" style={{ color: '#78350F' }}>
              {t('Pipeline data is mock data for demonstration purposes.', '\u7BA1\u9053\u6578\u64DA\u70BA\u793A\u7BC4\u7528\u9014\u7684\u6A21\u64EC\u6578\u64DA\u3002')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
