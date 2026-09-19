export interface Product {
  id: string;
  name: string;
  description: string;
  moq: string;
  price_range: string;
  category: string;
  photos?: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'human';
  content: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  contact_name: string | null;
  contact_phone: string | null;
  contact_wechat_id: string | null;
  channel: string;
  status: string;
  detected_language: string | null;
  handoff_summary: string | null;
  updated_at: string;
  last_message: { content: string; role: string; created_at: string } | null;
  message_count: number;
}

export interface FaqRule {
  id: string;
  question_pattern: string;
  keywords: string[];
  answer: string;
  priority: number;
}

export interface CompanySettings {
  system_prompt: string;
  response_delay_seconds: number;
  chat_widget_enabled: boolean;
}

// === Golden Path Types ===

export interface ExtractedField {
  field: string;
  value: string | null;
  status: 'extracted' | 'confirmed' | 'missing' | 'estimated';
}

export interface Inquiry {
  id: string;
  displayId: string;
  customer: string;
  company: string;
  channel: string;
  receivedAt: string;
  status: 'received' | 'reviewing' | 'extracting' | 'quoted' | 'converted' | 'closed';
  originalMessage: string;
  attachments: string[];
  extractedFields: ExtractedField[];
  missingFields: string[];
  clarificationDraft: string | null;
  conversationId: string;
  opportunityId: string | null;
  quoteId: string | null;
}

export interface Supplier {
  id: string;
  name: string;
  location: string;
  specialty: string;
  rating: number;
  certifications: string[];
  contact: string;
  email: string;
  verified: boolean;
}

export interface SupplierResponse {
  id: string;
  supplierId: string;
  rfqId: string;
  price: number;
  currency: string;
  moq: number;
  leadTime: number;
  leadTimeUnit: string;
  certifications: string[];
  validUntil: string;
  packaging: string;
  notes: string;
  receivedAt: string;
  status: 'pending' | 'received' | 'selected' | 'rejected';
}

export interface Rfq {
  id: string;
  displayId: string;
  inquiryId: string;
  suppliers: string[];
  sentAt: string;
  deadline: string;
  status: 'draft' | 'sent' | 'partially_received' | 'received' | 'closed';
  responses: SupplierResponse[];
}

export interface CostLine {
  label: string;
  amount: number;
  notes?: string;
}

export interface Quote {
  id: string;
  displayId: string;
  inquiryId: string;
  opportunityId: string;
  rfqId: string;
  customer: string;
  company: string;
  product: string;
  quantity: string;
  currency: string;
  costBreakdown: CostLine[];
  totalCost: number;
  marginPercent: number;
  customerPrice: number;
  status: 'draft' | 'pending_approval' | 'approved' | 'sent' | 'accepted' | 'rejected' | 'negotiating';
  createdAt: string;
  sentAt: string | null;
  approvedAt: string | null;
  validUntil: string;
  notes: string;
  supplierId: string;
  assumptions: string[];
  auditTrail: AuditEntry[];
}

export interface AuditEntry {
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

export interface FollowUp {
  id: string;
  quoteId: string;
  scheduledFor: string;
  status: 'pending' | 'sent' | 'completed' | 'paused';
  type: 'initial' | 'follow_up_1' | 'follow_up_2' | 'final';
  message: string;
}

export interface Opportunity {
  id: string;
  displayId: string;
  inquiryId: string;
  company: string;
  contact: string;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  priority: 'low' | 'medium' | 'high';
  estimatedValue: number;
  currency: string;
  nextAction: string;
  missingInformation: string[];
  owner: string;
  createdAt: string;
  quoteId: string | null;
}

function minutesAgo(mins: number): string {
  return new Date(Date.now() - mins * 60000).toISOString();
}

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 86400000).toISOString();
}

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 86400000).toISOString();
}

