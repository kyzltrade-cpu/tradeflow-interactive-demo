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

export type FieldSource = 'customer_stated' | 'inferred_from_supplier' | 'system_default' | 'user_confirmed' | 'missing';

export interface ExtractedField {
  field: string;
  value: string | null;
  status: 'extracted' | 'confirmed' | 'missing' | 'inferred' | 'conflicting';
  source: FieldSource;
  sourceDetail?: string;
  confidence: 'high' | 'medium' | 'low';
  confirmedBy?: string;
  confirmedAt?: string;
}

export interface EmailMessage {
  id: string;
  from: string;
  fromEmail: string;
  to: string;
  subject: string;
  body: string;
  receivedAt: string;
  read: boolean;
  inquiryId?: string;
  attachments?: string[];
  channel: 'email' | 'whatsapp' | 'wechat';
}

export interface SupplierCertification {
  name: string;
  status: 'claimed' | 'documents_available' | 'reviewed' | 'verified' | 'not_confirmed';
  notes?: string;
}

export interface Inquiry {
  id: string;
  displayId: string;
  customer: string;
  company: string;
  channel: string;
  receivedAt: string;
  status: 'received' | 'reviewing' | 'needs_information' | 'ready_for_rfq' | 'converted' | 'closed';
  originalMessage: string;
  subject?: string;
  attachments: string[];
  extractedFields: ExtractedField[];
  missingFields: string[];
  clarificationDraft: string | null;
  clarificationSent: boolean;
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
  certifications: SupplierCertification[];
  contact: string;
  email: string;
  verified: boolean;
  verificationDate?: string;
  verificationNotes?: string;
}

export type CostSource = 'supplier_quoted' | 'user_entered' | 'system_estimate' | 'external_data' | 'assumption' | 'unverified';

export interface SupplierResponse {
  id: string;
  supplierId: string;
  rfqId: string;
  price: number;
  currency: string;
  moq: number;
  leadTime: number;
  leadTimeUnit: string;
  certifications: SupplierCertification[];
  validUntil: string;
  packaging: string;
  logoPrinting: string;
  logoCost: number;
  incoterm: string;
  paymentTerms: string;
  notes: string;
  receivedAt: string;
  status: 'pending' | 'received' | 'selected' | 'rejected';
}

export interface Rfq {
  id: string;
  displayId: string;
  inquiryId: string;
  opportunityId: string;
  suppliers: string[];
  sentAt: string;
  deadline: string;
  status: 'draft' | 'sent' | 'partially_received' | 'received' | 'closed';
  responses: SupplierResponse[];
  sharedFields: string[];
  redactedFields: string[];
}

export interface CostLine {
  label: string;
  amount: number;
  source: CostSource;
  sourceDetail: string;
  confirmed: boolean;
  notes?: string;
}

export interface Quote {
  id: string;
  displayId: string;
  version: number;
  inquiryId: string;
  opportunityId: string;
  rfqId: string;
  supplierResponseId: string;
  customer: string;
  company: string;
  product: string;
  quantity: string;
  currency: string;
  costBreakdown: CostLine[];
  totalCost: number;
  marginPercent: number;
  customerPrice: number;
  status: 'draft' | 'in_review' | 'approved' | 'sent' | 'accepted' | 'rejected' | 'negotiating' | 'expired';
  createdAt: string;
  sentAt: string | null;
  approvedAt: string | null;
  approvedBy?: string;
  validUntil: string;
  incoterm: string;
  paymentTerms: string;
  notes: string;
  supplierId: string;
  warnings: string[];
  assumptions: string[];
  auditTrail: AuditEntry[];
  blockedByMissingFields: string[];
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
  status: 'pending' | 'sent' | 'completed' | 'paused' | 'cancelled';
  type: 'initial' | 'follow_up_1' | 'follow_up_2' | 'final';
  message: string;
  pauseReason?: string;
}

