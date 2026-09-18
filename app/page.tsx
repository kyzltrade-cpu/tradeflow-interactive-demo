'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { DemoProvider, useDemo } from '@/lib/mock-store';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  isHandoff?: boolean;
}

const HANDOFF_KEYWORDS = [
  'human', 'agent', 'talk to staff', 'speak to someone', 'real person',
  'manager', 'supervisor', '真人', '人工', '轉人', '找人', '轉接',
  'talk to a person', 'speak to a human', 'connect me', 'transfer',
  'not a bot', 'not ai', 'real person please', 'actual person',
];

function WhatsAppChat() {
  const { sendWhatsAppMessage, takeOver } = useDemo();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [handoffTriggered, setHandoffTriggered] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      setMounted(true);
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: "Hello! Welcome to Pacific Trading Co. I'm here to help with any product inquiries. What are you looking for today?",
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, isTyping]);

  const checkHandoffKeywords = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return HANDOFF_KEYWORDS.some(keyword => lowerText.includes(keyword.toLowerCase()));
  };

  const handleSend = () => {
    if (!inputValue.trim() || isTyping) return;
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    const messageText = inputValue.trim();
    setInputValue('');
    setIsTyping(true);

    if (checkHandoffKeywords(messageText) && !handoffTriggered) {
      setHandoffTriggered(true);
      setTimeout(() => {
        const handoffMsg: ChatMessage = {
          id: `handoff_${Date.now()}`,
          role: 'assistant',
          content: "I understand you'd like to speak with a human representative. I'm connecting you now. A team member will be with you shortly.",
          timestamp: new Date(),
          isHandoff: true,
        };
        setIsTyping(false);
        setMessages((prev) => [...prev, handoffMsg]);
        takeOver('c1');
      }, 1500 + Math.random() * 1000);
    } else {
      setTimeout(() => {
        const response = sendWhatsAppMessage(messageText);
        const aiMsg: ChatMessage = {
          id: `ai_${Date.now()}`,
          role: 'assistant',
          content: response,
          timestamp: new Date(),
        };
        setIsTyping(false);
        setMessages((prev) => [...prev, aiMsg]);
      }, 1500 + Math.random() * 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#ECE5DD' }}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ background: '#075E54' }}>
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-white/80 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </Link>
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-medium" style={{ background: '#25D366', color: '#fff' }}>
            PT
          </div>
          <div>
            <p className="text-[14px] font-medium text-white">Pacific Trading Co.</p>
            <p className="text-[11px] text-white/70">online</p>
          </div>
        </div>
        <Link href="/admin" className="text-[12px] font-medium px-3 py-1.5 rounded text-white/90" style={{ background: 'rgba(255,255,255,0.15)' }}>
          Open Dashboard →
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
        {!mounted ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[14px]" style={{ color: '#667781' }}>Loading...</p>
          </div>
        ) : messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="max-w-[80%] rounded-lg px-3 py-2 text-[14px] leading-[1.4] shadow-sm"
              style={{
                background: msg.isHandoff ? '#FFF3CD' : msg.role === 'user' ? '#D9FDD3' : '#FFFFFF',
                borderTopRightRadius: msg.role === 'user' ? '0' : '8px',
                borderTopLeftRadius: msg.role === 'assistant' ? '0' : '8px',
              }}
            >
              {msg.isHandoff && (
                <div className="flex items-center gap-1.5 mb-1.5 pb-1.5 border-b" style={{ borderColor: '#E0D5B0' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                  <span className="text-[11px] font-medium" style={{ color: '#92400E' }}>
                    Handoff to human agent
                  </span>
                </div>
              )}
              <p className="whitespace-pre-wrap">{msg.content}</p>
              <p className="text-[10px] mt-1 text-right" style={{ color: '#667781' }}>
                {formatTime(msg.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div
              className="rounded-lg px-4 py-3 shadow-sm"
              style={{
                background: '#FFFFFF',
                borderTopLeftRadius: '0',
              }}
            >
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#667781', animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#667781', animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full animate-bounce" style={{ background: '#667781', animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 flex items-center gap-2" style={{ background: '#F0F2F5' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 rounded-full px-4 py-2.5 text-[14px] border-0 focus:outline-none"
          style={{ background: '#FFFFFF' }}
          disabled={isTyping}
        />
        <button
          onClick={handleSend}
          disabled={!inputValue.trim() || isTyping}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
          style={{ background: '#075E54' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>

      {/* Demo banner */}
      <div className="px-4 py-2 text-center" style={{ background: '#FFF8E1' }}>
        <p className="text-[11px]" style={{ color: '#92400E' }}>
          This is a simulated WhatsApp chat. Try asking about products, prices, or say &quot;human&quot; to trigger handoff!
        </p>
      </div>
    </div>
  );
}

export default function WhatsAppPage() {
  return (
    <DemoProvider>
      <WhatsAppChat />
    </DemoProvider>
  );
}