// === Mock Products ===

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: '304 Stainless Steel Bottles (500ml)',
    description: 'Food-grade 304 SS water bottles, double-wall vacuum insulated. Custom logo printing available.',
    moq: '5,000 pcs',
    price_range: 'HKD $18–28/unit',
    category: 'Bottles',
  },
  {
    id: 'p2',
    name: '316L SS Food-Grade Containers',
    description: 'Premium 316L stainless steel containers for food storage and transport. Airtight lids.',
    moq: '2,000 pcs',
    price_range: 'HKD $35–52/unit',
    category: 'Containers',
  },
  {
    id: 'p3',
    name: 'Carbon Steel Pipes',
    description: 'ERW and seamless carbon steel pipes, various sizes (1/2" to 12"). API 5L certified.',
    moq: '500 meters',
    price_range: 'USD $800–1,200/ton',
    category: 'Pipes',
  },
  {
    id: 'p4',
    name: 'SS Flanges & Fittings',
    description: 'Stainless steel slip-on, weld neck, and blind flanges. ANSI/DIN standards.',
    moq: '1,000 pcs',
    price_range: 'USD $2.50–8.00/unit',
    category: 'Fittings',
  },
  {
    id: 'p5',
    name: 'Aluminum Sheets (6061-T6)',
    description: 'Aircraft-grade aluminum sheets, various thicknesses (0.5mm–10mm). Cut-to-size available.',
    moq: '2,000 sqm',
    price_range: 'USD $18–25/sqm',
    category: 'Sheets',
  },
  {
    id: 'p6',
    name: 'Custom CNC Machined Parts',
    description: 'Precision CNC machining for custom metal parts. Accepts DWG/STEP files. Prototype to production.',
    moq: 'Negotiable',
    price_range: 'USD $5–50/unit',
    category: 'Custom',
  },
];

// === Mock Conversations ===

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    contact_name: 'Sarah Chen',
    contact_phone: '+1-555-0101',
    contact_wechat_id: null,
    channel: 'WhatsApp',
    status: 'bookmarked',
    detected_language: 'en',
    handoff_summary: 'Wants 10,000 pcs 304 SS bottles, CIF Hamburg. Budget ~$26/unit.\nFollow up on sample request — sent address yesterday.',
    updated_at: minutesAgo(12),
    last_message: { content: 'Can you do $26 if I order 10,000?', role: 'user', created_at: minutesAgo(12) },
    message_count: 14,
  },
  {
    id: 'c2',
    contact_name: 'Hans Mueller',
    contact_phone: '+49-555-0202',
    contact_wechat_id: null,
    channel: 'Email',
    status: 'ai',
    detected_language: 'en',
    handoff_summary: null,
    updated_at: minutesAgo(45),
    last_message: { content: 'What about 3-month lead time for 2,000 meters?', role: 'user', created_at: minutesAgo(45) },
    message_count: 8,
  },
  {
    id: 'c3',
    contact_name: 'Yuki Tanaka',
    contact_phone: null,
    contact_wechat_id: 'yuki_tanaka_hk',
    channel: 'WeChat',
    status: 'bookmarked',
    detected_language: 'zh',
    handoff_summary: 'Discussing 316L containers, requested 15% discount on 5,000 unit order.\nNeeds quote by Friday — mentioned competitor pricing at $42/unit.',
    updated_at: minutesAgo(180),
    last_message: { content: '我們需要在星期五前拿到報價', role: 'user', created_at: minutesAgo(180) },
    message_count: 11,
  },
];

// === Golden Path Mock Data ===

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 's1',
    name: 'Shenzhen Steel Works',
    location: 'Shenzhen, China',
    specialty: 'Stainless Steel Bottles & Containers',
    rating: 4.8,
    certifications: ['ISO 9001', 'FDA', 'SGS'],
    contact: 'Zhang Wei',
    email: 'zhang@szsteel.cn',
    verified: true,
  },
  {
    id: 's2',
    name: 'Guangdong Metal Co.',
    location: 'Guangzhou, China',
    specialty: 'Metal Packaging & Bottles',
    rating: 4.2,
    certifications: ['ISO 9001'],
    contact: 'Li Ming',
    email: 'liming@gdmetal.cn',
    verified: true,
  },
  {
    id: 's3',
    name: 'Dongguan Drinkware',
    location: 'Dongguan, China',
    specialty: 'Custom Drinkware & Promotional Items',
    rating: 4.5,
    certifications: ['ISO 9001', 'FDA', 'BSCI'],
    contact: 'Chen Jie',
    email: 'chenjie@dgdrink.cn',
    verified: true,
  },
];