export interface Opportunity {
  id: string;
  displayId: string;
  inquiryId: string;
  company: string;
  contact: string;
  stage: 'new' | 'needs_information' | 'qualified' | 'sourcing' | 'quote_draft' | 'pending_approval' | 'sent' | 'negotiating' | 'won' | 'lost' | 'expired';
  priority: 'low' | 'medium' | 'high';
  estimatedValue: number;
  currency: string;
  commercialRole: 'sourcing_agent' | 'principal_trader' | 'referral' | 'undecided';
  nextAction: string;
  nextActionDue: string;
  missingInformation: string[];
  owner: string;
  createdAt: string;
  quoteId: string | null;
  rfqId: string | null;
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
];

// === Mock Conversations ===

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    contact_name: 'Sarah Chen',
    contact_phone: '+1-555-0101',
    contact_wechat_id: null,
    channel: 'Email',
    status: 'bookmarked',
    detected_language: 'en',
    handoff_summary: 'Acme Corp RFQ for 10,000 stainless steel bottles. Missing capacity, logo method, packaging specs. Clarification sent — awaiting reply.',
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
    handoff_summary: 'Discussing 316L containers, requested 15% discount on 5,000 unit order. Needs quote by Friday.',
    updated_at: minutesAgo(180),
    last_message: { content: '我們需要在星期五前拿到報價', role: 'user', created_at: minutesAgo(180) },
    message_count: 11,
  },
];

// === Email Inbox ===

export const MOCK_EMAILS: EmailMessage[] = [
  {
    id: 'e1',
    from: 'Sarah Chen',
    fromEmail: 'sarah.chen@acmecorp.com',
    to: 'sales@pacifictrading.co',
    subject: 'RFQ: 10,000 Stainless Steel Water Bottles — Acme Corp',
    body: `Dear Pacific Trading,

We are looking to source 10,000 stainless-steel water bottles with our company logo for a promotional campaign. We would like food-grade material and can provide our logo artwork.

Requirements:
- Quantity: 10,000 units
- Material: Stainless steel (food-grade)
- Logo: Yes, we will supply artwork
- Delivery: London, UK by 30 November 2026

Please quote your best CIF London price.

Best regards,
Sarah Chen
Procurement Manager
Acme Corp`,
    receivedAt: daysAgo(2),
    read: true,
    inquiryId: 'inq1',
    attachments: ['acme-bottle-rfq.pdf'],
    channel: 'email',
  },
  {
    id: 'e2',
    from: 'Hans Mueller',
    fromEmail: 'h.mueller@euroimports.de',
    to: 'sales@pacifictrading.co',
    subject: 'Inquiry: Carbon Steel Pipes — Euro Imports',
    body: `Hello,

We need 2,000 meters of 4-inch ERW carbon steel pipe. What is your best FOB price?

Regards,
Hans Mueller
Euro Imports GmbH`,
    receivedAt: daysAgo(1),
    read: false,
    channel: 'email',
  },
  {
    id: 'e3',
    from: 'Shenzhen Steel Works',
    fromEmail: 'zhang@szsteel.cn',
    to: 'rfq@pacifictrading.co',
    subject: 'RE: RFQ-2026-001 — Quote for SS Bottles',
    body: `Dear Pacific Trading,

Thank you for your RFQ. Please find our quotation below:

Product: 304 SS Bottle 500ml
Unit Price: USD 2.80 (FOB Shenzhen)
MOQ: 5,000 pcs
Lead Time: 28 days
Logo Printing: Silk screen, 1 color — included
Packaging: Individual gift box
Certification: ISO 9001 certified, FDA documents available on request
Payment: 30% deposit, 70% before shipment
Validity: 7 days

Please let us know if you need samples.

Best regards,
Zhang Wei
Shenzhen Steel Works`,
    receivedAt: daysAgo(0),
    read: true,
    inquiryId: 'inq1',
    channel: 'email',
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
    certifications: [
      { name: 'ISO 9001', status: 'verified', notes: 'Verified via certificate copy — expires 2027-03' },
      { name: 'FDA food-contact', status: 'documents_available', notes: 'Supplier provided FDA 21 CFR 177.1520 declaration — not yet independently reviewed' },
    ],
    contact: 'Zhang Wei',
    email: 'zhang@szsteel.cn',
    verified: true,
    verificationDate: daysAgo(45),
    verificationNotes: 'Factory audit completed. Production capacity confirmed for 50,000 units/month. Lead time verified for 10,000-unit orders.',
  },
  {
    id: 's2',
    name: 'Guangdong Metal Co.',
    location: 'Guangzhou, China',
    specialty: 'Metal Packaging & Bottles',
    rating: 4.2,
    certifications: [
      { name: 'ISO 9001', status: 'claimed', notes: 'Supplier claims certification — certificate copy not yet received' },
      { name: 'FDA food-contact', status: 'not_confirmed', notes: 'Supplier did not provide food-contact documentation' },
    ],
    contact: 'Li Ming',
    email: 'liming@gdmetal.cn',
    verified: false,
    verificationNotes: 'Preliminary assessment only. Factory audit not yet completed.',
  },
  {
    id: 's3',
    name: 'Dongguan Drinkware',
    location: 'Dongguan, China',
    specialty: 'Custom Drinkware & Promotional Items',
    rating: 4.5,
    certifications: [
      { name: 'ISO 9001', status: 'verified', notes: 'Verified via certificate copy — expires 2026-12' },
      { name: 'FDA food-contact', status: 'reviewed', notes: 'FDA 21 CFR 177.1520 declaration reviewed by QA team' },
      { name: 'BSCI', status: 'claimed', notes: 'Audit report pending' },
    ],
    contact: 'Chen Jie',
    email: 'chenjie@dgdrink.cn',
    verified: true,
    verificationDate: daysAgo(90),
    verificationNotes: 'Factory audit completed. Specializes in custom printing. Capacity: 30,000 units/month.',
  },
];

