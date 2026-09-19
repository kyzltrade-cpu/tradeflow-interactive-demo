'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLang } from '@/lib/lang';
import { useDemo } from '@/lib/mock-store';

function formatTimeAgo(dateStr: string, now: number): string {
  const diff = now - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function SkeletonCard() {
  return (
    <div className="border rounded-[4px] p-4 md:p-5 animate-pulse" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
      <div className="h-3 w-24 rounded mb-3" style={{ background: 'var(--border)' }} />
      <div className="h-7 w-12 rounded" style={{ background: 'var(--border)' }} />
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-4 md:px-5 py-3 border-b last:border-b-0 animate-pulse" style={{ borderColor: 'var(--border)' }}>
      <div className="w-8 h-8 rounded-full" style={{ background: 'var(--border)' }} />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-28 rounded" style={{ background: 'var(--border)' }} />
        <div className="h-3 w-48 rounded" style={{ background: 'var(--border)' }} />
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { t } = useLang();
  const { conversations, products } = useDemo();
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(0);
  const [expandedSummaries, setExpandedSummaries] = useState<Set<string>>(new Set());

  useEffect(() => {
    setNow(Date.now());
    setMounted(true);
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const toggleSummary = (id: string) => {
    setExpandedSummaries(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const uniqueContacts = new Set(
    conversations
      .filter((c) => new Date(c.updated_at).getTime() > weekAgo)
      .map((c) => c.contact_phone || c.contact_wechat_id || c.id)
  );

  const totalConversations = conversations.length;
  const newClientsThisWeek = uniqueContacts.size;
  const bookmarkedCount = conversations.filter((c) => c.status === 'bookmarked').length;
  const productsCount = products.length;
  const recentConversations = conversations.slice(0, 5);
  const bookmarkedConversations = conversations.filter((c) => c.status === 'bookmarked').slice(0, 3);

  const displayStatus = (conv: { status: string }) => {
    if (conv.status === 'bookmarked') return 'flagged';
    if (conv.status === 'human') return 'human';
    return 'ai';
  };

  const contactName = (conv: { contact_name: string | null; contact_phone: string | null; contact_wechat_id: string | null; id: string }) =>
    conv.contact_name || conv.contact_phone || conv.contact_wechat_id || 'Unknown';

  return (
    <div>
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-[20px] md:text-[24px] font-semibold tracking-[-0.5px]">{t('Dashboard', '控制台')}</h1>
          <p className="text-[13px] md:text-[14px] mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('Overview of your AI assistant performance', 'AI 助手表現概覽')}
          </p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="border rounded-[4px] p-4 md:p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <p className="text-[11px] md:text-[12px] font-medium uppercase tracking-[0.05em] mb-1.5 md:mb-2" style={{ color: 'var(--text-muted)' }}>
            {t('Total conversations', '總對話數')}
          </p>
          <p className="text-[22px] md:text-[28px] font-semibold tracking-[-0.5px]">{totalConversations}</p>
        </div>
        <div className="border rounded-[4px] p-4 md:p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <p className="text-[11px] md:text-[12px] font-medium uppercase tracking-[0.05em] mb-1.5 md:mb-2" style={{ color: 'var(--text-muted)' }}>
            {t('New clients this week', '本週新客戶')}
          </p>
          <p className="text-[22px] md:text-[28px] font-semibold tracking-[-0.5px]">{newClientsThisWeek}</p>
        </div>
        <div className="border rounded-[4px] p-4 md:p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <p className="text-[11px] md:text-[12px] font-medium uppercase tracking-[0.05em] mb-1.5 md:mb-2" style={{ color: 'var(--text-muted)' }}>
            {t('Bookmarked', '已加書籤')}
          </p>
          <p className="text-[22px] md:text-[28px] font-semibold tracking-[-0.5px]" style={{ color: 'var(--error)' }}>{bookmarkedCount}</p>
        </div>
        <div className="border rounded-[4px] p-4 md:p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <p className="text-[11px] md:text-[12px] font-medium uppercase tracking-[0.05em] mb-1.5 md:mb-2" style={{ color: 'var(--text-muted)' }}>
            {t('Products listed', '已上架產品')}
          </p>
          <p className="text-[22px] md:text-[28px] font-semibold tracking-[-0.5px]">{productsCount}</p>
        </div>
      </div>

      {/* Bookmarked — needs attention */}
      <div className="border rounded-[4px] mb-4" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <div className="px-4 md:px-5 py-3 md:py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--error)" stroke="var(--error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            <h2 className="text-[14px] md:text-[15px] font-semibold">{t('Bookmarked for review', '已加書籤待審核')}</h2>
            <span className="text-[11px] md:text-[12px] px-2 py-0.5 rounded font-medium" style={{ background: '#FEE8EA', color: 'var(--error)' }}>
              {bookmarkedConversations.length}
            </span>
          </div>
          <Link href="/admin/conversations" className="text-[12px] md:text-[13px] font-medium" style={{ color: 'var(--accent)' }}>
            {t('View all', '查看全部')}
          </Link>
        </div>
        <div>
          {bookmarkedConversations.length === 0 ? (
            <div className="px-4 md:px-5 py-6 text-center">
              <svg className="mx-auto mb-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
              </svg>
              <p className="text-[13px] md:text-[14px] font-medium" style={{ color: 'var(--text-muted)' }}>
                {t('No bookmarked conversations', '沒有已加書籤的對話')}
              </p>
            </div>
          ) : (
            bookmarkedConversations.map((conv) => (
              <div key={conv.id}>
                <Link
                  href="/admin/conversations"
                  className="flex items-center justify-between px-4 md:px-5 py-3 border-b last:border-b-0 relative hover:bg-[#FEFBFB]"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: 'var(--error)' }} />
                  <div className="flex items-center gap-3 ml-1 min-w-0">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-medium shrink-0" style={{ background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                      {contactName(conv).charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] md:text-[14px] font-medium truncate">{contactName(conv)}</p>
                        <span className="text-[10px] md:text-[11px] px-1.5 py-0.5 rounded shrink-0" style={{ background: '#FEE8EA', color: 'var(--error)' }}>
                          {conv.channel}
                        </span>
                      </div>
                      <p className="text-[12px] md:text-[13px] truncate" style={{ color: 'var(--text-muted)' }}>
                        {conv.last_message?.content || '—'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 flex-shrink-0 ml-2">
                    <span className="text-[11px] md:text-[12px] hidden sm:inline" style={{ color: 'var(--text-muted)' }}>{mounted ? formatTimeAgo(conv.updated_at, now) : ''}</span>
                    <span className="text-[12px] md:text-[13px] font-medium" style={{ color: 'var(--accent)' }}>{t('Review', '審核')}</span>
                  </div>
                </Link>
                {conv.handoff_summary && (
                  <div className="px-4 md:px-5 py-2 ml-4">
                    <button
                      onClick={(e) => { e.preventDefault(); toggleSummary(conv.id); }}
                      className="flex items-center gap-1.5 text-[11px] font-medium"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: expandedSummaries.has(conv.id) ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                      {t('Handoff Summary', '轉接摘要')}
                    </button>
                    {expandedSummaries.has(conv.id) && (
                      <div className="mt-1.5 p-2.5 rounded text-[11px] leading-relaxed whitespace-pre-line" style={{ background: '#FEF3C7', color: '#92400E' }}>
                        {conv.handoff_summary}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent conversations */}
      <div className="border rounded-[4px]" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <div className="px-4 md:px-5 py-3 md:py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-[14px] md:text-[15px] font-semibold">{t('Recent conversations', '最近對話')}</h2>
          <Link href="/admin/conversations" className="text-[12px] md:text-[13px] font-medium" style={{ color: 'var(--accent)' }}>
            {t('View all', '查看全部')}
          </Link>
        </div>
        {/* Desktop table */}
        <table className="hidden md:table w-full text-[14px]">
          <thead>
            <tr className="border-b text-left" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
              <th className="px-5 py-3 font-medium">{t('Contact', '聯絡人')}</th>
              <th className="px-5 py-3 font-medium">{t('Channel', '渠道')}</th>
              <th className="px-5 py-3 font-medium">{t('Last message', '最新訊息')}</th>
              <th className="px-5 py-3 font-medium">{t('Status', '狀態')}</th>
              <th className="px-5 py-3 font-medium">{t('Time', '時間')}</th>
            </tr>
          </thead>
          <tbody>
            {recentConversations.map((conv) => {
              const s = displayStatus(conv);
              return (
                <tr key={conv.id} className="border-b last:border-b-0 relative" style={{ borderColor: 'var(--border)' }}>
                  {s === 'flagged' && (
                    <td className="absolute left-0 top-0 bottom-0 w-[3px] p-0" style={{ background: 'var(--error)' }}></td>
                  )}
                  <td className="px-5 py-3 font-medium">{contactName(conv)}</td>
                  <td className="px-5 py-3" style={{ color: 'var(--text-muted)' }}>{conv.channel}</td>
                  <td className="px-5 py-3 truncate max-w-[300px]" style={{ color: 'var(--text-muted)' }}>{conv.last_message?.content || '—'}</td>
                  <td className="px-5 py-3">
                    <span
                      className="text-[11px] px-2 py-0.5 rounded font-medium"
                      style={{
                        background: s === 'flagged' ? '#FEE8EA' : s === 'human' ? '#E8F5F1' : 'var(--accent-light)',
                        color: s === 'flagged' ? 'var(--error)' : s === 'human' ? '#038153' : 'var(--accent)',
                      }}
                    >
                      {s === 'flagged' ? t('Bookmarked', '已加書籤') : s === 'human' ? 'HUMAN' : 'AI'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[13px]" style={{ color: 'var(--text-muted)' }}>{mounted ? formatTimeAgo(conv.updated_at, now) : ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Mobile list */}
        <div className="md:hidden">
          {recentConversations.map((conv) => {
            const s = displayStatus(conv);
            return (
              <div key={conv.id} className="px-4 py-3 border-b last:border-b-0 relative" style={{ borderColor: 'var(--border)' }}>
                {s === 'flagged' && (
                  <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: 'var(--error)' }} />
                )}
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[13px] font-medium truncate">{contactName(conv)}</p>
                  <span className="text-[11px] shrink-0 ml-2" style={{ color: 'var(--text-muted)' }}>{mounted ? formatTimeAgo(conv.updated_at, now) : ''}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[12px] truncate" style={{ color: 'var(--text-muted)' }}>{conv.last_message?.content || '—'}</p>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ml-2"
                    style={{
                      background: s === 'flagged' ? '#FEE8EA' : s === 'human' ? '#E8F5F1' : 'var(--accent-light)',
                      color: s === 'flagged' ? 'var(--error)' : s === 'human' ? '#038153' : 'var(--accent)',
                    }}
                  >
                    {s === 'flagged' ? t('Bookmarked', '已加書籤') : s === 'human' ? 'HUMAN' : 'AI'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