export const MOCK_INQUIRIES: Inquiry[] = [
  {
    id: 'inq1',
    displayId: 'INQ-2026-001',
    customer: 'Sarah Chen',
    company: 'Global Bottling Ltd',
    channel: 'WhatsApp',
    receivedAt: daysAgo(2),
    status: 'reviewing',
    originalMessage: "We need 10,000 stainless-steel bottles with our logo, delivered to London by 30 November. Please quote.",
    attachments: ['RFQ_Sarah_Chen.pdf'],
    extractedFields: [
      { field: 'Product', value: '304 SS Bottle (500ml)', status: 'extracted' },
      { field: 'Quantity', value: '10,000 pcs', status: 'confirmed' },
      { field: 'Destination', value: 'London, UK', status: 'confirmed' },
      { field: 'Delivery Date', value: '30 November 2026', status: 'confirmed' },
      { field: 'Capacity', value: null, status: 'missing' },
      { field: 'Logo Method', value: null, status: 'missing' },
      { field: 'Packaging', value: null, status: 'missing' },
    ],
    missingFields: ['Capacity', 'Logo Method', 'Packaging'],
    clarificationDraft: "Before we request supplier pricing, could you confirm:\n\n1. Bottle capacity (500ml, 750ml, or 1L)?\n2. Logo method (laser engraving, silk screen, or full wrap print)?\n3. Packaging requirements (individual box, bulk, or custom packaging)?",
    conversationId: 'c1',
    opportunityId: 'opp1',
    quoteId: 'q1',
  },
];

export const MOCK_RFQS: Rfq[] = [
  {
    id: 'rfq1',
    displayId: 'RFQ-2026-001',
    inquiryId: 'inq1',
    suppliers: ['s1', 's2', 's3'],
    sentAt: daysAgo(1),
    deadline: daysFromNow(5),
    status: 'received',
    responses: [
      {
        id: 'sr1',
        supplierId: 's1',
        rfqId: 'rfq1',
        price: 2.80,
        currency: 'USD',
        moq: 5000,
        leadTime: 28,
        leadTimeUnit: 'days',
        certifications: ['FDA available'],
        validUntil: daysFromNow(7),
        packaging: 'Individual gift box',
        notes: 'Price includes custom logo printing (silk screen, 1 color)',
        receivedAt: daysAgo(0),
        status: 'received',
      },
      {
        id: 'sr2',
        supplierId: 's2',
        rfqId: 'rfq1',
        price: 2.55,
        currency: 'USD',
        moq: 10000,
        leadTime: 42,
        leadTimeUnit: 'days',
        certifications: ['Not confirmed'],
        validUntil: daysFromNow(3),
        packaging: 'Bulk carton',
        notes: 'Lower price but higher MOQ and longer lead time',
        receivedAt: daysAgo(0),
        status: 'received',
      },
      {
        id: 'sr3',
        supplierId: 's3',
        rfqId: 'rfq1',
        price: 3.10,
        currency: 'USD',
        moq: 3000,
        leadTime: 21,
        leadTimeUnit: 'days',
        certifications: ['FDA confirmed'],
        validUntil: daysFromNow(14),
        packaging: 'Individual box with sleeve',
        notes: 'Premium packaging included. FDA certification confirmed.',
        receivedAt: daysAgo(0),
        status: 'received',
      },
    ],
  },
];

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp1',
    displayId: 'OPP-2026-001',
    inquiryId: 'inq1',
    company: 'Global Bottling Ltd',
    contact: 'Sarah Chen',
    stage: 'proposal',
    priority: 'high',
    estimatedValue: 28000,
    currency: 'USD',
    nextAction: 'Awaiting supplier comparison and quote generation',
    missingInformation: ['Logo method', 'Packaging preference'],
    owner: 'Demo User',
    createdAt: daysAgo(2),
    quoteId: 'q1',
  },
];