export const MOCK_INQUIRIES: Inquiry[] = [
  {
    id: 'inq1',
    displayId: 'INQ-2026-001',
    customer: 'Sarah Chen',
    company: 'Acme Corp',
    channel: 'Email',
    receivedAt: daysAgo(2),
    status: 'needs_information',
    subject: 'RFQ: 10,000 Stainless Steel Water Bottles — Acme Corp',
    originalMessage: `Dear Pacific Trading,

We are looking to source 10,000 stainless-steel water bottles with our company logo for a promotional campaign. We would like food-grade material and can provide our logo artwork.

Requirements:
- Quantity: 10,000 units
- Material: Stainless steel (food-grade)
- Logo: Yes, we will supply artwork
- Delivery: London, UK by 30 November 2026

Please quote your best CIF London price.

Best regards,
Sarah Chen
Procurement Manager
Acme Corp`,
    attachments: ['acme-bottle-rfq.pdf'],
    extractedFields: [
      { field: 'Customer company', value: 'Acme Corp', status: 'confirmed', source: 'customer_stated', sourceDetail: 'Stated in email signature', confidence: 'high' },
      { field: 'Contact', value: 'Sarah Chen', status: 'confirmed', source: 'customer_stated', sourceDetail: 'Stated in email signature', confidence: 'high' },
      { field: 'Product category', value: 'Drinkware', status: 'extracted', source: 'customer_stated', sourceDetail: 'Inferred from "stainless-steel water bottles"', confidence: 'high' },
      { field: 'Product', value: 'Stainless-steel water bottle', status: 'extracted', source: 'customer_stated', sourceDetail: 'Stated in email body', confidence: 'high' },
      { field: 'Quantity', value: '10,000 units', status: 'confirmed', source: 'customer_stated', sourceDetail: 'Stated in email body', confidence: 'high' },
      { field: 'Destination', value: 'London, UK', status: 'confirmed', source: 'customer_stated', sourceDetail: 'Stated in email body', confidence: 'high' },
      { field: 'Delivery deadline', value: '30 November 2026', status: 'confirmed', source: 'customer_stated', sourceDetail: 'Stated in email body', confidence: 'high' },
      { field: 'Food-grade requirement', value: 'Yes', status: 'extracted', source: 'customer_stated', sourceDetail: 'Stated in email body', confidence: 'high' },
      { field: 'Logo artwork', value: 'Customer will supply', status: 'extracted', source: 'customer_stated', sourceDetail: 'Stated in email body', confidence: 'high' },
      { field: 'Bottle capacity', value: null, status: 'missing', source: 'missing', confidence: 'high' },
      { field: 'Material grade', value: '304 SS (inferred)', status: 'inferred', source: 'inferred_from_supplier', sourceDetail: 'Most common food-grade SS for drinkware; customer did not specify', confidence: 'medium' },
      { field: 'Finish', value: null, status: 'missing', source: 'missing', confidence: 'high' },
      { field: 'Packaging', value: 'Individual gift box (inferred)', status: 'inferred', source: 'inferred_from_supplier', sourceDetail: 'Shenzhen Steel Works default packaging; not confirmed with customer', confidence: 'medium' },
      { field: 'Logo method', value: 'Silk screen 1 color (inferred)', status: 'inferred', source: 'inferred_from_supplier', sourceDetail: 'Shenzhen Steel Works included in quote; not confirmed with customer', confidence: 'medium' },
      { field: 'Certification', value: 'Food-grade stated', status: 'extracted', source: 'customer_stated', sourceDetail: 'Customer stated food-grade; specific certification not specified', confidence: 'medium' },
      { field: 'Incoterm', value: 'CIF London', status: 'confirmed', source: 'customer_stated', sourceDetail: 'Stated in email body', confidence: 'high' },
    ],
    missingFields: ['Bottle capacity', 'Finish', 'Packaging (confirmed)', 'Logo method (confirmed)', 'Specific certification'],
    clarificationDraft: `Thanks for your RFQ. Before we request final supplier pricing, could you please confirm:

1. Bottle capacity (500ml, 750ml, or 1L)?
2. Preferred material grade (304 or 316L stainless steel)?
3. Surface finish (brushed, polished, powder-coated, or other)?
4. Logo printing method (laser engraving, silk screen, or full wrap print)?
5. Packaging requirements (individual gift box, bulk carton, or custom)?
6. Required food-contact certification (FDA, LFGB, or other)?
7. Whether delivery to London must be completed by 30 November or shipped by that date?

Once we have these details, we can request final pricing from our approved suppliers.`,
    clarificationSent: false,
    conversationId: 'c1',
    opportunityId: 'opp1',
    quoteId: null,
  },
];

