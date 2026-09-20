'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang, LangToggle } from '@/lib/lang';
import { DemoProvider, useDemo } from '@/lib/mock-store';

const NAV_GROUPS = [
  {
    label: 'Main',
    zhLabel: '主要',
    items: [
      { href: '/admin/work-queue', en: 'Work Queue', zh: '工作佇列', icon: 'M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z' },
      { href: '/admin', en: 'Dashboard', zh: '控制台', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      { href: '/admin/conversations', en: 'Conversations', zh: '對話', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
      { href: '/admin/inbox', en: 'Inbox', zh: '收件箱', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6' },
    ],
  },
  {
    label: 'Content',
    zhLabel: '內容',
    items: [
      { href: '/admin/products', en: 'Products', zh: '產品', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
      { href: '/admin/knowledge', en: 'Knowledge Base', zh: '知識庫', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
      { href: '/admin/faq', en: 'FAQ Rules', zh: 'FAQ 規則', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    ],
  },
  {
    label: 'Sales',
    zhLabel: '銷售',
    items: [
      { href: '/admin/quotes', en: 'Quotes', zh: '報價', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { href: '/admin/inquiries', en: 'Inquiries', zh: '詢價', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
      { href: '/admin/opportunities', en: 'Opportunities', zh: '商機', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
      { href: '/admin/suppliers', en: 'Suppliers', zh: '供應商', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    ],
  },
  {
    label: 'Operations',
    zhLabel: '營運',
    items: [
      { href: '/admin/follow-ups', en: 'Follow-ups', zh: '跟進', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
      { href: '/admin/billing', en: 'Billing', zh: '帳單', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    ],
  },
  {
    label: 'System',
    zhLabel: '系統',
    items: [
      { href: '/admin/settings', en: 'Settings', zh: '設定', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoProvider>
      <AdminShell>{children}</AdminShell>
      <ResetDemoButton />
    </DemoProvider>
  );
}

function ResetDemoButton() {
  const { resetDemo } = useDemo();
  const { t } = useLang();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-[4px] p-5 max-w-[320px] w-full shadow-lg">
            <h3 className="text-[15px] font-semibold mb-2">{t('Reset Demo?', '重設示範?')}</h3>
            <p className="text-[13px] mb-4" style={{ color: 'var(--text-muted)' }}>
              {t('This will reset all conversations, settings, and actions to the initial demo state.', '這將把所有對話、設定和操作重設到初始示範狀態。')}
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="text-[13px] font-medium px-3 py-1.5 rounded-[4px] border"
                style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
              >
                {t('Cancel', '取消')}
              </button>
              <button
                onClick={() => { resetDemo(); setShowConfirm(false); }}
                className="text-[13px] font-medium px-3 py-1.5 rounded-[4px] text-white"
                style={{ background: 'var(--error)' }}
              >
                {t('Reset', '重設')}
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setShowConfirm(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg text-[12px] font-medium transition-all hover:scale-105"
        style={{ background: 'var(--accent)', color: '#fff' }}
        title={t('Reset all demo data to initial state', '將所有示範資料重設到初始狀態')}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
        </svg>
        {t('Reset Demo', '重設示範')}
      </button>
    </>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useLang();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? 'w-[60px]' : 'w-[240px]';

  return (
    <div className="dashboard-mode min-h-screen flex" style={{ background: '#F8FAFD' }}>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 ${sidebarWidth} flex flex-col border-r transform transition-all duration-200 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
      >
        <div className="h-14 px-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--border)' }}>
          {!collapsed && (
            <Link href="/admin" className="flex items-center overflow-hidden">
              <span className="text-[16px] font-semibold tracking-[-0.5px]" style={{ color: 'var(--accent)' }}>TradeFlow</span>
              <span className="text-[10px] ml-1.5 px-1.5 py-0.5 rounded font-medium" style={{ background: '#FEF3C7', color: '#92400E' }}>DEMO</span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-md hover:bg-black/5 shrink-0"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)', transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {!collapsed && <LangToggle />}
        </div>
        <nav className="flex-1 py-3 overflow-y-auto">
          {NAV_GROUPS.map((group, gi) => (
            <div key={group.label} className={gi > 0 ? 'mt-4' : ''}>
              {!collapsed && (
                <p className="px-5 mb-1 text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  {t(group.label, group.zhLabel)}
                </p>
              )}
              {collapsed && gi > 0 && (
                <div className="mx-3 my-2 border-t" style={{ borderColor: 'var(--border)' }} />
              )}
              {group.items.map((item) => {
                const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 py-2.5 text-[14px] ${collapsed ? 'justify-center px-0' : 'px-5'}`}
                    title={collapsed ? t(item.en, item.zh) : undefined}
                    style={{
                      color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                      fontWeight: isActive ? 500 : 400,
                      background: isActive ? 'var(--accent-light)' : 'transparent',
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                      <path d={item.icon} />
                    </svg>
                    {!collapsed && t(item.en, item.zh)}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className={`border-t ${collapsed ? 'px-2 py-3' : 'px-3 py-3'}`} style={{ borderColor: 'var(--border)' }}>
          {!collapsed ? (
            <div className="border rounded-[4px] p-3" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-medium shrink-0" style={{ background: 'var(--accent)', color: '#fff' }}>D</div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium truncate">demo@tradeflow.ai</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Interactive Demo</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </aside>

      <main className="flex-1 min-w-0" style={{ background: 'var(--bg)' }}>
        <div className="h-14 border-b px-4 md:px-6 flex items-center gap-3" style={{ borderColor: 'var(--border)' }}>
          <button
            className="md:hidden p-1.5 -ml-1 rounded-md hover:bg-black/5"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>
            {t('Admin', '管理後台')}
          </p>
        </div>
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