export const MOCK_QUOTES: Quote[] = [
  {
    id: 'q1',
    displayId: 'Q-2026-001',
    inquiryId: 'inq1',
    opportunityId: 'opp1',
    rfqId: 'rfq1',
    customer: 'Sarah Chen',
    company: 'Global Bottling Ltd',
    product: '304 SS Bottle (500ml)',
    quantity: '10,000 pcs',
    currency: 'USD',
    costBreakdown: [
      { label: 'Supplier cost (Shenzhen Steel Works)', amount: 28000, notes: '$2.80 × 10,000 pcs' },
      { label: 'Packaging upgrade', amount: 1200, notes: 'Individual gift box' },
      { label: 'Quality inspection', amount: 800, notes: 'Third-party SGS inspection' },
      { label: 'Sea freight to London', amount: 3500, notes: 'FCL 20ft, ~25 days transit' },
      { label: 'Insurance', amount: 350, notes: '1.1% of CIF value' },
      { label: 'Contingency (5%)', amount: 1693, notes: 'Buffer for exchange rate fluctuation' },
    ],
    totalCost: 35543,
    marginPercent: 15,
    customerPrice: 40875,
    status: 'pending_approval',
    createdAt: daysAgo(1),
    sentAt: null,
    approvedAt: null,
    validUntil: daysFromNow(14),
    notes: 'CIF London. Includes custom logo printing (silk screen, 1 color). 28-day lead time.',
    supplierId: 's1',
    assumptions: [
      'Exchange rate: 1 USD = 7.25 HKD',
      'Freight rate based on current Shanghai-London route',
      'Logo printing: silk screen, 1 color, included in supplier price',
      'FDA certification available from supplier',
    ],
    auditTrail: [
      { timestamp: daysAgo(1), action: 'Created', user: 'System', details: 'Auto-generated from RFQ comparison' },
      { timestamp: daysAgo(0), action: 'Cost calculated', user: 'System', details: 'Total cost: $35,543, Margin: 15%' },
      { timestamp: daysAgo(0), action: 'Pending approval', user: 'System', details: 'Sent to manager for approval' },
    ],
  },
];

