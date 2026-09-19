"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/lang";
import { MOCK_EMAILS } from "@/lib/mock-data";

const channelConfig: Record<string, { bg: string; color: string; label: string }> = {
  email: { bg: "#DBEAFE", color: "#2563EB", label: "Email" },
  whatsapp: { bg: "#D1FAE5", color: "#059669", label: "WhatsApp" },
  wechat: { bg: "#D1FAE5", color: "#059669", label: "WeChat" },
};

export default function InboxPage() {
  const { t } = useLang();
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_EMAILS[0]?.id || null);
  const [filter, setFilter] = useState<"all" | "unread" | "inquiries" | "suppliers">("all");

  const emails = MOCK_EMAILS.filter((email) => {
    if (filter === "unread") return !email.read;
    if (filter === "inquiries") return !!email.inquiryId;
    if (filter === "suppliers") return email.subject.includes("RFQ") || email.from.includes("Steel") || email.from.includes("Metal") || email.from.includes("Drinkware");
    return true;
  });

  const selected = MOCK_EMAILS.find((e) => e.id === selectedId);
  const unreadCount = MOCK_EMAILS.filter((e) => !e.read).length;

  const filters = [
    { key: "all" as const, label: "All" },
    { key: "unread" as const, label: `Unread (${unreadCount})` },
    { key: "inquiries" as const, label: "Inquiries" },
    { key: "suppliers" as const, label: "Suppliers" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[20px] md:text-[24px] font-semibold tracking-[-0.5px]">
            {t("Inbox", "收件箱")}
          </h1>
          <p className="text-[13px] mt-1" style={{ color: "var(--text-muted)" }}>
            {unreadCount} unread {unreadCount === 1 ? "message" : "messages"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="px-3 py-1.5 rounded-[4px] text-[12px] font-medium transition-colors"
              style={{
                background: filter === f.key ? "var(--accent)" : "var(--surface)",
                color: filter === f.key ? "white" : "var(--text-muted)",
                border: `1px solid ${filter === f.key ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-0 border rounded-[4px] overflow-hidden" style={{ borderColor: "var(--border)", background: "var(--surface)", height: "calc(100vh - 220px)" }}>
        <div className="w-80 flex-shrink-0 border-r overflow-y-auto" style={{ borderColor: "var(--border)" }}>
          {emails.map((email) => {
            const ch = channelConfig[email.channel] || channelConfig.email;
            return (
              <button
                key={email.id}
                onClick={() => setSelectedId(email.id)}
                className="w-full text-left p-3 border-b transition-colors"
                style={{
                  borderColor: "var(--border)",
                  background: selectedId === email.id ? "var(--background)" : "transparent",
                }}
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: ch.bg }}>
                    <span className="text-[11px] font-bold" style={{ color: ch.color }}>{ch.label[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-medium truncate" style={{ color: !email.read ? "var(--foreground)" : "var(--text-muted)", fontWeight: !email.read ? 600 : 400 }}>
                        {email.from}
                      </span>
                      {!email.read && (
                        <span className="w-2 h-2 rounded-full flex-shrink-0 ml-2" style={{ background: "var(--accent)" }} />
                      )}
                    </div>
                    <p className="text-[12px] truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {email.subject}
                    </p>
                    <p className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
                      {new Date(email.receivedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto">
          {selected ? (
            <div>
              <div className="p-5 border-b" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-[16px] font-semibold">{selected.subject}</h2>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-[12px]" style={{ color: "var(--text-muted)" }}>
                      <span>From: {selected.from} &lt;{selected.fromEmail}&gt;</span>
                      <span>To: {selected.to}</span>
                    </div>
                    <p className="text-[12px] mt-1" style={{ color: "var(--text-muted)" }}>
                      {new Date(selected.receivedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {selected.inquiryId && (
                      <Link
                        href={`/admin/inquiries/inq1`}
                        className="px-3 py-1.5 rounded-[4px] text-[12px] font-medium transition-colors"
                        style={{ background: "var(--accent)", color: "white" }}
                      >
                        View Inquiry
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="whitespace-pre-wrap text-[13px] leading-relaxed" style={{ color: "var(--foreground)" }}>
                  {selected.body}
                </div>
                {selected.attachments && selected.attachments.length > 0 && (
                  <div className="mt-6 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                    <p className="text-[12px] font-semibold mb-2" style={{ color: "var(--text-muted)" }}>Attachments</p>
                    <div className="flex flex-wrap gap-2">
                      {selected.attachments.map((file) => (
                        <div key={file} className="flex items-center gap-2 px-3 py-2 rounded-[4px] text-[12px]" style={{ background: "var(--background)", border: "1px solid var(--border)" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          {file}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-[14px]" style={{ color: "var(--text-muted)" }}>
                {t("Select a message to read", "選擇要讀取的訊息")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
