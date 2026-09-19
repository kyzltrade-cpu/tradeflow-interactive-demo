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

export const MOCK_COMPANY = {
  name: 'Pacific Trading Co.',
  industry: 'Steel & Metal Trading',
  location: 'Hong Kong',
  subscription_status: 'active',
};

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

function minutesAgo(mins: number): string {
  return new Date(Date.now() - mins * 60000).toISOString();
}

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    contact_name: 'Sarah Chen',
    contact_phone: '+1-555-0101',
    contact_wechat_id: null,
    channel: 'WhatsApp',
    status: 'bookmarked',
    detected_language: 'en',
    handoff_summary: 'Wants 5,000 pcs 304 SS bottles, CIF Hamburg. Budget ~$28/unit.\nFollow up on sample request — sent address yesterday.',
    updated_at: minutesAgo(12),
    last_message: { content: 'Can you do $26 if I order 10,000?', role: 'user', created_at: minutesAgo(12) },
    message_count: 14,
  },
  {
    id: 'c2',
    contact_name: 'Hans Mueller',
    contact_phone: '+49-555-0202',
    contact_wechat_id: null,
    channel: 'WhatsApp',
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
    handoff_summary: ' discussing 316L containers, requested 15% discount on 5,000 unit order.\nNeeds quote by Friday — mentioned competitor pricing at $42/unit.',
    updated_at: minutesAgo(180),
    last_message: { content: '我們需要在星期五前拿到報價', role: 'user', created_at: minutesAgo(180) },
    message_count: 11,
  },
  {
    id: 'c4',
    contact_name: 'Raj Patel',
    contact_phone: '+91-555-0404',
    contact_wechat_id: null,
    channel: 'WhatsApp',
    status: 'ai',
    detected_language: 'en',
    handoff_summary: null,
    updated_at: minutesAgo(30),
    last_message: { content: 'Do you have the 6061-T6 spec sheet?', role: 'user', created_at: minutesAgo(30) },
    message_count: 6,
  },
  {
    id: 'c5',
    contact_name: 'Maria Garcia',
    contact_phone: '+34-555-0505',
    contact_wechat_id: null,
    channel: 'WhatsApp',
    status: 'bookmarked',
    detected_language: 'en',
    handoff_summary: null,
    updated_at: minutesAgo(90),
    last_message: { content: 'I need SS flanges for a chemical plant — what grade?', role: 'user', created_at: minutesAgo(90) },
    message_count: 5,
  },
  {
    id: 'c6',
    contact_name: 'Li Wei',
    contact_phone: null,
    contact_wechat_id: 'li_wei_shanghai',
    channel: 'WeChat',
    status: 'ai',
    detected_language: 'zh',
    handoff_summary: null,
    updated_at: minutesAgo(60),
    last_message: { content: '碳鋼管有現貨嗎？', role: 'user', created_at: minutesAgo(60) },
    message_count: 4,
  },
  {
    id: 'c7',
    contact_name: 'James Wilson',
    contact_phone: '+44-555-0707',
    contact_wechat_id: null,
    channel: 'WhatsApp',
    status: 'ai',
    detected_language: 'en',
    handoff_summary: null,
    updated_at: minutesAgo(15),
    last_message: { content: 'Great, can you send the proforma invoice?', role: 'user', created_at: minutesAgo(15) },
    message_count: 10,
  },
  {
    id: 'c8',
    contact_name: 'Anna Kowalski',
    contact_phone: '+48-555-0808',
    contact_wechat_id: null,
    channel: 'WhatsApp',
    status: 'bookmarked',
    detected_language: 'en',
    handoff_summary: 'Custom CNC parts — needs prototype before bulk order.\nSent DWG files, waiting for engineering review and quote.',
    updated_at: minutesAgo(240),
    last_message: { content: 'When can I expect the prototype?', role: 'user', created_at: minutesAgo(240) },
    message_count: 7,
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  c1: [
    { id: 'm1', role: 'user', content: 'Hi, I need 500ml stainless steel bottles. Can you supply?', created_at: minutesAgo(120) },
    { id: 'm2', role: 'assistant', content: "Hello Sarah! Yes, we supply 304 stainless steel bottles (500ml). They're double-wall vacuum insulated, food-grade certified. Our MOQ is 5,000 pcs. What quantity are you looking at?", created_at: minutesAgo(119) },
    { id: 'm3', role: 'user', content: "I need 5,000 units. What's the price?", created_at: minutesAgo(100) },
    { id: 'm4', role: 'assistant', content: "For 5,000 pcs of 304 SS 500ml bottles, our price range is HKD $22–28/unit depending on finish and customization. This includes: body, lid, silicone seal, and gift box packaging.\n\nFOB Shanghai price: ~HKD $22/unit for plain finish.\nWith custom logo printing: ~HKD $25/unit.\n\nWould you like a formal quote?", created_at: minutesAgo(99) },
    { id: 'm5', role: 'user', content: "What about CIF Hamburg?", created_at: minutesAgo(80) },
    { id: 'm6', role: 'assistant', content: "For CIF Hamburg, we can arrange sea freight. Estimated CIF price: HKD $26–30/unit (depending on final specs). Transit time is about 25–30 days.\n\nWould you like me to prepare a detailed CIF quote?", created_at: minutesAgo(79) },
    { id: 'm7', role: 'human', content: "I've taken over this conversation. Let me prepare the CIF quote manually.", created_at: minutesAgo(60) },
    { id: 'm8', role: 'user', content: "Can you do $26 if I order 10,000?", created_at: minutesAgo(12) },
  ],
  c2: [
    { id: 'm20', role: 'user', content: 'Do you supply carbon steel pipes?', created_at: minutesAgo(200) },
    { id: 'm21', role: 'assistant', content: "Hello Hans! Yes, we supply both ERW and seamless carbon steel pipes. Available sizes range from 1/2 inch to 12 inches. All pipes are API 5L certified.\n\nWhat size and quantity are you looking for?", created_at: minutesAgo(199) },
    { id: 'm22', role: 'user', content: 'I need 2,000 meters of 4-inch ERW pipe.', created_at: minutesAgo(150) },
    { id: 'm23', role: 'assistant', content: "For 2,000 meters of 4-inch (DN100) ERW carbon steel pipe:\n\n- Price: USD $850–950/ton (FOB Shanghai)\n- Weight: ~9.1 kg/m, so ~18.2 tons total\n- Estimated total: USD $15,500–17,300\n- Lead time: 15–20 days\n\nWould you like a formal quotation?", created_at: minutesAgo(149) },
    { id: 'm24', role: 'user', content: 'What about 3-month lead time for 2,000 meters?', created_at: minutesAgo(45) },
  ],
  c3: [
    { id: 'm30', role: 'user', content: '你好，我需要316L不鏽鋼容器', created_at: minutesAgo(400) },
    { id: 'm31', role: 'assistant', content: '您好！是的，我們有316L食品級不鏽鋼容器。請問您需要什麼規格？容量和數量是多少？', created_at: minutesAgo(399) },
    { id: 'm32', role: 'user', content: '5000個，需要密封蓋子', created_at: minutesAgo(350) },
    { id: 'm33', role: 'assistant', content: '好的，5000個316L不鏽鋼容器（配密封蓋）：\n\n- 單價：HKD $38–45/個\n- MOQ：2,000個\n- 交貨時間：20–25天\n\n需要我給您報價嗎？', created_at: minutesAgo(349) },
    { id: 'm34', role: 'human', content: '我來接手這個對話。', created_at: minutesAgo(200) },
    { id: 'm35', role: 'user', content: '我們需要在星期五前拿到報價', created_at: minutesAgo(180) },
  ],
  c4: [
    { id: 'm40', role: 'user', content: 'Aluminum sheets 6061-T6, 3mm thick. Price?', created_at: minutesAgo(90) },
    { id: 'm41', role: 'assistant', content: "Hello Raj! For 6061-T6 aluminum sheets, 3mm thick:\n\n- Price: USD $20–22/sqm\n- MOQ: 2,000 sqm\n- Cut-to-size available\n- Mill certificates included\n\nWhat quantity and dimensions do you need?", created_at: minutesAgo(89) },
    { id: 'm42', role: 'user', content: '500 sheets, 1m x 2m each.', created_at: minutesAgo(60) },
    { id: 'm43', role: 'assistant', content: "500 sheets × 2 sqm = 1,000 sqm total.\n\nPrice: USD $21/sqm (bulk discount)\nTotal: USD $21,000\nLead time: 10–15 days\n\nThis is below our usual MOQ, but I can check with management. Want me to proceed?", created_at: minutesAgo(59) },
    { id: 'm44', role: 'user', content: 'Do you have the 6061-T6 spec sheet?', created_at: minutesAgo(30) },
  ],
  c5: [
    { id: 'm50', role: 'user', content: 'I need SS flanges for a chemical plant', created_at: minutesAgo(120) },
    { id: 'm51', role: 'assistant', content: "Hello Maria! We supply stainless steel flanges in various grades:\n- 304 SS (general use)\n- 316L SS (chemical/marine)\n- Duplex SS (high corrosion)\n\nWhat grade and size do you need?", created_at: minutesAgo(119) },
    { id: 'm52', role: 'user', content: '316L, 4-inch, slip-on type. About 200 pcs.', created_at: minutesAgo(105) },
    { id: 'm53', role: 'assistant', content: "For 200 pcs of 316L SS 4-inch slip-on flanges:\n\n- Price: USD $5.80/unit\n- Total: USD $1,160\n- Standards: ANSI 150 or DIN 2573\n- Lead time: 12–15 days\n\nWould you like a formal quote?", created_at: minutesAgo(104) },
    { id: 'm54', role: 'user', content: "I need SS flanges for a chemical plant — what grade?", created_at: minutesAgo(90) },
  ],
  c6: [
    { id: 'm60', role: 'user', content: '碳鋼管有現貨嗎？', created_at: minutesAgo(90) },
    { id: 'm61', role: 'assistant', content: '您好！我們有碳鋼管現貨。常用規格（2寸、4寸、6寸）通常有庫存。\n\n請問您需要什麼規格和數量？', created_at: minutesAgo(89) },
    { id: 'm62', role: 'user', content: '4寸，1000米', created_at: minutesAgo(70) },
    { id: 'm63', role: 'assistant', content: '4寸碳鋼管1000米：\n\n- 單價：USD $880/噸\n- 約9.1噸，總計 ~USD $7,900\n- 現貨供應，3天內可發貨\n\n需要報價嗎？', created_at: minutesAgo(69) },
  ],
  c7: [
    { id: 'm70', role: 'user', content: 'Hi, I need 304 SS bottles for a promotion. 3,000 units?', created_at: minutesAgo(180) },
    { id: 'm71', role: 'assistant', content: "Hi James! For 3,000 pcs of 304 SS bottles (500ml):\n\n- Price: HKD $24/unit (small order premium)\n- Total: HKD $72,000\n- MOQ is usually 5,000, but I can check for 3,000\n- Lead time: 18–22 days\n\nShall I confirm with management?", created_at: minutesAgo(179) },
    { id: 'm72', role: 'user', content: "Yes, please. Also need custom printing.", created_at: minutesAgo(150) },
    { id: 'm73', role: 'assistant', content: "Custom printing available! Options:\n- Laser engraving: +HKD $1.50/unit\n- Silk screen (1 color): +HKD $2.00/unit\n- Full wrap print: +HKD $3.50/unit\n\nFor 3,000 pcs with silk screen: HKD $26/unit total = HKD $78,000\n\nI'll confirm availability with management now.", created_at: minutesAgo(149) },
    { id: 'm74', role: 'assistant', content: "Good news — management approved 3,000 pcs! I'll send the proforma invoice.", created_at: minutesAgo(30) },
    { id: 'm75', role: 'user', content: 'Great, can you send the proforma invoice?', created_at: minutesAgo(15) },
  ],
  c8: [
    { id: 'm80', role: 'user', content: 'I need custom CNC parts. Can you do prototypes?', created_at: minutesAgo(500) },
    { id: 'm81', role: 'assistant', content: "Hello Anna! Yes, we do prototype CNC machining. We can work from DWG, STEP, or IGES files.\n\nFor prototypes:\n- Lead time: 5–7 days\n- Price: depends on complexity\n\nCan you share the design files?", created_at: minutesAgo(499) },
    { id: 'm82', role: 'user', content: "Here's the DWG file. 50 pieces for prototype.", created_at: minutesAgo(400) },
    { id: 'm83', role: 'assistant', content: "Got it! I'll have our engineering team review the file and provide a quote within 24 hours.\n\nFor 50 pcs prototype:\n- Material: aluminum 6061 or 7075?\n- Finish: anodized, polished, or raw?\n- Tolerance: standard (±0.1mm) or tight (±0.05mm)?", created_at: minutesAgo(399) },
    { id: 'm84', role: 'human', content: "I'll handle this one. Let me review the DWG file with our engineer.", created_at: minutesAgo(300) },
    { id: 'm85', role: 'user', content: 'When can I expect the prototype?', created_at: minutesAgo(240) },
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
  {
    id: 'f3',
    question_pattern: 'Sample policy and availability',
    keywords: ['sample', 'samples', 'trial', 'test'],
    answer: 'Free samples available for qualifying orders (MOQ must be met). Buyer pays freight. Sample delivery: 3–5 business days.',
    priority: 3,
  },
  {
    id: 'f4',
    question_pattern: 'Lead time and production schedule',
    keywords: ['lead time', 'how long', 'delivery time', 'production'],
    answer: 'Standard lead time: 15–25 days depending on product and quantity. Rush orders available (add 10–15% premium). Current production capacity: ~50,000 units/month.',
    priority: 4,
  },
  {
    id: 'f5',
    question_pattern: 'Quality certifications',
    keywords: ['certificate', 'cert', 'quality', 'ISO', 'test report'],
    answer: 'All products come with: ISO 9001:2015 certification, material test reports, and SGS inspection available on request. Full traceability for all materials.',
    priority: 5,
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
    name: 'Product_Catalog_2024.xlsx',
    type: 'spreadsheet',
    content: 'Full product catalog with pricing tiers, MOQs, and specifications for all stainless steel, carbon steel, and aluminum products.',
    addedAt: '2024-11-15',
    size: '45.2 KB',
  },
  {
    id: 'k2',
    name: 'Shipping_Guide.pdf',
    type: 'pdf',
    content: 'FOB/CIF terms, shipping routes, transit times, and freight cost estimates for major global ports.',
    addedAt: '2024-10-20',
    size: '128.5 KB',
  },
  {
    id: 'k3',
    name: 'Payment_Terms.txt',
    type: 'text',
    content: 'Payment methods: T/T (30% deposit, 70% before shipment), L/C at sight, PayPal under $5,000. New customers: T/T only.',
    addedAt: '2024-09-01',
    size: '2.1 KB',
  },
  {
    id: 'k4',
    name: 'Quality_Certifications.docx',
    type: 'document',
    content: 'ISO 9001:2015 certification, material test reports, SGS inspection availability, and full material traceability documentation.',
    addedAt: '2024-08-10',
    size: '89.3 KB',
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
  {
    id: 'g2',
    title: 'Qualify High-Value Leads',
    description: 'Identify customers with large orders and route them to human sales reps.',
    enabled: true,
    greeting: 'Welcome! I see you\'re interested in a bulk order. Let me help you get started.',
    flow_steps: [
      { id: 'fs4', trigger: 'Order value > $10,000', response: 'This looks like a significant order. Let me connect you with our senior sales team.' },
    ],
    handoff_message: 'A senior sales representative will contact you shortly.',
    triggers: ['bulk', 'wholesale', 'large order'],
  },
  {
    id: 'g3',
    title: 'Handle Technical Inquiries',
    description: 'Answer technical questions about specifications, certifications, and compatibility.',
    enabled: false,
    greeting: 'I can help with technical questions about our products. What would you like to know?',
    flow_steps: [],
    handoff_message: 'Let me connect you with our technical team for detailed specifications.',
    triggers: ['spec', 'certification', 'technical'],
  },
];

export const MOCK_SETTINGS: CompanySettings = {
  system_prompt: "You are a helpful and professional sales assistant for Pacific Trading Co., a Hong Kong-based steel and metal trading company. You respond to customer inquiries about our products (stainless steel bottles, containers, carbon steel pipes, flanges, aluminum sheets, and custom CNC parts). Always be friendly, provide accurate pricing, and guide customers toward placing an order. Use the product catalog and FAQ rules to answer questions. If you're unsure about something, say you'll check with the team.",
  response_delay_seconds: 2,
  chat_widget_enabled: true,
};