export const MOCK_FOLLOWUPS: FollowUp[] = [
  {
    id: 'fu1',
    quoteId: 'q1',
    scheduledFor: daysFromNow(3),
    status: 'pending',
    type: 'initial',
    message: 'Hi Sarah, following up on the quote we sent for 10,000 stainless steel bottles. Do you have any questions?',
  },
  {
    id: 'fu2',
    quoteId: 'q1',
    scheduledFor: daysFromNow(7),
    status: 'pending',
    type: 'follow_up_1',
    message: 'Hi Sarah, checking in on the bottle quote. The pricing is valid until the end of the month. Let me know if you need any adjustments.',
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  c1: [
    { id: 'm1', role: 'user', content: 'Hi, I need 500ml stainless steel bottles. Can you supply?', created_at: daysAgo(3) },
    { id: 'm2', role: 'assistant', content: "Hello Sarah! Yes, we supply 304 stainless steel bottles (500ml). They're double-wall vacuum insulated, food-grade certified. Our MOQ is 5,000 pcs. What quantity are you looking at?", created_at: daysAgo(3) },
    { id: 'm3', role: 'user', content: "I need 10,000 units. What's the price?", created_at: daysAgo(2) },
    { id: 'm4', role: 'assistant', content: "For 10,000 pcs of 304 SS 500ml bottles, our price range is HKD $22–28/unit depending on finish and customization. This includes: body, lid, silicone seal, and gift box packaging.\n\nFOB Shanghai price: ~HKD $22/unit for plain finish.\nWith custom logo printing: ~HKD $25/unit.\n\nWould you like a formal quote?", created_at: daysAgo(2) },
    { id: 'm5', role: 'user', content: "What about CIF Hamburg?", created_at: daysAgo(2) },
    { id: 'm6', role: 'assistant', content: "For CIF Hamburg, we can arrange sea freight. Estimated CIF price: HKD $26–30/unit (depending on final specs). Transit time is about 25–30 days.\n\nWould you like me to prepare a detailed CIF quote?", created_at: daysAgo(2) },
    { id: 'm7', role: 'human', content: "I've taken over this conversation. Let me prepare the CIF quote manually.", created_at: daysAgo(1) },
    { id: 'm8', role: 'user', content: "Can you do $26 if I order 10,000? I need delivery to London by 30 November.", created_at: minutesAgo(12) },
  ],
};

export const MOCK_FAQ_RULES: FaqRule[] = [
  {
    id: 'f1',
    question_pattern: 'Shipping terms and options',
    keywords: ['shipping', 'FOB', 'CIF', 'delivery', 'freight'],
    answer: 'We offer FOB Shanghai and CIF to major ports worldwide. Sea freight takes 20–35 days depending on destination. Air freight available for urgent orders (3–5 days, higher cost).',
    priority: 1,
  },
  {
    id: 'f2',
    question_pattern: 'Payment methods accepted',
    keywords: ['payment', 'T/T', 'L/C', 'terms', 'pay'],
    answer: 'We accept: T/T (30% deposit, 70% before shipment), L/C at sight, and PayPal for orders under $5,000. New customers: T/T only.',
    priority: 2,
  },
];

export interface KnowledgeDocument {
  id: string;
  name: string;
  type: string;
  content: string;
  addedAt: string;
  size: string;
}

export interface FlowStep {
  id: string;
  trigger: string;
  response: string;
}

export interface AiGoal {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  greeting: string;
  flow_steps: FlowStep[];
  handoff_message: string;
  triggers: string[];
}

export const MOCK_KNOWLEDGE_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'k1',
    name: 'Product_Catalog_2026.xlsx',
    type: 'spreadsheet',
    content: 'Full product catalog with pricing tiers, MOQs, and specifications for all stainless steel, carbon steel, and aluminum products.',
    addedAt: daysAgo(15),
    size: '45.2 KB',
  },
  {
    id: 'k2',
    name: 'Shipping_Guide.pdf',
    type: 'pdf',
    content: 'FOB/CIF terms, shipping routes, transit times, and freight cost estimates for major global ports.',
    addedAt: daysAgo(20),
    size: '128.5 KB',
  },
];

export const MOCK_AI_GOALS: AiGoal[] = [
  {
    id: 'g1',
    title: 'Collect Customer Requirements',
    description: 'Gather product specifications, quantity, and delivery preferences before providing a quote.',
    enabled: true,
    greeting: 'Hello! I\'d be happy to help you find the right products. What are you looking for?',
    flow_steps: [
      { id: 'fs1', trigger: 'Customer mentions product type', response: 'Great choice! What quantity are you looking for?' },
      { id: 'fs2', trigger: 'Customer mentions quantity', response: 'And what delivery terms do you prefer? FOB or CIF?' },
      { id: 'fs3', trigger: 'Customer mentions delivery terms', response: 'Perfect, let me prepare a quote for you.' },
    ],
    handoff_message: 'I\'ll connect you with our sales team for a personalized quote.',
    triggers: ['product', 'looking for', 'need'],
  },
];

export const MOCK_SETTINGS: CompanySettings = {
  system_prompt: "You are a helpful and professional sales assistant for Pacific Trading Co., a Hong Kong-based steel and metal trading company.",
  response_delay_seconds: 2,
  chat_widget_enabled: true,
};

export const MOCK_COMPANY = {
  name: 'Pacific Trading Co.',
  industry: 'Steel & Metal Trading',
  location: 'Hong Kong',
  subscription_status: 'active',
};
