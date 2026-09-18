import { MOCK_FAQ_RULES, MOCK_PRODUCTS } from './mock-data';

const GREETING_RESPONSES = [
  "Hello! Welcome to Pacific Trading Co. I'm here to help with any product inquiries. What are you looking for today?",
  "Hi there! Thanks for reaching out. How can I assist you with your sourcing needs?",
  "Good day! I'm your Pacific Trading assistant. What products are you interested in?",
];

const DEFAULT_RESPONSES = [
  "That's a great question! Let me check with my team and get back to you shortly. Is there anything else I can help with in the meantime?",
  "I'd be happy to look into that for you. Our team will review and respond within the hour. Any other questions?",
  "Let me verify that with our operations team. I'll have an answer for you very soon!",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function matchesKeywords(input: string, keywords: string[]): boolean {
  const lower = input.toLowerCase();
  return keywords.some((kw) => lower.includes(kw.toLowerCase()));
}

export function generateAIResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|你好|您好)/i.test(lower)) {
    return pickRandom(GREETING_RESPONSES);
  }

  // FAQ rules (keyword matching)
  for (const rule of MOCK_FAQ_RULES) {
    if (matchesKeywords(lower, rule.keywords)) {
      return rule.answer;
    }
  }

  // Product-specific responses
  if (lower.includes('bottle') || lower.includes('304')) {
    return "Our 304 Stainless Steel Bottles (500ml) are very popular! Price: HKD $18–28/unit. MOQ: 5,000 pcs. Double-wall vacuum insulated, food-grade certified. Custom logo available. Would you like a quote?";
  }
  if (lower.includes('container') || lower.includes('316l')) {
    return "Our 316L SS Food-Grade Containers are perfect for food storage and transport. Price: HKD $35–52/unit. MOQ: 2,000 pcs. Airtight lids included. Need a specific size?";
  }
  if (lower.includes('pipe') || lower.includes('steel pipe')) {
    return "We supply both ERW and seamless carbon steel pipes. Sizes from 1/2\" to 12\". Price: USD $800–1,200/ton. API 5L certified. What size and quantity do you need?";
  }
  if (lower.includes('flange') || lower.includes('fitting')) {
    return "Our SS Flanges & Fittings come in 304, 316L, and Duplex grades. Price: USD $2.50–8.00/unit. ANSI and DIN standards available. What grade and size?";
  }
  if (lower.includes('aluminum') || lower.includes('sheet')) {
    return "Aluminum Sheets (6061-T6): USD $18–25/sqm. MOQ: 2,000 sqm. Cut-to-size available. Thicknesses from 0.5mm to 10mm. What specs do you need?";
  }
  if (lower.includes('cnc') || lower.includes('custom') || lower.includes('machined')) {
    return "Custom CNC Machined Parts: we accept DWG/STEP files. Prototype to production. Price: USD $5–50/unit depending on complexity. Want to start with a prototype?";
  }

  // Price/cost
  if (lower.includes('price') || lower.includes('cost') || lower.includes('多少錢')) {
    return "Our products range from HKD $18–52/unit for bottles and containers, and USD $2.50–1,200/ton for pipes and fittings. What specific product are you interested in?";
  }

  // MOQ
  if (lower.includes('moq') || lower.includes('minimum') || lower.includes('最小')) {
    return "Our standard MOQs: Bottles 5,000 pcs, Containers 2,000 pcs, Pipes 500 meters, Flanges 1,000 pcs, Sheets 2,000 sqm. For custom parts, MOQ is negotiable.";
  }

  // Payment
  if (lower.includes('payment') || lower.includes('pay')) {
    return "We accept T/T (30% deposit, 70% before shipment), L/C at sight, and PayPal for orders under $5,000. New customers: T/T only.";
  }

  // Shipping
  if (lower.includes('ship') || lower.includes('deliver') || lower.includes('freight')) {
    return "We offer FOB Shanghai and CIF to major ports worldwide. Sea freight: 20–35 days. Air freight: 3–5 days (higher cost). Which destination?";
  }

  // Sample
  if (lower.includes('sample') || lower.includes('trial')) {
    return "Free samples available for qualifying orders! Buyer pays freight. Sample delivery: 3–5 business days. Which product samples would you like?";
  }

  // Thank you
  if (lower.includes('thank') || lower.includes('thanks') || lower.includes('謝謝')) {
    return "You're welcome! Is there anything else I can help with?";
  }

  // Default
  return pickRandom(DEFAULT_RESPONSES);
}
