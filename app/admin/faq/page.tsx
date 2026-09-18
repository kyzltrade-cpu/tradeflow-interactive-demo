'use client';

import { useLang } from '@/lib/lang';
import { useDemo } from '@/lib/mock-store';

export default function FaqPage() {
  const { t } = useLang();
  const { faqRules } = useDemo();

  return (
    <div>
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-[20px] md:text-[24px] font-semibold tracking-[-0.5px]">{t('FAQ Rules', 'FAQ 規則')}</h1>
          <p className="text-[13px] md:text-[14px] mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('Pre-defined responses for common questions', '常見問題的預設回覆')}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {faqRules.map((rule) => (
          <div key={rule.id} className="border rounded-[4px] p-4 md:p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                  #{rule.priority}
                </span>
                <p className="text-[14px] md:text-[15px] font-medium">{rule.question_pattern}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {rule.keywords.map((kw) => (
                <span key={kw} className="text-[10px] md:text-[11px] px-2 py-0.5 rounded font-medium" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                  {kw}
                </span>
              ))}
            </div>
            <p className="text-[13px] md:text-[14px] leading-[1.5]" style={{ color: 'var(--text-muted)' }}>{rule.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
