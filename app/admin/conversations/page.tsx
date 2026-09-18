'use client';

import { useState, useRef, useEffect } from 'react';
import { useLang } from '@/lib/lang';
import { useDemo, type Conversation } from '@/lib/mock-store';
import { exportConversationPDF } from '@/lib/export-pdf';

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

function formatMessageTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function contactName(conv: Conversation) {
  return conv.contact_name || conv.contact_phone || conv.contact_wechat_id || 'Unknown';
}

function displayStatus(conv: Conversation): 'ai' | 'human' | 'flagged' | 'ai_paused' {
  if (conv.status === 'bookmarked') return 'flagged';
  if (conv.status === 'human') return 'human';
  if (conv.status === 'ai_paused') return 'ai_paused';
  return 'ai';
}

export default function ConversationsPage() {
  const { t } = useLang();
  const { conversations, messages, takeOver, releaseToAI, bookmark, stopAI, resumeAI, sendHumanMessage, companyName } = useDemo();
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<'all' | 'ai' | 'human' | 'flagged'>('all');
  const [showChat, setShowChat] = useState(false);
  const [sending, setSending] = useState(false);
  const [expandedSummaries, setExpandedSummaries] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNow(Date.now());
    setMounted(true);
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const filtered = conversations.filter((c) => {
    if (filter === 'all') return true;
    if (filter === 'flagged') return c.status === 'bookmarked';
    if (filter === 'human') return c.status === 'human';
    if (filter === 'ai') return c.status === 'ai' || c.status === 'ai_paused';
    return true;
  });

  const selectedMessages = selected ? messages[selected.id] || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedMessages.length]);

  const selectConversation = (conv: Conversation) => {
    setSelected(conv);
    setShowChat(true);
  };

  const toggleSummary = (id: string) => {
    setExpandedSummaries((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSendMessage = () => {
    if (!selected || !inputValue.trim() || sending) return;
    setSending(true);
    const content = inputValue.trim();
    setInputValue('');

    setTimeout(() => {
      sendHumanMessage(selected.id, content);
      setSelected((prev) => prev ? { ...conversations.find((c) => c.id === prev.id) || prev } : null);
      setSending(false);
    }, 300);
  };

  const handleTakeover = (id: string) => {
    takeOver(id);
    setSelected((prev) => prev?.id === id ? { ...prev, status: 'human' } : prev);
  };

  const handleReleaseToAI = (id: string) => {
    releaseToAI(id);
    setSelected((prev) => prev?.id === id ? { ...prev, status: 'ai' } : prev);
  };

  const handleBookmark = (id: string) => {
    bookmark(id);
    setSelected((prev) => prev?.id === id ? { ...prev, status: 'bookmarked' } : prev);
  };

  const handleStopAI = (id: string) => {
    stopAI(id);
    setSelected((prev) => prev?.id === id ? { ...prev, status: 'ai_paused' } : prev);
  };

  const handleResumeAI = (id: string) => {
    resumeAI(id);
    setSelected((prev) => prev?.id === id ? { ...prev, status: 'ai' } : prev);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-[20px] md:text-[24px] font-semibold tracking-[-0.5px]">{t('Conversations', '對話')}</h1>
          <p className="text-[13px] md:text-[14px] mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('View and manage customer conversations', '查看和管理客戶對話')}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-0 border rounded-[4px] overflow-hidden" style={{ borderColor: 'var(--border)', background: 'var(--surface)', height: 'calc(100vh - 200px)' }}>
        {/* Conversation list */}
        <div className={`${showChat ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-[340px] border-r`} style={{ borderColor: 'var(--border)' }}>
          {/* Filter tabs */}
          <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
            {(['all', 'flagged', 'human', 'ai'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="flex-1 py-2.5 text-[11px] md:text-[12px] font-medium border-b-2 transition-colors"
                style={{
                  borderColor: filter === f ? 'var(--accent)' : 'transparent',
                  color: filter === f ? 'var(--accent)' : 'var(--text-muted)',
                }}
              >
                {f === 'all' ? t('All', '全部') : f === 'flagged' ? t('Flagged', '已加書籤') : f === 'human' ? t('Human', '人手') : 'AI'}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-[13px] md:text-[14px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  {t('No conversations', '暫無對話')}
                </p>
              </div>
            ) : (
              filtered.map((conv) => {
                const s = displayStatus(conv);
                const isFlagged = s === 'flagged';
                const isHuman = s === 'human';
                const isExpanded = expandedSummaries.has(conv.id);
                return (
                  <div key={conv.id}>
                    <button
                      onClick={() => selectConversation(conv)}
                      className="w-full text-left px-4 py-3 border-b text-[13px] md:text-[14px] relative"
                      style={{
                        borderColor: 'var(--border)',
                        background: selected?.id === conv.id ? 'var(--accent-light)' : 'transparent',
                      }}
                    >
                      {isFlagged && (
                        <div className="absolute left-0 top-0 bottom-0 w-[3px]" style={{ background: 'var(--error)' }} />
                      )}
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium truncate">{contactName(conv)}</span>
                        <span className="text-[10px] md:text-[11px] flex-shrink-0 ml-2" style={{ color: 'var(--text-muted)' }}>{mounted ? formatTimeAgo(conv.updated_at, now) : ''}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isHuman && (
                          <span className="text-[9px] md:text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0" style={{ background: '#E8F5F1', color: '#038153' }}>
                            HUMAN
                          </span>
                        )}
                        {!isHuman && !isFlagged && (
                          <span className="text-[9px] md:text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                            AI
                          </span>
                        )}
                        {conv.detected_language && (
                          <span className="text-[9px] md:text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0" style={{ background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                            {conv.detected_language === 'zh' ? '中文' : 'EN'}
                          </span>
                        )}
                        <span className="text-[11px] md:text-[12px] truncate" style={{ color: 'var(--text-muted)' }}>{conv.last_message?.content || '—'}</span>
                      </div>
                    </button>
                    {/* Handoff summary dropdown */}
                    {conv.handoff_summary && (isHuman || isFlagged) && (
                      <div className="border-b" style={{ borderColor: 'var(--border)' }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleSummary(conv.id); }}
                          className="w-full text-left px-4 py-2 flex items-center gap-2 text-[11px] md:text-[12px]"
                          style={{ color: 'var(--text-muted)', background: 'var(--bg)' }}
                        >
                          <svg
                            width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }}
                          >
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                          <span className="font-medium">{t('Handoff Summary', '交接摘要')}</span>
                        </button>
                        {isExpanded && (
                          <div className="px-4 pb-3 text-[12px] md:text-[13px] leading-[1.5]" style={{ color: 'var(--text)' }}>
                            <p className="whitespace-pre-wrap">{conv.handoff_summary}</p>
                            {conv.last_message && (
                              <p className="mt-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>
                                {t('Last message:', '最後訊息:')} {conv.last_message.content}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className={`${showChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col min-w-0`}>
          {/* Chat header */}
          <div className="px-3 md:px-5 py-3 border-b flex items-center justify-between flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <button
                onClick={() => setShowChat(false)}
                className="md:hidden p-1 -ml-1 rounded hover:bg-black/5"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              {selected && (
                <>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-medium text-white flex-shrink-0"
                    style={{ background: displayStatus(selected) === 'flagged' ? 'var(--error)' : displayStatus(selected) === 'human' ? '#038153' : 'var(--accent)' }}
                  >
                    {contactName(selected).charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] md:text-[14px] font-medium truncate">{contactName(selected)}</p>
                    <p className="text-[11px] md:text-[12px]" style={{ color: 'var(--text-muted)' }}>{selected.channel}</p>
                  </div>
                </>
              )}
            </div>
            {selected && (
              <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
                {displayStatus(selected) === 'ai' && (
                  <>
                    <button
                      onClick={() => handleStopAI(selected.id)}
                      className="text-[11px] md:text-[12px] font-medium px-2 md:px-3 py-1.5 rounded-[4px] border flex items-center gap-1.5"
                      style={{ borderColor: '#F59E0B', color: '#F59E0B' }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
                      </svg>
                      <span className="hidden sm:inline">{t('Stop AI', '暫停 AI')}</span>
                    </button>
                    <button
                      onClick={() => handleBookmark(selected.id)}
                      className="text-[11px] md:text-[12px] font-medium px-2 md:px-3 py-1.5 rounded-[4px] border flex items-center gap-1.5"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                      </svg>
                      <span className="hidden sm:inline">{t('Bookmark', '加書籤')}</span>
                    </button>
                    <button
                      onClick={() => exportConversationPDF(selected, selectedMessages, companyName)}
                      className="text-[11px] md:text-[12px] font-medium px-2 md:px-3 py-1.5 rounded-[4px] border flex items-center gap-1.5"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                      </svg>
                      <span className="hidden sm:inline">{t('Export PDF', '匯出 PDF')}</span>
                    </button>
                    <button
                      onClick={() => handleTakeover(selected.id)}
                      className="text-[11px] md:text-[12px] font-medium px-2 md:px-3 py-1.5 rounded-[4px] text-white"
                      style={{ background: '#038153' }}
                    >
                      {t('Take over', '接管')}
                    </button>
                  </>
                )}
                {displayStatus(selected) === 'ai_paused' && (
                  <>
                    <button
                      onClick={() => handleResumeAI(selected.id)}
                      className="text-[11px] md:text-[12px] font-medium px-2 md:px-3 py-1.5 rounded-[4px] flex items-center gap-1.5"
                      style={{ background: '#FEF3C7', color: '#D97706' }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                      </svg>
                      <span className="hidden sm:inline">{t('Resume AI', '恢復 AI')}</span>
                    </button>
                    <button
                      onClick={() => handleTakeover(selected.id)}
                      className="text-[11px] md:text-[12px] font-medium px-2 md:px-3 py-1.5 rounded-[4px] text-white"
                      style={{ background: '#038153' }}
                    >
                      {t('Take over', '接管')}
                    </button>
                  </>
                )}
                {displayStatus(selected) === 'human' && (
                  <button
                    onClick={() => handleReleaseToAI(selected.id)}
                    className="text-[11px] md:text-[12px] font-medium px-2 md:px-3 py-1.5 rounded-[4px] border"
                    style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                  >
                    {t('Release to AI', '交還 AI')}
                  </button>
                )}
                {displayStatus(selected) === 'flagged' && (
                  <>
                    <button
                      onClick={() => handleBookmark(selected.id)}
                      className="text-[11px] md:text-[12px] font-medium px-2 md:px-3 py-1.5 rounded-[4px] flex items-center gap-1.5"
                      style={{ background: '#FEE8EA', color: 'var(--error)' }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--error)" stroke="var(--error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                      </svg>
                      <span className="hidden sm:inline">{t('Bookmarked', '已加書籤')}</span>
                    </button>
                    <button
                      onClick={() => exportConversationPDF(selected, selectedMessages, companyName)}
                      className="text-[11px] md:text-[12px] font-medium px-2 md:px-3 py-1.5 rounded-[4px] border flex items-center gap-1.5"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                      </svg>
                      <span className="hidden sm:inline">{t('Export PDF', '匯出 PDF')}</span>
                    </button>
                    <button
                      onClick={() => handleTakeover(selected.id)}
                      className="text-[11px] md:text-[12px] font-medium px-2 md:px-3 py-1.5 rounded-[4px] text-white"
                      style={{ background: '#038153' }}
                    >
                      {t('Take over', '接管')}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 md:p-5 space-y-3" style={{ background: 'var(--bg)' }}>
            {/* Handoff summary banner */}
            {selected?.handoff_summary && (
              <div className="rounded-[4px] px-4 py-3 border" style={{ background: '#FEF3C7', borderColor: '#FDE68A' }}>
                <div className="flex items-start gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <div>
                    <p className="text-[11px] md:text-[12px] font-semibold mb-1" style={{ color: '#92400E' }}>
                      {t('AI Handoff Summary', 'AI 交接摘要')}
                    </p>
                    <p className="text-[12px] md:text-[13px] whitespace-pre-wrap" style={{ color: '#78350F' }}>
                      {selected.handoff_summary}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {!selected ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-[14px]" style={{ color: 'var(--text-muted)' }}>
                  {t('Select a conversation to start', '選擇一個對話')}
                </p>
              </div>
            ) : selectedMessages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <svg className="mx-auto mb-2" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                  <p className="text-[14px]" style={{ color: 'var(--text-muted)' }}>
                    {t('No messages yet', '暫無訊息')}
                  </p>
                </div>
              </div>
            ) : (
              selectedMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="max-w-[85%] md:max-w-[65%] rounded-[4px] px-3 md:px-4 py-2.5 md:py-3 text-[13px] md:text-[14px] leading-[1.5]"
                    style={{
                      background: msg.role === 'user'
                        ? 'var(--accent-light)'
                        : msg.role === 'human' ? '#E8F5F1' : 'var(--surface)',
                      border: `1px solid ${
                        msg.role === 'human' ? '#038153'
                        : msg.role === 'assistant' ? 'var(--border)'
                        : 'transparent'
                      }`,
                    }}
                  >
                    {msg.role === 'human' && (
                      <p className="text-[10px] md:text-[11px] font-medium mb-1" style={{ color: '#038153' }}>{t('You (human)', '您（人手）')}</p>
                    )}
                    {msg.role === 'assistant' && (
                      <p className="text-[10px] md:text-[11px] font-medium mb-1" style={{ color: 'var(--accent)' }}>{t('AI', 'AI')}</p>
                    )}
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <p className="text-[10px] md:text-[11px] mt-2" style={{ color: 'var(--text-muted)' }}>{formatMessageTime(msg.created_at)}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* AI disclosure */}
          <div className="px-3 md:px-5 py-2 text-center flex-shrink-0 border-t" style={{ borderColor: 'var(--border)' }}>
            <p className="text-[11px] md:text-[12px]" style={{ color: 'var(--text-muted)' }}>
              {t('AI assistant — Customer sees this as a human rep', 'AI 助手 — 客戶看到的是人手代表')}
            </p>
          </div>

          {/* Input area */}
          <div className="px-3 md:px-5 py-3 md:py-4 border-t flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
            {selected && displayStatus(selected) === 'human' ? (
              <div>
                <div className="flex gap-2 mb-2">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={t('Type your reply...', '輸入回覆...')}
                    rows={2}
                    className="flex-1 border rounded-[4px] px-3 py-2.5 text-[16px] focus:outline-none resize-none"
                    style={{ borderColor: 'var(--border)' }}
                    disabled={sending}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={sending || !inputValue.trim()}
                    className="text-[12px] md:text-[13px] font-medium px-4 md:px-5 rounded-[4px] text-white self-end disabled:opacity-50"
                    style={{ background: '#038153' }}
                  >
                    {sending ? t('Sending...', '發送中...') : t('Send', '發送')}
                  </button>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] md:text-[12px]" style={{ color: 'var(--text-muted)' }}>
                    {t("You're replying as a human.", '您正在以人手身份回覆。')}
                  </p>
                  <button
                    onClick={() => handleReleaseToAI(selected.id)}
                    className="text-[11px] md:text-[12px] font-medium px-3 py-1.5 rounded-[4px] border shrink-0"
                    style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                  >
                    {t('Release to AI', '交還 AI')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 py-2.5 px-3 rounded-[4px]" style={{ background: 'var(--bg)' }}>
                <span className="text-[12px] md:text-[13px]" style={{ color: 'var(--text-muted)' }}>
                  {!selected
                    ? ''
                    : displayStatus(selected) === 'ai'
                      ? t('AI is handling this conversation', 'AI 正在處理此對話')
                      : displayStatus(selected) === 'ai_paused'
                        ? t('AI is paused — new messages will not get AI replies', 'AI 已暫停——新訊息不會收到 AI 回覆')
                        : t('Conversation bookmarked — take over to reply', '對話已加書籤——接管後可回覆')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
