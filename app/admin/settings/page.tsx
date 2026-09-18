'use client';

import { useState } from 'react';
import { useLang } from '@/lib/lang';
import { useDemo } from '@/lib/mock-store';

export default function SettingsPage() {
  const { t } = useLang();
  const { settings, companyName, updateSettings } = useDemo();
  const [systemPrompt, setSystemPrompt] = useState(settings.system_prompt);
  const [responseDelay, setResponseDelay] = useState(settings.response_delay_seconds);
  const [chatWidgetEnabled, setChatWidgetEnabled] = useState(settings.chat_widget_enabled);
  const [imageResponsePrompt, setImageResponsePrompt] = useState(
    'Thanks for sending the image! To help me find the right product, could you please provide:\n1. Model number or product name\n2. Material (e.g., stainless steel, carbon steel)\n3. Size or dimensions\n4. Quantity needed'
  );
  const [saved, setSaved] = useState(false);
  const [whatsappConnected, setWhatsappConnected] = useState(true);

  const handleSave = () => {
    updateSettings({
      system_prompt: systemPrompt,
      response_delay_seconds: responseDelay,
      chat_widget_enabled: chatWidgetEnabled,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <div>
          <h1 className="text-[20px] md:text-[24px] font-semibold tracking-[-0.5px]">{t('Settings', '設定')}</h1>
          <p className="text-[13px] md:text-[14px] mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('Configure your AI assistant', '配置您的 AI 助手')}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Company Info */}
        <section className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <h2 className="text-[15px] font-semibold mb-1">{t('Company', '公司')}</h2>
          <p className="text-[13px] mb-4" style={{ color: 'var(--text-muted)' }}>
            {t('Your company information', '您的公司資訊')}
          </p>
          <div>
            <label className="text-[12px] font-medium block mb-1.5" style={{ color: 'var(--text-muted)' }}>{t('Company Name', '公司名稱')}</label>
            <input
              type="text"
              value={companyName}
              disabled
              className="w-full border rounded-[4px] px-3 py-2 text-[13px] bg-gray-50"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>
        </section>

        {/* WhatsApp Connect */}
        <section className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-semibold">{t('WhatsApp Connection', 'WhatsApp 連接')}</h2>
              <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {t('Connect your WhatsApp Business account', '連接您的 WhatsApp Business 帳號')}
              </p>
            </div>
            {whatsappConnected ? (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                {t('Connected', '已連接')}
              </span>
            ) : (
              <button
                onClick={() => setWhatsappConnected(true)}
                className="text-[13px] font-medium px-4 py-2 rounded-[4px] text-white"
                style={{ background: 'var(--accent)' }}
              >
                {t('Connect', '連接')}
              </button>
            )}
          </div>
          {whatsappConnected && (
            <div className="mt-3 p-3 rounded-[4px]" style={{ background: 'var(--bg)' }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#25D366' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] font-medium">+852 6001 2345</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    {t('WhatsApp Business API', 'WhatsApp Business API')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* System Prompt */}
        <section className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <h2 className="text-[15px] font-semibold mb-1">{t('System Prompt', '系統提示')}</h2>
          <p className="text-[13px] mb-4" style={{ color: 'var(--text-muted)' }}>
            {t('Customize how your AI assistant behaves and responds', '自訂 AI 助手的行為和回覆方式')}
          </p>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="w-full border rounded-[4px] px-3 py-2 text-[13px] font-mono h-32 focus:outline-none"
            style={{ borderColor: 'var(--border)' }}
          />
          <p className="text-[12px] mt-2" style={{ color: 'var(--text-muted)' }}>
            {t('This defines the AI personality, tone, and knowledge boundaries', '這定義了 AI 的個性、語氣和知識範圍')}
          </p>
        </section>

        {/* Chat Widget Toggle */}
        <section className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-semibold">{t('Website Chat Widget', '網站聊天元件')}</h2>
              <p className="text-[13px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {t('Show or hide the AI chat button on your website', '在您的網站上顯示或隱藏 AI 聊天按鈕')}
              </p>
            </div>
            <button
              onClick={() => setChatWidgetEnabled(!chatWidgetEnabled)}
              className="relative w-11 h-6 rounded-full transition-colors shrink-0"
              style={{ background: chatWidgetEnabled ? 'var(--accent)' : 'var(--border)' }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
                style={{ left: chatWidgetEnabled ? '22px' : '2px' }}
              />
            </button>
          </div>
          <p className="text-[12px] mt-2" style={{ color: 'var(--text-muted)' }}>
            {chatWidgetEnabled
              ? t('Chat widget is active — visitors can message your AI', '聊天元件已啟用——訪客可以向您的 AI 發送訊息')
              : t('Chat widget is hidden — visitors cannot see the chat button', '聊天元件已隱藏——訪客看不到聊天按鈕')}
          </p>
        </section>

        {/* Response Delay */}
        <section className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <h2 className="text-[15px] font-semibold mb-1">{t('Response Delay', '回覆延遲')}</h2>
          <p className="text-[13px] mb-4" style={{ color: 'var(--text-muted)' }}>
            {t('Simulate human typing by delaying AI responses', '透過延遲 AI 回覆來模擬人手打字')}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="range"
                min="0"
                max="120"
                step="1"
                value={responseDelay}
                onChange={(e) => setResponseDelay(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="w-[80px] text-center">
              <span className="text-[20px] font-semibold">{responseDelay}</span>
              <span className="text-[13px] ml-1" style={{ color: 'var(--text-muted)' }}>
                {t('sec', '秒')}
              </span>
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {t('Instant (0s)', '即時 (0s)')}
            </span>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {t('2 minutes', '2 分鐘')}
            </span>
          </div>
          <p className="text-[12px] mt-3" style={{ color: 'var(--text-muted)' }}>
            {responseDelay === 0
              ? t('AI replies instantly — may feel robotic', 'AI 即時回覆 — 可能感覺機械化')
              : responseDelay <= 3
              ? t('Quick reply — feels like a fast typer', '快速回覆 — 感覺像打字快的人')
              : responseDelay <= 8
              ? t('Natural pace — feels like a real person', '自然節奏 — 感覺像真人')
              : responseDelay <= 30
              ? t('Slow reply — thoughtful pace', '慢速回覆 — 深思熟慮的節奏')
              : t('Very slow — may frustrate customers', '非常慢 — 可能令客戶不耐煩')}
          </p>
        </section>

        {/* Image Detection Auto-Response */}
        <section className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <h2 className="text-[15px] font-semibold mb-1">{t('Image Detection Auto-Response', '圖片偵測自動回覆')}</h2>
          <p className="text-[13px] mb-4" style={{ color: 'var(--text-muted)' }}>
            {t('When a buyer sends an image, AI will automatically reply with a customizable message to gather more details', '當買家發送圖片時，AI 會自動回覆可自訂的訊息以收集更多細節')}
          </p>
          <textarea
            value={imageResponsePrompt}
            onChange={(e) => setImageResponsePrompt(e.target.value)}
            className="w-full border rounded-[4px] px-3 py-2 text-[13px] h-24 focus:outline-none"
            style={{ borderColor: 'var(--border)' }}
          />
          <p className="text-[12px] mt-2" style={{ color: 'var(--text-muted)' }}>
            {t('Customize the message AI sends when it detects an image. Ask for model number, material, size, or other specs to search your catalog.', '自訂 AI 偵測到圖片時發送的訊息。要求提供型號、材料、尺寸或其他規格以搜尋您的產品目錄。')}
          </p>
        </section>

        {/* Setup Service */}
        <section className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-[15px] font-semibold">{t('Done-for-you Setup', '代客設定')}</h2>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              +HK$1,000
            </span>
          </div>
          <p className="text-[13px] mb-3" style={{ color: 'var(--text-muted)' }}>
            {t('Let our team set up TradeFlow for you. We\'ll connect WhatsApp, upload your products, and configure the AI. This is a one-time fee on top of your subscription plan.', '讓我們的團隊為您設定 TradeFlow。我們會連接 WhatsApp、上傳產品並配置 AI。此為訂閱方案外的一次性費用。')}
          </p>
          <div className="flex items-center justify-between p-3 rounded-[4px]" style={{ background: 'var(--bg)' }}>
            <div>
              <p className="text-[13px] font-medium">{t('WhatsApp connection + Product upload + AI config', 'WhatsApp 連接 + 產品上傳 + AI 配置')}</p>
            </div>
            <span className="text-[18px] font-semibold">HK$1,000</span>
          </div>
          <p className="text-[12px] mt-3" style={{ color: 'var(--text-muted)' }}>
            {t('Contact us: tradeflow.hk@gmail.com', '聯繫我們：tradeflow.hk@gmail.com')}
          </p>
        </section>

        {/* Billing */}
        <section className="border rounded-[4px] p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <h2 className="text-[15px] font-semibold mb-2">{t('Billing', '帳單')}</h2>
          <p className="text-[13px] mb-3" style={{ color: 'var(--text-muted)' }}>
            {t('Manage your subscription, view plans, and update payment.', '管理您的訂閱、查看方案及更新付款。')}
          </p>
          <div className="flex items-center justify-between p-3 rounded-[4px] mb-3" style={{ background: 'var(--bg)' }}>
            <div>
              <p className="text-[12px] uppercase tracking-[0.05em] font-medium" style={{ color: 'var(--text-muted)' }}>
                {t('Current plan', '目前方案')}
              </p>
              <p className="text-[15px] font-semibold mt-0.5">Starter SDR · HK$880/mo</p>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
              {t('Active', '啟用中')}
            </span>
          </div>
          <button
            className="inline-flex items-center gap-1 text-[13px] font-medium px-4 py-2 rounded-[4px] text-white"
            style={{ background: 'var(--accent)' }}
          >
            {t('Go to billing', '前往帳單')}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </section>

        {/* Save button */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={handleSave}
            className="text-[14px] font-medium px-6 py-2 rounded-[4px] text-white"
            style={{ background: saved ? '#22c55e' : 'var(--accent)' }}
          >
            {saved ? t('Saved', '已儲存') : t('Save changes', '儲存變更')}
          </button>
        </div>

        {/* Demo note */}
        <div className="border rounded-[4px] p-4" style={{ borderColor: '#FDE68A', background: '#FFFBEB' }}>
          <div className="flex items-start gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <div>
              <p className="text-[12px] font-semibold" style={{ color: '#92400E' }}>{t('Demo Mode', '示範模式')}</p>
              <p className="text-[12px] mt-0.5" style={{ color: '#78350F' }}>
                {t('Settings are saved locally and reset when you refresh the page.', '設定儲存在本地，重新整理頁面後會重設。')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
