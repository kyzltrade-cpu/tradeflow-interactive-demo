import type { Conversation, Message } from './mock-data';

export function exportConversationPDF(
  conv: Conversation,
  messages: Message[],
  companyName: string
) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const contactName = conv.contact_name || conv.contact_phone || conv.contact_wechat_id || 'Unknown';

  const messageRows = messages.map((m) => {
    const time = new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const role = m.role === 'user' ? contactName : m.role === 'human' ? 'Team (manual)' : 'AI Assistant';
    const roleColor = m.role === 'user' ? '#2563EB' : m.role === 'human' ? '#038153' : '#6B7280';
    return `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #E5E7EB;vertical-align:top;width:60px;color:#6B7280;font-size:12px;">${time}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #E5E7EB;vertical-align:top;width:100px;">
          <span style="font-size:11px;font-weight:600;color:${roleColor};">${role}</span>
        </td>
        <td style="padding:8px 12px;border-bottom:1px solid #E5E7EB;vertical-align:top;font-size:13px;color:#111827;">${escapeHtml(m.content)}</td>
      </tr>`;
  }).join('');

  const handoffSection = conv.handoff_summary ? `
    <div style="margin-bottom:24px;padding:16px;background:#FEF3C7;border:1px solid #FDE68A;border-radius:6px;">
      <h3 style="margin:0 0 8px 0;font-size:14px;font-weight:700;color:#92400E;">AI Handoff Summary</h3>
      <p style="margin:0;font-size:13px;color:#78350F;white-space:pre-wrap;line-height:1.6;">${escapeHtml(conv.handoff_summary)}</p>
    </div>` : '';

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Conversation Report — ${contactName}</title>
  <style>
    @media print {
      body { margin: 0; }
      @page { margin: 20mm 15mm; }
    }
  </style>
</head>
<body style="margin:0;padding:40px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111827;background:#fff;">

  <!-- Header -->
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:16px;border-bottom:2px solid #E5E7EB;">
    <div>
      <h1 style="margin:0;font-size:22px;font-weight:700;color:#111827;">${escapeHtml(companyName)}</h1>
      <p style="margin:4px 0 0;font-size:12px;color:#6B7280;">Customer Conversation Report</p>
    </div>
    <div style="text-align:right;">
      <p style="margin:0;font-size:12px;color:#6B7280;">Generated</p>
      <p style="margin:2px 0 0;font-size:13px;font-weight:600;color:#111827;">${dateStr}</p>
    </div>
  </div>

  <!-- Contact Details -->
  <div style="margin-bottom:24px;">
    <h2 style="margin:0 0 12px;font-size:14px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:0.05em;">Contact Details</h2>
    <table style="width:100%;border-collapse:collapse;font-size:13px;">
      <tr>
        <td style="padding:8px 12px;background:#F9FAFB;border:1px solid #E5E7EB;width:140px;font-weight:600;color:#374151;">Name</td>
        <td style="padding:8px 12px;border:1px solid #E5E7EB;">${escapeHtml(contactName)}</td>
      </tr>
      <tr>
        <td style="padding:8px 12px;background:#F9FAFB;border:1px solid #E5E7EB;font-weight:600;color:#374151;">Channel</td>
        <td style="padding:8px 12px;border:1px solid #E5E7EB;">${escapeHtml(conv.channel)}</td>
      </tr>
      <tr>
        <td style="padding:8px 12px;background:#F9FAFB;border:1px solid #E5E7EB;font-weight:600;color:#374151;">Contact</td>
        <td style="padding:8px 12px;border:1px solid #E5E7EB;">${escapeHtml(conv.contact_phone || conv.contact_wechat_id || '—')}</td>
      </tr>
      <tr>
        <td style="padding:8px 12px;background:#F9FAFB;border:1px solid #E5E7EB;font-weight:600;color:#374151;">Language</td>
        <td style="padding:8px 12px;border:1px solid #E5E7EB;">${conv.detected_language === 'zh' ? 'Chinese' : 'English'}</td>
      </tr>
      <tr>
        <td style="padding:8px 12px;background:#F9FAFB;border:1px solid #E5E7EB;font-weight:600;color:#374151;">Status</td>
        <td style="padding:8px 12px;border:1px solid #E5E7EB;">
          <span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;${conv.status === 'bookmarked' ? 'background:#FEE2E2;color:#DC2626;' : conv.status === 'human' ? 'background:#D1FAE5;color:#059669;' : 'background:#DBEAFE;color:#2563EB;'}">
            ${conv.status === 'bookmarked' ? 'Bookmarked for Review' : conv.status === 'human' ? 'Human Handling' : 'AI Active'}
          </span>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 12px;background:#F9FAFB;border:1px solid #E5E7EB;font-weight:600;color:#374151;">Messages</td>
        <td style="padding:8px 12px;border:1px solid #E5E7EB;">${conv.message_count}</td>
      </tr>
    </table>
  </div>

  ${handoffSection}

  <!-- Conversation Thread -->
  <div style="margin-bottom:24px;">
    <h2 style="margin:0 0 12px;font-size:14px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:0.05em;">Conversation Thread</h2>
    <table style="width:100%;border-collapse:collapse;border:1px solid #E5E7EB;border-radius:6px;overflow:hidden;">
      <thead>
        <tr style="background:#F9FAFB;">
          <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:600;color:#6B7280;border-bottom:1px solid #E5E7EB;width:60px;">Time</th>
          <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:600;color:#6B7280;border-bottom:1px solid #E5E7EB;width:100px;">Sender</th>
          <th style="padding:8px 12px;text-align:left;font-size:11px;font-weight:600;color:#6B7280;border-bottom:1px solid #E5E7EB;">Message</th>
        </tr>
      </thead>
      <tbody>
        ${messageRows}
      </tbody>
    </table>
  </div>

  <!-- Next Steps -->
  <div style="margin-bottom:24px;padding:16px;background:#EFF6FF;border:1px solid #BFDBFE;border-radius:6px;">
    <h3 style="margin:0 0 8px;font-size:14px;font-weight:700;color:#1E40AF;">Recommended Next Steps</h3>
    <ul style="margin:0;padding-left:20px;font-size:13px;color:#1E3A5F;line-height:1.8;">
      <li>Review the conversation and respond to outstanding questions</li>
      ${conv.handoff_summary ? '<li>Address the items noted in the AI handoff summary</li>' : ''}
      <li>Follow up within 24 hours to maintain customer engagement</li>
    </ul>
  </div>

  <!-- Footer -->
  <div style="margin-top:32px;padding-top:16px;border-top:1px solid #E5E7EB;text-align:center;">
    <p style="margin:0;font-size:11px;color:#9CA3AF;">This report was generated by TradeFlow AI · ${dateStr}</p>
  </div>

</body>
</html>`;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  printWindow.document.write(html);
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
  }, 300);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}
