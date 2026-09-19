'use client';

import { useState } from 'react';
import { useLang } from '@/lib/lang';

const plans = [
  {
    id: 'starter',
    name: 'Starter SDR',
    priceMonthly: 880,
    currency: 'HK$',
    features: [
      '1 AI SDR agent',
      'WhatsApp + Email channels',
      'Up to 500 conversations/mo',
      'Product catalog (100 items)',
      'Basic follow-up sequences',
      'Standard support',
    ],
  },
  {
    id: 'growth',
    name: 'Growth Trading Desk',
    priceMonthly: 2480,
    currency: 'HK$',
    features: [
      'Up to 3 AI agents',
      'WhatsApp + Email + WeChat',
      'Unlimited conversations',
      'Unlimited product catalog',
      'Advanced follow-up sequences',
      'Quote generation & tracking',
      'Priority support',
      'Analytics dashboard',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    priceMonthly: 0,
    currency: 'HK$',
    features: [
      'Unlimited AI agents',
      'All channels',
      'Unlimited everything',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
      'Custom AI training',
      'API access',
    ],
  },
];

export default function BillingPage() {
  const { t } = useLang();
  const [annual, setAnnual] = useState(false);
  const [currentPlan] = useState('starter');

  return (
    <div>
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-[20px] md:text-[24px] font-semibold tracking-[-0.5px]">{t('Billing', '帳單')}</h1>
          <p className="text-[13px] md:text-[14px] mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('Manage your subscription and plan', '管理您的訂閱和方案')}
          </p>
        </div>
      </div>

      {/* Monthly / Annual toggle */}
      <div className="flex items-center justify-center mb-8">
        <div className="inline-flex items-center gap-3 border rounded-[4px] p-1" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <button
            onClick={() => setAnnual(false)}
            className="px-4 py-1.5 rounded-[4px] text-[13px] font-medium transition-colors"
            style={{ background: !annual ? 'var(--accent)' : 'transparent', color: !annual ? '#fff' : 'var(--text-muted)' }}
          >
            {t('Monthly', '每月')}
          </button>
          <button
            onClick={() => setAnnual(true)}
            className="px-4 py-1.5 rounded-[4px] text-[13px] font-medium transition-colors"
            style={{ background: annual ? 'var(--accent)' : 'transparent', color: annual ? '#fff' : 'var(--text-muted)' }}
          >
            {t('Annual', '每年')}
            <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(34,197,94,0.15)', color: '#16a34a' }}>
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id;
          const isEnterprise = plan.id === 'enterprise';
          const displayPrice = isEnterprise
            ? null
            : annual
              ? Math.round(plan.priceMonthly * 0.8)
              : plan.priceMonthly;

          return (
            <div
              key={plan.id}
              className="border rounded-[4px] p-5 relative"
              style={{
                borderColor: isCurrent ? 'var(--accent)' : 'var(--border)',
                background: 'var(--surface)',
              }}
            >
              {isCurrent && (
                <span className="absolute top-3 right-3 text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                  {t('Current Plan', '目前方案')}
                </span>
              )}

              <h3 className="text-[15px] font-semibold mb-1">{plan.name}</h3>

              <div className="mb-4">
                {displayPrice !== null ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-[28px] font-bold">{plan.currency}{displayPrice}</span>
                    <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>/mo</span>
                  </div>
                ) : (
                  <div className="text-[28px] font-bold">{t('Custom', '自訂')}</div>
                )}
                {annual && !isEnterprise && (
                  <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {t('Billed annually', '每年付款')}
                  </p>
                )}
              </div>

              <ul className="space-y-2 mb-5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-[13px]" style={{ color: 'var(--text-muted)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" className="flex-shrink-0 mt-0.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <button
                  className="w-full text-center text-[13px] font-medium px-4 py-2 rounded-[4px] border"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                  disabled
                >
                  {t('Current Plan', '目前方案')}
                </button>
              ) : isEnterprise ? (
                <button
                  className="w-full text-center text-[13px] font-medium px-4 py-2 rounded-[4px] text-white"
                  style={{ background: 'var(--accent)' }}
                >
                  {t('Contact Sales', '聯繫銷售')}
                </button>
              ) : (
                <button
                  className="w-full text-center text-[13px] font-medium px-4 py-2 rounded-[4px] text-white"
                  style={{ background: 'var(--accent)' }}
                >
                  {t('Upgrade', '升級')}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Go to billing */}
      <div className="mt-6 flex justify-end">
        <button
          className="inline-flex items-center gap-1 text-[13px] font-medium px-4 py-2 rounded-[4px] text-white"
          style={{ background: 'var(--accent)' }}
        >
          {t('Go to billing', '前往帳單')}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>

      {/* Demo note */}
      <div className="border rounded-[4px] p-4 mt-6" style={{ borderColor: '#FDE68A', background: '#FFFBEB' }}>
        <div className="flex items-start gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div>
            <p className="text-[12px] font-semibold" style={{ color: '#92400E' }}>{t('Demo Mode', '示範模式')}</p>
            <p className="text-[12px] mt-0.5" style={{ color: '#78350F' }}>
              {t('Billing is simulated in this demo. No real charges will be made.', '此示範中的帳單為模擬。不會產生實際費用。')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