export const MOCK_RFQS: Rfq[] = [
  {
    id: 'rfq1',
    displayId: 'RFQ-2026-001',
    inquiryId: 'inq1',
    opportunityId: 'opp1',
    suppliers: ['s1', 's2', 's3'],
    sentAt: daysAgo(1),
    deadline: daysFromNow(5),
    status: 'received',
    sharedFields: ['Product specification', 'Quantity', 'Destination', 'Delivery deadline', 'Required certifications'],
    redactedFields: ['Customer name', 'Target price', 'Customer artwork'],
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
        certifications: [
          { name: 'FDA food-contact', status: 'documents_available', notes: 'FDA 21 CFR 177.1520 declaration provided' },
        ],
        validUntil: daysFromNow(7),
        packaging: 'Individual gift box',
        logoPrinting: 'Silk screen, 1 color — included in price',
        logoCost: 0,
        incoterm: 'FOB Shenzhen',
        paymentTerms: '30% deposit, 70% before shipment',
        notes: 'Production lead time 28 days from deposit. Samples available in 5 days.',
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
        certifications: [
          { name: 'FDA food-contact', status: 'not_confirmed', notes: 'Supplier did not provide food-contact documentation' },
        ],
        validUntil: daysFromNow(3),
        packaging: 'Bulk carton',
        logoPrinting: 'Additional USD 0.08/unit',
        logoCost: 0.08,
        incoterm: 'FOB Shenzhen',
        paymentTerms: '50% deposit, 50% before shipment',
        notes: 'Lower price but higher MOQ. Longer lead time. No food-contact certification provided.',
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
        certifications: [
          { name: 'FDA food-contact', status: 'reviewed', notes: 'FDA 21 CFR 177.1520 declaration reviewed by QA team' },
        ],
        validUntil: daysFromNow(14),
        packaging: 'Individual box with sleeve',
        logoPrinting: 'Included in price',
        logoCost: 0,
        incoterm: 'FOB Shenzhen',
        paymentTerms: '30% deposit, 70% before shipment',
        notes: 'Premium packaging included. Fastest lead time. FDA documents reviewed.',
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
    company: 'Acme Corp',
    contact: 'Sarah Chen',
    stage: 'sourcing',
    priority: 'high',
    estimatedValue: 28000,
    currency: 'USD',
    commercialRole: 'principal_trader',
    nextAction: 'Confirm missing fields with customer before generating quote',
    nextActionDue: daysFromNow(2),
    missingInformation: ['Bottle capacity', 'Finish', 'Packaging (confirmed)', 'Logo method (confirmed)', 'Specific certification'],
    owner: 'Demo User',
    createdAt: daysAgo(2),
    quoteId: null,
    rfqId: 'rfq1',
  },
];

export const MOCK_QUOTES: Quote[] = [
  {
    id: 'q1',
    displayId: 'Q-2026-001',
    version: 1,
    inquiryId: 'inq1',
    opportunityId: 'opp1',
    rfqId: 'rfq1',
    supplierResponseId: 'sr1',
    customer: 'Sarah Chen',
    company: 'Acme Corp',
    product: '304 SS Bottle (500ml)',
    quantity: '10,000 pcs',
    currency: 'USD',
    costBreakdown: [
      { label: 'Supplier unit cost', amount: 28000, source: 'supplier_quoted', sourceDetail: 'Shenzhen Steel Works RFQ: $2.80 × 10,000 pcs', confirmed: true, notes: '$2.80 × 10,000 pcs' },
      { label: 'Packaging', amount: 1200, source: 'supplier_quoted', sourceDetail: 'Included in Shenzhen Steel Works quote — individual gift box', confirmed: true, notes: 'Individual gift box — included in supplier price' },
      { label: 'Logo printing', amount: 0, source: 'supplier_quoted', sourceDetail: 'Included in Shenzhen Steel Works quote — silk screen 1 color', confirmed: true, notes: 'Silk screen 1 color — included in supplier price' },
      { label: 'Quality inspection', amount: 800, source: 'system_estimate', sourceDetail: 'TradeFlow estimate: SGS third-party inspection for 10,000 units', confirmed: false, notes: 'SGS third-party inspection — estimate only' },
      { label: 'Local transport to port', amount: 180, source: 'system_estimate', sourceDetail: 'TradeFlow estimate: Shenzhen factory to port', confirmed: false, notes: 'Shenzhen factory to Shenzhen port — estimate' },
      { label: 'Sea freight to London', amount: 3500, source: 'external_data', sourceDetail: 'Freightos rate estimate: FCL 20ft Shanghai-London, ~25 days transit', confirmed: false, notes: 'FCL 20ft — rate estimate from Freightos, subject to confirmation' },
      { label: 'Marine insurance', amount: 350, source: 'system_estimate', sourceDetail: 'TradeFlow estimate: 1.1% of CIF value', confirmed: false, notes: '1.1% of CIF value — estimate' },
      { label: 'Contingency (3%)', amount: 1065, source: 'assumption', sourceDetail: 'TradeFlow standard contingency buffer', confirmed: false, notes: 'Buffer for exchange rate fluctuation and unforeseen costs' },
    ],
    totalCost: 35095,
    marginPercent: 22,
    customerPrice: 42816,
    status: 'in_review',
    createdAt: daysAgo(0),
    sentAt: null,
    approvedAt: null,
    validUntil: daysFromNow(14),
    incoterm: 'CIF London',
    paymentTerms: 'T/T 30% deposit, 70% before shipment',
    notes: 'CIF London. Based on Shenzhen Steel Works (lowest cost with FDA documents available). 28-day production lead time.',
    supplierId: 's1',
    warnings: [
      'Bottle capacity not confirmed by customer — assumed 500ml',
      'Packaging not confirmed by customer — assumed individual gift box',
      'Logo method not confirmed by customer — assumed silk screen 1 color',
      'Specific food-contact certification not confirmed by customer',
      'Freight rate is an estimate — subject to carrier confirmation',
      'Insurance is an estimate — actual premium may vary',
      'Shenzhen Steel Works FDA documents not independently verified',
      'Delivery deadline (30 Nov) requires 28-day lead time + 25-day transit — tight margin',
    ],
    assumptions: [
      'Exchange rate: 1 USD = 7.85 HKD (current market rate)',
      'Bottle capacity: 500ml (not confirmed by customer)',
      'Packaging: Individual gift box (supplier default, not confirmed by customer)',
      'Logo: Silk screen 1 color (supplier default, not confirmed by customer)',
      'Freight: FCL 20ft Shanghai-London at current market rate',
      'Insurance: 1.1% of CIF value (standard rate)',
      'Contingency: 3% of subtotal (standard buffer)',
    ],
    blockedByMissingFields: ['Bottle capacity', 'Finish', 'Packaging', 'Logo method', 'Certification'],
    auditTrail: [
      { timestamp: daysAgo(1), action: 'RFQ responses received', user: 'System', details: 'Received 3 supplier responses for RFQ-2026-001' },
      { timestamp: daysAgo(0), action: 'Supplier comparison completed', user: 'System', details: 'Recommended Shenzhen Steel Works: lowest cost with FDA documents available' },
      { timestamp: daysAgo(0), action: 'Cost calculation completed', user: 'System', details: 'Total cost: $35,095, Margin: 22%, Customer price: $42,816' },
      { timestamp: daysAgo(0), action: 'Quote draft generated', user: 'System', details: 'Quote Q-2026-001 v1 created — pending customer confirmation of missing fields' },
      { timestamp: daysAgo(0), action: 'Pending review', user: 'System', details: 'Quote requires human review — 5 missing fields flagged' },
    ],
  },
];

export const MOCK_FOLLOWUPS: FollowUp[] = [
  {
    id: 'fu1',
    quoteId: 'q1',
    scheduledFor: daysFromNow(3),
    status: 'paused',
    type: 'initial',
    message: 'Hi Sarah, following up on the quote we sent for 10,000 stainless steel bottles. Do you have any questions?',
    pauseReason: 'Quote not yet approved — awaiting customer confirmation of missing fields',
  },
  {
    id: 'fu2',
    quoteId: 'q1',
    scheduledFor: daysFromNow(7),
    status: 'paused',
    type: 'follow_up_1',
    message: 'Hi Sarah, checking in on the bottle quote. The pricing is valid until the end of the month. Let me know if you need any adjustments.',
    pauseReason: 'Quote not yet approved — awaiting customer confirmation of missing fields',
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  c1: [
    { id: 'm1', role: 'user', content: 'Hi, I need stainless steel water bottles. Can you supply?', created_at: daysAgo(3) },
    { id: 'm2', role: 'assistant', content: "Hello Sarah! Yes, we supply 304 stainless steel bottles. They're double-wall vacuum insulated, food-grade certified. Our MOQ is 5,000 pcs. What quantity are you looking for?", created_at: daysAgo(3) },
    { id: 'm3', role: 'user', content: "I need 10,000 units. What's the price?", created_at: daysAgo(2) },
    { id: 'm4', role: 'assistant', content: "For 10,000 pcs of 304 SS bottles, our price range is HKD $22–28/unit depending on finish and customization. This includes: body, lid, silicone seal, and gift box packaging.\n\nFOB Shanghai price: ~HKD $22/unit for plain finish.\nWith custom logo printing: ~HKD $25/unit.\n\nWould you like a formal quote?", created_at: daysAgo(2) },
    { id: 'm5', role: 'user', content: "What about CIF London?", created_at: daysAgo(2) },
    { id: 'm6', role: 'assistant', content: "For CIF London, we can arrange sea freight. Estimated CIF price: HKD $26–30/unit (depending on final specs). Transit time is about 25–30 days.\n\nWould you like me to prepare a detailed CIF quote?", created_at: daysAgo(2) },
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
