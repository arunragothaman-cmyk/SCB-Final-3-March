import { useState, useEffect } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────
const STRATEGY = {
  purpose: "To drive commerce and prosperity through our unique diversity",
  brand: "Here for good",
  description: "A leading international banking group connecting corporate, institutional and affluent clients to sustainable growth opportunities across Asia, Africa and the Middle East. Formed in 1969, headquartered in London, operating in 54 markets with ~82,000 employees. FY2025: Delivered 3-year plan a year early. $20.9B income, $7.9B underlying PBT, 14.7% RoTE. $9.1B shareholder distributions since Feb 2024.",
  pillars: [
    { id: "cb", title: "Cross-Border Banking", desc: "Serve large global corporates and FIs. FY25: FI income at 54% of CIB (target: 60%), cross-border income at 61.5% (target: 70%). Digital transaction initiation at 72.1%. CSAT improved to 76.5%.", icon: "🌍" },
    { id: "af", title: "Affluent & Wealth", desc: "FY25 record: $447B AUM, 275K NTB clients, $52B NNM (#3 Asia). $1.5B investment programme (50% people, 25% digital). Target $200B NNM 2025-2029. Affluent share of WRB income to reach 75% by 2029.", icon: "💎" },
    { id: "ffg", title: "Fit for Growth (Final Year)", desc: "ENTERING FINAL YEAR (2026). Revised target: ~$1.3B savings (from $1.5B). 343 initiatives mobilised; $754M run-rate savings achieved by FY2025. Programme concludes end-2026. Post-FFG focus shifts to sustainable productivity and AI-led growth. Medium-term framework to be published May 2026.", icon: "⚡" },
    { id: "it", title: "Innovate & Transform", desc: "Transform core via digital, new business models and partnerships to scale. Mox (~750K customers) and Trust (1M+ customers) now profitable. Alibaba Cloud AI partnership signed July 2025. Bill Winters' 2026 scorecard includes GenAI strategy and digital assets/tokenisation as personal KPIs.", icon: "🔬" },
    { id: "pc", title: "People & Culture", desc: "Unmatched employee experience, future-ready skills, and inclusion. Talent Marketplace pioneered internally. Skills-Powered Organisation framework co-authored by Tanuj Kapilashrami. NOTE: eNPS declined 3.9 points to 17.56 in FY2025 — a board-level concern amidst FFG restructuring.", icon: "🛡️" },
  ],
  targets: [
    { label: "2024-26 Plan", value: "ACHIEVED", period: "Delivered one year early" },
    { label: "Income Growth (2026)", value: "~5% ccy", period: "Reported basis, bottom of 5-7% range" },
    { label: "Statutory RoTE (2026)", value: ">12%", period: "Reported basis (shift from underlying)" },
    { label: "Costs (2026)", value: "Broadly flat", period: "ccy, incl. final FFG charges" },
    { label: "Shareholder Returns", value: "$9.1B+", period: "Announced since Feb 2024" },
    { label: "CET1 Ratio", value: "13-14%", period: "Target range (actual 14.1%)" },
    { label: "Revenue per FTE", value: "NEW KPI", period: "2026 CEO scorecard measure" },
    { label: "Medium-Term Framework", value: "May 2026", period: "WATCH: New multi-year targets" },
  ],
  ffgTracks: [
    { name: "Organisational Design", saving: "28% of ~$1.3B", desc: "36 initiatives — matrix simplification, regional to business-centric model" },
    { name: "Process Simplification", saving: "22% of ~$1.3B", desc: "95 initiatives — WRB operations: digitising onboarding, due diligence, asset transfers" },
    { name: "Service Delivery & Platforms", saving: "32% of ~$1.3B", desc: "69 initiatives — vendor sourcing, automating end-to-end procurement" },
    { name: "Technology Simplification", saving: "18% of ~$1.3B", desc: "143 initiatives — platform rationalisation and workflow optimisation" },
  ],
};

const FINANCIALS = {
  // ── FY2025 Full Year Results (Underlying basis unless noted) ──
  // Source: SCB Annual Report 2025 pp.1, 17–18, 54–55; FY25 Results Presentation slides 2, 6, 28, 33
  fy2025: {
    headline: [
      { label: "Operating Income", value: "$20.9B", delta: "+6% ccy", prior: "$19.7B" },
      { label: "Profit Before Tax", value: "$7.9B", delta: "+18% ccy", prior: "$6.8B" },
      { label: "Underlying RoTE", value: "14.7%", delta: "+300bps", prior: "11.7%" },
      { label: "Statutory RoTE", value: "11.9%", delta: "+220bps", prior: "9.7%" },
    ],
    secondary: [
      { label: "Cost-to-Income", value: "59.1%", delta: "-80bps" },
      { label: "NIM", value: "2.03%", delta: "-3bps (re-presented)" },
      { label: "CET1 Ratio", value: "14.1%", delta: "-12bps (above 13–14% range)" },
      { label: "Underlying EPS", value: "229.7c", delta: "+37% YoY" },
      { label: "TSR", value: "89.0%", delta: "+35.5ppt" },
      { label: "Dividend/Share", value: "61c", delta: "+65% YoY" },
      { label: "Distributions", value: "$9.1B", delta: "since Feb'24 inc. new $1.5B buyback" },
      { label: "Credit Impairment", value: "$676M", delta: "19bps loan-loss rate" },
    ],
  },
  // ── Income by Product (FY2025, $m) ──
  // Source: Annual Report p.54; Presentation slide 28
  incomeByProduct: [
    { name: "Transaction Services", fy25: 6005, fy24: 6434, yoyCcy: "-7%", isHeader: true },
    { name: "  Payments & Liquidity", fy25: 4155, fy24: 4605, yoyCcy: "-10%" },
    { name: "  Securities & Prime", fy25: 648, fy24: 611, yoyCcy: "+7%" },
    { name: "  Trade & Working Capital", fy25: 1202, fy24: 1218, yoyCcy: "-1%" },
    { name: "Global Banking", fy25: 2229, fy24: 1935, yoyCcy: "+15%", isHeader: true },
    { name: "  Lending & Financial Sol.", fy25: 1905, fy24: 1677, yoyCcy: "+13%" },
    { name: "  Capital Mkts & Advisory", fy25: 324, fy24: 258, yoyCcy: "+26%" },
    { name: "Global Markets", fy25: 3863, fy24: 3450, yoyCcy: "+12%", isHeader: true },
    { name: "  Macro Trading", fy25: 3116, fy24: 2852, yoyCcy: "+9%" },
    { name: "  Credit Trading", fy25: 753, fy24: 644, yoyCcy: "+17%" },
    { name: "Wealth Solutions", fy25: 3086, fy24: 2490, yoyCcy: "+24%", isHeader: true },
    { name: "  Investment Products", fy25: 2347, fy24: 1827, yoyCcy: "+28%" },
    { name: "  Bancassurance", fy25: 739, fy24: 663, yoyCcy: "+12%" },
    { name: "Deposits & Mortgages", fy25: 4080, fy24: 4170, yoyCcy: "-2%", isHeader: true },
    { name: "CCPL & Unsecured", fy25: 1080, fy24: 1081, yoyCcy: "flat", isHeader: true },
    { name: "Ventures", fy25: 415, fy24: 183, yoyCcy: "+125%", isHeader: true },
    { name: "  Digital Banks", fy25: 195, fy24: 142, yoyCcy: "+36%" },
    { name: "  SCV", fy25: 220, fy24: 41, yoyCcy: "n.m." },
    { name: "Treasury & Other", fy25: 136, fy24: -47, yoyCcy: "n.m.", isHeader: true },
  ],
  totalIncome: { fy25: 20894, fy24: 19696, yoyCcy: "+6%" },
  // ── Q4 2025 Quarterly Snapshot ($m) ──
  // Source: Presentation slides 6, 28
  q42025: {
    operatingIncome: 4848,
    pbt: 1235,
    note: "Q4 flat YoY due to weak episodic income in Global Markets ($660M vs $773M in Q4'24). Q1'26 started strongly across CIB and WRB.",
  },
  // ── PBT by Client Segment ($m) ──
  // Source: Annual Report p.55; Presentation slide 33
  pbtBySegment: [
    { name: "CIB", fy25: 5875, fy24: 5431, yoyCcy: "+9%", income: 12394 },
    { name: "WRB", fy25: 2883, fy24: 2537, yoyCcy: "+14%", income: 8464 },
    { name: "Ventures", fy25: -167, fy24: -385, yoyCcy: "loss ↓57%", income: 415 },
    { name: "Central & Other", fy25: -691, fy24: -772, yoyCcy: "loss ↓14%", income: -379 },
  ],
  // ── NII vs Non-NII Split ──
  niiSplit: { nii: 11185, nonNii: 9709, niiPct: 54, nonNiiPct: 46, nonNiiGrowth: "+13% ccy (+17% ex-notables)" },
  // ── Income & PBT Trend (2020–2025) ──
  incomeHistory: [
    { year: "2020", income: 14.8, pbt: 3.0 },
    { year: "2021", income: 14.7, pbt: 3.3 },
    { year: "2022", income: 15.8, pbt: 4.3 },
    { year: "2023", income: 17.4, pbt: 5.1 },
    { year: "2024", income: 19.7, pbt: 6.8 },
    { year: "2025", income: 20.9, pbt: 7.9 },
  ],
  // ── Income by Key Market ($m, FY2025) ──
  // Source: Annual Report p.436; Presentation slide 33
  revenueByMarket: [
    { name: "Hong Kong", fy25: 5347, pbt: 2663, pct: 26, yoy: "+17%" },
    { name: "Singapore", fy25: 3059, pbt: 1142, pct: 15, yoy: "+19%" },
    { name: "UK", fy25: 1665, pbt: 244, pct: 8, yoy: "+15%" },
    { name: "India", fy25: 1499, pbt: 542, pct: 7, yoy: "-3%" },
    { name: "US", fy25: 1201, pbt: 501, pct: 6, yoy: "+28%" },
    { name: "UAE", fy25: 1173, pbt: 562, pct: 6, yoy: "+1%" },
    { name: "China", fy25: 1149, pbt: 376, pct: 5, yoy: "-18%" },
    { name: "Korea", fy25: 1088, pbt: 234, pct: 5, yoy: "-3%" },
    { name: "Taiwan", fy25: 590, pbt: 223, pct: 3 },
    { name: "Other", fy25: 4123, pbt: 1413, pct: 20 },
  ],
  // ── Segment Split ──
  revenueByBU: [
    { name: "CIB", pct: 59, value: "$12.4B", income: 12394 },
    { name: "WRB", pct: 41, value: "$8.5B", income: 8464 },
  ],
  // ── Balance Sheet Highlights ──
  balanceSheet: {
    totalAssets: "$920B (+8%)",
    customerAccounts: "$530B (+14%)",
    loansToCustomers: "$287B (+2%)",
    lcr: "155.4% (+1,720bps)",
    rwa: "$258B (+4%)",
    tnav: "1,730c/share (+12%)",
  },
  // ── 2026 Guidance (REPORTED basis) ──
  // Source: Annual Report p.18; Presentation slide 19
  guidance2026: [
    { metric: "Income Growth", target: "Low end of 5–7%", basis: "Reported, ccy, ex-notables" },
    { metric: "NII", target: "Broadly flat YoY", basis: "Ccy" },
    { metric: "Costs", target: "Broadly flat YoY", basis: "Ccy, inc. final FFG charges" },
    { metric: "Statutory RoTE", target: ">12%", basis: "Reported" },
    { metric: "Medium-term Framework", target: "May 2026", basis: "New targets TBC" },
  ],
  // ── Contextual Notes ──
  softwareImpairmentNote: "Other impairment fell from $588M (FY24) to $42M (FY25) — non-repeat of software asset write-offs. Suggests custom-build depreciation cycle largely complete. Strengthens platform consolidation argument vs ServiceBench.",
  reportingBasisNote: "FROM 2026: All guidance on REPORTED basis (not underlying). Mox/Trust move to WRB segment. SCV moves to Central & Other. All value narratives must be reframed accordingly.",
  alibabaPartnership: "July 2025: Strategic partnership with Alibaba Group — Alibaba Cloud AI deployed in client service, sales intelligence, risk mgmt, compliance. Bank provides cross-border fund management and supply chain financing to Alibaba.",
  q1Outlook: "Q1 2026 started strongly across both CIB and WRB — per Bill Winters and Pete Burrill commentary at results presentation.",
};


const EXECUTIVES = [
  // Tier 0 — CEO
  { id: "bw", name: "Bill Winters", title: "Group Chief Executive", tier: 0, division: "Group", status: "amber", parentId: null, location: "London",
    commentary: "Longest-serving CEO of a major UK bank (since 2015). Wharton MBA, former JP Morgan Co-CEO of Investment Bank. Delivered 3-year plan one year early (14.7% underlying RoTE vs ~13% target). 2026 personal scorecard KPIs include: GenAI strategy creation, digital assets/tokenisation/DLT into mainstream products, Fit for Growth strong finish, Platinum programme execution, and revenue-per-FTE productivity. Blockchain advocate. $9.1B shareholder distributions announced since Feb 2024.",
    priorities: "Revenue-per-FTE productivity (NEW 2026 KPI), GenAI strategy (personal objective), digital assets/tokenisation, Platinum programmes, strong finish on FFG, cross-border and affluent strategy",
    lastEngagement: "Met Chris Bedi — 14 May, Santa Clara", risk: "Low — supportive of transformation agenda",
    opportunityIds: [], strategicThemes: ["ffg", "clientExp", "techRes"] },
  // Tier 1 — ExCo
  { id: "ne", name: "Noelle Eder", title: "Group Head, Technology & Operations", tier: 1, division: "Technology", status: "red", parentId: "bw", location: "Singapore",
    commentary: "⚠️ SINGLE MOST CRITICAL PERSON TO MEET. Appointed May 2025 from Cigna Group (EVP, Global CIO). Previously CIO/CDO at Hilton, Capital One. Forbes CIO Next List (Top 50). Has authority over all technology strategy — can override Ben Issa's 'build' preference. Platform consolidation track record. NEVER BEEN MET. Board Governance Committee explicitly reviewed her appointment in 2025 — confirming the strategic weight of her role. 2026 technology strategy review and Platinum programmes almost certainly sit within her scope. This is our single biggest strategic gap.",
    priorities: "Technology consolidation, vendor rationalisation, digital transformation, Fit for Growth delivery",
    lastEngagement: "Never met — CRITICAL GAP", risk: "CRITICAL — must engage immediately",
    opportunityIds: [3, 5], strategicThemes: ["techRes"] },
  { id: "tk", name: "Tanuj Kapilashrami", title: "Chief Strategy & Talent Officer", tier: 1, division: "Strategy & Talent", status: "green", parentId: "bw", location: "London",
    commentary: "Our strongest executive sponsor and champion. Expanded role April 2024: strategy, transformation, HR, brand, supply chain, CRES. Co-authored 'The Skills-Powered Organisation'. Meets directly with Chris Bedi (ServiceNow CCO). Pioneered internal Talent Marketplace. The HR Hub success is her platform.",
    priorities: "OneSC employee experience, AI-led transformation, Fit for Growth, people strategy, CRES transformation",
    lastEngagement: "Chris Bedi 1:1 with Melinda — 30 March 2026. Knowledge 2026 delegation (4 SCB execs attending)", risk: "Low — strongest advocate",
    opportunityIds: [1, 2, 4], strategicThemes: ["ffg"] },
  { id: "pb", name: "Pete Burrill", title: "Interim Group Chief Financial Officer", tier: 1, division: "Finance", status: "red", parentId: "bw", location: "London",
    commentary: "⚠️ NEVER MET — CRITICAL ENGAGEMENT. Appointed Interim GCFO on 10 Feb 2026, replacing Diego De Giorgi who stepped down. Permanent GCFO search underway — new appointee becomes mandatory early engagement. Pete’s immediate focus: delivering 2026 guidance (statutory RoTE >12%, costs broadly flat) and preparing the May 2026 medium-term financial framework. Key for TCO analysis, FFG ROI, post-FFG cost base sustainability, and 2028 renewal business case. Must arm with shelfware quantification and platform consolidation savings.",
    priorities: "2026 guidance delivery, statutory RoTE >12%, cost discipline (final FFG year), May medium-term framework, shareholder returns continuity",
    lastEngagement: "Never met — engagement required BEFORE May 2026 framework", risk: "CRITICAL — must engage before budgets are set for new framework",
    opportunityIds: [], strategicThemes: ["ffg"] },
  { id: "tp", name: "Tom Pfaff", title: "COO, GCFO Office", tier: 2, division: "Finance", status: "amber", parentId: "pb", location: "London",
    commentary: "NEW BUYING CENTRE (March 2026). Identified as key stakeholder in the GCFO/COO office. Material expansion of account footprint beyond HR and CRES into Finance operations. First outreach and approach to be agreed.",
    priorities: "Finance operations, cost management, operational efficiency",
    lastEngagement: "New contact — first outreach planned", risk: "Medium — new buying centre, approach TBD",
    opportunityIds: [], strategicThemes: ["ffg"] },
  { id: "jh", name: "Judy Hsu", title: "CEO, Wealth & Retail Banking", tier: 1, division: "WRB", status: "amber", parentId: "bw", location: "Singapore",
    commentary: "ExCo member. CEO of $8.5B revenue business (FY2025 underlying). Record wealth performance: $447B affluent AUM, 275K NTB affluent clients, $52B net new money (14% AUM growth), #3 Asia wealth ranking. Wealth Solutions income +24% YoY. Strategic RM hiring programme underway. $1.5B affluent investment programme (50% people, 25% digital). CRM and CSM opportunity is NOW better evidenced than before — client onboarding speed, RM productivity, and servicing quality are the bottlenecks to scaling the affluent growth machine. ENGAGEMENT NEEDED.",
    priorities: "Affluent growth, wealth solutions, RM productivity, digital banking, client experience, regional oversight (ASEAN, South Asia, Greater China, North Asia)",
    lastEngagement: "Never met — ENGAGEMENT NOW WARRANTED given record wealth performance", risk: "HIGH — FSO and CSM opportunities depend on WRB engagement",
    opportunityIds: [6, 7], strategicThemes: ["clientExp"] },
  { id: "jf", name: "Jason Forrester", title: "Group Chief Risk Officer", tier: 1, division: "Risk", status: "grey", parentId: "bw", location: "London",
    commentary: "Group CRO at ExCo level. Leads Risk/Compliance function across 6,000+ employees. Oversees enterprise-wide risk framework. IRM strategic opportunity. DORA and IBS 2025 compliance requirements create urgency for integrated risk management.",
    priorities: "Enterprise risk management, DORA compliance, IBS 2025, regulatory technology, risk culture",
    lastEngagement: "Never met — evaluate engagement need", risk: "Medium — IRM opportunity at stake",
    opportunityIds: [5], strategicThemes: ["techRes"] },
  { id: "rh", name: "Roberto Hoornweg", title: "CEO, Corporate & Investment Banking", tier: 1, division: "CIB", status: "amber", parentId: "bw", location: "Dubai",
    commentary: "Appointed CEO of CIB in December 2025 (previously Co-Head with Sunil Kaushal). Over 30 years banking experience — joined SCB 2017 as Global Head of Financial Markets. Retains oversight of Americas, Europe, Africa and Middle East markets. Member of Group Management Team. MIT economics graduate. Prior experience at Brevan Howard, UBS Investment Bank, Morgan Stanley. NOW CRITICAL: CIB engagement opened March 2026 via Geoff Kot. First entry into $11.7B CIB division. Workshop planned mid-April. Bypasses T&O chain entirely.",
    priorities: "Cross-border strategy, CIB growth, financial markets, EMEA regional oversight",
    lastEngagement: "CIB engagement opened March 2026. Geoff Kot (direct report) leading. Workshop mid-April.", risk: "Low — evaluating relevance",
    opportunityIds: [6, 7], strategicThemes: ["clientExp"] },
  { id: "bh", name: "Benjamin Hung", title: "President, International", tier: 1, division: "Group", status: "grey", parentId: "bw", location: "Hong Kong",
    commentary: "Appointed President, International in April 2024. Chairman of Standard Chartered Bank (Hong Kong), (China) and (Singapore). Joined SCB in 1992 — first Chinese executive elevated to global management. Previously CEO Asia, Regional CEO Greater China & North Asia, CEO Retail Banking and Wealth Management. Member of Group Management Team. Visiting lecturer at Princeton. Co-Chair of B20 Finance & Infrastructure Taskforce. Evaluating if engagement is needed at this stage.",
    priorities: "International strategy, Greater China, wealth management, regional coordination",
    lastEngagement: "Never met — evaluate engagement need", risk: "Low — evaluating relevance",
    opportunityIds: [], strategicThemes: [] },
  { id: "mh", name: "Mary Huen", title: "CEO, Hong Kong & Greater China & North Asia", tier: 1, division: "GCNA", status: "grey", parentId: "bw", location: "Hong Kong",
    commentary: "Appointed August 2024. Over 30 years at SCB (joined 1991). Previously CEO Hong Kong (2017), Cluster CEO HK/Taiwan/Macau (2021). Chairperson of Hong Kong Association of Banks. Executive Director of SC Bank (HK) Limited. Chairperson of Mox Bank. Awarded Best Bank CEO in Hong Kong 2024 by TAB Global. Evaluating if engagement is needed at this stage.",
    priorities: "Hong Kong market leadership, Greater China strategy, digital transformation, RMB internationalisation",
    lastEngagement: "Never met — evaluate engagement need", risk: "Low — evaluating relevance",
    opportunityIds: [], strategicThemes: [] },
  // Tier 2 — Key Stakeholders
  { id: "gv", name: "Guillermo Veiga", title: "Group CIO", tier: 2, division: "Technology", status: "amber", parentId: "ne", location: "Singapore",
    commentary: "⚠️ CRITICAL ACTION: Must meet if we want to land FSO use cases. Promoted 2025 from CIO of WRB. Background: Santander, Amazon, Cisco. Public advocate for 'platform-led, API-first architecture'. Will support ServiceNow adoption and App Engine positioning.",
    priorities: "AI-enabled operations, cloud-native services, platform consolidation, FSO strategy",
    lastEngagement: "Never met — MUST MEET for FSO", risk: "HIGH — FSO opportunity depends on engagement",
    opportunityIds: [6], strategicThemes: ["clientExp"] },
  { id: "bi", name: "Benyameen Issa", title: "CIO, Technology & Architecture", tier: 2, division: "Technology", status: "red", parentId: "ne", location: "Sydney",
    commentary: "⚠️ PRIMARY BLOCKER. Known preference for custom-built platforms. Engineering team advocates proprietary solutions. Creating parallel systems that duplicate licensed ServiceNow capabilities. Avoids ServiceNow meetings. Neutralisation strategy: engage above him via Noelle Eder with business case on waste, speed, TCO.",
    priorities: "Engineering autonomy, custom platform development, internal builds",
    lastEngagement: "Avoids meetings — engagement via leadership required", risk: "CRITICAL — active resistance",
    opportunityIds: [], strategicThemes: [] },
  { id: "ag", name: "Alvaro Garrido", title: "COO T&O and CIO Information Security", tier: 2, division: "Technology", status: "amber", parentId: "ne", location: "Singapore",
    commentary: "Security champion — EXPANDED ROLE: now COO T&O and CIO Information Security (dual hat). 6,678 employees. Evaluating Veza, Armis, and other security platforms. SecOps engagement opportunity. DORA compliance driver. Supporter but we need to increase engagement with him.",
    priorities: "Zero trust architecture, DORA compliance, security operations modernisation",
    lastEngagement: "Q3 2025 via Constance Chang — need to increase engagement", risk: "Medium — supporter, needs more engagement",
    opportunityIds: [3], strategicThemes: ["techRes"] },
  { id: "mk", name: "Melinda McKinley", title: "COO, Strategy & Talent", tier: 2, division: "Strategy & Talent", status: "green", parentId: "tk", location: "Singapore",
    commentary: "Day-to-day operational champion for OneSC. Leads HR service delivery transformation. Strong advocate for platform consolidation. Direct access. HR Hub success story owner.",
    priorities: "OneSC platform delivery, HR transformation, employee experience",
    lastEngagement: "Chris Bedi 1:1 — 30 March 2026. OneSC LIVE (went live 6 April) ✅. Knowledge 2026 speaker (SES8101: AI Agents & Pre-Boarding at Scale, 7 May)", risk: "Low — operationally engaged",
    opportunityIds: [1], strategicThemes: ["ffg"] },
  { id: "sb", name: "Shelley Boland", title: "Head of Global CRES & Workplace Services", tier: 2, division: "Strategy & Talent", status: "green", parentId: "tk", location: "Singapore",
    commentary: "CRES Digital Vision programme sponsor. WSD signed and in delivery (41 digital experiences). Knowledge 2026 speaker confirmed (SES8102). Attended executive summit March 2026. CRES executive visit 30 April London. Strong ServiceNow advocate.",
    priorities: "CRES digital transformation, workplace experience, cost efficiency",
    lastEngagement: "Executive summit March 2026. CRES executive visit 30 April London (Salisbury Sq + PIC site visit). Knowledge 2026 speaker (SES8102: Real Estate to Real Experience)", risk: "Low — strong sponsorship",
    opportunityIds: [4], strategicThemes: ["ffg"] },
  { id: "cp", name: "Cezary Piekarski", title: "Chief Security Officer", tier: 2, division: "Technology", status: "amber", parentId: "ne", location: "Singapore",
    commentary: "CISO. Works closely with Alvaro Garrido. SecOps opportunity. IRM/GRC potential. DORA and IBS 2025 compliance mandates. Generally supportive but relationship needs revival for Veza and Armis use cases.",
    priorities: "DORA compliance, security governance, threat intelligence",
    lastEngagement: "CISO call for Veza being scheduled (March 2026). Executive dinner with Lavy held.", risk: "Medium — supportive, action needed for Veza/Armis",
    opportunityIds: [3], strategicThemes: ["techRes"] },
  { id: "bb", name: "Balachandher Balakrishnan", title: "CIO, Finance & Treasury Technology", tier: 2, division: "Technology", status: "amber", parentId: "gv", location: "Singapore",
    commentary: "Replaces Sean Coppinger (departed). Reports to Guillermo Veiga. 3,129 employees. CIO for Finance & Treasury Technology. Relevant to GCFO/Tom Pfaff buying centre and technology resilience. New contact — engagement approach TBD.",
    priorities: "Finance technology, treasury systems, DORA compliance, technology resilience",
    lastEngagement: "New contact — not yet engaged", risk: "Medium — new relationship to build",
    opportunityIds: [5], strategicThemes: ["techRes"] },
  { id: "cdo", name: "TBH — Chief Data Officer", title: "Chief Data Officer (To Be Hired)", tier: 2, division: "Technology", status: "grey", parentId: "ne", location: "TBD",
    commentary: "Shebani Baweja appointed as Interim CDO. Previously vacant. Key for data strategy and AI governance.",
    priorities: "Data strategy, AI governance, data platform modernisation",
    lastEngagement: "N/A — position vacant", risk: "Medium — leadership gap",
    opportunityIds: [], strategicThemes: [] },
  { id: "wy", name: "Warren Young", title: "Group Head, Fit for Growth Programme", tier: 2, division: "Strategy & Talent", status: "amber", parentId: "tk", location: "Singapore",
    commentary: "Runs SCB’s Fit for Growth programme — ENTERING FINAL YEAR in 2026. Revised target: ~$1.3B (from $1.5B) across 343 initiatives. $754M run-rate savings achieved by FY2025. Programme concludes end-2026. Bank sees ‘new opportunities for better returns from investments outside FFG scope’ — signals post-FFG transformation wave from 2027. CRITICAL: Identify whether any ServiceNow initiatives qualify as ‘Platinum programmes’ (new 2026 board-level tier of prioritised transformation initiatives). Background: Credit Suisse senior COO/CFO roles. Commercially minded, results orientated.",
    priorities: "FFG final year delivery, Platinum programme identification, post-FFG transition planning, value measurement, sustainable efficiency culture",
    lastEngagement: "Aug 27 Group Functions Summit", risk: "Medium — critical for FFG value narrative and Platinum programme intelligence",
    opportunityIds: [1, 2, 4], strategicThemes: ["ffg"] },
  { id: "acb", name: "Andrew Canon-Brookes", title: "Head of Supply Chain Management", tier: 2, division: "Strategy & Talent", status: "amber", parentId: "tk", location: "Singapore",
    commentary: "Heads Supply Chain Management for the bank. Reports to Tanuj Kapilashrami. Met in Oct 2025 to discuss S2P but insufficient interest as our offering didn't seem to add value at that time. Needs re-engagement with stronger value proposition.",
    priorities: "Supply chain optimisation, procurement, S2P transformation",
    lastEngagement: "Oct 2025 — S2P discussion, insufficient interest", risk: "Medium — need stronger value proposition",
    opportunityIds: [], strategicThemes: ["ffg"] },
  { id: "bon", name: "Brian O'Neill", title: "Global Head, Group Transformation", tier: 2, division: "Strategy & Talent", status: "amber", parentId: "tk", location: "Singapore",
    commentary: "Leads Group Transformation function. Reports to Tanuj Kapilashrami. Cares deeply about value measurement for transformation initiatives — will be key for demonstrating ServiceNow platform ROI and FFG contribution.",
    priorities: "Transformation delivery, value measurement, change management",
    lastEngagement: "Limited engagement", risk: "Medium — key for value measurement",
    opportunityIds: [1, 2, 4], strategicThemes: ["ffg"] },
  // Tier 2 — CIB Stakeholders (NEW — March 2026)
  { id: "gk", name: "Geoff Kot", title: "Global Head, CIB Business Platforms & Partnerships; Head of AI, Marketing & Trading", tier: 2, division: "CIB", status: "amber", parentId: "rh", location: "Europe",
    commentary: "KEY NEW CONTACT (March 2026). Decision-maker for CIB business platforms. Reports to Roberto Hoornweg, NOT through T&O chain. Stated philosophy: 'process and people, not just tech' — aligns with ServiceNow positioning. Also newly appointed Head of AI for Marketing & Trading. Three workstreams agreed at 20 March workshop: (1) client lifecycle, (2) AI governance in CIB, (3) Kyriba autonomous treasury innovation. Workshop planned 16-17 April.",
    priorities: "CIB business platforms, client lifecycle modernisation, AI for marketing & trading, intra-day swap liquidity, process optimisation",
    lastEngagement: "20 March 2026 — workshop at ServiceNow Santa Clara. Three workstreams agreed. In-person follow-up mid-April.", risk: "Medium — new relationship, high potential",
    opportunityIds: [6], strategicThemes: ["clientExp"] },
  { id: "cc", name: "Craig Corte", title: "Global Head Digital Channels, Platforms & Partnerships", tier: 3, division: "CIB", status: "amber", parentId: "gk", location: "TBC",
    commentary: "Business owner for Tracks 1 and 2 of the CIB engagement. Responsible for digital channels and partnerships within CIB. Planning call for week of 7 April. Pre-reading on current client journey process requested.",
    priorities: "Digital channels, client platforms, partnerships, client lifecycle",
    lastEngagement: "Named as track owner 1 April 2026. Planning call week of 7 April.", risk: "Medium — new contact, working-level",
    opportunityIds: [6], strategicThemes: ["clientExp"] },
  { id: "jk", name: "Jennifer Ketelaar", title: "MD, US Transaction Banking Sales, TMT", tier: 3, division: "CIB", status: "amber", parentId: "rh", location: "San Francisco",
    commentary: "Coordinator and planning lead for CIB engagement. Originated from Lunar New Year event connection. Disclosed she was given opportunity to replatform entire CIB client lifecycle — starting with Pega. Asked 'What would an implementation pattern look like?' — indicating scope may be broader. Key intelligence source.",
    priorities: "Transaction banking, TMT sector coverage, client lifecycle, CIB sales",
    lastEngagement: "1 April 2026 — confirmed team assignments and workshop dates", risk: "Low — engaged and responsive",
    opportunityIds: [6], strategicThemes: ["clientExp"] },
  { id: "ak", name: "Ankur Kanwar", title: "Global Head Payments Treasury Solutions", tier: 3, division: "CIB", status: "grey", parentId: "rh", location: "TBC",
    commentary: "Track 3 owner: longer-term innovation — intra-day liquidity swaps, wallets, tokenised deposits (Quantum initiative). Relevant to Kyriba autonomous treasury partnership.",
    priorities: "Payments, treasury solutions, digital assets innovation",
    lastEngagement: "Added to thread 1 April 2026", risk: "Low — evaluating",
    opportunityIds: [6], strategicThemes: ["clientExp"] },
  { id: "mw", name: "Mark Willis", title: "Global Head Digital Assets & APIs", tier: 3, division: "CIB", status: "grey", parentId: "rh", location: "TBC",
    commentary: "Track 3 co-owner with Ankur Kanwar. Digital assets, tokenised deposits, wallet infrastructure. Available for 16-17 April workshop option which would cover all three tracks.",
    priorities: "Digital assets, APIs, tokenisation, wallet infrastructure",
    lastEngagement: "Added to thread 1 April 2026", risk: "Low — evaluating",
    opportunityIds: [6], strategicThemes: ["clientExp"] },
  // Tier 2/3 — New from Org Chart (April 2026)
  { id: "rn", name: "Rosalind Ng", title: "COO, WRB and Global Head Operations", tier: 3, division: "Technology", status: "grey", parentId: "ne", location: "Singapore",
    commentary: "Reports to Noelle Eder. 7,424 employees. COO for WRB and Global Head of Operations. Relevant to WRB client experience, FSO, and operational efficiency pursuits.",
    priorities: "WRB operations, client experience, operational efficiency",
    lastEngagement: "Not yet engaged", risk: "Low — evaluating relevance",
    opportunityIds: [6, 7], strategicThemes: ["clientExp"] },
  { id: "je", name: "John Emerson", title: "Global Head Operations, Transactions", tier: 3, division: "Technology", status: "grey", parentId: "ne", location: "Singapore",
    commentary: "Reports to Noelle Eder. 11,914 employees — one of the largest teams under T&O. Directly relevant to FSO Trade Finance, KYC/AML, and transaction operations.",
    priorities: "Transaction operations, trade finance, KYC/AML processing",
    lastEngagement: "Not yet engaged", risk: "Low — evaluating relevance",
    opportunityIds: [6], strategicThemes: ["clientExp"] },
  { id: "ai", name: "Ahsan Ijaz", title: "Chief Architect, AI", tier: 4, division: "Technology", status: "grey", parentId: "bi", location: "Singapore",
    commentary: "Reports to Benyameen Issa. 193 employees. Chief Architect for AI within the engineering team. Key person to understand for AI positioning — could be ally or gatekeeper. SCB building own AI agents (Stancy FX agent) under this team.",
    priorities: "AI architecture, engineering, internal AI agents",
    lastEngagement: "Not yet engaged", risk: "Medium — aligned with Issa engineering preference but AI focus creates potential common ground",
    opportunityIds: [], strategicThemes: ["techRes"] },
  // Tier 3 — Senior Leaders
  { id: "jw", name: "Januar Wayong", title: "Global Head, Engineering", tier: 3, division: "Technology", status: "red", parentId: "bi", location: "Singapore",
    commentary: "⚠️ SAME SENTIMENT AS BEN ISSA. Reports to Ben Issa. Leads global engineering organisation. Previously Head of Technology at ING Neo Innovation, built mobile-only bank for ING Philippines. Background: ING Australia, UBS. Strong engineering culture advocate — likely aligned with Ben Issa's 'build' preference. University of Melbourne (Computer Science/Engineering).",
    priorities: "Engineering excellence, platform development, cloud-first strategy, developer experience",
    lastEngagement: "No direct engagement", risk: "HIGH — aligned with Ben Issa's build preference",
    opportunityIds: [], strategicThemes: [] },
  { id: "sba", name: "Shebani Baweja", title: "Interim Chief Data Officer", tier: 2, division: "Technology", status: "amber", parentId: "ne", location: "Singapore",
    commentary: "Appointed Interim CDO following David Hardoon's departure. Key stakeholder for AI governance, data strategy, and AI Control Tower. Engagement approach TBD — must build relationship quickly given AICT go-live 30 April.",
    priorities: "Data strategy, AI governance, data platform modernisation, AI Control Tower",
    lastEngagement: "New contact — not yet engaged", risk: "Medium — new appointment, critical for AI governance",
    opportunityIds: [1, 6], strategicThemes: ["techRes"] },
  { id: "mkor", name: "Martin Kornicki", title: "COO, CABM / Group Strategy / HR", tier: 3, division: "Strategy & Talent", status: "green", parentId: "mk", location: "London",
    commentary: "Leads COO team for Corporate Affairs, Brand and Marketing (CABM), Group Strategy, and Human Resources. Reports to Melinda McKinley. Key operational leader for S&T functions.",
    priorities: "CABM operations, Group Strategy support, HR operations",
    lastEngagement: "Regular via Melinda", risk: "Low — operational ally",
    opportunityIds: [1], strategicThemes: ["ffg"] },
  { id: "sl", name: "Steve Leighton", title: "Head, Digital Strategy & Innovation (S&T)", tier: 3, division: "Strategy & Talent", status: "amber", parentId: "mk", location: "London",
    commentary: "Heads Digital Strategy and Innovation for Strategy & Talent function. Reports to Melinda McKinley. Key for digital transformation initiatives and innovation agenda within S&T.",
    priorities: "Digital strategy, innovation initiatives, S&T transformation",
    lastEngagement: "Limited engagement", risk: "Medium — digital innovation opportunity",
    opportunityIds: [1, 4], strategicThemes: ["ffg"] },
  { id: "ls", name: "Lavy Stokhamer", title: "MD, Global Head of Cybersecurity & Anti-Crime Technology", tier: 3, division: "Technology", status: "amber", parentId: "cp", location: "Singapore",
    commentary: "Reports to Cezary Piekarski. Leads global Cybersecurity and Anti-Crime Technology across Cyber Defense, Fraud, AML, Screening and Digital Assets. Driving secure cross-border and affluent client growth through scalable data platforms, advanced analytics and AI-enabled risk management. Influential for both security platform opportunities and FSO financial crime use cases.",
    priorities: "Cybersecurity operations, fraud prevention, AML technology, anti-crime analytics, AI-enabled risk management",
    lastEngagement: "Executive dinner held March 2026. CISO call (Cezary) being scheduled for Veza.", risk: "Medium — key for security and FSO financial crime",
    opportunityIds: [3, 5, 6], strategicThemes: ["techRes", "clientExp"] },
  // Tier 4 — Operational Leaders
  { id: "rg", name: "Rama Gatiganti", title: "Global Head, Service Delivery Platform", tier: 4, division: "Technology", status: "amber", parentId: "jw", location: "Singapore",
    commentary: "Reports to Januar Wayong. SDP programme lead. Strategic transformation initiatives. Key operational contact for platform strategy. Important for ServiceNow platform adoption within engineering.",
    priorities: "Service delivery platform, strategic transformation programmes, platform strategy",
    lastEngagement: "Monthly", risk: "Medium — key operational contact",
    opportunityIds: [5], strategicThemes: ["techRes"] },
  { id: "id", name: "Isaiah Das", title: "Global Head, myHR & Digital Service Experience", tier: 4, division: "Strategy & Talent", status: "green", parentId: "mkor", location: "Singapore",
    commentary: "Reports to Martin Kornicki. Great supporter for ServiceNow. Heads the myHR programme and Digital Service Experience. Key champion for HR Hub success and ongoing expansion.",
    priorities: "myHR programme, digital service experience, HR Hub expansion",
    lastEngagement: "Regular engagement", risk: "Low — strong supporter",
    opportunityIds: [1], strategicThemes: ["ffg"] },
];

const VALUE_DELIVERED = {
  total: 11242012,
  byDomain: [
    { domain: "Virtual Agent", value: 8135414, hours: 2311197, detail: "VA deflection ($6.8M) + requestor time savings ($1.3M). 3.9M conversations/month." },
    { domain: "ITSM", value: 1361210, hours: 385853, detail: "Request mgmt ($769K), Incident mgmt ($503K), Change ($81K), Problem ($9K)" },
    { domain: "AI Search & Now Assist", value: 1159988, hours: 329542, detail: "Search deflection ($827K), Genius Search ($185K), AI Search savings ($138K), LLM calls ($10K)" },
    { domain: "HR & EJM", value: 338376, hours: 80531, detail: "HR case mgmt fulfiller efficiency ($277K), Employee Journey Mgmt ($61K)" },
    { domain: "Knowledge Mgmt", value: 121497, hours: 34516, detail: "KB article views — requestor time savings. 912K articles viewed (+65% YoY)." },
    { domain: "ITOM & Discovery", value: 68267, hours: 19394, detail: "Discovery ($43K), AIOps alert automation ($25K)" },
    { domain: "GRC & Risk", value: 38318, hours: 4234, detail: "Risk assessment automation — 882 assessments (10x peer median)" },
    { domain: "Process Mining", value: 11354, hours: 3226, detail: "Automated discovery and mapping — 9.6 projects mined" },
    { domain: "ITAM (SAM + HAM)", value: 5380, hours: 892, detail: "SAM normalisation ($4.3K), SAM models ($615), HAM automation ($444)" },
    { domain: "Other", value: 2208, hours: 12, detail: "Integration Hub ($2.2K), Demand Mgmt ($35)" },
  ],
};

const ADOPTION_DATA = {
  products: [
    { family: "ITSM", products: ["Incident", "Problem", "Change", "Request", "Knowledge"], adoption: "High", users: "66,653 UU (95%)", status: "green", notes: "Core platform. 951K incidents/month, 1.5M requests/month — above P75 peers. +13% YoY task growth." },
    { family: "HRSD", products: ["Case Management", "Employee Centre", "Lifecycle Events", "Document Mgmt"], adoption: "High", users: "132,723 HR (166% of entitlement)", status: "green", notes: "OneSC flagship. 525K HR cases/month (2.9x peer median). 104K productive hours saved/year. 86% satisfaction. Overage needs true-up." },
    { family: "ITOM", products: ["AIOps", "Discovery", "Event Mgmt", "Cloud Observability"], adoption: "High", users: "49,311 SU (82%)", status: "green", notes: "82% utilisation — healthy. 84,798 automation executions/day. Below peer P75 for ITOM Visibility; automation solid." },
    { family: "ITAM (SAM)", products: ["Software Asset Management"], adoption: "High", users: "60,993 SU (94%)", status: "green", notes: "94% utilisation — near capacity. $1B annual tech spend justifies investment." },
    { family: "ITAM (HAM)", products: ["Hardware Asset Management"], adoption: "High", users: "47,983 SU (96%)", status: "green", notes: "96% utilisation — near capacity. Strong operational usage." },
    { family: "SecOps SIR", products: ["Security Incident Response"], adoption: "High", users: "66,653 UU (95%)", status: "green", notes: "Shared UU count with ITSM. SIR well integrated into security ops." },
    { family: "Enterprise Architecture", products: ["Enterprise Architecture Professional"], adoption: "High", users: "1,731 BA (87%)", status: "green", notes: "87% utilisation — strong adoption." },
    { family: "Virtual Agent", products: ["VA", "Now Assist VA"], adoption: "High", users: "3.9M conversations/month", status: "green", notes: "100x peer median. +101% YoY. The standout success metric across the entire estate." },
    { family: "App Engine", products: ["App Engine Enterprise", "Custom Apps"], adoption: "High", users: "~1,535 FU (287% of entitlement)", status: "amber", notes: "Massive overage: 535 entitled, ~1,535 actual. 248K custom flows/month (+30% YoY). Needs true-up." },
    { family: "WSD", products: ["Workplace Service Delivery Enterprise"], adoption: "Implementing", users: "10,000 entitled / 0 active", status: "amber", notes: "Signed with Shelley Boland. 41 digital experiences in delivery. Go-live in progress — not a failure, an investment in motion." },
    { family: "AI & Data", products: ["AI Control Tower", "RaptorDB Pro", "GenAI Controller", "AI Search"], adoption: "Emerging", users: "65 SU (AICT); 211K GAI results/month", status: "amber", notes: "AICT go-live 30 April. GenAI Controller at Medium Use. AI Search at Low Use (43K users). RaptorDB Pro at Low Use." },
    { family: "Now Assist", products: ["Now Assist ITSM", "Now Assist AI Search", "Now Assist Panel", "Now Assist VA"], adoption: "Low", users: "33,678 (ITSM); 39,021 (Search); 7,638 (VA)", status: "red", notes: "30M assists entitled, 575K consumed (1.9%). ITSM and Search activating. HR, ITOM, Security, CS, Portfolio Mgmt all Not In Use. Critical activation gap." },
    { family: "IRM / GRC", products: ["IRM Professional", "TPRM", "BCM", "PA for GRC"], adoption: "Low", users: "70,000 UU (scope-restricted)", status: "red", notes: "Contractually limited to Policy, GRC, Risk, Op Resilience. 882 risk assessments/month (10x peer median — good). BCM at 8%, TPRM at 51%. Mixed picture." },
    { family: "SecOps VR", products: ["Vulnerability Response"], adoption: "Low", users: "Shared 66,653 UU (not VR-specific)", status: "red", notes: "Usage unclear — shared UU count masks actual product adoption. Databricks integration incomplete. Downsell candidate." },
    { family: "H&S", products: ["Health & Safety Professional"], adoption: "Implementing", users: "1,000 entitled / 20 active", status: "amber", notes: "In active implementation alongside CRES Digital Vision. Not at risk — ramping." },
    { family: "SPM", products: ["Strategic Portfolio Management"], adoption: "Low", users: "8 demands/month (vs 1,466 peer median)", status: "red", notes: "Severely under-used. 100 users entitled, 1 active. Below P25 peers." },
    { family: "Performance Analytics", products: ["PA Pro", "Reporting", "Platform Analytics"], adoption: "High", users: "42,375 reports; 12,280 dashboard views", status: "green", notes: "PA Pro and Reporting at High Use (+24% YoY). Platform Analytics at High Use." },
    { family: "Service Portal & Catalog", products: ["Service Portal", "Service Catalog", "Employee Center"], adoption: "High", users: "2.2M sessions/month; 191K catalog items", status: "green", notes: "Portal +94% YoY, Catalog +10% YoY. Employee Center at Medium Use (28K searches)." },
  ],
  downsellRisk: {
    total: "$4M",
    at36Months: true,
    products: ["Now Assist (1.9% of 30M assists)", "SecOps VR (unclear usage)", "SPM (8 vs 1,466 peer median)", "BCM (8% utilisation)"],
    mainThreat: "ServiceBench + Low Now Assist Activation",
    threatDescription: "Two distinct risks: (1) ServiceBench — homegrown alternative actively positioned for underutilised areas. (2) Now Assist — $897K contracted, 1.9% consumed. 9 of 13 Now Assist products are Not In Use. If AI value is not demonstrated before the 2028 renewal, both the AI investment and the at-risk operational products face downsell pressure.",
  },
  successMeasure: {
    metric: "Platform Adoption Health",
    target: ">70%",
    description: "Adoption rate for at-risk solutions — measured via telemetry. Current: 8 High Use, 4 Medium, 12 Low, 17 Not In Use across horizontal products.",
  },
};

const GROWTH_OPPORTUNITIES = [
  { id: 1, pursuit: "EmployeeWorks & AI Expansion", nnacv: "$2M", probability: "High", stage: "Active", theme: "ffg", year: "2026", progress: "active",
    products: ["EmployeeWorks", "NowAssist", "Agentic AI", "AI Control Tower"],
    sponsor: "Tanuj Kapilashrami / Melinda McKinley",
    executiveIds: ["tk", "mk", "sba", "wy", "bon", "mkor", "id", "sl"],
    competes: "ServiceBench (displace)", partner: "Infosys (MSP)",
    description: "OneSC LIVE (6 April ✅). Agentic AI for Onboarding go-live 24 April. AICT Phase 1 MVP confirmed 30 April. EmployeeWorks (Moveworks) $2.25M deal progressing. Drives revenue-per-FTE (CEO KPI) and eNPS recovery.",
    items: [
      { name: "EmployeeWorks (Moveworks)", est: "$2.25M", status: "Active", detail: "Action layer on OneSC (now LIVE). Bhavin Shah engagement with Melinda progressing. $2.25M pipeline." },
      { name: "Agentic AI for Onboarding", est: "$200K", status: "Go-Live", detail: "Go-live confirmed 24 April 2026. MVP presented. Sponsor: Melinda McKinley." },
      { name: "NowAssist Expansion", est: "$250K", status: "Pipeline", detail: "Contracted June 2025. Expansion beyond HR to ITSM/ITOM." },
      { name: "AI Control Tower", est: "$150K", status: "Implementing", detail: "Phase 1 MVP with Infosys. 500-unit entitlement. Go-live 30 April (confirmed). Blockers: SAE visibility rules, versioning. Interim CDO engagement TBD." },
    ]},
  { id: 2, pursuit: "Legal Service Delivery & Contract Management", nnacv: "$500K", probability: "High", stage: "Active", theme: "ffg", year: "2026", progress: "stalled",
    products: ["Legal Service Delivery", "Contract Lifecycle Management", "Matter Management"],
    sponsor: "Legal function / Tanuj Kapilashrami",
    executiveIds: ["tk", "wy", "bon"],
    competes: "ServiceBench (displace)", partner: "Infosys (MSP)",
    description: "New domain: digitise legal ops with matter management, contract lifecycle, and approval workflows. Strong executive sponsorship under Tanuj. Extends platform consolidation into FFG final-year savings.",
    items: [
      { name: "Legal Service Delivery", est: "$250K", status: "Requirements gathering", detail: "Legal ops transformation — matter management, request intake" },
      { name: "Contract Lifecycle Management", est: "$250K", status: "Opportunity", detail: "Contract authoring, approval workflows, obligation tracking" },
    ]},
  { id: 3, pursuit: "Security Platform Expansion (Veza & Armis)", nnacv: "$1.6M", probability: "Medium", stage: "Developing", theme: "techRes", year: "2027", progress: "active",
    products: ["Veza", "Armis", "SecOps VR", "IRM", "AI Governance"],
    sponsor: "Alvaro Garrido / Cezary Piekarski",
    executiveIds: ["ag", "cp", "ne", "ls"],
    competes: "MetricStream (incumbent)", partner: "Infosys (MSP)",
    description: "Veza (identity security) and Armis (asset visibility) for DORA compliance. SecOps integration with Databricks. Software write-offs ($588M to $42M) signal custom-build depreciation complete — strengthens consolidation case.",
    items: [
      { name: "Veza Identity Security", est: "$600K", status: "Active", detail: "Executive dinner with Lavy held. CISO call (Cezary) being scheduled. Primary entry point for broader security platform." },
      { name: "Armis Asset Intelligence", est: "$500K", status: "Evaluation", detail: "Asset visibility, vulnerability management — security engineering priority" },
      { name: "SecOps Integration Completion", est: "$500K", status: "Developing", detail: "Databricks security stack integration — reduce downsell risk" },
    ]},
  { id: 4, pursuit: "CRES Digital Vision Programme", nnacv: "$1M", probability: "High", stage: "Active", theme: "ffg", year: "2026", progress: "stalled",
    products: ["WSD", "Custom Apps", "Integrations"],
    sponsor: "Shelley Boland / Storm Dalati",
    executiveIds: ["sb", "tk", "wy", "bon", "sl"],
    competes: "ServiceBench (displace)", partner: "JLL (CRES partner)",
    description: "41 digital experiences across 7 priority areas: visitor management, smart lockers, client suites, frictionless access. Potential Platinum programme candidate. Contributes to eNPS recovery and revenue-per-FTE.",
    items: [
      { name: "Visitor Management System", est: "$200K", status: "Requirements gathered", detail: "Pre-registration, digital check-in, badge printing, NDA" },
      { name: "Smart Locker System", est: "$150K", status: "Requirements gathered", detail: "Automated allocation, temp storage, integration with RFID/QR" },
      { name: "Client Suite & Event Management", est: "$200K", status: "Requirements gathered", detail: "Booking, catering, AV, attendee management" },
      { name: "Frictionless Client Access", est: "$150K", status: "Requirements gathered", detail: "QR/NFC check-in, real-time access control, security integration" },
      { name: "Employee Digital Menu & Kiosk", est: "$150K", status: "Requirements gathered", detail: "Food pre-ordering, dietary preferences, kiosk interface" },
      { name: "Service Call Button", est: "$75K", status: "Requirements gathered", detail: "One-touch hospitality request, real-time routing" },
      { name: "Space Finding & Wayfinding", est: "$75K", status: "Opportunity", detail: "Indoor navigation, desk booking, occupancy analytics" },
    ]},
  { id: 6, pursuit: "Financial Services Operations (FSO) & CIB", nnacv: "$4M", probability: "Medium", stage: "Developing", theme: "clientExp", year: "2027", progress: "active",
    products: ["FSO", "App Engine", "Agentic AI", "AI Control Tower", "Kyriba Autonomous Treasury"],
    sponsor: "Geoff Kot / Roberto Hoornweg / Guillermo Veiga",
    executiveIds: ["gk", "cc", "jk", "ak", "mw", "gv", "rh", "sba", "je", "rn"],
    competes: "Pega (selected for CIB client lifecycle replatform — ServiceNow plays adjacency), Microsoft (MAC agreement), ServiceBench (not a factor in CIB — reports through Roberto, not T&O)", partner: "Kyriba (autonomous treasury partnership), Infosys (MSP)",
    description: "BREAKTHROUGH: First entry into CIB ($12.4B income division). New buying centre opened March 2026 via Geoff Kot, bypassing T&O chain entirely. Three workstreams agreed: (1) Client lifecycle/bank account management, (2) AI Control Tower governance for CIB, (3) Kyriba autonomous treasury innovation. Workshop planned 16-17 April. Bank account management agreed as first use case. Agent-to-agent interoperability (ServiceNow ↔ SCB Stancy agent) a key differentiator. Conservative $2-3M pipeline within 6 months; stretch $5M+ over 18-24 months.",
    items: [
      { name: "Track 1: Client Lifecycle & Bank Account Mgmt", est: "$1.2M", status: "Developing", detail: "First use case agreed. Craig Corte as business owner. Workshop mid-April. Pega adjacency play — operational workflow orchestration around client lifecycle." },
      { name: "Track 2: AI Control Tower in CIB", est: "$300K", status: "Active", detail: "Connects AICT end-of-April go-live to CIB needs. CEO Scorecard visibility. Shebani Baweja + Geoff Kot alignment." },
      { name: "Track 3: Kyriba Autonomous Treasury", est: "$1M", status: "Exploratory", detail: "Intra-day liquidity swaps, tokenised deposits, wallet infrastructure. Ankur Kanwar + Mark Willis. Quantum initiative." },
      { name: "VISA Disputes Management", est: "$500K", status: "Early", detail: "Co-exist with ServiceBench in CIB context." },
    ]},
  { id: 7, pursuit: "Revenue Growth & Client Experience", nnacv: "$2.5M", probability: "Medium", stage: "Visionary", theme: "clientExp", year: "2027", progress: "stalled",
    products: ["CRM", "Agentic AI", "CSM", "Client Portal"],
    sponsor: "Judy Hsu (WRB) / Roberto Hoornweg (CIB)",
    executiveIds: ["jh", "rh"],
    competes: "Microsoft (MAC agreement), ServiceBench", partner: "TCS (to explore)",
    description: "CRM for wealth RM productivity (digital banker, financial planner). CSM for private banking client service. SC Ventures innovation partnership. Aligned to bank's $447B AUM growth engine and $1.5B affluent investment programme.",
    items: [
      { name: "CRM for Wealth RM Productivity", est: "$1M", status: "Concept", detail: "Digital banker, financial planner tools" },
      { name: "CSM for Private Banking", est: "$500K", status: "Concept", detail: "Client service excellence" },
      { name: "SC Ventures Innovation Partnership", est: "$500K", status: "Exploratory", detail: "Joint innovation programme" },
      { name: "Client Portal & Self-Service", est: "$500K", status: "Concept", detail: "Digital client experience" },
    ]},
  { id: 8, pursuit: "Strategic Customer Success", nnacv: "$1M", probability: "High", stage: "Active", theme: "ffg", year: "2026", progress: "active",
    products: ["Customer Success", "Adoption Services", "Value Realisation", "Executive Health Review"],
    sponsor: "Tanuj Kapilashrami / Melinda McKinley",
    executiveIds: ["tk", "mk", "wy", "bon"],
    competes: "N/A — strategic investment", partner: "Infosys (MSP)",
    description: "Dedicated senior customer success engagement to drive adoption, protect $4M at-risk CACV, and build the quantified value narrative for the 2028 renewal. Directly supports revenue-per-FTE measurement and post-FFG productivity sustainability.",
    items: [
      { name: "Dean Lee — Customer Success Executive", est: "$400K", status: "Active", detail: "Assigned. Dedicated resource driving adoption across stalled product areas. 2 days/week onsite." },
      { name: "Platform Architect / Integrated Success Plan", est: "$300K", status: "Pursuing", detail: "Roadmap to $1M+ ISP add-on via Impact programme. Structural answer to delivery skill gap constraining AICT and other programmes." },
      { name: "Telemetry-based value assessment", est: "$200K", status: "Not Started", detail: "Quantify $value delivered to support revenue-per-FTE narrative and renewal positioning" },
      { name: "Executive Health Review", est: "$100K", status: "Not Started", detail: "Annual domain review with CEG leadership and bank executives" },
    ]},
];

// ─── Theme & Styles ──────────────────────────────────────────────────────────
const colors = {
  // Standard Chartered Brand Palette — Light Theme (Projector-Optimised)
  // SC Blue #0072AA, SC Teal #00A896, SC Navy #2C3A87
  bg: "#F7F8FC",
  bgCard: "#FFFFFF",
  bgHover: "#EEF1F8",
  bgPanel: "#F0F2F8",
  border: "#DDE1EC",
  borderLight: "rgba(0,168,150,0.15)",
  green: "#008A7B",          // SC Teal deepened for white bg
  greenDark: "#006B5E",
  greenGlow: "rgba(0,138,123,0.08)",
  blue: "#0066B3",           // SC Blue deepened for white bg
  blueGlow: "rgba(0,102,179,0.08)",
  amber: "#D97B00",
  amberGlow: "rgba(217,123,0,0.07)",
  red: "#C92A2A",
  redGlow: "rgba(201,42,42,0.07)",
  textPrimary: "#1A1F3C",
  textSecondary: "#4A4E5A",
  textMuted: "#7C8290",
  white: "#FFFFFF",
};

const statusColors = {
  green: { bg: colors.greenGlow, color: colors.green, label: "Strong Ally" },
  amber: { bg: colors.amberGlow, color: colors.amber, label: "Needs Development" },
  red: { bg: colors.redGlow, color: colors.red, label: "Risk / No Relationship" },
  grey: { bg: "rgba(124,130,144,0.08)", color: "#7C8290", label: "Evaluating Need" },
};

// ─── Components ──────────────────────────────────────────────────────────────

function Sidebar({ active, setActive }) {
  const sections = [
    { id: "dashboard", label: "Executive Summary", icon: "📄" },
    { id: "apac", label: "Internal Summary", icon: "⭐" },
    { id: "customer", label: "Customer View", icon: "👤" },
    { id: "strategy", label: "Strategy", icon: "◆" },
    { id: "financials", label: "Financials", icon: "◇" },
    { id: "orgchart", label: "Org & Stakeholders", icon: "▣" },
    { id: "team", label: "Account Team", icon: "👥" },
    { id: "adoption", label: "Adoption & Renewal", icon: "🤝" },
    { id: "growth", label: "Growth & Upsell", icon: "▲" },
    { id: "actions", label: "Actions", icon: "✓" },
    { id: "telemetry", label: "Platform Telemetry", icon: "📊" },
    { id: "migration", label: "Migration Simulation", icon: "⚡" },
    { id: "licenses", label: "License Entitlements", icon: "📋" },
  ];
  return (
    <div style={{ width: 220, minHeight: "100vh", background: "linear-gradient(180deg, #1E2D5A 0%, #142040 100%)", borderRight: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, zIndex: 100 }}>
      <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg, #00A896, #0072AA)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#FFFFFF" }}>SC</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#E8EDF2", letterSpacing: "0.02em" }}>Standard Chartered</div>
            <div style={{ fontSize: 10, color: "#8A9BB5", letterSpacing: "0.05em", textTransform: "uppercase" }}>Marquee Account Plan</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "12px 8px" }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => setActive(s.id)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", marginBottom: 2, border: "none", borderRadius: 8, cursor: "pointer", transition: "all 0.2s",
              background: active === s.id ? "rgba(0,168,150,0.15)" : "transparent",
              color: active === s.id ? "#4DD0C0" : "#8A9BB5",
              fontWeight: active === s.id ? 600 : 400, fontSize: 13 }}>
            <span style={{ fontSize: 16, opacity: active === s.id ? 1 : 0.5 }}>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.1)", fontSize: 10, color: "#607080" }}>
        <div>CACV: <span style={{ color: "#00A896", fontWeight: 700 }}>$13.1M</span></div>
        <div>Next Renewal: <span style={{ color: "#F5A623", fontWeight: 600 }}>28 Dec 2028</span></div>
        <div style={{ marginTop: 6, paddingTop: 6, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: 9, color: "#607080", marginBottom: 2 }}>CSE: <span style={{ color: "#00A896" }}>Dean Lee</span></div>
        </div>
        <div style={{ marginTop: 4, opacity: 0.6 }}>ServiceNow · FY2026</div>
        <div style={{ marginTop: 4, opacity: 0.6 }}>Last updated: 9 April 2026</div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, sub, accent = colors.green }) {
  return (
    <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, padding: "18px 20px", flex: "1 1 0" }}>
      <div style={{ fontSize: 11, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: accent, lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function StatusDot({ status, size = 10 }) {
  const c = statusColors[status] || statusColors.grey;
  return <div style={{ width: size, height: size, borderRadius: "50%", background: c.color, boxShadow: `0 0 8px ${c.color}40` }} />;
}

function SimpleBar({ value, max, color = colors.green, height = 8 }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div style={{ width: "100%", height, borderRadius: height / 2, background: colors.border }}>
      <div style={{ width: `${pct}%`, height: "100%", borderRadius: height / 2, background: color, transition: "width 0.8s ease" }} />
    </div>
  );
}

// ─── Executive Summary (Dashboard) ───────────────────────────────────────────
function DashboardView() {
  return (
    <div>
      {/* HEADER - FIRST */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
        <div style={{ width: 50, height: 50, background: `linear-gradient(135deg, ${colors.green}, ${colors.blue})`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 20, color: "#FFFFFF" }}>SC</div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: colors.textPrimary, margin: 0 }}>Standard Chartered PLC</h1>
          <p style={{ fontSize: 14, color: colors.textSecondary, margin: "6px 0 0" }}>Marquee Account · Interactive Plan · FY2026</p>
        </div>
      </div>
      
      {/* ACCOUNT STORY - SECOND */}
      <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary, margin: "0 0 14px" }}>Account Story</h3>
        <div style={{ position: "relative", paddingTop: 10, overflowX: "auto" }}>
          <div style={{ position: "absolute", top: 30, left: 0, right: 0, height: 2, background: colors.border }} />
          <div style={{ display: "flex", gap: 0, justifyContent: "space-between", position: "relative", minWidth: 900 }}>
            {[
              { date: "Dec 2017", label: "First Contract", value: "$800K", color: colors.textMuted },
              { date: "Jan 2023", label: "Growth Phase", value: "$8.8M", color: colors.blue },
              { date: "Dec 2023", label: "Renewal with\nMSP + Impact", value: "$10M", delta: "+$1.2M (+14%)", color: colors.amber },
              { date: "June 2025", label: "AI Tailwind\nRe-contracted", value: "$12.6M", delta: "+$2.6M (+26%)", color: colors.green },
              { date: "Jan 2026", label: "Upsell: New Buying\nCenter (WSD)", value: "$13.1M", delta: "+$0.5M (+4%)", color: colors.green },
              { date: "Nov 2027", label: "Vision: Adopt First,\nExpand Bold", value: "$18-20M", delta: "+$5-7M (+38-53%)", color: colors.green, glow: true },
            ].map((m, i) => (
              <div key={i} style={{ flex: "0 0 16%", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                <div style={{ width: m.glow ? 14 : 12, height: m.glow ? 14 : 12, borderRadius: "50%", background: m.color, border: `2px solid ${colors.bg}`, marginBottom: 8, zIndex: 1, boxShadow: m.glow ? `0 0 12px ${m.color}60` : "none" }} />
                <div style={{ fontSize: 11, fontWeight: 700, color: m.color, marginBottom: 4, textAlign: "center" }}>{m.date}</div>
                <div style={{ fontSize: 10, color: colors.textMuted, marginBottom: 6, textAlign: "center", lineHeight: 1.3, whiteSpace: "pre-line" }}>{m.label}</div>
                <div style={{ fontSize: m.glow ? 20 : 18, fontWeight: m.glow ? 800 : 700, color: m.color, textAlign: "center" }}>{m.value}</div>
                {m.delta && <div style={{ fontSize: 9, color: colors.green, marginTop: 2, textAlign: "center" }}>{m.delta}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* METRICS - THIRD */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <MetricCard label="Current CACV" value="$13.1M" sub="+31.7% YoY" />
        <MetricCard label="CACV Target (Nov 2027)" value="$21-23M" sub="Conservative growth target" accent={colors.blue} />
        <MetricCard label="Total NNACV Potential" value="$12-14M" sub="Conservative estimate" accent={colors.green} />
      </div>
      
      {/* WATERFALL CHART - FOURTH */}
      <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary, margin: "0 0 16px" }}>CACV Waterfall: The Mathematics of Growth</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 220, padding: "0 20px" }}>
          {/* Current CACV */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: colors.green, marginBottom: 8 }}>$13.1M</div>
            <div style={{ width: "100%", height: 130, background: `linear-gradient(180deg, ${colors.green}, ${colors.greenDark})`, borderRadius: "6px 6px 0 0", position: "relative" }}>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: 11, fontWeight: 600, color: "#FFFFFF", textAlign: "center" }}>Current<br/>CACV</div>
            </div>
            <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 8, textAlign: "center" }}>Feb 2026</div>
          </div>
          
          {/* At-Risk (shown as portion of current CACV) */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: colors.red, marginBottom: 8 }}>-$4M</div>
            <div style={{ width: "100%", height: 130, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <div style={{ width: "100%", height: 40, background: `repeating-linear-gradient(45deg, ${colors.red}20, ${colors.red}20 10px, ${colors.red}40 10px, ${colors.red}40 20px)`, borderRadius: "6px 6px 0 0", border: `2px dashed ${colors.red}`, position: "relative" }}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: 10, fontWeight: 600, color: colors.red, textAlign: "center" }}>At-Risk</div>
              </div>
            </div>
            <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 8, textAlign: "center" }}>IRM, SecOps,<br/>ITOM, SAM</div>
          </div>
          
          {/* Protected Floor */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: colors.amber, marginBottom: 8 }}>$9.1M</div>
            <div style={{ width: "100%", height: 130, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <div style={{ width: "100%", height: 90, background: `linear-gradient(180deg, ${colors.amber}, #c4851c)`, borderRadius: "6px 6px 0 0", position: "relative" }}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: 11, fontWeight: 600, color: "#FFFFFF", textAlign: "center" }}>Protected<br/>Floor</div>
              </div>
            </div>
            <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 8, textAlign: "center" }}>If at-risk<br/>lost</div>
          </div>
          
          {/* Expansion (positive) */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: colors.blue, marginBottom: 8 }}>+$12-14M</div>
            <div style={{ width: "100%", height: 130, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <div style={{ width: "100%", height: 100, background: `linear-gradient(180deg, ${colors.blue}, #3577cc)`, borderRadius: "6px 6px 0 0", position: "relative", border: `2px solid ${colors.blue}` }}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: 11, fontWeight: 600, color: colors.white, textAlign: "center" }}>Expansion<br/>(Conservative)</div>
              </div>
            </div>
            <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 8, textAlign: "center" }}>New pipeline<br/>opportunities</div>
          </div>
          
          {/* Target CACV */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: colors.green, marginBottom: 8 }}>$21-23M</div>
            <div style={{ width: "100%", height: 180, background: `linear-gradient(180deg, ${colors.green}, ${colors.greenDark})`, borderRadius: "6px 6px 0 0", position: "relative", border: `3px solid ${colors.white}`, boxShadow: `0 0 20px ${colors.green}40` }}>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: 11, fontWeight: 600, color: "#FFFFFF", textAlign: "center" }}>Target<br/>CACV</div>
            </div>
            <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 8, textAlign: "center" }}>Nov 2027</div>
          </div>
        </div>
        
        {/* Explanatory Note */}
        <div style={{ marginTop: 20, padding: 16, background: colors.bgPanel, borderRadius: 8, borderLeft: `4px solid ${colors.amber}` }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: colors.textPrimary, marginBottom: 8 }}>The Mathematics of Growth</div>
          <p style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 1.7, margin: 0 }}>
            Protecting the <strong style={{ color: colors.green }}>$13.1M base</strong> is essential. Losing <strong style={{ color: colors.red }}>$4M at-risk</strong> drops us to <strong style={{ color: colors.amber }}>$9.1M</strong> — requiring <strong style={{ color: colors.blue }}>$12-14M in new sales</strong> just to hit target. Conservative expansion from a protected base yields $21-23M; expansion from an eroded base yields only $17-19M, falling short.
          </p>
          <div style={{ marginTop: 12, padding: "10px 14px", background: colors.greenGlow, borderRadius: 6, display: "inline-block" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: colors.green }}>Strategic imperative: "Adopt first, expand bold."</span>
          </div>
          <p style={{ fontSize: 11, color: colors.textMuted, lineHeight: 1.6, margin: "12px 0 0" }}>
            The waterfall demonstrates why adoption must come before expansion — without it, new sales merely backfill downsells rather than driving net growth.
          </p>
        </div>
      </div>
      
      {/* ACCOUNT HEALTH & STRATEGIC PRIORITIES - FIFTH */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary, margin: "0 0 14px" }}>Account Health</h3>
          {[
            { label: "Executive Sponsorship", status: "green", detail: "Chris Bedi ↔ Tanuj Kapilashrami" },
            { label: "myHR / OneSC Adoption", status: "green", detail: "86% satisfaction · 77% VA resolution preference" },
            { label: "IRM/SecOps Utilisation", status: "red", detail: "Risk function not engaged; 6,000 potential users — critical gap" },
            { label: "Leadership Window", status: "amber", detail: "Noelle Eder — new, not yet engaged" },
            { label: "Engineering Risk", status: "red", detail: "Ben Issa — active resistance" },
            { label: "FFG Alignment", status: "amber", detail: "FINAL YEAR: ~$1.3B revised programme — platform consolidation" },
          ].map((h, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 5 ? `1px solid ${colors.border}` : "none" }}>
              <StatusDot status={h.status} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: colors.textPrimary, fontWeight: 500 }}>{h.label}</div>
                <div style={{ fontSize: 11, color: colors.textMuted }}>{h.detail}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary, margin: "0 0 14px" }}>Key Actions / Help Needed</h3>
          {[
            { label: "Secure Noelle Eder engagement", priority: "CRITICAL", color: colors.red },
            { label: "CRES Digital Vision programme — $1.5M pipeline", priority: "ACTIVE", color: colors.green },
            { label: "WSD + H&S go-live (Q4 2026)", priority: "ACTIVE", color: colors.green },
            { label: "Knowledge 2026 — Melinda engagement with P5 is confirmed", priority: "HIGH", color: colors.amber },
            { label: "EmployeeWorks opportunity pursuit", priority: "CRITICAL", color: colors.red },
            { label: "Neutralise Ben Issa via platform mandate", priority: "HIGH", color: colors.amber },
            { label: "IRM + SecOps adoption campaign", priority: "HIGH", color: colors.amber },
            { label: "CIB Workshop — first entry into $12.4B division", priority: "CRITICAL", color: colors.red },
            { label: "K26: Facilitate 45-min session on last day with SC team at Marquee Experience — hear from them, plan high-impact actions", priority: "HELP NEEDED", color: colors.blue },
          ].map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: i < 8 ? `1px solid ${colors.border}` : "none" }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: p.color, background: `${p.color}18`, padding: "2px 6px", borderRadius: 4, whiteSpace: "nowrap" }}>{p.priority}</span>
              <span style={{ fontSize: 12, color: colors.textPrimary }}>{p.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* AI VALUE DELIVERED & UPCOMING GO-LIVES — COMBINED */}
      <div style={{ background: colors.bgCard, border: `2px solid ${colors.green}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ fontSize: 22 }}>📈</div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: colors.green, margin: 0 }}>AI Value Delivered & Upcoming Go-Lives</h3>
        </div>
        {/* Go-Live Milestones */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, background: colors.greenGlow, borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>✅</span>
            <div><div style={{ fontSize: 12, fontWeight: 700, color: colors.green }}>OneSC HR Hub — LIVE</div><div style={{ fontSize: 10, color: colors.textSecondary }}>6 April 2026 · 82,000 employees</div></div>
          </div>
          <div style={{ flex: 1, background: colors.amberGlow, borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>🚀</span>
            <div><div style={{ fontSize: 12, fontWeight: 700, color: colors.amber }}>Agentic AI Onboarding</div><div style={{ fontSize: 10, color: colors.textSecondary }}>24 April 2026</div></div>
          </div>
          <div style={{ flex: 1, background: `${colors.blue}15`, borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>🎯</span>
            <div><div style={{ fontSize: 12, fontWeight: 700, color: colors.blue }}>AI Control Tower</div><div style={{ fontSize: 10, color: colors.textSecondary }}>30 April 2026</div></div>
          </div>
        </div>
        {/* AI Metrics Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 12 }}>
          <div style={{ background: colors.greenGlow, borderRadius: 8, padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: colors.green }}>104K+</div>
            <div style={{ fontSize: 10, color: colors.green, fontWeight: 500 }}>Productive Hours Saved/Year</div>
          </div>
          <div style={{ background: colors.greenGlow, borderRadius: 8, padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: colors.green }}>86%</div>
            <div style={{ fontSize: 10, color: colors.green, fontWeight: 500 }}>Employee Satisfaction</div>
          </div>
          <div style={{ background: colors.greenGlow, borderRadius: 8, padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: colors.green }}>77%</div>
            <div style={{ fontSize: 10, color: colors.green, fontWeight: 500 }}>VA Resolution Preference</div>
          </div>
          <div style={{ background: colors.greenGlow, borderRadius: 8, padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: colors.green }}>289%</div>
            <div style={{ fontSize: 10, color: colors.green, fontWeight: 500 }}>AI Adoption Improvement</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
          <div style={{ background: colors.greenGlow, borderRadius: 8, padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: colors.green }}>52%</div>
            <div style={{ fontSize: 10, color: colors.green, fontWeight: 500 }}>Reduction in Live Chat</div>
          </div>
          <div style={{ background: colors.greenGlow, borderRadius: 8, padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: colors.green }}>1,682</div>
            <div style={{ fontSize: 10, color: colors.green, fontWeight: 500 }}>Hours Saved/Quarter (+410%)</div>
          </div>
          <div style={{ background: colors.greenGlow, borderRadius: 8, padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: colors.green }}>30→10</div>
            <div style={{ fontSize: 10, color: colors.green, fontWeight: 500 }}>Mins/Case (Onboarding)</div>
          </div>
          <div style={{ background: colors.greenGlow, borderRadius: 8, padding: 14, textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: colors.green }}>90%</div>
            <div style={{ fontSize: 10, color: colors.green, fontWeight: 500 }}>New Hire Experience Target</div>
          </div>
        </div>
        <p style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 1.6, margin: 0 }}>
          OneSC HR Hub is our flagship success story — AI Pacesetters Innovation Award 2026 nominee. This proven value must be replicated across ITSM, ITOM, Security, and Workplace domains to protect the renewal base and justify expansion investment.
        </p>
      </div>
      
      <div style={{ background: `linear-gradient(135deg, ${colors.redGlow}, ${colors.amberGlow})`, border: `2px solid ${colors.red}`, borderRadius: 10, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <div style={{ fontSize: 24 }}>⚠️</div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: colors.red, margin: 0 }}>Critical Commercial Context: MSP Swap Clause</h3>
        </div>
        <p style={{ fontSize: 13, color: colors.textPrimary, lineHeight: 1.6, margin: 0 }}>
          SCB's tri-party contract with <strong>Infosys (MSP provider, contract through Dec 2028)</strong> includes a <strong style={{ color: colors.red }}>swap clause</strong>: Infosys has <strong>first right of refusal</strong> on all project work and can swap out ServiceNow licenses for alternative solutions if adoption remains low.
        </p>
        <p style={{ fontSize: 13, color: colors.textPrimary, lineHeight: 1.6, margin: "12px 0 0" }}>
          <strong style={{ color: colors.green }}>Strategic Imperative:</strong> Adoption is the <strong>foundation of all expansion</strong>. Protect the $8M at-risk base before pursuing new sales.
        </p>
      </div>
    </div>
  );
}

// ─── Internal Summary ────────────────────────────────────────────────────────
function APACReviewView() {
  const visionText = "By the 2028 renewal, ServiceNow will underpin how Standard Chartered sustains post-FFG productivity gains, governs AI deployment at enterprise scale, and grows revenue per FTE across its affluent and cross-border franchises. The platform will extend from its proven HR success into Legal, CRES, Finance, and client-facing workflows — creating measurable, board-reportable value that directly connects to the bank’s 2026 executive scorecard and the medium-term framework to be published in May 2026.";
  
  const aspirationText = "SUSTAIN | GOVERN | GROW. Sustain productivity gains delivered via OneSC and platform consolidation, preventing cost regression as the programme ends. Govern GenAI deployment with enterprise-grade AI Control Tower, directly supporting Bill Winters' personal scorecard objective and board-level AI oversight requirements. Grow revenue per FTE by infusing AI in workflows related to affluent wealth machine ($447B AUM, 275K NTB clients) and CIB cross-border franchise (61.5% of income) and positioning ServiceNow as the only platform that can deliver operational resilience, responsible AI, and growth enablement simultaneously."
  
  // Color-coded themes
  const themeColors = {
    ffg: { primary: colors.green, bg: colors.greenGlow, label: "Sustain (2026)" },
    techRes: { primary: colors.amber, bg: colors.amberGlow, label: "Govern (2027)" },
    clientExp: { primary: colors.blue, bg: `${colors.blue}15`, label: "Grow (2027)" },
  };
  
  const customerPriorities = [
    { priority: "Sustain Productivity Gains", value: "$5.5M (2026)", description: "Lock in run-rate savings delivered via OneSC and platform consolidation. Expand unified service management into Legal, Finance, CRES, and Supply Chain. Directly drives revenue-per-FTE (CEO 2026 KPI). Address eNPS decline through improved employee experience.", theme: "ffg" },
    { priority: "Govern AI & Risk at Scale", value: "$1.5-2M (2027)", description: "Enterprise GenAI governance (Bill Winters personal objective). AI Control Tower for 200+ use cases. DORA compliance and technology resilience. Integrated risk management for the bank's 6,000+ risk function employees.", theme: "techRes" },
    { priority: "Grow Revenue per FTE", value: "$3.5-5.5M (2027)", description: "Enable the $447B affluent growth machine: RM productivity, client onboarding, CSM. FSO for CIB cross-border workflows. Add value for the bank's planned $1.5B investment in wealth management (50% people, 25% digital platforms).", theme: "clientExp" },
  ];
  
  const strategicPursuits = [
    {
      title: "Sustain: Post-FFG Productivity",
      subtitle: "Lock in run-rate savings, prevent cost regression",
      theme: "ffg",
      whatItIs: "Expand ServiceNow from HR success into Legal, Finance, CRES, and Supply Chain — creating a unified operational backbone that locks in run-rate savings beyond FFG's end-2026 conclusion.",
      whyItMatters: "FFG concludes in 2026 but cost discipline remains a 20% weighted 2026 scorecard measure. Without platform consolidation, run-rate savings will erode. Revenue-per-FTE (NEW CEO KPI) requires the same productivity engine. eNPS decline (-3.9pts) demands better employee experience.",
      howWeHelp: "EmployeeWorks (HRSD + WSD + NowAssist) extends HR Hub’s 104K hours saved. Legal Service Delivery, CRES Digital Vision, and Supply Chain digitalisation multiply productivity gains. Directly contributes to revenue-per-FTE KPI.",
      whoBuys: "Tanuj Kapilashrami (Chief Strategy & Talent), Shelley Boland (CRES), Pete Burrill (Interim GCFO), Warren Young (FFG)",
      nnacv: "$5.5M",
      nnacvYear: "2026",
    },
    {
      title: "Govern: AI & Risk at Enterprise Scale",
      subtitle: "Board-level AI confidence, regulatory compliance",
      theme: "techRes",
      whatItIs: "Deploy AI Control Tower as the governance foundation for GenAI at scale, plus integrated risk management and security operations for DORA compliance.",
      whyItMatters: "Bill Winters’ 2026 personal objective: ‘Lead creation of a bank-specific approach to GenAI.’ Board hosted AI governance stewardship event Nov 2025. DORA compliance is non-negotiable. Software write-offs ($588M to $42M) suggest custom-build depreciation cycle complete.",
      howWeHelp: "AI Control Tower governs 200+ use cases with the bank’s AI governance framework. IRM/GRC for policy and compliance. SecOps VR with Databricks integration. Software impairment cycle complete ($588M→$42M) — strengthens consolidation case.",
      whoBuys: "Noelle Eder (Group Head T&O), Jason Forrester (Group CRO), Alvaro Garrido (CIO InfoSec), Shebani Baweja (Interim CDO)",
      nnacv: "$1.5-2M",
      nnacvYear: "2027",
    },
    {
      title: "Grow: Revenue-per-FTE Enablement",
      subtitle: "Wealth, CIB, and client experience at scale",
      theme: "clientExp",
      whatItIs: "Transform client onboarding, RM productivity, and cross-border servicing through FSO and CSM — directly enabling the bank’s record affluent and CIB growth engines.",
      whyItMatters: "$447B AUM, 275K new affluent clients, $52B NNM. The growth machine is working — but client onboarding speed, RM productivity, and servicing quality are the bottlenecks to scaling further. CIB cross-border income at 61.5%. The bank's planned $1.5B investment in wealth management (50% people, 25% digital) creates a direct opening for ServiceNow to add value.",
      howWeHelp: "FSO for Trade Finance KYC/AML and disputes management. CSM for client service excellence. App Engine for RM tools. CRM for wealth RM productivity — the digital banker, financial planner vision. All governed by AI Control Tower.",
      whoBuys: "Judy Hsu (CEO WRB), Guillermo Veiga (Group CIO), Roberto Hoornweg (CEO CIB), Shebani Baweja (Interim CDO)",
      nnacv: "$3.5-5.5M",
      nnacvYear: "2027",
    },
  ];
  
  const measuresOfSuccess = [
    "NNACV: $12-14M over 2 years — Sustain $5.5M in 2026; Govern $1.5-2M + Grow $3.5-5.5M in 2027",
    "Adoption: Critical apps (ITOM, HAM, SAM, SecOps) reach >70% utilisation",
    "Protect $4M at-risk CACV through adoption acceleration",
    "Platinum programme inclusion: At least one ServiceNow initiative classified as Platinum-tier",
    "Revenue-per-FTE contribution: Quantified productivity gains mapped to CEO scorecard KPI",
  ];
  
  const barriersRisksDependencies = [
    "Noelle Eder: Board confirmed her appointment's strategic weight. Technology strategy review and Platinum programmes almost certainly sit within her scope. Non-engagement is even more exposed.",
    "ServiceNow alignment to the new medium-term framework: The bank publishes a new multi-year strategic framework in May 2026. If ServiceNow is not embedded in that narrative internally before budgets are set, we start from scratch with a new agenda.",
    "Engineering alignment: The bank's engineering team (led by Benyameen Issa / Januar Wayong) has a preference for custom-built platforms. We need to align and collaborate with engineering rather than compete — demonstrating platform value alongside their capabilities.",
  ];
  
  return (
    <div>
      {/* Header Banner */}
      <div style={{ background: `linear-gradient(135deg, ${colors.bgCard}, ${colors.bgHover})`, border: `2px solid ${colors.green}`, borderRadius: 12, padding: "20px 24px", marginBottom: 20, textAlign: "center" }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: colors.textPrimary, margin: 0 }}>
          <span style={{ color: colors.textSecondary }}>Standard Chartered Bank:</span> <span style={{ color: colors.green }}>Adopt First, Expand Bold</span>
        </h1>
        <p style={{ fontSize: 13, color: colors.textSecondary, margin: "8px 0 0" }}>ServiceNow's 2 Year Account Strategy</p>
      </div>
      
      {/* Color Legend */}
      <div style={{ display: "flex", gap: 20, marginBottom: 16, justifyContent: "center" }}>
        {Object.entries(themeColors).map(([key, theme]) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, background: theme.primary }} />
            <span style={{ fontSize: 11, color: colors.textSecondary, fontWeight: 600 }}>{theme.label}</span>
          </div>
        ))}
      </div>
      
      {/* Vision and Aspiration */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20 }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, color: colors.green, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Our vision for the customer</h3>
          <p style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 1.7, margin: 0 }}>{visionText}</p>
        </div>
        <div style={{ background: `linear-gradient(135deg, ${colors.greenGlow}, ${colors.bgCard})`, border: `2px solid ${colors.green}`, borderRadius: 10, padding: 20 }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, color: colors.green, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Our winning aspiration</h3>
          <p style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 1.7, margin: 0 }}>{aspirationText}</p>
        </div>
      </div>
      
      {/* Customer Priorities and Strategic Pursuits */}
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, marginBottom: 20 }}>
        {/* Left: Customer Priorities */}
        <div>
          <h3 style={{ fontSize: 12, fontWeight: 700, color: colors.textPrimary, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Top customer priorities</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {customerPriorities.map((p, i) => {
              const theme = themeColors[p.theme];
              return (
                <div key={i} style={{ background: theme.bg, border: `2px solid ${theme.primary}`, borderRadius: 8, padding: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 6, height: 24, borderRadius: 2, background: theme.primary }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: theme.primary }}>{p.priority}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: theme.primary, marginLeft: "auto" }}>{p.value}</span>
                  </div>
                  <p style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.5, margin: "0 0 0 14px" }}>{p.description}</p>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Right: Strategic Pursuits */}
        <div>
          <h3 style={{ fontSize: 12, fontWeight: 700, color: colors.textPrimary, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Top 3 strategic pursuits starting FY26</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {strategicPursuits.map((pursuit, i) => {
              const theme = themeColors[pursuit.theme];
              return (
                <div key={i} style={{ background: `linear-gradient(180deg, ${theme.bg}, ${colors.bgPanel})`, border: `2px solid ${theme.primary}`, borderRadius: 10, padding: 16, position: "relative", overflow: "hidden" }}>
                  {/* Color bar at top */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: theme.primary }} />
                  
                  <div style={{ fontSize: 14, fontWeight: 700, color: theme.primary, marginBottom: 4, marginTop: 4 }}>{pursuit.title}</div>
                  <div style={{ fontSize: 10, color: colors.textMuted, marginBottom: 12, fontStyle: "italic" }}>{pursuit.subtitle}</div>
                  
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: colors.textPrimary }}>What it is: </span>
                    <span style={{ fontSize: 10, color: colors.textSecondary, lineHeight: 1.5 }}>{pursuit.whatItIs}</span>
                  </div>
                  
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: colors.textPrimary }}>Why it matters: </span>
                    <span style={{ fontSize: 10, color: colors.textSecondary, lineHeight: 1.5 }}>{pursuit.whyItMatters}</span>
                  </div>
                  
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: colors.textPrimary }}>How we help: </span>
                    <span style={{ fontSize: 10, color: colors.textSecondary, lineHeight: 1.5 }}>{pursuit.howWeHelp}</span>
                  </div>
                  
                  <div style={{ marginBottom: 10 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: colors.textPrimary }}>Who buys: </span>
                    <span style={{ fontSize: 10, color: colors.textSecondary, lineHeight: 1.5 }}>{pursuit.whoBuys}</span>
                  </div>
                  
                  <div style={{ background: theme.bg, border: `1px solid ${theme.primary}`, borderRadius: 4, padding: "6px 10px", marginTop: 12 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: theme.primary }}>NNACV ({pursuit.nnacvYear}): </span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: theme.primary }}>{pursuit.nnacv}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Measures of Success and Barriers */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 16 }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, color: colors.textPrimary, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Measures of success</h3>
          {measuresOfSuccess.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <span style={{ color: colors.green }}>•</span>
              <span style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.5 }}>{m}</span>
            </div>
          ))}
        </div>
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.red}40`, borderRadius: 10, padding: 16 }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, color: colors.textPrimary, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Top 3 barriers/risks/dependencies</h3>
          {barriersRisksDependencies.map((b, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <span style={{ color: colors.red }}>•</span>
              <span style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.5 }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Customer View ───────────────────────────────────────────────────────────
function CustomerView() {
  // Theme colors for the 3 future state cards
  const themeColors = {
    ffg: { primary: colors.green, bg: colors.greenGlow, label: "Sustain (2026)" },
    clientExp: { primary: colors.blue, bg: `${colors.blue}15`, label: "Grow (2027)" },
    techRes: { primary: colors.amber, bg: colors.amberGlow, label: "Govern (2027)" },
  };
  
  const strategicDrivers = [
    { text: "~$1.3B FFG savings (final year)", highlight: true, detail: "$754M run-rate achieved; programme concludes end-2026. Post-FFG sustainable productivity is the next horizon" },
    { text: "Statutory RoTE >12% in 2026", highlight: true, detail: "Shift to reported basis. Underlying RoTE of 14.7% already achieved; sustaining returns is the new challenge" },
    { text: "Revenue per FTE", highlight: true, detail: "NEW 2026 CEO scorecard KPI — directly connects to every ServiceNow productivity capability" },
    { text: "GenAI at scale with governance", highlight: true, detail: "Bill Winters' personal 2026 objective. Board hosted AI governance stewardship event Nov 2025" },
    { text: "$9.1B+ shareholder distributions", highlight: true, detail: "Announced since Feb 2024, including new $1.5B buyback. Exceeds original $8B+ target" },
    { text: "eNPS recovery needed", highlight: true, detail: "Declined 3.9 points to 17.56 in FY2025 amidst FFG restructuring. Improve experiences and improve eNPS." },
    { text: "$200B net new money by 2029", highlight: true, detail: "$52B NNM achieved in FY2025 alone (14% of AUM). 275K new affluent clients. #3 wealth manager in Asia" },
    { text: "Platinum programmes", highlight: true, detail: "NEW 2026 board-tier transformation initiatives — intelligence gap: must identify if ServiceNow features in any" },
  ];
  
  const successOutcomes = [
    { label: "SUSTAIN — Post-FFG productivity gains locked in:", color: colors.green, detail: "Platform consolidation ensures run-rate savings persist beyond FFG programme end. Revenue-per-FTE improves as manual processes are eliminated" },
    { label: "GOVERN — GenAI deployed with board-level confidence:", color: colors.amber, detail: "AI Control Tower provides the enterprise-grade foundation that allows SCB to scale GenAI responsibly, directly supporting Bill Winters’ personal 2026 scorecard objective" },
    { label: "GROW — Revenue-per-FTE acceleration:", color: colors.blue, detail: "RM productivity tools, client onboarding automation, and digital enablement of the affluent and CIB franchises drive top-line growth. CSM and FSO capture the wealth growth engine" },
  ];
  
  const futureStateCards = [
    {
      title: "Reinvest Created Capacity for Growth",
      theme: "ffg",
      whatItIs: "Legal, Supply Chain, Finance, and CRES operations unified on a single platform — eliminating duplicate systems and accelerating process standardisation across the bank",
      whyItMatters: "Each fragmented system costs money to maintain, creates compliance gaps, and slows decision-making. Platform consolidation directly contributes to FFG savings targets",
      targetState: "By Q4 2027: Legal operations digitised, procurement automated, workplace services delivering consistent experience across all locations globally",
    },
    {
      title: "Client Experience That Drives Growth",
      theme: "clientExp",
      whatItIs: "Unified client onboarding, servicing, and relationship management capabilities that accelerate cross-border connectivity and strengthen the affluent proposition across Asia, Africa, and the Middle East",
      whyItMatters: "Cross-border and affluent segments are SCB's strategic growth engines. RM productivity, onboarding speed, and service quality directly impact revenue, client retention, and the Bank's differentiation as the super connector",
      targetState: "By Q3 2027: Streamlined client onboarding for wealth and CIB, enhanced RM tools driving productivity gains, and seamless cross-border service delivery reinforcing SCB's network advantage",
    },
    {
      title: "Compliance as Competitive Advantage",
      theme: "techRes",
      whatItIs: "Integrated risk, security, and asset management meeting DORA and IBS 2025 requirements whilst providing operational visibility that improves decision-making speed",
      whyItMatters: "Regulatory compliance is mandatory but expensive. Platform approach transforms compliance from cost centre to strategic capability — knowing your risk posture faster than competitors",
      targetState: "By Q1 2027: DORA compliant with integrated view of technology resilience, security posture visible in real-time, $1B tech spend optimised through better asset management",
    },
  ];
  
  const partnershipValues = [
    { label: "Outcome accountability:", detail: "We measure success by your business results, not product adoption metrics" },
    { label: "Transparent communication:", detail: "Regular executive engagement with Tanuj's leadership team, honest progress reporting, proactive risk escalation" },
    { label: "Co-innovation mindset:", detail: "Your requirements drive our roadmap — Knowledge 2026 showcase, direct access to Product teams, beta participation" },
    { label: "Long-term commitment:", detail: "Investment in your success beyond 2028 MSP renewal — building capabilities that compound over time" },
  ];
  
  const openQuestions = [
    "How do we secure Noelle Eder’s engagement to align Technology division’s strategy with proven S&T success?",
    "Which of the bank’s Platinum programmes could ServiceNow underpin — and how do we get classified?",
    "How should we position for the May 2026 medium-term financial framework to ensure ServiceNow is embedded in the post-FFG narrative?",
    "How do we connect ServiceNow productivity gains directly to the revenue-per-FTE KPI that the CEO is personally assessed against?",
    "How can we ensure leadership participation for strategic reviews and innovation calls every quarter?",
  ];
  
  return (
    <div>
      {/* Header Banner */}
      <div style={{ background: `linear-gradient(135deg, ${colors.bgCard}, ${colors.bgHover})`, border: `2px solid ${colors.green}`, borderRadius: 12, padding: "20px 24px", marginBottom: 20, textAlign: "center" }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: colors.textPrimary, margin: 0 }}>
          <span style={{ color: colors.textSecondary }}>Standard Chartered:</span> <span style={{ color: colors.green }}>Transforming Operations</span>
        </h1>
        <p style={{ fontSize: 13, color: colors.textSecondary, margin: "8px 0 0" }}>Aligning on outcomes that matter most over the next 2 years</p>
      </div>
      
      {/* Our Shared Ambition & What Success Looks Like */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: colors.bgCard, border: `2px solid ${colors.green}`, borderRadius: 10, padding: 20 }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, color: colors.green, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Our Shared Ambition</h3>
          <p style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 1.7, margin: 0 }}>
            Transform how Standard Chartered delivers employee and client services across 54 markets — creating a unified, AI-powered platform that accelerates your Fit for Growth programme, eliminates operational friction, and proves platform consolidation delivers faster, more cost-effective outcomes than custom-built alternatives. Together, we'll establish the foundation for operational resilience that supports your ambitious growth targets whilst meeting regulatory requirements and enabling your people to focus on what matters most: serving clients and driving commerce across the world's most dynamic markets.
          </p>
        </div>
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20 }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, color: colors.amber, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>What Success Looks Like</h3>
          <p style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 12 }}>By November 2027, Standard Chartered will have achieved three transformational outcomes:</p>
          {successOutcomes.map((o, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <span style={{ color: o.color, fontSize: 16, lineHeight: 1 }}>•</span>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: o.color }}>{o.label}</span>
                <span style={{ fontSize: 11, color: colors.textSecondary }}> {o.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Strategic Drivers & Future State */}
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, marginBottom: 20 }}>
        {/* Left: Strategic Drivers */}
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.blue}`, borderRadius: 10, padding: 16 }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, color: colors.textPrimary, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Standard Chartered's strategic drivers</h3>
          <p style={{ fontSize: 11, color: colors.textSecondary, margin: "0 0 14px", fontStyle: "italic" }}>Over the next 2 years, what must Standard Chartered achieve or deliver, and where is pressure coming from?</p>
          {strategicDrivers.map((d, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <span style={{ color: colors.green, fontSize: 14, lineHeight: 1 }}>•</span>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: colors.green }}>{d.text}</span>
                <span style={{ fontSize: 11, color: colors.textSecondary }}> {d.detail}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Right: Envisioning the Future State */}
        <div>
          <h3 style={{ fontSize: 12, fontWeight: 700, color: colors.textPrimary, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Envisioning the future state</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {futureStateCards.map((card, i) => {
              const theme = themeColors[card.theme];
              return (
                <div key={i} style={{ background: colors.bgCard, border: `2px solid ${theme.primary}`, borderRadius: 10, padding: 16, position: "relative", overflow: "hidden" }}>
                  {/* Color bar at top */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: theme.primary }} />
                  
                  <div style={{ fontSize: 14, fontWeight: 700, color: theme.primary, marginBottom: 12, marginTop: 4 }}>{card.title}</div>
                  
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: theme.primary, marginBottom: 4 }}>What it is:</div>
                    <div style={{ fontSize: 10, color: colors.textSecondary, lineHeight: 1.5 }}>{card.whatItIs}</div>
                  </div>
                  
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: theme.primary, marginBottom: 4 }}>Why it matters:</div>
                    <div style={{ fontSize: 10, color: colors.textSecondary, lineHeight: 1.5 }}>{card.whyItMatters}</div>
                  </div>
                  
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: theme.primary, marginBottom: 4 }}>Target state:</div>
                    <div style={{ fontSize: 10, color: colors.textSecondary, lineHeight: 1.5 }}>{card.targetState}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Partnership Values & Open Questions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 16 }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, color: colors.textPrimary, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Partnership values</h3>
          {partnershipValues.map((v, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <span style={{ color: colors.green, fontSize: 14, lineHeight: 1 }}>•</span>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: colors.green }}>{v.label}</span>
                <span style={{ fontSize: 11, color: colors.textSecondary }}> {v.detail}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.amber}`, borderRadius: 10, padding: 16 }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, color: colors.amber, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Open questions for discussion</h3>
          {openQuestions.map((q, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <span style={{ color: colors.amber, fontSize: 14, lineHeight: 1 }}>•</span>
              <span style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.5 }}>{q}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Strategy ────────────────────────────────────────────────────────────────
function StrategyView() {
  const [expandedPillar, setExpandedPillar] = useState(null);
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.textPrimary, margin: "0 0 4px" }}>SCB Strategic Overview</h1>
      <p style={{ fontSize: 13, color: colors.textSecondary, margin: "0 0 20px" }}>Source: Annual Report 2025 · FY2025 Results Presentation · 24 February 2026</p>
      <div style={{ background: `linear-gradient(135deg, ${colors.bgCard}, ${colors.bgHover})`, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 24, marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: colors.green, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Purpose</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: colors.textPrimary, marginBottom: 4 }}>{STRATEGY.purpose}</div>
        <div style={{ fontSize: 13, color: colors.textSecondary, fontStyle: "italic" }}>Brand promise: "{STRATEGY.brand}"</div>
        <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 10, lineHeight: 1.6 }}>{STRATEGY.description}</div>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {STRATEGY.targets.map((t, i) => (
          <div key={i} style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "12px 16px", flex: "1 1 140px" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: colors.green }}>{t.value}</div>
            <div style={{ fontSize: 11, fontWeight: 500, color: colors.textPrimary }}>{t.label}</div>
            <div style={{ fontSize: 10, color: colors.textMuted }}>{t.period}</div>
          </div>
        ))}
      </div>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: colors.textPrimary, margin: "0 0 12px" }}>Strategic Pillars</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {STRATEGY.pillars.map(p => (
          <div key={p.id} onClick={() => setExpandedPillar(expandedPillar === p.id ? null : p.id)}
            style={{ background: expandedPillar === p.id ? colors.bgHover : colors.bgCard, border: `1px solid ${expandedPillar === p.id ? colors.green + "40" : colors.border}`, borderRadius: 10, padding: "16px 20px", cursor: "pointer", transition: "all 0.2s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 22 }}>{p.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>{p.title}</div>
                {expandedPillar === p.id && <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 8, lineHeight: 1.6 }}>{p.desc}</div>}
              </div>
              <span style={{ color: colors.textMuted, fontSize: 16 }}>{expandedPillar === p.id ? "−" : "+"}</span>
            </div>
          </div>
        ))}
      </div>
      <h2 style={{ fontSize: 16, fontWeight: 600, color: colors.textPrimary, margin: "0 0 12px" }}>Fit for Growth — Programme Tracks</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {STRATEGY.ffgTracks.map((t, i) => (
          <div key={i} style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 8, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: colors.textPrimary }}>{t.name}</div>
              <span style={{ fontSize: 12, fontWeight: 700, color: colors.green }}>{t.saving}</span>
            </div>
            <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.5 }}>{t.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Financials ──────────────────────────────────────────────────────────────
function FinancialsView() {
  const maxIncome = 24;
  const [showProducts, setShowProducts] = useState(false);
  const greenUp = (v) => v.startsWith("+") || v.startsWith("loss") ? colors.green : v.startsWith("-") || v.startsWith("flat") || v.startsWith("n.m") ? colors.amber : colors.green;
  
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.textPrimary, margin: "0 0 4px" }}>Financial Performance — FY2025 Full Year</h1>
      <p style={{ fontSize: 13, color: colors.textSecondary, margin: "0 0 6px" }}>Source: Annual Report 2025 · FY25 Results Presentation · 24 February 2026</p>
      <p style={{ fontSize: 11, color: colors.amber, margin: "0 0 20px", fontWeight: 600 }}>⚠️ 3-year plan delivered a year early. All 2026 guidance now on REPORTED basis (not underlying).</p>
      
      {/* ── Headline KPIs ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 12 }}>
        {FINANCIALS.fy2025.headline.map((m, i) => (
          <div key={i} style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, padding: "16px 18px" }}>
            <div style={{ fontSize: 10, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{m.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: i < 2 ? colors.green : i === 2 ? colors.green : colors.blue, lineHeight: 1.1 }}>{m.value}</div>
            <div style={{ fontSize: 11, color: colors.green, marginTop: 4, fontWeight: 600 }}>{m.delta}</div>
            <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 2 }}>FY24: {m.prior}</div>
          </div>
        ))}
      </div>
      
      {/* ── Secondary Metrics ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 20 }}>
        {FINANCIALS.fy2025.secondary.map((m, i) => (
          <div key={i} style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "12px 14px" }}>
            <div style={{ fontSize: 9, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: colors.green }}>{m.value}</div>
            <div style={{ fontSize: 10, color: colors.textSecondary, marginTop: 2 }}>{m.delta}</div>
          </div>
        ))}
      </div>

      {/* ── Income & PBT Trend Chart ── */}
      <h2 style={{ fontSize: 16, fontWeight: 600, color: colors.textPrimary, margin: "0 0 12px" }}>Income & Profit Trend (2020–2025)</h2>
      <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-end", height: 180 }}>
          {FINANCIALS.incomeHistory.map((d, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", gap: 4, alignItems: "flex-end", width: "100%" }}>
                <div style={{ flex: 1, background: `linear-gradient(180deg, ${colors.green}, ${colors.greenDark})`, borderRadius: "4px 4px 0 0", position: "relative", height: `${(d.income / maxIncome) * 100}%`, minHeight: 20 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#FFFFFF", position: "absolute", top: 4, left: 0, right: 0, textAlign: "center" }}>${d.income}B</div>
                </div>
                <div style={{ flex: 1, background: `linear-gradient(180deg, ${colors.blue}, #3577cc)`, borderRadius: "4px 4px 0 0", position: "relative", height: `${(d.pbt / maxIncome) * 100}%`, minHeight: 20 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: "#FFFFFF", position: "absolute", top: 4, left: 0, right: 0, textAlign: "center" }}>${d.pbt}B</div>
                </div>
              </div>
              <div style={{ fontSize: 11, fontWeight: d.year === "2025" ? 800 : 600, color: d.year === "2025" ? colors.green : colors.textPrimary }}>{d.year}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 12, height: 12, background: colors.green, borderRadius: 2 }} /><span style={{ fontSize: 11, color: colors.textSecondary }}>Operating Income (underlying)</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 12, height: 12, background: colors.blue, borderRadius: 2 }} /><span style={{ fontSize: 11, color: colors.textSecondary }}>Profit Before Tax (underlying)</span></div>
        </div>
      </div>

      {/* ── PBT by Segment ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary, margin: "0 0 14px" }}>PBT by Segment (FY2025)</h3>
          {FINANCIALS.pbtBySegment.map((s, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: colors.textPrimary }}>{s.name}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: s.fy25 > 0 ? colors.green : colors.red }}>${Math.abs(s.fy25).toLocaleString()}M</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 10, color: colors.textMuted }}>Income: ${s.income > 0 ? (s.income/1000).toFixed(1) : s.income.toLocaleString()}B</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: greenUp(s.yoyCcy) }}>{s.yoyCcy} ccy</span>
              </div>
              {s.fy25 > 0 && <SimpleBar value={s.fy25} max={6000} color={i === 0 ? colors.green : colors.blue} />}
            </div>
          ))}
          <div style={{ marginTop: 12, padding: "10px 12px", background: colors.bgPanel, borderRadius: 6 }}>
            <div style={{ fontSize: 10, color: colors.textMuted }}>NII / Non-NII split: <span style={{ color: colors.textPrimary, fontWeight: 600 }}>{FINANCIALS.niiSplit.niiPct}% / {FINANCIALS.niiSplit.nonNiiPct}%</span></div>
            <div style={{ fontSize: 10, color: colors.green, marginTop: 2 }}>Non-NII: {FINANCIALS.niiSplit.nonNiiGrowth}</div>
          </div>
        </div>
        
        {/* ── Key Markets ── */}
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary, margin: "0 0 14px" }}>Income by Key Market (FY2025)</h3>
          {FINANCIALS.revenueByMarket.slice(0, 8).map((r, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <span style={{ fontSize: 11, color: colors.textPrimary }}>{r.name}</span>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: colors.green }}>${(r.fy25/1000).toFixed(1)}B</span>
                  {r.yoy && <span style={{ fontSize: 9, color: greenUp(r.yoy), marginLeft: 6 }}>{r.yoy}</span>}
                </div>
              </div>
              <SimpleBar value={r.fy25} max={5500} color={i < 2 ? colors.green : colors.blue} height={6} />
            </div>
          ))}
          <div style={{ marginTop: 8, fontSize: 10, color: colors.textMuted }}>Segment split: CIB 59% ($12.4B) · WRB 41% ($8.5B)</div>
        </div>
      </div>

      {/* ── Product Income (Collapsible) ── */}
      <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 20 }}>
        <button onClick={() => setShowProducts(!showProducts)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", border: "none", background: "transparent", cursor: "pointer", color: colors.textPrimary }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Income by Product — Full Breakdown</span>
          <span style={{ fontSize: 18, color: colors.textMuted }}>{showProducts ? "−" : "+"}</span>
        </button>
        {showProducts && (
          <div style={{ padding: "0 20px 16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "3fr 1.2fr 1.2fr 1fr", gap: 4, padding: "8px 0", borderBottom: `1px solid ${colors.border}` }}>
              {["Product", "FY25 ($M)", "FY24 ($M)", "YoY ccy"].map(h => (
                <div key={h} style={{ fontSize: 9, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase" }}>{h}</div>
              ))}
            </div>
            {FINANCIALS.incomeByProduct.map((p, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "3fr 1.2fr 1.2fr 1fr", gap: 4, padding: "6px 0", borderBottom: `1px solid ${colors.border}20` }}>
                <div style={{ fontSize: 11, color: colors.textPrimary, fontWeight: p.isHeader ? 700 : 400 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: colors.textPrimary, fontWeight: p.isHeader ? 700 : 400 }}>{p.fy25.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: colors.textMuted }}>{p.fy24 < 0 ? `(${Math.abs(p.fy24)})` : p.fy24.toLocaleString()}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: greenUp(p.yoyCcy) }}>{p.yoyCcy}</div>
              </div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "3fr 1.2fr 1.2fr 1fr", gap: 4, padding: "8px 0", borderTop: `2px solid ${colors.green}` }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: colors.green }}>Total</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: colors.green }}>{FINANCIALS.totalIncome.fy25.toLocaleString()}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: colors.textMuted }}>{FINANCIALS.totalIncome.fy24.toLocaleString()}</div>
              <div style={{ fontSize: 12, fontWeight: 800, color: colors.green }}>{FINANCIALS.totalIncome.yoyCcy}</div>
            </div>
          </div>
        )}
      </div>

      {/* ── 2026 Guidance ── */}
      <div style={{ background: `${colors.blue}12`, border: `1px solid ${colors.blue}40`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: colors.blue, margin: "0 0 12px" }}>2026 Guidance (Reported Basis)</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {FINANCIALS.guidance2026.slice(0, 3).map((g, i) => (
            <div key={i}>
              <div style={{ fontSize: 10, color: colors.textMuted, textTransform: "uppercase", marginBottom: 4 }}>{g.metric}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: colors.blue }}>{g.target}</div>
              <div style={{ fontSize: 9, color: colors.textSecondary }}>{g.basis}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginTop: 12 }}>
          {FINANCIALS.guidance2026.slice(3).map((g, i) => (
            <div key={i}>
              <div style={{ fontSize: 10, color: colors.textMuted, textTransform: "uppercase", marginBottom: 4 }}>{g.metric}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: g.metric.includes("May") ? colors.amber : colors.blue }}>{g.target}</div>
              <div style={{ fontSize: 9, color: colors.textSecondary }}>{g.basis}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Balance Sheet & Context ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary, margin: "0 0 12px" }}>Balance Sheet</h3>
          {Object.entries(FINANCIALS.balanceSheet).map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${colors.border}20` }}>
              <span style={{ fontSize: 11, color: colors.textSecondary }}>{k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: colors.textPrimary }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary, margin: "0 0 12px" }}>Context & Signals</h3>
          <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.6, marginBottom: 10 }}>
            <span style={{ color: colors.green, fontWeight: 700 }}>Software write-offs:</span> {FINANCIALS.softwareImpairmentNote}
          </div>
          <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.6, marginBottom: 10 }}>
            <span style={{ color: colors.amber, fontWeight: 700 }}>Alibaba AI:</span> {FINANCIALS.alibabaPartnership}
          </div>
          <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.6, marginBottom: 10 }}>
            <span style={{ color: colors.blue, fontWeight: 700 }}>Q1'26:</span> {FINANCIALS.q1Outlook}
          </div>
          <div style={{ fontSize: 11, color: colors.red, lineHeight: 1.6, fontWeight: 600 }}>
            ⚠️ {FINANCIALS.reportingBasisNote}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Org Chart ───────────────────────────────────────────────────────────────
function OrgChartView() {
  const [selectedExec, setSelectedExec] = useState(null);
  const [filterDiv, setFilterDiv] = useState("All");
  const divisions = ["All", "Technology", "Strategy & Talent", "Finance", "Risk", "WRB", "CIB", "GCNA", "Group"];
  const filteredExecs = filterDiv === "All" ? EXECUTIVES : EXECUTIVES.filter(e => e.division === filterDiv);
  const tier0 = filteredExecs.filter(e => e.tier === 0);
  const tier1 = filteredExecs.filter(e => e.tier === 1);
  const tier2 = filteredExecs.filter(e => e.tier === 2);
  const tier3 = filteredExecs.filter(e => e.tier === 3);
  const tier4 = filteredExecs.filter(e => e.tier === 4);
  
  // Theme colors for strategic areas
  const themeColors = {
    ffg: { primary: colors.green, bg: colors.greenGlow, label: "Sustain (2026)", short: "Sustain" },
    techRes: { primary: colors.amber, bg: colors.amberGlow, label: "Govern (2027)", short: "Govern" },
    clientExp: { primary: colors.blue, bg: `${colors.blue}15`, label: "Grow (2027)", short: "Grow" },
  };
  
  // Get linked opportunities for an executive
  const getLinkedOpportunities = (exec) => {
    if (!exec.opportunityIds || exec.opportunityIds.length === 0) return [];
    return GROWTH_OPPORTUNITIES.filter(opp => exec.opportunityIds.includes(opp.id));
  };
  
  // Calculate total NNACV influence for an executive
  const getTotalNNACV = (exec) => {
    const opps = getLinkedOpportunities(exec);
    if (opps.length === 0) return null;
    let total = 0;
    opps.forEach(opp => {
      const val = opp.nnacv.replace(/[^0-9.]/g, '');
      total += parseFloat(val) || 0;
    });
    return `$${total.toFixed(1)}M`;
  };
  
  const ExecCard = ({ exec, onClick }) => {
    const themes = exec.strategicThemes || [];
    return (
      <div onClick={() => onClick(exec)}
        style={{ background: selectedExec?.id === exec.id ? colors.bgHover : colors.bgCard, border: `2px solid ${statusColors[exec.status]?.color || colors.border}`, borderRadius: 10, padding: "14px 16px", cursor: "pointer", transition: "all 0.2s", minWidth: 180, flex: "1 1 0", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <StatusDot status={exec.status} size={12} />
          <div style={{ fontSize: 13, fontWeight: 700, color: colors.textPrimary }}>{exec.name}</div>
        </div>
        <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.4 }}>{exec.title}</div>
        {exec.parentId && (() => {
          const parent = EXECUTIVES.find(e => e.id === exec.parentId);
          return parent ? (
            <div style={{ fontSize: 9, color: colors.blue, marginTop: 2, opacity: 0.8 }}>↑ {parent.name}</div>
          ) : null;
        })()}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
          <div style={{ fontSize: 10, color: colors.textMuted }}>{exec.division}</div>
          {exec.location && <div style={{ fontSize: 10, color: colors.blue }}>📍 {exec.location}</div>}
        </div>
        {exec.parentId && (() => {
          const parent = EXECUTIVES.find(e => e.id === exec.parentId);
          return parent ? (
            <div style={{ fontSize: 9, color: colors.textMuted, marginTop: 4, paddingTop: 4, borderTop: `1px dashed ${colors.border}`, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ color: statusColors[parent.status]?.color || colors.textMuted }}>↑</span>
              <span>Reports to <span style={{ color: colors.textSecondary, fontWeight: 600 }}>{parent.name}</span></span>
            </div>
          ) : null;
        })()}
        {/* Strategic Theme Badges */}
        {themes.length > 0 && (
          <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
            {themes.map(t => themeColors[t] && (
              <span key={t} style={{ fontSize: 9, fontWeight: 600, color: themeColors[t].primary, background: themeColors[t].bg, padding: "2px 6px", borderRadius: 3, border: `1px solid ${themeColors[t].primary}40` }}>
                {themeColors[t].short}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div style={{ display: "flex", gap: 20 }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.textPrimary, margin: "0 0 4px" }}>Organisation & Stakeholders</h1>
            <p style={{ fontSize: 13, color: colors.textSecondary, margin: 0 }}>Executive relationships across 4 tiers · {EXECUTIVES.length} key stakeholders</p>
          </div>
          <select value={filterDiv} onChange={(e) => setFilterDiv(e.target.value)}
            style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 6, padding: "8px 12px", color: colors.textPrimary, fontSize: 12, cursor: "pointer" }}>
            {divisions.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        
        {/* Status Legend */}
        <div style={{ display: "flex", gap: 16, marginBottom: 12, flexWrap: "wrap" }}>
          {Object.entries(statusColors).map(([key, val]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: val.color }} />
              <span style={{ fontSize: 10, color: colors.textSecondary }}>{val.label}</span>
            </div>
          ))}
        </div>
        
        {/* Theme Legend */}
        <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
          {Object.entries(themeColors).map(([key, theme]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: theme.primary }} />
              <span style={{ fontSize: 10, color: colors.textSecondary }}>{theme.label}</span>
            </div>
          ))}
        </div>
        
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>Tier 0 — CEO</div>
          <div style={{ display: "flex", gap: 10 }}>
            {tier0.map(e => <ExecCard key={e.id} exec={e} onClick={setSelectedExec} />)}
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>Tier 1 — ExCo & Direct Reports to CEO</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {tier1.map(e => <ExecCard key={e.id} exec={e} onClick={setSelectedExec} />)}
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>Tier 2 — Key Stakeholders</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {tier2.map(e => <ExecCard key={e.id} exec={e} onClick={setSelectedExec} />)}
          </div>
        </div>
        {tier3.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>Tier 3 — Senior Leaders</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {tier3.map(e => <ExecCard key={e.id} exec={e} onClick={setSelectedExec} />)}
            </div>
          </div>
        )}
        {tier4.length > 0 && (
          <div>
            <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>Tier 4 — Operational Leaders</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {tier4.map(e => <ExecCard key={e.id} exec={e} onClick={setSelectedExec} />)}
            </div>
          </div>
        )}
      </div>
      {selectedExec && (
        <div style={{ width: 360, background: colors.bgPanel, border: `2px solid ${statusColors[selectedExec.status]?.color || colors.border}`, borderRadius: 12, padding: 24, position: "sticky", top: 24, alignSelf: "flex-start", maxHeight: "calc(100vh - 80px)", overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: colors.textPrimary, marginBottom: 4 }}>{selectedExec.name}</div>
              <div style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 2 }}>{selectedExec.title}</div>
              <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                <div style={{ fontSize: 11, color: colors.textMuted }}>{selectedExec.division}</div>
                {selectedExec.location && <div style={{ fontSize: 11, color: colors.blue }}>📍 {selectedExec.location}</div>}
              </div>
            </div>
            <button onClick={() => setSelectedExec(null)} style={{ background: "transparent", border: "none", color: colors.textMuted, fontSize: 20, cursor: "pointer", padding: 0 }}>Ã—</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, padding: "8px 12px", background: statusColors[selectedExec.status]?.bg || colors.bgCard, borderRadius: 6 }}>
            <StatusDot status={selectedExec.status} size={10} />
            <span style={{ fontSize: 11, fontWeight: 600, color: statusColors[selectedExec.status]?.color || colors.textSecondary }}>{statusColors[selectedExec.status]?.label || "Unknown"}</span>
          </div>
          
          {/* Strategic Themes */}
          {selectedExec.strategicThemes && selectedExec.strategicThemes.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Strategic Areas</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {selectedExec.strategicThemes.map(t => themeColors[t] && (
                  <span key={t} style={{ fontSize: 11, fontWeight: 600, color: themeColors[t].primary, background: themeColors[t].bg, padding: "4px 10px", borderRadius: 4, border: `1px solid ${themeColors[t].primary}40` }}>
                    {themeColors[t].label}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Linked Opportunities */}
          {getLinkedOpportunities(selectedExec).length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ fontSize: 10, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Linked Opportunities</div>
                {getTotalNNACV(selectedExec) && (
                  <div style={{ fontSize: 12, fontWeight: 700, color: colors.green, background: colors.greenGlow, padding: "2px 8px", borderRadius: 4 }}>
                    {getTotalNNACV(selectedExec)} influence
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {getLinkedOpportunities(selectedExec).map(opp => {
                  const theme = themeColors[opp.theme] || themeColors.ffg;
                  return (
                    <div key={opp.id} style={{ background: colors.bgCard, border: `1px solid ${theme.primary}40`, borderRadius: 6, padding: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: colors.textPrimary, flex: 1 }}>{opp.pursuit}</div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: theme.primary, marginLeft: 8 }}>{opp.nnacv}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 9, fontWeight: 600, color: "#FFFFFF", background: theme.primary, padding: "1px 6px", borderRadius: 3 }}>{opp.stage}</span>
                        <span style={{ fontSize: 9, color: theme.primary }}>{theme.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {selectedExec.parentId && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Reports To</div>
              <div style={{ fontSize: 12, color: colors.blue }}>{EXECUTIVES.find(e => e.id === selectedExec.parentId)?.name || "Unknown"}</div>
            </div>
          )}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Commentary</div>
            <div style={{ fontSize: 12, color: colors.textPrimary, lineHeight: 1.6 }}>{selectedExec.commentary}</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Priorities</div>
            <div style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 1.6 }}>{selectedExec.priorities}</div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Last Engagement</div>
            <div style={{ fontSize: 12, color: colors.textSecondary }}>{selectedExec.lastEngagement}</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Risk Assessment</div>
            <div style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 1.6 }}>{selectedExec.risk}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Account Team ─────────────────────────────────────────────────────────────
const ACCOUNT_TEAM = {
  core: [
    { name: "Arun Ragothaman", role: "Client Director", focus: "Overall account strategy & execution", status: "lead" },
    { name: "Brij Trivedi", role: "Solution Architect & Advisor", focus: "Technical strategy & solution design", status: "active" },
  ],
  executive: [
    { name: "Chris Bedi", role: "P5 Sponsor", focus: "C-suite engagement (Bill Winters, Tanuj)", status: "exec" },
    { name: "Stuart Pearce", role: "Overall Executive Sponsor", focus: "Regional executive oversight", status: "exec" },
    { name: "Melissa Ries", role: "Local Executive Sponsor", focus: "APAC executive relationships", status: "exec" },
  ],
  specialist: [
    { name: "Sandeep Karkhanis", role: "GPC", focus: "Global partner coordination", status: "active" },
    { name: "Sri Lakshmi", role: "CTO", focus: "Technical architecture & platform", status: "active" },
    { name: "Jan Morgenthal", role: "CTO", focus: "Technical architecture & platform", status: "active" },
    { name: "TBD", role: "Inspire Value Consultant", focus: "Value engineering & ROI", status: "pending" },
  ],
  solution: [
    { name: "Various", role: "Solution Sales Teams", focus: "FSO, Security, ITOM, WSD specialists", status: "active" },
    { name: "Various", role: "Solution Consultants", focus: "Pre-sales technical support", status: "active" },
  ],
  services: [
    { name: "James Tan", role: "Support Account Manager", focus: "Support & escalation management", status: "active" },
    { name: "Lydia Chia", role: "Impact Guided", focus: "Customer success & adoption", status: "active" },
    { name: "Abhishek Nigam", role: "CEG Services Account Executive", focus: "Expert services & implementations", status: "active" },
  ],
  partner: [
    { name: "Lead TBD", role: "Infosys Lead", focus: "MSP coordination & delivery", status: "pending" },
  ],
};

function AccountTeamView() {
  const roleColors = {
    lead: { bg: colors.greenGlow, color: colors.green, border: colors.green },
    exec: { bg: `${colors.blue}15`, color: colors.blue, border: colors.blue },
    active: { bg: colors.bgCard, color: colors.textPrimary, border: colors.border },
    pending: { bg: colors.amberGlow, color: colors.amber, border: colors.amber },
  };
  
  const TeamCard = ({ member }) => {
    const style = roleColors[member.status] || roleColors.active;
    return (
      <div style={{ background: style.bg, border: `1px solid ${style.border}40`, borderRadius: 8, padding: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: style.color }}>{member.name}</div>
          {member.status === "pending" && <span style={{ fontSize: 9, fontWeight: 600, color: colors.amber, background: colors.amberGlow, padding: "2px 6px", borderRadius: 3 }}>TBD</span>}
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, color: colors.textSecondary, marginBottom: 4 }}>{member.role}</div>
        <div style={{ fontSize: 10, color: colors.textMuted }}>{member.focus}</div>
      </div>
    );
  };
  
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.textPrimary, margin: "0 0 4px" }}>Account Team</h1>
        <p style={{ fontSize: 13, color: colors.textSecondary, margin: 0 }}>ServiceNow resources aligned to Standard Chartered</p>
      </div>
      
      {/* Core Team */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: colors.green, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: colors.green }} />
          Core Account Team
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {ACCOUNT_TEAM.core.map((m, i) => <TeamCard key={i} member={m} />)}
        </div>
      </div>
      
      {/* Executive Sponsors */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: colors.blue, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: colors.blue }} />
          Executive Sponsors
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {ACCOUNT_TEAM.executive.map((m, i) => <TeamCard key={i} member={m} />)}
        </div>
      </div>
      
      {/* Specialists */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: colors.textPrimary, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: colors.textSecondary }} />
          Technical & Value Specialists
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
          {ACCOUNT_TEAM.specialist.map((m, i) => <TeamCard key={i} member={m} />)}
        </div>
      </div>
      
      {/* Solution Teams */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: colors.textPrimary, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: colors.textSecondary }} />
          Solution Sales
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {ACCOUNT_TEAM.solution.map((m, i) => <TeamCard key={i} member={m} />)}
        </div>
      </div>
      
      {/* Services & Support */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: colors.textPrimary, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: colors.textSecondary }} />
          Services & Support
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {ACCOUNT_TEAM.services.map((m, i) => <TeamCard key={i} member={m} />)}
        </div>
      </div>
      
      {/* Partner */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: colors.amber, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: colors.amber }} />
          Partner Coordination
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {ACCOUNT_TEAM.partner.map((m, i) => <TeamCard key={i} member={m} />)}
        </div>
      </div>
      
      {/* Noelle Eder Engagement Plan */}
      <div style={{ background: `linear-gradient(135deg, ${colors.redGlow}, ${colors.amberGlow})`, border: `2px solid ${colors.red}`, borderRadius: 10, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ fontSize: 20 }}>🎯</div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: colors.red, margin: 0 }}>Critical Engagement Plan: Noelle Eder</h3>
        </div>
        <p style={{ fontSize: 12, color: colors.textPrimary, lineHeight: 1.6, margin: "0 0 12px" }}>
          <strong>The Challenge:</strong> Noelle Eder (Group Head, Technology & Operations) is the single most critical person to engage. She has authority over all technology strategy and can override Ben Issa's "build" preference. Direct reachouts have not yielded results.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ background: colors.bgCard, borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: colors.amber, marginBottom: 6 }}>Current Approach</div>
            <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.5 }}>Chris Bedi has requested Tanuj Kapilashrami facilitate an introduction — positioning it as a <strong style={{ color: colors.textPrimary }}>relationship introduction</strong> given Noelle's previous employer Cigna is also a Marquee account for ServiceNow.</div>
          </div>
          <div style={{ background: colors.bgCard, borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: colors.green, marginBottom: 6 }}>Meeting Objective</div>
            <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.5 }}>Platform consolidation conversation aligned to her track record. TCO analysis for duplicative systems. Position ServiceNow as enabling her <strong style={{ color: colors.textPrimary }}>Fit for Growth technology agenda</strong>.</div>
          </div>
        </div>
        <div style={{ marginTop: 12, padding: 10, background: colors.bgPanel, borderRadius: 6 }}>
          <div style={{ fontSize: 10, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Key Talking Points</div>
          <div style={{ fontSize: 11, color: colors.textPrimary }}>Cigna relationship • Platform consolidation track record • Forbes CIO Next List recognition • 86% HR satisfaction as proof point • $4M at-risk due to underutilisation</div>
        </div>
      </div>
    </div>
  );
}

// ─── Adoption ────────────────────────────────────────────────────────────────
function AdoptionView() {
  const [expandedFamily, setExpandedFamily] = useState(null);
  const highCount = ADOPTION_DATA.products.filter(p => p.adoption === "High").length;
  const medCount = ADOPTION_DATA.products.filter(p => p.adoption === "Medium" || p.adoption === "Emerging" || p.adoption === "Implementing").length;
  const lowCount = ADOPTION_DATA.products.filter(p => p.adoption === "Low" || p.adoption === "None").length;
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.textPrimary, margin: "0 0 4px" }}>Adoption & Renewal Status</h1>
      <p style={{ fontSize: 13, color: colors.textSecondary, margin: "0 0 20px" }}>Telemetry-grounded assessment · April 2026 scan · Next renewal: 28 Dec 2028</p>
      
      {/* Platform Health Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 20 }}>
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.green}40`, borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: 9, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Active Users</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: colors.green }}>632K</div>
          <div style={{ fontSize: 10, color: colors.green }}>+28% YoY</div>
        </div>
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.blue}40`, borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: 9, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Workflows/Month</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: colors.blue }}>5.9M</div>
          <div style={{ fontSize: 10, color: colors.blue }}>+44% YoY</div>
        </div>
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.green}40`, borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: 9, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>VA Conversations</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: colors.green }}>3.9M/mo</div>
          <div style={{ fontSize: 10, color: colors.green }}>100x peer median</div>
        </div>
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.green}40`, borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: 9, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>KB Views</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: colors.green }}>912K</div>
          <div style={{ fontSize: 10, color: colors.green }}>+65% YoY</div>
        </div>
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.red}40`, borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: 9, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Now Assist Consumed</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: colors.red }}>1.9%</div>
          <div style={{ fontSize: 10, color: colors.red }}>575K of 30M assists</div>
        </div>
      </div>

      {/* Value Delivered — Telemetry-Based */}
      <div style={{ background: colors.bgCard, border: `2px solid ${colors.green}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 22 }}>💰</div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: colors.green, margin: 0 }}>Annual Value Delivered (Telemetry-Based)</h3>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: colors.green }}>$11.2M</div>
            <div style={{ fontSize: 10, color: colors.textMuted }}>86% of $13.1M CACV</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
          {VALUE_DELIVERED.byDomain.filter(d => d.value > 10000).map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: colors.bgPanel, borderRadius: 6 }}>
              <div style={{ minWidth: 70, textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: d.value > 1000000 ? colors.green : colors.blue, fontFamily: "monospace" }}>
                  ${d.value >= 1000000 ? (d.value/1000000).toFixed(1) + "M" : (d.value/1000).toFixed(0) + "K"}
                </div>
              </div>
              <div style={{ flex: 1, borderLeft: `2px solid ${colors.border}`, paddingLeft: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: colors.textPrimary }}>{d.domain}</div>
                <div style={{ fontSize: 9, color: colors.textMuted }}>{d.detail}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: colors.textMuted, lineHeight: 1.5, borderTop: `1px solid ${colors.border}`, paddingTop: 10 }}>
          Modelled from April 2026 telemetry scan. Methodology: ServiceNow Value Melody framework — time savings × cost assumptions × attribution %. VA deflection at 50% attribution, ITSM efficiency gains at 50%, AI search deflection at 100%. Conservative assumptions applied throughout.
        </div>
      </div>

      {/* Adoption Summary Bar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <div style={{ flex: highCount, background: colors.greenGlow, borderRadius: 8, padding: "10px 14px", textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: colors.green }}>{highCount}</div>
          <div style={{ fontSize: 10, fontWeight: 600, color: colors.green }}>High Use</div>
        </div>
        <div style={{ flex: medCount, background: colors.amberGlow, borderRadius: 8, padding: "10px 14px", textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: colors.amber }}>{medCount}</div>
          <div style={{ fontSize: 10, fontWeight: 600, color: colors.amber }}>Emerging / Implementing</div>
        </div>
        <div style={{ flex: lowCount, background: colors.redGlow, borderRadius: 8, padding: "10px 14px", textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: colors.red }}>{lowCount}</div>
          <div style={{ fontSize: 10, fontWeight: 600, color: colors.red }}>Low / At Risk</div>
        </div>
      </div>

      {/* Downsell Risk Warning */}
      <div style={{ background: `linear-gradient(135deg, ${colors.redGlow}, ${colors.amberGlow})`, border: `2px solid ${colors.red}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 24 }}>⚠️</div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: colors.red, margin: 0 }}>Downsell Risk: {ADOPTION_DATA.downsellRisk.total}</h3>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {ADOPTION_DATA.downsellRisk.products.map((p, i) => (
            <span key={i} style={{ fontSize: 11, fontWeight: 600, color: colors.red, background: `${colors.red}20`, padding: "4px 10px", borderRadius: 4 }}>{p}</span>
          ))}
        </div>
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 8, padding: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: colors.amber }}>Primary Threat:</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: colors.red }}>{ADOPTION_DATA.downsellRisk.mainThreat}</span>
          </div>
          <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.5 }}>{ADOPTION_DATA.downsellRisk.threatDescription}</div>
        </div>
      </div>
      
      <h2 style={{ fontSize: 16, fontWeight: 600, color: colors.textPrimary, margin: "0 0 12px" }}>Product Family Adoption — Telemetry View</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {ADOPTION_DATA.products.map((p, i) => (
          <div key={i} onClick={() => setExpandedFamily(expandedFamily === i ? null : i)}
            style={{ background: expandedFamily === i ? colors.bgHover : colors.bgCard, border: `1px solid ${expandedFamily === i ? colors.green + "40" : colors.border}`, borderRadius: 10, padding: "14px 18px", cursor: "pointer", transition: "all 0.2s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <StatusDot status={p.status} size={10} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: colors.textPrimary }}>{p.family}</span>
                  <span style={{ fontSize: 10, color: colors.textMuted, fontFamily: "monospace" }}>{p.users}</span>
                </div>
                {expandedFamily === i && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>Products: {p.products.join(", ")}</div>
                    <div style={{ fontSize: 11, color: colors.textSecondary }}>{p.notes}</div>
                  </div>
                )}
              </div>
              <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, fontWeight: 600,
                background: p.adoption === "High" ? colors.greenGlow : (p.adoption === "Low" || p.adoption === "None") ? colors.redGlow : colors.amberGlow,
                color: p.adoption === "High" ? colors.green : (p.adoption === "Low" || p.adoption === "None") ? colors.red : colors.amber }}>
                {p.adoption}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Success Measure */}
      <div style={{ background: colors.bgCard, border: `2px solid ${colors.green}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary, margin: "0 0 12px" }}>Measure of Success</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 4 }}>{ADOPTION_DATA.successMeasure.metric}</div>
            <div style={{ fontSize: 11, color: colors.textMuted }}>{ADOPTION_DATA.successMeasure.description}</div>
          </div>
          <div style={{ textAlign: "center", padding: "12px 24px", background: colors.greenGlow, borderRadius: 8 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: colors.green }}>{ADOPTION_DATA.successMeasure.target}</div>
            <div style={{ fontSize: 10, color: colors.green, textTransform: "uppercase", letterSpacing: "0.05em" }}>Target</div>
          </div>
        </div>
      </div>
      
      {/* Investment Asks & Adoption Acceleration Plan */}
      <div style={{ background: `linear-gradient(135deg, ${colors.bgCard}, ${colors.bgHover})`, border: `2px solid ${colors.blue}`, borderRadius: 10, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ fontSize: 22 }}>💡</div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.blue, margin: 0 }}>Investment Asks & Adoption Acceleration Plan</h3>
        </div>
        <p style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 16, lineHeight: 1.6 }}>
          To drive adoption of at-risk solutions and protect the $4M CACV, we are requesting the following investments from ServiceNow leadership:
        </p>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {/* Investment 1: Customer Success Executive */}
          <div style={{ background: colors.bgPanel, border: `1px solid ${colors.blue}40`, borderRadius: 8, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: colors.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: colors.white, flexShrink: 0 }}>1</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.green, marginBottom: 4 }}>✅ Dean Lee — Customer Success Executive (Assigned)</div>
                <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.5 }}>Dedicated resource as part of the account team, spending <strong style={{ color: colors.green }}>2 days per week onsite</strong>. Driving adoption and protecting $4M at-risk CACV.</div>
              </div>
            </div>
          </div>
          
          {/* Investment 2: Platform Architect */}
          <div style={{ background: colors.bgPanel, border: `1px solid ${colors.blue}40`, borderRadius: 8, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: colors.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: colors.white, flexShrink: 0 }}>2</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.textPrimary, marginBottom: 4 }}>Platform Architect Investment</div>
                <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.5 }}><strong style={{ color: colors.blue }}>3-month engagement</strong> to enable stalled or at-risk areas: SecOps VR, SPM, BCM, and Now Assist activation across HR, ITOM, Security.</div>
              </div>
            </div>
          </div>
          
          {/* Investment 3: Active AI Adoption Guidance */}
          <div style={{ background: `linear-gradient(135deg, ${colors.greenGlow}, ${colors.blueGlow})`, border: `2px solid ${colors.green}`, borderRadius: 8, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: colors.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#FFFFFF", flexShrink: 0 }}>A</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.green, marginBottom: 4 }}>ASK: Active AI Adoption Guidance & Support</div>
                <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.5 }}>SCB has <strong style={{ color: colors.red }}>$897K in Now Assist at 1.9% consumption</strong>. 9 of 13 Now Assist products are Not In Use. We need dedicated AI adoption support — use case identification, activation playbooks, and hands-on enablement — to turn contracted AI spend into demonstrated value before the 2028 renewal.</div>
              </div>
            </div>
          </div>
          
          {/* Investment 4: Operating Model Guidance */}
          <div style={{ background: `linear-gradient(135deg, ${colors.blueGlow}, ${colors.greenGlow})`, border: `2px solid ${colors.blue}`, borderRadius: 8, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: colors.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#FFFFFF", flexShrink: 0 }}>B</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.blue, marginBottom: 4 }}>ASK: Guidance to Prepare a Working Operating Model</div>
                <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.5 }}>SCB's platform spans <strong style={{ color: colors.blue }}>632K users, 5.9M workflows/month, and 142M configuration items</strong> but lacks a formalised operating model. We need guidance on governance, demand management, release cadence, and centre-of-excellence structure to sustain the +44% YoY growth trajectory and scale into new domains (CIB, Legal, CRES).</div>
              </div>
            </div>
          </div>
          
          {/* Investment 5: Paid Services via CEG */}
          <div style={{ background: colors.bgPanel, border: `1px solid ${colors.green}40`, borderRadius: 8, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: colors.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#FFFFFF", flexShrink: 0 }}>3</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.textPrimary, marginBottom: 4 }}>Paid Services via CEG</div>
                <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.5 }}>Pitching for paid services in parallel. <strong style={{ color: colors.green }}>2 Expert Services SoWs already in play</strong> to support implementation and adoption.</div>
              </div>
            </div>
          </div>
          
          {/* Investment 6: Training Credits */}
          <div style={{ background: colors.bgPanel, border: `1px solid ${colors.amber}40`, borderRadius: 8, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: colors.amber, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#FFFFFF", flexShrink: 0 }}>4</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.textPrimary, marginBottom: 4 }}>Pro-active Training Credits Guidance</div>
                <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.5 }}>The bank has <strong style={{ color: colors.amber }}>$30K/year in training credits</strong> not used effectively. Maximise utilisation to support platform operating model build-out.</div>
              </div>
            </div>
          </div>
          
          {/* Investment 7: Executive Review Forum */}
          <div style={{ background: colors.bgPanel, border: `1px solid ${colors.blue}40`, borderRadius: 8, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: colors.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: colors.white, flexShrink: 0 }}>5</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.textPrimary, marginBottom: 4 }}>Bi-Monthly Executive Review Forum</div>
                <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.5 }}>Proposing an <strong style={{ color: colors.blue }}>operational cadence</strong> covering innovations, progress, and value realised. CEG leaders and Product BU representatives to attend.</div>
              </div>
            </div>
          </div>
          
          {/* Investment 8: Telemetry & Value Assessment */}
          <div style={{ background: `linear-gradient(135deg, ${colors.redGlow}, ${colors.amberGlow})`, border: `2px solid ${colors.red}`, borderRadius: 8, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: colors.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: colors.white, flexShrink: 0 }}>⚡</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.red, marginBottom: 4 }}>CRITICAL: Telemetry & Value Assessment</div>
                <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.5 }}>We need help to use <strong style={{ color: colors.red }}>telemetry to assess $value delivered</strong> as a starting point. Monthly refresh cycle established. Essential for demonstrating ROI and protecting the renewal.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Growth & Upsell ─────────────────────────────────────────────────────────
function GrowthView() {
  const [expandedOpp, setExpandedOpp] = useState(null);
  
  // Theme colors matching strategic areas
  const themeColors = {
    ffg: { primary: colors.green, bg: colors.greenGlow, label: "Sustain (2026)" },
    techRes: { primary: colors.amber, bg: colors.amberGlow, label: "Govern (2027)" },
    clientExp: { primary: colors.blue, bg: `${colors.blue}15`, label: "Grow (2027)" },
  };
  
  // Get linked executives for an opportunity
  const getLinkedExecutives = (opp) => {
    if (!opp.executiveIds || opp.executiveIds.length === 0) return [];
    return EXECUTIVES.filter(exec => opp.executiveIds.includes(exec.id));
  };
  
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.textPrimary, margin: "0 0 4px" }}>Growth & Upsell Pipeline</h1>
          <p style={{ fontSize: 13, color: colors.textSecondary, margin: "4px 0 0" }}>Expansion across 7 pursuits: Sustain (2026) · Govern (2027) · Grow (2027)</p>
        </div>
        <div style={{ background: colors.greenGlow, border: `1px solid ${colors.green}40`, borderRadius: 10, padding: "12px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 10, color: colors.green, textTransform: "uppercase", letterSpacing: "0.1em" }}>Total NNACV Potential</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: colors.green }}>$12-14M</div>
        </div>
      </div>
      
      {/* Theme Legend */}
      <div style={{ display: "flex", gap: 20, marginBottom: 16, justifyContent: "flex-start" }}>
        {Object.entries(themeColors).map(([key, theme]) => (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 14, height: 14, borderRadius: 3, background: theme.primary }} />
            <span style={{ fontSize: 11, color: colors.textSecondary, fontWeight: 600 }}>{theme.label}</span>
          </div>
        ))}
      </div>
      
      {/* Competitive Landscape & Partner Context */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.red}40`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: colors.red, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <span>⚔️</span> Competitive Landscape
          </div>
          <div style={{ fontSize: 10, color: colors.textSecondary, lineHeight: 1.6 }}>
            <div style={{ marginBottom: 4 }}><strong style={{ color: colors.textPrimary }}>Displace:</strong> ServiceBench (EmployeeWorks, Contract Mgmt, CRES, FSO)</div>
            <div style={{ marginBottom: 4 }}><strong style={{ color: colors.textPrimary }}>Incumbent:</strong> MetricStream (IRM/GRC), Pega (selected for CIB client lifecycle replatform — we play adjacency)</div>
            <div><strong style={{ color: colors.textPrimary }}>Platform:</strong> Microsoft (MAC agreement), AWS (hyperscaler), SAP (ERP)</div>
          </div>
        </div>
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.blue}40`, borderRadius: 8, padding: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: colors.blue, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <span>🤝</span> Partner Strategy
          </div>
          <div style={{ fontSize: 10, color: colors.textSecondary, lineHeight: 1.6 }}>
            <div style={{ marginBottom: 4 }}><strong style={{ color: colors.textPrimary }}>MSP:</strong> Infosys (contract through Dec 2028) — all engagements</div>
            <div style={{ marginBottom: 4 }}><strong style={{ color: colors.textPrimary }}>CRES:</strong> JLL — workplace & facilities implementation partner</div>
            <div style={{ marginBottom: 4 }}><strong style={{ color: colors.textPrimary }}>FSO/CIB:</strong> Kyriba (autonomous treasury partnership) + TCS (to explore)</div>
          </div>
        </div>
      </div>
      
      <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto" }}>
        {GROWTH_OPPORTUNITIES.map(o => {
          const theme = themeColors[o.theme] || themeColors.ffg;
          return (
            <div key={o.id} style={{ flex: "1 1 0", minWidth: 120, background: colors.bgCard, border: `2px solid ${theme.primary}`, borderRadius: 8, padding: "10px 12px", textAlign: "center", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: theme.primary }} />
              <div style={{ fontSize: 18, fontWeight: 700, color: theme.primary, marginTop: 4 }}>{o.nnacv}</div>
              <div style={{ fontSize: 10, color: colors.textSecondary, lineHeight: 1.3 }}>{o.pursuit.split("(")[0].trim()}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 2 }}>
                <span style={{ fontSize: 10 }}>{o.progress === "active" ? "🟢" : "🔴"}</span>
                <span style={{ fontSize: 9, color: theme.primary, fontWeight: 600 }}>{o.stage}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {GROWTH_OPPORTUNITIES.map(o => {
          const theme = themeColors[o.theme] || themeColors.ffg;
          const linkedExecs = getLinkedExecutives(o);
          return (
            <div key={o.id} style={{ background: expandedOpp === o.id ? colors.bgHover : colors.bgCard, border: `2px solid ${theme.primary}`, borderRadius: 10, overflow: "hidden", transition: "all 0.2s", position: "relative" }}>
              {/* Color bar on left */}
              <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 4, background: theme.primary }} />
              <div onClick={() => setExpandedOpp(expandedOpp === o.id ? null : o.id)} style={{ padding: "16px 20px 16px 24px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#FFFFFF", background: theme.primary, padding: "2px 8px", borderRadius: 4 }}>{o.stage}</span>
                    <span style={{ fontSize: 14 }}>{o.progress === "active" ? "🟢" : "🔴"}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: theme.primary, background: theme.bg, padding: "2px 8px", borderRadius: 4, border: `1px solid ${theme.primary}40` }}>{o.year}</span>
                    <span style={{ fontSize: 15, fontWeight: 600, color: colors.textPrimary }}>{o.pursuit}</span>
                    <span style={{ fontSize: 9, fontWeight: 600, color: theme.primary, background: theme.bg, padding: "2px 8px", borderRadius: 4, border: `1px solid ${theme.primary}40` }}>{themeColors[o.theme]?.label || "Strategic"}</span>
                  </div>
                  <div style={{ fontSize: 11, color: colors.textSecondary }}>{o.description}</div>
                </div>
                <div style={{ textAlign: "right", marginLeft: 16 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: theme.primary }}>{o.nnacv}</div>
                  <div style={{ fontSize: 10, color: colors.textMuted }}>NNACV</div>
                </div>
              </div>
              {expandedOpp === o.id && (
                <div style={{ padding: "0 20px 16px 24px", borderTop: `1px solid ${colors.border}` }}>
                  <div style={{ display: "flex", gap: 16, padding: "12px 0 8px", flexWrap: "wrap" }}>
                    <div style={{ fontSize: 11 }}><span style={{ color: colors.textMuted }}>Sponsor:</span> <span style={{ color: colors.textPrimary, fontWeight: 500 }}>{o.sponsor}</span></div>
                    <div style={{ fontSize: 11 }}><span style={{ color: colors.textMuted }}>Products:</span> <span style={{ color: theme.primary }}>{o.products.join(", ")}</span></div>
                  </div>
                  <div style={{ display: "flex", gap: 16, padding: "0 0 12px", flexWrap: "wrap" }}>
                    {o.competes && <div style={{ fontSize: 11 }}><span style={{ color: colors.textMuted }}>Competes:</span> <span style={{ color: colors.red, fontWeight: 500 }}>{o.competes}</span></div>}
                    {o.partner && <div style={{ fontSize: 11 }}><span style={{ color: colors.textMuted }}>Partner:</span> <span style={{ color: colors.blue, fontWeight: 500 }}>{o.partner}</span></div>}
                  </div>
                  
                  {/* Linked Executives Section */}
                  {linkedExecs.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 10, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Key Stakeholders ({linkedExecs.length})</div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {linkedExecs.map(exec => (
                          <div key={exec.id} style={{ display: "flex", alignItems: "center", gap: 6, background: colors.bgPanel, border: `1px solid ${statusColors[exec.status]?.color || colors.border}40`, borderRadius: 6, padding: "6px 10px" }}>
                            <StatusDot status={exec.status} size={8} />
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 600, color: colors.textPrimary }}>{exec.name}</div>
                              <div style={{ fontSize: 9, color: colors.textMuted }}>{exec.title.length > 30 ? exec.title.substring(0, 30) + '...' : exec.title}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {o.items.map((item, i) => (
                      <div key={i} style={{ background: colors.bgPanel, borderRadius: 8, padding: 12, border: `1px solid ${theme.primary}40` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: colors.textPrimary }}>{item.name}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: theme.primary }}>{item.est}</span>
                        </div>
                        <div style={{ fontSize: 10, color: colors.textSecondary, marginBottom: 4 }}>{item.detail}</div>
                        <span style={{ fontSize: 9, padding: "1px 6px", borderRadius: 3, fontWeight: 500,
                          background: ["Active", "Building", "Requirements gathering", "Requirements gathered"].includes(item.status) ? colors.greenGlow : ["Developing", "Evaluation"].includes(item.status) ? colors.amberGlow : colors.blueGlow,
                          color: ["Active", "Building", "Requirements gathering", "Requirements gathered"].includes(item.status) ? colors.green : ["Developing", "Evaluation"].includes(item.status) ? colors.amber : colors.blue }}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Actions View ─────────────────────────────────────────────────────────────
const ACTIONS_DATA = [
  // Growth & Upsell Actions
  { id: 1, category: "Growth", action: "Secure meeting with Noelle Eder", criticality: "Critical", bankContact: "Noelle Eder (Group Head T&O)", snContact: "Stuart Pearce / Arun Ragothaman", dueDate: "Q2 2026", status: "In Progress", notes: "Stuart Pearce is reaching out directly to Noelle Eder. Response not yet confirmed. Single most critical engagement gap — controls all technology strategy. Fallback: peer-brokered introduction via Chris Bedi and Tanuj. Target: before or at Knowledge 2026 (May).", marqueeOffer: "Access: Global Advisory Council" },
  { id: 27, category: "Growth", action: "Bill McDermott office outreach to Bill Winters", criticality: "Critical", bankContact: "Bill Winters (Group CEO)", snContact: "Bill McDermott's Office / Stuart Pearce", dueDate: "Q2 2026", status: "In Progress", notes: "Bill McDermott's office now engaged to reach out to Bill Winters. Exploring mutual partnership angle. AI governance sits on Winters' personal 2026 scorecard — natural alignment for a CEO-to-CEO dialogue on enterprise AI strategy.", marqueeOffer: "Access: Dedicated Executive Sponsor" },
  { id: 2, category: "Growth", action: "Meet Guillermo Veiga for FSO positioning", criticality: "High", bankContact: "Guillermo Veiga (Group CIO)", snContact: "Arun Ragothaman / FSO Specialist", dueDate: "Q2 2026", status: "Not Started", notes: "CIB engagement via Geoff Kot has opened an alternative path into FSO. Veiga still important for broader T&O platform strategy and Balachandher Balakrishnan alignment.", marqueeOffer: "Advantage: AI Advantage Team" },
  { id: 3, category: "Growth", action: "Revive Cezary Piekarski relationship for Veza/Armis", criticality: "High", bankContact: "Cezary Piekarski (CISO)", snContact: "Lou Fiorello / Security Team", dueDate: "Early May 2026", status: "In Progress", notes: "Meeting with Cezary scheduled for early May 2026. Lavy dinner (6 April) led to introduction to Felicia Ong (Head of Identity under Cezary) — direct path into Veza identity security. DORA compliance creates urgency.", marqueeOffer: "Advantage: Industry Customer Advisory Board" },
  { id: 4, category: "Growth", action: "Engage Lavy Stokhamer for SecOps and Financial Crime", criticality: "Medium", bankContact: "Lavy Stokhamer (Global Head Cyber & Anti-Crime)", snContact: "Arun Ragothaman / Security Team", dueDate: "Q2 2026", status: "Complete", notes: "Executive dinner held 6 April 2026. Connected to Felicia Ong (Head of Identity) who reports to Cezary — key entry point for Veza identity security pursuit. Reports to Cezary. Key for security and FSO financial crime use cases." },
  { id: 5, category: "Growth", action: "Progress CRES Digital Vision requirements with Shelley", criticality: "High", bankContact: "Shelley Boland (Head CRES)", snContact: "Melissa Ries / Arun Ragothaman", dueDate: "Ongoing", status: "In Progress", notes: "WSD signed and in delivery. CRES executive visit 30 April London (Salisbury Sq + PIC). Shelley attending Knowledge 2026. Potential Platinum programme candidate.", marqueeOffer: "Access: Complimentary Knowledge Passes" },
  { id: 6, category: "Growth", action: "Agentic AI for Onboarding go-live", criticality: "High", bankContact: "Melinda McKinley", snContact: "AI Team / Arun Ragothaman", dueDate: "24 Apr 2026", status: "In Progress", notes: "Go-live revised to 24 April 2026. MVP presented. Directly supports GenAI governance mandate and revenue-per-FTE KPI.", marqueeOffer: "Advantage: AI Advantage Team" },
  { id: 7, category: "Growth", action: "Legal Service Delivery requirements gathering", criticality: "Medium", bankContact: "Legal Function / Tanuj Kapilashrami", snContact: "Arun Ragothaman", dueDate: "Q2 2026", status: "Stalled", notes: "Stalled — no active engagement from the Legal function. Executive sponsorship from Tanuj remains but operational traction has not materialised." },
  { id: 8, category: "Growth", action: "Engage Pete Burrill (Interim GCFO) for value/TCO narrative", criticality: "Critical", bankContact: "Pete Burrill (Interim GCFO)", snContact: "Chris Bedi / Arun Ragothaman", dueDate: "Q2 2026", status: "Not Started", notes: "Must engage before May 2026 medium-term framework. Build value narrative on reported basis for 2028 renewal.", marqueeOffer: "Access: Dedicated Executive Sponsor" },
  // Post-FFG & Intelligence Actions
  { id: 20, category: "Growth", action: "Identify Platinum programmes via Tanuj/Warren Young", criticality: "Critical", bankContact: "Tanuj Kapilashrami / Warren Young", snContact: "Arun Ragothaman", dueDate: "Q2 2026", status: "Not Started", notes: "2026 board scorecard (15% weighting) includes Platinum programmes. If ServiceNow is not in one, risk of budget marginalisation.", marqueeOffer: "Access: Marquee Leaders Advantage" },
  { id: 21, category: "Growth", action: "Prepare for May 2026 medium-term financial framework", criticality: "Critical", bankContact: "Pete Burrill / Tanuj Kapilashrami", snContact: "Arun Ragothaman / Account Team", dueDate: "Apr 2026", status: "Not Started", notes: "SCB publishes new multi-year framework in May 2026. ServiceNow must be embedded in the post-FFG narrative before budgets are set.", marqueeOffer: "Acceleration: Commercial Strategy & Advisory" },
  { id: 22, category: "Growth", action: "Build revenue-per-FTE value narrative", criticality: "High", bankContact: "Pete Burrill / Warren Young", snContact: "Arun Ragothaman", dueDate: "Q2 2026", status: "Not Started", notes: "NEW 2026 CEO scorecard KPI. Quantify HR Hub 104K hours + CRES + Legal productivity gains into board-ready narrative.", marqueeOffer: "Acceleration: Annual Executive Health Review" },
  { id: 23, category: "Growth", action: "Position eNPS recovery story with Melinda/Tanuj", criticality: "High", bankContact: "Melinda McKinley / Tanuj Kapilashrami", snContact: "Arun Ragothaman", dueDate: "Q2 2026", status: "Not Started", notes: "eNPS declined 3.9pts to 17.56 (board KPI). HR Hub shows 86% satisfaction. Position WSD, EmployeeWorks, Agentic AI as recovery vehicle.", marqueeOffer: "Advantage: AI Benchmarking & Insights Report" },
  { id: 24, category: "Growth", action: "Map AI Control Tower to GenAI governance mandate", criticality: "High", bankContact: "Shebani Baweja / Noelle Eder", snContact: "AI Team / Arun Ragothaman", dueDate: "Q2 2026", status: "Not Started", notes: "Bill Winters' 2026 personal objective: GenAI strategy. Board held AI governance stewardship event Nov 2025. Reframe AI Control Tower as enterprise foundation for GenAI at scale.", marqueeOffer: "Advantage: AI Solutions Product Advisory Council" },
  { id: 25, category: "Growth", action: "CIB Workshop — confirm 16-17 April with Geoff Kot / Craig Corte", criticality: "Critical", bankContact: "Geoff Kot / Craig Corte / Jennifer Ketelaar", snContact: "Arun Ragothaman / Stuart Pearce / Ryan Clare", dueDate: "16 Apr 2026", status: "In Progress", notes: "BREAKTHROUGH: First entry into CIB. Three workstreams agreed. Bank account management as first use case. Stuart Pearce for executive air cover. Connect AICT go-live (30 Apr) to Geoff's CIB needs. Position for Knowledge 2026 storytelling.", marqueeOffer: "Advantage: AI Advantage Team" },
  { id: 26, category: "Growth", action: "Connect GCFO (Tom Pfaff) to CIB engagement post-workshop", criticality: "Medium", bankContact: "Tom Pfaff / Geoff Kot", snContact: "Arun Ragothaman", dueDate: "May 2026", status: "Not Started", notes: "Post-CIB workshop: connect the GCFO/COO buying centre to the CIB engagement for broader account coverage." },
    // Adoption & Renewal Actions
  { id: 9, category: "Adoption", action: "Customer Success Executive onboarded (Dean Lee)", criticality: "High", bankContact: "Melinda McKinley / Tanuj Kapilashrami", snContact: "Dean Lee (CSE)", dueDate: "Q1 2026", status: "Complete", notes: "Investment ask to drive adoption and protect $4M at-risk CACV.", marqueeOffer: "Acceleration: Now on Now Concierge" },
  { id: 10, category: "Adoption", action: "Platform Architect engagement for stalled areas", criticality: "Critical", bankContact: "Technology Teams", snContact: "Platform Architect (TBD)", dueDate: "Q2 2026", status: "Requested", notes: "3-month engagement for ITOM, HAM, SAM, SecOps VR, IRM (DORA), AICT.", marqueeOffer: "Acceleration: Deployment & Adoption Roundtables" },
  { id: 11, category: "Adoption", action: "Progress Expert Services SoWs", criticality: "High", bankContact: "SCB Procurement", snContact: "CEG Team", dueDate: "Q2 2026", status: "In Progress", notes: "2 Expert Services SoWs already in play.", marqueeOffer: "Acceleration: Commercial Strategy & Advisory" },
  { id: 12, category: "Adoption", action: "Maximise $30K training credits utilisation", criticality: "Medium", bankContact: "HR / Training Teams", snContact: "Training Team", dueDate: "Q2 2026", status: "Not Started", notes: "Bank has unused training credits — need proactive guidance." },
  { id: 13, category: "Adoption", action: "Strategic Review 1 — Executive Review Forum", criticality: "High", bankContact: "Tanuj / Melinda", snContact: "CEG Leaders / Product BU", dueDate: "Q3 2026", status: "Not Started", notes: "First formal strategic review moved to Q3 2026. Operational cadence covering innovations, progress, and value realised. Bi-weekly account cadence already active via dedicated Teams channel.", marqueeOffer: "Access: Marquee Leaders Advantage" },
  { id: 14, category: "Adoption", action: "Implement telemetry-based value assessment", criticality: "Critical", bankContact: "Warren Young / Brian O'Neill", snContact: "Value Engineering / Arun Ragothaman", dueDate: "Q2 2026", status: "Not Started", notes: "Use telemetry to assess $value delivered — critical for renewal positioning.", marqueeOffer: "Advantage: AI Benchmarking & Insights Report" },
  { id: 15, category: "Adoption", action: "ITOM/HAM/SAM adoption acceleration", criticality: "High", bankContact: "Balachandher Balakrishnan / Technology Teams", snContact: "Platform Team", dueDate: "Q2 2026", status: "Not Started", notes: "$4M at-risk CACV. Est. 20-30% utilisation outside HR — critical gap." },
  { id: 16, category: "Adoption", action: "SecOps VR Databricks integration completion", criticality: "High", bankContact: "Alvaro Garrido / Lavy Stokhamer", snContact: "Security Team", dueDate: "Q2 2026", status: "Stalled", notes: "Stalled — the bank has confirmed they will not use SecOps VR. Downsell candidate for AI Native migration. Redirect investment to Veza identity security." },
];

function ActionsView() {
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterCriticality, setFilterCriticality] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  
  const categories = ["All", "Growth", "Adoption"];
  const criticalities = ["All", "Critical", "High", "Medium", "Low"];
  const statuses = ["All", "Not Started", "In Progress", "Requested", "Developing", "Stalled", "Complete"];
  
  const filteredActions = ACTIONS_DATA.filter(a => {
    if (filterCategory !== "All" && a.category !== filterCategory) return false;
    if (filterCriticality !== "All" && a.criticality !== filterCriticality) return false;
    if (filterStatus !== "All" && a.status !== filterStatus) return false;
    return true;
  });
  
  const criticalityColors = {
    "Critical": { bg: colors.redGlow, color: colors.red, border: colors.red },
    "High": { bg: colors.amberGlow, color: colors.amber, border: colors.amber },
    "Medium": { bg: `${colors.blue}15`, color: colors.blue, border: colors.blue },
    "Low": { bg: colors.bgCard, color: colors.textMuted, border: colors.border },
  };
  
  const statusColors = {
    "Not Started": { bg: colors.bgCard, color: colors.textMuted },
    "In Progress": { bg: colors.amberGlow, color: colors.amber },
    "Requested": { bg: `${colors.blue}15`, color: colors.blue },
    "Developing": { bg: colors.amberGlow, color: colors.amber },
    "Complete": { bg: colors.greenGlow, color: colors.green },
    "Stalled": { bg: colors.redGlow, color: colors.red },
  };
  
  const criticalCount = ACTIONS_DATA.filter(a => a.criticality === "Critical").length;
  const highCount = ACTIONS_DATA.filter(a => a.criticality === "High").length;
  const inProgressCount = ACTIONS_DATA.filter(a => a.status === "In Progress" || a.status === "Developing").length;
  
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.textPrimary, margin: "0 0 4px" }}>Actions</h1>
          <p style={{ fontSize: 13, color: colors.textSecondary, margin: 0 }}>Key actions across Growth & Upsell and Adoption & Renewal</p>
          <div style={{ marginTop: 8, padding: "8px 14px", background: colors.blueGlow, border: `1px solid ${colors.blue}30`, borderRadius: 6, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12 }}>📋</span>
            <span style={{ fontSize: 11, color: colors.blue, fontWeight: 600 }}>Bi-weekly account cadence active via dedicated Teams channel: Marquee-Standard Chartered</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ background: colors.redGlow, border: `1px solid ${colors.red}40`, borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: colors.red }}>{criticalCount}</div>
            <div style={{ fontSize: 10, color: colors.red, textTransform: "uppercase" }}>Critical</div>
          </div>
          <div style={{ background: colors.amberGlow, border: `1px solid ${colors.amber}40`, borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: colors.amber }}>{highCount}</div>
            <div style={{ fontSize: 10, color: colors.amber, textTransform: "uppercase" }}>High</div>
          </div>
          <div style={{ background: colors.greenGlow, border: `1px solid ${colors.green}40`, borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: colors.green }}>{inProgressCount}</div>
            <div style={{ fontSize: 10, color: colors.green, textTransform: "uppercase" }}>In Progress</div>
          </div>
        </div>
      </div>
      
      {/* Next 30 Days — Key Happenings */}
      <div style={{ background: colors.bgCard, border: `2px solid ${colors.blue}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ fontSize: 18 }}>⚡</div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: colors.blue, margin: 0 }}>Next 30 Days — Key Happenings</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {[
            { date: "22 Apr", event: "Dinner with Shelley Boland", detail: "Holly and Chelsea (ServiceNow leaders) attending. CRES relationship deepening.", type: "meeting" },
            { date: "24 Apr", event: "Agentic AI Onboarding Go-Live", detail: "Melinda McKinley internal communication to 82,000 employees. Flagship AI launch.", type: "golive" },
            { date: "30 Apr", event: "London: Host Shelley and MT", detail: "Client visit in London — Salisbury Square + PIC site visit at 22 Ropemaker Street.", type: "meeting" },
            { date: "Early May", event: "Cezary Piekarski CISO Meeting", detail: "Security platform discussion. Felicia Ong (Identity) connection made via Lavy.", type: "meeting" },
            { date: "May (K26)", event: "K26: Paul Fipps ↔ Melinda", detail: "Executive Circle face time. Chris Bedi ↔ Melinda also confirmed.", type: "k26" },
            { date: "May (K26)", event: "K26: Debrief meeting", detail: "Post-K26 debrief session with SCB team. Help needed to facilitate.", type: "k26" },
            { date: "May (K26)", event: "K26: Bhavin + Peer Meetings", detail: "JPMC, Morgan Stanley, Dai-ichi Life meetings scheduled for Bhavin Shah.", type: "k26" },
            { date: "11 May", event: "CIB Client Onboarding Call", detail: "Workshop planning session with Geoff Kot / Craig Corte.", type: "meeting" },
            { date: "15–19 Jun", event: "CIB Workshop", detail: "Full week on-site. Three workstreams: client lifecycle, AI Control Tower, Kyriba.", type: "workshop" },
          ].map((item, i) => {
            const typeStyle = {
              meeting: { color: colors.green, icon: "🤝" },
              golive: { color: colors.amber, icon: "🚀" },
              k26: { color: colors.blue, icon: "🎯" },
              workshop: { color: colors.green, icon: "🔬" },
            }[item.type];
            return (
              <div key={i} style={{ display: "flex", gap: 14, padding: "10px 0", borderBottom: i < 8 ? `1px solid ${colors.border}` : "none" }}>
                <div style={{ width: 70, flexShrink: 0, textAlign: "right" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: typeStyle.color }}>{item.date}</div>
                </div>
                <div style={{ width: 10, display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, paddingTop: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: typeStyle.color, flexShrink: 0 }} />
                  {i < 8 && <div style={{ width: 1, flex: 1, background: `${colors.border}`, marginTop: 4 }} />}
                </div>
                <div style={{ flex: 1, paddingBottom: 2 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 12 }}>{typeStyle.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: colors.textPrimary }}>{item.event}</span>
                  </div>
                  <div style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2 }}>{item.detail}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 12-Month Timeline */}
      <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ fontSize: 18 }}>📅</div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: colors.textPrimary, margin: 0 }}>12-Month Roadmap (2026)</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {/* Q1 2026 */}
          <div style={{ background: colors.greenGlow, border: `2px solid ${colors.green}`, borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: colors.green, marginBottom: 10 }}>Q1 2026</div>
            <div style={{ fontSize: 10, color: colors.textPrimary, lineHeight: 1.6 }}>
              <div style={{ marginBottom: 6 }}><strong style={{ color: colors.green }}>Deals:</strong> Close WSD deal</div>
              <div style={{ marginBottom: 6 }}><strong style={{ color: colors.green }}>Projects:</strong> Kick off CRES project</div>
              <div style={{ marginBottom: 6 }}><strong style={{ color: colors.green }}>Go-Lives:</strong> OneSC ✅ LIVE (6 Apr), Agentic AI (24 Apr), AICT MVP (30 Apr)</div>
              <div><strong style={{ color: colors.amber }}>Cadence:</strong> Strategic Review #1 (Infosys-Bank-ServiceNow)</div>
            </div>
          </div>
          
          {/* Q2 2026 */}
          <div style={{ background: colors.amberGlow, border: `2px solid ${colors.amber}`, borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: colors.amber, marginBottom: 10 }}>Q2 2026</div>
            <div style={{ fontSize: 10, color: colors.textPrimary, lineHeight: 1.6 }}>
              <div style={{ marginBottom: 6 }}><strong style={{ color: colors.green }}>Go-Lives:</strong> AICT MVP 1</div>
              <div style={{ marginBottom: 6 }}><strong style={{ color: colors.blue }}>Governance:</strong> CRES Steering Committee</div>
              <div style={{ marginBottom: 6 }}><strong style={{ color: colors.red }}>Protect:</strong> IRM / SecOps protection review</div>
              <div style={{ marginBottom: 6 }}><strong style={{ color: colors.red }}>Milestone:</strong> <strong>SCB Medium-Term Framework (May)</strong> + Knowledge 2026 — Melinda & Shelley attendance</div>
              <div><strong style={{ color: colors.amber }}>Cadence:</strong> Strategic Review #2, Exec Meeting</div>
            </div>
          </div>
          
          {/* Q3 2026 */}
          <div style={{ background: `${colors.blue}15`, border: `2px solid ${colors.blue}`, borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: colors.blue, marginBottom: 10 }}>Q3 2026</div>
            <div style={{ fontSize: 10, color: colors.textPrimary, lineHeight: 1.6 }}>
              <div style={{ marginBottom: 6 }}><strong style={{ color: colors.green }}>Deals:</strong> Moveworks deal mechanics, Legal Service Delivery, CRES upsell</div>
              <div style={{ marginBottom: 6 }}><strong style={{ color: colors.red }}>Protect:</strong> SecOps VR, ITAM adoption</div>
              <div style={{ marginBottom: 6 }}><strong style={{ color: colors.blue }}>Engage:</strong> FSO & Client Experience interest creation</div>
              <div><strong style={{ color: colors.amber }}>Cadence:</strong> Strategic Review #3, Exec Meeting</div>
            </div>
          </div>
          
          {/* Q4 2026 */}
          <div style={{ background: colors.bgPanel, border: `2px solid ${colors.textSecondary}`, borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: colors.textPrimary, marginBottom: 10 }}>Q4 2026</div>
            <div style={{ fontSize: 10, color: colors.textPrimary, lineHeight: 1.6 }}>
              <div style={{ marginBottom: 6 }}><strong style={{ color: colors.green }}>Close:</strong> Open deals</div>
              <div style={{ marginBottom: 6 }}><strong style={{ color: colors.blue }}>Progress:</strong> Pipeline deals for FY27</div>
              <div style={{ marginBottom: 6 }}><strong style={{ color: colors.green }}>Celebrate:</strong> Go-live celebrations</div>
              <div><strong style={{ color: colors.amber }}>Cadence:</strong> Strategic Review #4, Exec Meeting, Year-end review</div>
            </div>
          </div>
        </div>
        
        {/* Key Milestones Bar */}
        <div style={{ marginTop: 16, padding: 12, background: colors.bgPanel, borderRadius: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: colors.green }} />
            <span style={{ fontSize: 10, color: colors.textSecondary }}>Quarterly Strategic Reviews (Infosys-Bank-ServiceNow)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: colors.blue }} />
            <span style={{ fontSize: 10, color: colors.textSecondary }}>Quarterly Executive Meetings</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: colors.amber }} />
            <span style={{ fontSize: 10, color: colors.textSecondary }}>Knowledge 2026 — May</span>
          </div>
        </div>
      </div>
      
      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: colors.textMuted }}>Category:</span>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
            style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 6, padding: "6px 10px", color: colors.textPrimary, fontSize: 11, cursor: "pointer" }}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: colors.textMuted }}>Criticality:</span>
          <select value={filterCriticality} onChange={(e) => setFilterCriticality(e.target.value)}
            style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 6, padding: "6px 10px", color: colors.textPrimary, fontSize: 11, cursor: "pointer" }}>
            {criticalities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: colors.textMuted }}>Status:</span>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 6, padding: "6px 10px", color: colors.textPrimary, fontSize: 11, cursor: "pointer" }}>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 11, color: colors.textMuted }}>
          Showing {filteredActions.length} of {ACTIONS_DATA.length} actions
        </div>
      </div>
      
      {/* Actions Table */}
      <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, overflow: "hidden" }}>
        {/* Table Header */}
        <div style={{ display: "grid", gridTemplateColumns: "2.5fr 0.8fr 1.5fr 1.5fr 0.8fr 0.8fr", gap: 8, padding: "12px 16px", background: colors.bgPanel, borderBottom: `1px solid ${colors.border}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Action</div>
          <div style={{ fontSize: 10, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Criticality</div>
          <div style={{ fontSize: 10, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Bank Contact</div>
          <div style={{ fontSize: 10, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>ServiceNow</div>
          <div style={{ fontSize: 10, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Due</div>
          <div style={{ fontSize: 10, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</div>
        </div>
        
        {/* Table Rows */}
        {filteredActions.map((action, i) => {
          const critStyle = criticalityColors[action.criticality] || criticalityColors["Low"];
          const statStyle = statusColors[action.status] || statusColors["Not Started"];
          return (
            <div key={action.id} style={{ display: "grid", gridTemplateColumns: "2.5fr 0.8fr 1.5fr 1.5fr 0.8fr 0.8fr", gap: 8, padding: "14px 16px", borderBottom: i < filteredActions.length - 1 ? `1px solid ${colors.border}` : "none", background: action.criticality === "Critical" ? `${colors.red}08` : "transparent" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: colors.textPrimary, marginBottom: 4 }}>{action.action}</div>
                <div style={{ fontSize: 10, color: colors.textMuted, lineHeight: 1.4 }}>{action.notes}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 4, alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontSize: 9, color: action.category === "Growth" ? colors.green : colors.blue, fontWeight: 600 }}>{action.category}</span>
                  {action.marqueeOffer && (
                    <span style={{ fontSize: 8, fontWeight: 600, color: "#a78bfa", background: "rgba(167,139,250,0.12)", padding: "2px 8px", borderRadius: 3, border: "1px solid rgba(167,139,250,0.3)" }}>
                      {action.marqueeOffer}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <span style={{ fontSize: 10, fontWeight: 700, color: critStyle.color, background: critStyle.bg, padding: "3px 8px", borderRadius: 4, border: `1px solid ${critStyle.border}40` }}>
                  {action.criticality}
                </span>
              </div>
              <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.5 }}>{action.bankContact}</div>
              <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.5 }}>{action.snContact}</div>
              <div style={{ fontSize: 11, color: colors.textPrimary, fontWeight: 500 }}>{action.dueDate}</div>
              <div>
                <span style={{ fontSize: 10, fontWeight: 600, color: statStyle.color, background: statStyle.bg, padding: "3px 8px", borderRadius: 4 }}>
                  {action.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div style={{ marginTop: 16, padding: 16, background: colors.bgPanel, borderRadius: 8, border: `1px solid ${colors.border}` }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: colors.textPrimary, marginBottom: 10 }}>Criticality Legend</div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {Object.entries(criticalityColors).map(([key, style]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: style.color, background: style.bg, padding: "2px 8px", borderRadius: 4, border: `1px solid ${style.border}40` }}>{key}</span>
              <span style={{ fontSize: 10, color: colors.textMuted }}>
                {key === "Critical" && "— Immediate action required"}
                {key === "High" && "— Action within 30 days"}
                {key === "Medium" && "— Action within 60 days"}
                {key === "Low" && "— Action within 90 days"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
// ─── Migration Simulation View ───────────────────────────────────────────────
const USAGE_DATA = [
  { product: "App Engine Enterprise", entitled: "535 FU", actual: "~1,535 FU", pct: 287, status: "overage", acv: 288900 },
  { product: "HRSD Enterprise", entitled: "80,000 HR", actual: "132,723 HR", pct: 166, status: "overage", acv: 1689600 },
  { product: "Cloud Storage", entitled: "84 TB", actual: "151.7 TB", pct: 181, status: "overage", acv: 428400 },
  { product: "ITSM Professional", entitled: "70,000 UU", actual: "66,653 UU", pct: 95, status: "core", acv: 1470000 },
  { product: "SAM Professional", entitled: "65,000 SU", actual: "60,993 SU", pct: 94, status: "core", acv: 686400 },
  { product: "HAM Professional", entitled: "50,000 SU", actual: "47,983 SU", pct: 96, status: "core", acv: 672000 },
  { product: "Enterprise Architecture", entitled: "2,000 BA", actual: "1,731 BA", pct: 87, status: "core", acv: 384000 },
  { product: "ITOM AIOps", entitled: "60,000 SU", actual: "49,304 SU", pct: 82, status: "core", acv: 1692000 },
  { product: "SecOps SIR", entitled: "70,000 UU", actual: "66,653 UU", pct: 95, status: "core", acv: 655200 },
  { product: "TPRM Standard", entitled: "2,000 txns", actual: "1,012 txns", pct: 51, status: "underused", acv: 197640 },
  { product: "AI Control Tower", entitled: "500 SU", actual: "65 SU", pct: 13, status: "implementation", acv: 72000 },
  { product: "BCM Professional", entitled: "300 ops", actual: "23 ops", pct: 8, status: "dormant", acv: 180000 },
  { product: "Now Assist (Assists)", entitled: "30,000,000", actual: "575,199", pct: 1.9, status: "dormant", acv: 897192 },
  { product: "WSD Enterprise", entitled: "10,000", actual: "0", pct: 0, status: "implementation", acv: 0 },
  { product: "IRM Professional", entitled: "70,000 UU", actual: "Shared count", pct: 0, status: "offload", acv: 588000 },
  { product: "SecOps VR", entitled: "70,000 UU", actual: "Shared count", pct: 0, status: "offload", acv: 394800 },
];

const NNACV_WATERFALL = [
  { category: "A", label: "App Engine true-up (535 -> ~1,535 FU)", low: 270000, mid: 361800, high: 540000 },
  { category: "A", label: "HRSD true-up (80K -> 132,723 HR Users)", low: 557494, mid: 743326, high: 1113509 },
  { category: "A", label: "Storage true-up (84TB -> 152TB)", low: 183600, mid: 275400, high: 367200 },
  { category: "B", label: "IRM Professional (offload)", low: -588000, mid: -588000, high: -588000 },
  { category: "B", label: "SecOps VR (offload)", low: -394800, mid: -394800, high: -394800 },
  { category: "B", label: "BCM Professional (offload)", low: -180000, mid: -180000, high: -180000 },
  { category: "B", label: "TPRM Standard + Base (offload)", low: -197640, mid: -197640, high: -197640 },
  { category: "C", label: "ITSM Pro -> Prime (70K UU)", low: 147000, mid: 220500, high: 367500 },
  { category: "C", label: "ITOM AIOps Pro -> Prime (60K SU)", low: 169200, mid: 253800, high: 423000 },
  { category: "C", label: "EA Pro -> Prime (2K BA)", low: 38400, mid: 57600, high: 96000 },
  { category: "C", label: "SIR Pro -> Advanced (70K UU)", low: 32760, mid: 65520, high: 98280 },
  { category: "C", label: "SAM Pro -> Advanced (65K SU)", low: 34320, mid: 68640, high: 102960 },
  { category: "C", label: "HAM Pro -> Advanced (50K SU)", low: 33600, mid: 67200, high: 100800 },
  { category: "C", label: "HRSD Ent -> Advanced (132K HR)", low: 84480, mid: 168960, high: 253440 },
  { category: "C", label: "AE Ent -> Prime (~1,535 FU)", low: 83000, mid: 124000, high: 207000 },
  { category: "C", label: "AICT -> Foundation", low: 3600, mid: 7200, high: 14400 },
  { category: "D", label: "Moveworks for Enterprise (standalone)", low: 500000, mid: 800000, high: 1200000 },
];

function MigrationView() {
  const [activeTab, setActiveTab] = useState("usage");
  const fmt = (n) => {
    if (n === 0) return "–";
    const prefix = n < 0 ? "-" : "";
    return prefix + "$" + Math.abs(n).toLocaleString("en-US");
  };

  const statusStyles = {
    overage: { bg: `${colors.red}15`, color: colors.red, label: "Overage" },
    core: { bg: colors.greenGlow, color: colors.green, label: "Core" },
    underused: { bg: colors.amberGlow, color: colors.amber, label: "Under-used" },
    dormant: { bg: colors.amberGlow, color: colors.amber, label: "Dormant" },
    implementation: { bg: "rgba(108,52,131,0.12)", color: "#a78bfa", label: "Implementation" },
    offload: { bg: `${colors.red}10`, color: colors.red, label: "Offload" },
  };

  const tabs = [
    { id: "usage", label: "Usage Analysis" },
    { id: "waterfall", label: "NNACV Waterfall" },
    { id: "scenarios", label: "Scenarios" },
    { id: "guide", label: "Conversation Guide" },
  ];

  // Calculate waterfall totals
  const totals = { low: 0, mid: 0, high: 0 };
  NNACV_WATERFALL.forEach(r => { totals.low += r.low; totals.mid += r.mid; totals.high += r.high; });
  const catTotals = {};
  NNACV_WATERFALL.forEach(r => {
    if (!catTotals[r.category]) catTotals[r.category] = { low: 0, mid: 0, high: 0 };
    catTotals[r.category].low += r.low; catTotals[r.category].mid += r.mid; catTotals[r.category].high += r.high;
  });

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.textPrimary, margin: "0 0 4px" }}>Migration Simulation</h1>
        <p style={{ fontSize: 13, color: colors.textSecondary, margin: 0 }}>AI Native migration model – usage scan 9 April 2026 – End of sale for legacy SKUs: 1 July 2026</p>
      </div>

      {/* Summary Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: 9, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Current ACV</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: colors.textPrimary }}>$12.1M</div>
        </div>
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.red}40`, borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: 9, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Dormant ACV to Offload</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: colors.red }}>$1.36M</div>
        </div>
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.green}40`, borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: 9, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Net NNACV (Mid)</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: colors.green }}>$1.9M</div>
        </div>
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.blue}40`, borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: 9, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Post-Migration ACV</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: colors.blue }}>~$14.0M</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: `1px solid ${colors.border}` }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ background: "none", border: "none", borderBottom: activeTab === t.id ? `2px solid ${colors.blue}` : "2px solid transparent", padding: "8px 16px", fontSize: 11, fontWeight: 600, color: activeTab === t.id ? colors.blue : colors.textMuted, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* USAGE TAB */}
      {activeTab === "usage" && (
        <div>
          <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.5fr 0.8fr", gap: 8, padding: "12px 16px", background: colors.bgPanel, borderBottom: `1px solid ${colors.border}` }}>
              {["Product", "Entitled", "Actual", "Utilisation", "Status"].map(h => (
                <div key={h} style={{ fontSize: 10, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</div>
              ))}
            </div>
            {USAGE_DATA.map((p, i) => {
              const st = statusStyles[p.status] || statusStyles.core;
              const barWidth = Math.min(p.pct, 100);
              const barColor = p.status === "overage" ? colors.red : p.status === "core" ? colors.green : p.status === "implementation" ? "#a78bfa" : colors.amber;
              return (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.5fr 0.8fr", gap: 8, padding: "10px 16px", borderBottom: i < USAGE_DATA.length - 1 ? `1px solid ${colors.border}` : "none", background: p.status === "offload" || p.status === "dormant" ? `${colors.amber}08` : p.status === "overage" ? `${colors.red}05` : "transparent" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: colors.textPrimary }}>{p.product}</div>
                  <div style={{ fontSize: 11, color: colors.textSecondary, fontFamily: "monospace" }}>{p.entitled}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: p.status === "overage" ? colors.red : colors.textPrimary, fontFamily: "monospace" }}>{p.actual}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 80, height: 6, background: `${colors.textMuted}20`, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${barWidth}%`, height: "100%", background: barColor, borderRadius: 3 }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: barColor, fontFamily: "monospace" }}>{p.pct > 0 ? p.pct + "%" : "–"}</span>
                  </div>
                  <div><span style={{ fontSize: 9, fontWeight: 600, color: st.color, background: st.bg, padding: "2px 8px", borderRadius: 10 }}>{st.label}</span></div>
                </div>
              );
            })}
          </div>
          <div style={{ background: colors.bgCard, border: `1px solid ${colors.amber}40`, borderRadius: 8, padding: 14, marginTop: 16 }}>
            <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.6 }}>
              <strong style={{ color: colors.amber }}>Note:</strong> App Engine usage report shows 18,748 FU (inflated by role-based counting). Actual overage is approximately 1,000 FU. IRM and SecOps VR share the same 66,653 UU count as ITSM — not a measure of product-specific usage.
            </div>
          </div>
        </div>
      )}

      {/* WATERFALL TAB */}
      {activeTab === "waterfall" && (
        <div>
          <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr", gap: 8, padding: "12px 16px", background: colors.bgPanel, borderBottom: `1px solid ${colors.border}` }}>
              {["Line Item", "Low", "Mid", "High"].map(h => (
                <div key={h} style={{ fontSize: 10, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", textAlign: h !== "Line Item" ? "right" : "left" }}>{h}</div>
              ))}
            </div>
            {["A", "B", "C", "D"].map(cat => {
              const catLabels = { A: "Overage True-Ups", B: "Offloaded Products", C: "AI Native Tier Uplifts", D: "New Products" };
              const rows = NNACV_WATERFALL.filter(r => r.category === cat);
              const ct = catTotals[cat];
              return (
                <div key={cat}>
                  <div style={{ padding: "10px 16px", background: colors.bgPanel, fontSize: 11, fontWeight: 700, color: colors.textPrimary, borderBottom: `1px solid ${colors.border}` }}>{cat}. {catLabels[cat]}</div>
                  {rows.map((r, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr", gap: 8, padding: "8px 16px", borderBottom: `1px solid ${colors.border}` }}>
                      <div style={{ fontSize: 11, color: colors.textSecondary }}>{r.label}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: r.low < 0 ? colors.red : colors.green, textAlign: "right", fontFamily: "monospace" }}>{fmt(r.low)}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: r.mid < 0 ? colors.red : colors.green, textAlign: "right", fontFamily: "monospace" }}>{fmt(r.mid)}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: r.high < 0 ? colors.red : colors.green, textAlign: "right", fontFamily: "monospace" }}>{fmt(r.high)}</div>
                    </div>
                  ))}
                  <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr", gap: 8, padding: "8px 16px", background: `${colors.bgPanel}`, borderBottom: `2px solid ${colors.border}` }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: colors.textPrimary }}>Subtotal {cat}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: ct.low < 0 ? colors.red : colors.green, textAlign: "right", fontFamily: "monospace" }}>{fmt(ct.low)}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: ct.mid < 0 ? colors.red : colors.green, textAlign: "right", fontFamily: "monospace" }}>{fmt(ct.mid)}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: ct.high < 0 ? colors.red : colors.green, textAlign: "right", fontFamily: "monospace" }}>{fmt(ct.high)}</div>
                  </div>
                </div>
              );
            })}
            <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1fr", gap: 8, padding: "14px 16px", background: colors.bgPanel, borderTop: `3px solid ${colors.green}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: colors.textPrimary }}>Net NNACV Opportunity</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: colors.green, textAlign: "right", fontFamily: "monospace" }}>{fmt(totals.low)}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: colors.green, textAlign: "right", fontFamily: "monospace" }}>{fmt(totals.mid)}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: colors.green, textAlign: "right", fontFamily: "monospace" }}>{fmt(totals.high)}</div>
            </div>
          </div>
        </div>
      )}

      {/* SCENARIOS TAB */}
      {activeTab === "scenarios" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 20 }}>
            {[
              { label: "Conservative", value: "$0.8M", color: colors.amber, details: "50% discount on true-ups. 10% tier uplifts (Pro to Prime). 5% tier uplifts (Pro to Adv). Lower-end Moveworks." },
              { label: "Moderate", value: "$1.9M", color: colors.green, details: "33% discount on true-ups. 15% tier uplifts (Pro to Prime). 10% tier uplifts (Pro to Adv). Mid-range Moveworks." },
              { label: "Optimistic", value: "$3.5M", color: colors.blue, details: "Contract rate true-ups. 25% tier uplifts (Pro to Prime). 15% tier uplifts (Pro to Adv). Full Moveworks rollout." },
            ].map((s, i) => (
              <div key={i} style={{ background: colors.bgCard, border: `2px solid ${s.color}`, borderRadius: 10, padding: 20, textAlign: "center" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: s.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{s.label}</div>
                <div style={{ fontSize: 36, fontWeight: 800, color: s.color, marginBottom: 12 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.6, textAlign: "left" }}>{s.details}</div>
              </div>
            ))}
          </div>
          <div style={{ background: colors.bgCard, border: `1px solid ${colors.green}40`, borderRadius: 10, padding: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: colors.green, marginBottom: 10 }}>Revenue Composition (Mid Scenario)</div>
            {[
              { label: "AI Native Tier Uplifts", value: "$1,034,275", pct: 32 },
              { label: "Moveworks for Enterprise", value: "$800,000", pct: 25 },
              { label: "HRSD True-Up", value: "$743,326", pct: 23 },
              { label: "App Engine True-Up", value: "$361,800", pct: 11 },
              { label: "Storage True-Up", value: "$275,400", pct: 9 },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{ width: 100, height: 6, background: `${colors.green}20`, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${r.pct * 3}%`, height: "100%", background: colors.green, borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: colors.green, fontFamily: "monospace", width: 90 }}>{r.value}</span>
                <span style={{ fontSize: 11, color: colors.textSecondary }}>{r.label} ({r.pct}%)</span>
              </div>
            ))}
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${colors.border}`, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: colors.textPrimary }}>Gross Positive: $3,214,801</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: colors.red }}>Offload Credits: -$1,360,440</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: colors.green }}>Net NNACV: $1,854,361</span>
            </div>
          </div>
        </div>
      )}

      {/* CONVERSATION GUIDE TAB */}
      {activeTab === "guide" && (
        <div>
          {[
            { step: "1", title: "Start with the success story", detail: "ITSM, HRSD, ITOM, SAM, HAM, and App Engine are running at or above capacity. OneSC is a genuine industry first. That is the foundation." },
            { step: "2", title: "Acknowledge what is ramping vs stalled", detail: "WSD, H&S, SPM, and AI Control Tower are investments in motion, not failures. By contrast, IRM (scope-restricted), SecOps VR (shared count), BCM (8%), and TPRM (51%) have not found a home." },
            { step: "3", title: "Present the platform shift", detail: "ServiceNow is moving to AI Native. Moveworks, NowAssist, and agentic AI are embedded directly into the platform. The question is not whether to migrate but how to maximise the return." },
            { step: "4", title: "Frame as reinvestment, not upsell", detail: "You are spending roughly $1.36M/year on four products that are not delivering. Redirect that into Moveworks for Enterprise: an AI assistant across every application in the bank." },
            { step: "5", title: "Address overages constructively", detail: "App Engine and HRSD overages reflect success, not misuse. SCB built extensively because the platform works. Frame the true-up as enabling continued growth, not a penalty." },
            { step: "6", title: "The Moveworks hook", detail: "Moveworks for Enterprise works across all enterprise applications, not just ServiceNow. For a bank operating in 55 countries with hundreds of systems, that is the differentiator. Frame against SCB's internal Yoda tool." },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 16, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: colors.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#FFFFFF", flexShrink: 0 }}>{s.step}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: colors.textPrimary, marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 1.6 }}>{s.detail}</div>
              </div>
            </div>
          ))}
          <div style={{ background: colors.bgCard, border: `1px solid ${colors.green}40`, borderRadius: 8, padding: 16, marginTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: colors.green, marginBottom: 8 }}>The pitch in one sentence</div>
            <div style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.6 }}>Today you are paying ~$1.36M/year for four products that are not delivering. Redirect that into Moveworks for Enterprise and you transform dormant spend into an AI assistant that works across every application in the bank, not just ServiceNow. That is a fundamentally different return on the same capital.</div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 20, fontSize: 10, color: colors.textMuted, textAlign: "center" }}>
        Internal – Not for client distribution | ACCT0213754 | Usage scan: 9 April 2026 | All uplift percentages indicative
      </div>
    </div>
  );
}

// ─── Platform Telemetry View ──────────────────────────────────────────────────
const PEER_USAGE = [
  { workflow: "AI Platform", metric: "VA Conversations/month", usage: 3888711, median: 34231, p75: 207346, hours: 2311197, persona: "All" },
  { workflow: "AI Platform", metric: "AI Searches/month", usage: 1957926, median: 38241, p75: 1066412, hours: 274110, persona: "All" },
  { workflow: "AI Platform", metric: "Now Assist Searches/month", usage: 350064, median: 57104, p75: 232448, hours: 52510, persona: "All" },
  { workflow: "AI Platform", metric: "LLM Calls – Record Resolution", usage: 62105, median: 62105, p75: 62446, hours: 1553, persona: "Fulfiller" },
  { workflow: "AI Platform", metric: "LLM Calls – Summarisation", usage: 27403, median: 15784, p75: 27403, hours: 1370, persona: "Fulfiller" },
  { workflow: "AI Platform", metric: "KB Views/day", usage: 4158572, median: 1448304, p75: 2995138, hours: 34516, persona: "Requestor" },
  { workflow: "Core Business", metric: "HR Cases/month", usage: 525316, median: 183025, p75: 450871, hours: 120823, persona: "All" },
  { workflow: "Core Business", metric: "Lifecycle Event Cases", usage: 9629, median: 9470, p75: 9629, hours: 1733, persona: "All" },
  { workflow: "Technology", metric: "ITSM Requests/month", usage: 1507130, median: 825181, p75: 1463099, hours: 256212, persona: "All" },
  { workflow: "Technology", metric: "Incidents/month", usage: 951817, median: 790251, p75: 1524575, hours: 218918, persona: "All" },
  { workflow: "Technology", metric: "Problems Created/month", usage: 5700, median: 3990, p75: 8922, hours: 855, persona: "Fulfiller" },
  { workflow: "Technology", metric: "Standard Changes Closed/month", usage: 45813, median: 67330, p75: 152229, hours: 22907, persona: "Fulfiller" },
  { workflow: "Technology", metric: "ITOM Visibility SU (90-day avg)", usage: 49311, median: 69048, p75: 117950, hours: 12328, persona: "Fulfiller" },
  { workflow: "Technology", metric: "ITOM Automation Executions/day", usage: 84798, median: 129123, p75: 644911, hours: 7066, persona: "Fulfiller" },
  { workflow: "Technology", metric: "GRC Risk Assessments", usage: 882, median: 83, p75: 1355, hours: 4234, persona: "Fulfiller" },
  { workflow: "Technology", metric: "SPM Demands Created/month", usage: 8, median: 1466, p75: 3331, hours: 10, persona: "Fulfiller" },
];

const PLATFORM_GROWTH = [
  { metric: "Workflows Executed/month", value: "5,872,619", yoy: 44 },
  { metric: "KB Articles Viewed", value: "912,080", yoy: 65 },
  { metric: "Total Tasks (all time)", value: "70.7M", yoy: 40 },
  { metric: "Service Portal Sessions/month", value: "2,228,739", yoy: 35 },
  { metric: "Workflows Published/month", value: "864", yoy: 35 },
  { metric: "DB Size (all instances)", value: "44.6 TB", yoy: 33 },
  { metric: "Mobile Sessions/month", value: "3,644", yoy: 29 },
  { metric: "Active User Profiles/month", value: "632,546", yoy: 28 },
  { metric: "Dashboards Created/month", value: "63", yoy: 23 },
  { metric: "Service Catalog Items Requested/month", value: "114,617", yoy: 20 },
  { metric: "OOB Spokes", value: "119", yoy: 20 },
  { metric: "Tasks Created (30 days)", value: "1,442,363", yoy: 13 },
  { metric: "Workspace Pages Configured/month", value: "59", yoy: 13 },
  { metric: "Configuration Items", value: "142.3M", yoy: 7 },
  { metric: "Service Catalog Requests/month", value: "109,880", yoy: 5 },
  { metric: "User Engagement/month", value: "2,396,376", yoy: 2 },
];

const PRODUCT_ADOPTION = [
  { product: "Advanced Work Assignment", status: "High Use", value: "147,781", yoy: 4 },
  { product: "Knowledge Management", status: "High Use", value: "1,419", yoy: 54 },
  { product: "Performance Analytics Pro", status: "High Use", value: "42,375", yoy: 24 },
  { product: "Platform Analytics Experience", status: "High Use", value: "12,280", yoy: 2 },
  { product: "Reporting", status: "High Use", value: "42,375", yoy: 24 },
  { product: "Service Catalog", status: "High Use", value: "191,233", yoy: 10 },
  { product: "Service Portal", status: "High Use", value: "52,487", yoy: 94 },
  { product: "Virtual Agent", status: "High Use", value: "21,339", yoy: 101 },
  { product: "Employee Center", status: "Medium Use", value: "28,605", yoy: 2 },
  { product: "Generative AI Controller", status: "Medium Use", value: "211,603", yoy: null },
  { product: "NLU Models (S2P)", status: "Medium Use", value: null, yoy: null },
  { product: "ServiceNow Studio", status: "Medium Use", value: null, yoy: null },
  { product: "Agent Chat", status: "Low Use", value: "69,427", yoy: 21 },
  { product: "AI Search", status: "Low Use", value: "43,754", yoy: 4 },
  { product: "Flow Designer", status: "Low Use", value: "248,807", yoy: 30 },
  { product: "Now Assist – AI Search", status: "Low Use", value: "39,021", yoy: null },
  { product: "Now Assist – Virtual Agent", status: "Low Use", value: "7,638", yoy: null },
  { product: "Now Assist – ITSM", status: "Low Use", value: "33,678", yoy: null },
  { product: "Now Assist Panel", status: "Low Use", value: "5,722", yoy: null },
  { product: "Performance Analytics", status: "Low Use", value: "274", yoy: 34 },
  { product: "Playbook Experience", status: "Low Use", value: "155", yoy: 80 },
  { product: "RaptorDB Pro", status: "Low Use", value: null, yoy: null },
  { product: "Workspace", status: "Low Use", value: "93", yoy: 210 },
  { product: "User Experience Analytics", status: "Low Use", value: null, yoy: null },
  { product: "Now Assist – HR", status: "Not In Use", value: null, yoy: null },
  { product: "Now Assist – ITOM", status: "Not In Use", value: null, yoy: null },
  { product: "Now Assist – Security", status: "Not In Use", value: null, yoy: null },
  { product: "Now Assist – Customer Service", status: "Not In Use", value: null, yoy: null },
  { product: "Now Assist – Portfolio Mgmt", status: "Not In Use", value: null, yoy: null },
  { product: "Now Assist – Knowledge Mgmt", status: "Not In Use", value: null, yoy: null },
  { product: "Now Assist Data Kit", status: "Not In Use", value: null, yoy: null },
  { product: "Now Assist Guardian", status: "Not In Use", value: null, yoy: null },
  { product: "Now Assist Skill Kit", status: "Not In Use", value: null, yoy: null },
  { product: "Automated Test Framework", status: "Not In Use", value: null, yoy: null },
  { product: "Flow Generation", status: "Not In Use", value: null, yoy: null },
  { product: "Flow Recommendation", status: "Not In Use", value: null, yoy: null },
  { product: "Playbook Generation", status: "Not In Use", value: null, yoy: null },
  { product: "Playbook Recommendation", status: "Not In Use", value: null, yoy: null },
  { product: "Predictive Intelligence", status: "Not In Use", value: null, yoy: null },
  { product: "Security Center", status: "Not In Use", value: null, yoy: null },
  { product: "Task Intelligence Admin Console", status: "Not In Use", value: null, yoy: null },
];

function TelemetryView() {
  const [activeTab, setActiveTab] = useState("peers");
  const fmt = (n) => n >= 1000000 ? (n/1000000).toFixed(1) + "M" : n >= 1000 ? (n/1000).toFixed(0) + "K" : String(n);

  const tabs = [
    { id: "peers", label: "Usage vs Peers" },
    { id: "growth", label: "Platform Growth" },
    { id: "adoption", label: "Product Adoption" },
  ];

  const statusStyle = {
    "High Use": { bg: colors.greenGlow, color: colors.green },
    "Medium Use": { bg: colors.amberGlow, color: colors.amber },
    "Low Use": { bg: `${colors.red}12`, color: colors.red },
    "Not In Use": { bg: `${colors.textMuted}12`, color: colors.textMuted },
  };

  const adoptionCounts = {
    "High Use": PRODUCT_ADOPTION.filter(p => p.status === "High Use").length,
    "Medium Use": PRODUCT_ADOPTION.filter(p => p.status === "Medium Use").length,
    "Low Use": PRODUCT_ADOPTION.filter(p => p.status === "Low Use").length,
    "Not In Use": PRODUCT_ADOPTION.filter(p => p.status === "Not In Use").length,
  };

  const totalHours = PEER_USAGE.reduce((s, r) => s + r.hours, 0);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.textPrimary, margin: "0 0 4px" }}>Platform Telemetry</h1>
          <p style={{ fontSize: 13, color: colors.textSecondary, margin: 0 }}>Usage scan: April 2026 – ACCT0213754 – Refreshed monthly</p>
        </div>
      </div>

      {/* Headline Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 20 }}>
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.green}40`, borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: 9, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Active Users</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: colors.green }}>632K</div>
          <div style={{ fontSize: 10, color: colors.green }}>+28% YoY</div>
        </div>
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.blue}40`, borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: 9, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Workflows/Month</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: colors.blue }}>5.9M</div>
          <div style={{ fontSize: 10, color: colors.blue }}>+44% YoY</div>
        </div>
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.green}40`, borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: 9, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>VA Conversations</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: colors.green }}>3.9M</div>
          <div style={{ fontSize: 10, color: colors.green }}>100x peer median</div>
        </div>
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.green}40`, borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: 9, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Est. Hours Saved</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: colors.green }}>{fmt(totalHours)}</div>
          <div style={{ fontSize: 10, color: colors.textMuted }}>Modelled (all workflows)</div>
        </div>
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.red}40`, borderRadius: 8, padding: "12px 14px" }}>
          <div style={{ fontSize: 9, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>Products Not In Use</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: colors.red }}>{adoptionCounts["Not In Use"]}</div>
          <div style={{ fontSize: 10, color: colors.red }}>of {PRODUCT_ADOPTION.length} horizontal</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: `1px solid ${colors.border}` }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ background: "none", border: "none", borderBottom: activeTab === t.id ? `2px solid ${colors.blue}` : "2px solid transparent", padding: "8px 16px", fontSize: 11, fontWeight: 600, color: activeTab === t.id ? colors.blue : colors.textMuted, cursor: "pointer", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* USAGE vs PEERS */}
      {activeTab === "peers" && (
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr 1fr 1fr 1fr 0.8fr 1fr", gap: 8, padding: "12px 16px", background: colors.bgPanel, borderBottom: `1px solid ${colors.border}` }}>
            {["Workflow", "Metric", "SCB Usage", "Peer Median", "Peer P75", "Position", "Est. Hours"].map(h => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", textAlign: ["SCB Usage","Peer Median","Peer P75","Est. Hours"].includes(h) ? "right" : "left" }}>{h}</div>
            ))}
          </div>
          {PEER_USAGE.map((r, i) => {
            const pos = r.usage > r.p75 ? "above" : r.usage >= r.median ? "mid" : "below";
            const posColor = pos === "above" ? colors.green : pos === "mid" ? colors.amber : colors.red;
            const posLabel = pos === "above" ? "> P75" : pos === "mid" ? "Median" : "< Median";
            return (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr 1fr 1fr 1fr 0.8fr 1fr", gap: 8, padding: "10px 16px", borderBottom: i < PEER_USAGE.length - 1 ? `1px solid ${colors.border}` : "none" }}>
                <div style={{ fontSize: 10, color: colors.textMuted }}>{r.workflow}</div>
                <div style={{ fontSize: 11, fontWeight: 500, color: colors.textPrimary }}>{r.metric}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: posColor, textAlign: "right", fontFamily: "monospace" }}>{fmt(r.usage)}</div>
                <div style={{ fontSize: 11, color: colors.textSecondary, textAlign: "right", fontFamily: "monospace" }}>{fmt(r.median)}</div>
                <div style={{ fontSize: 11, color: colors.textSecondary, textAlign: "right", fontFamily: "monospace" }}>{fmt(r.p75)}</div>
                <div><span style={{ fontSize: 9, fontWeight: 600, color: posColor, background: `${posColor}15`, padding: "2px 8px", borderRadius: 10 }}>{posLabel}</span></div>
                <div style={{ fontSize: 11, color: colors.textSecondary, textAlign: "right", fontFamily: "monospace" }}>{fmt(r.hours)}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* PLATFORM GROWTH */}
      {activeTab === "growth" && (
        <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, overflow: "hidden" }}>
          {PLATFORM_GROWTH.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 20px", borderBottom: i < PLATFORM_GROWTH.length - 1 ? `1px solid ${colors.border}` : "none" }}>
              <div style={{ flex: 2, fontSize: 12, fontWeight: 500, color: colors.textPrimary }}>{r.metric}</div>
              <div style={{ flex: 1, fontSize: 12, fontWeight: 600, color: colors.textPrimary, textAlign: "right", fontFamily: "monospace" }}>{r.value}</div>
              <div style={{ flex: 1.5, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, height: 8, background: `${colors.textMuted}15`, borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: `${Math.min(r.yoy * 2, 100)}%`, height: "100%", background: r.yoy >= 30 ? colors.green : r.yoy >= 15 ? colors.blue : colors.textSecondary, borderRadius: 4, transition: "width 0.3s" }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: r.yoy >= 30 ? colors.green : r.yoy >= 15 ? colors.blue : colors.textSecondary, fontFamily: "monospace", width: 45, textAlign: "right" }}>+{r.yoy}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PRODUCT ADOPTION HEATMAP */}
      {activeTab === "adoption" && (
        <div>
          {/* Summary bar */}
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            {Object.entries(adoptionCounts).map(([status, count]) => {
              const st = statusStyle[status];
              return (
                <div key={status} style={{ flex: 1, background: st.bg, borderRadius: 8, padding: "10px 14px", textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: st.color }}>{count}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: st.color }}>{status}</div>
                </div>
              );
            })}
          </div>
          {/* Product grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {PRODUCT_ADOPTION.map((p, i) => {
              const st = statusStyle[p.status];
              return (
                <div key={i} style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderLeft: `3px solid ${st.color}`, borderRadius: 6, padding: "10px 12px" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: colors.textPrimary, marginBottom: 4 }}>{p.product}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 9, fontWeight: 600, color: st.color, background: st.bg, padding: "2px 6px", borderRadius: 3 }}>{p.status}</span>
                    {p.yoy !== null && <span style={{ fontSize: 10, fontWeight: 600, color: p.yoy >= 50 ? colors.green : colors.textMuted, fontFamily: "monospace" }}>+{p.yoy}%</span>}
                  </div>
                  {p.value && <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 4, fontFamily: "monospace" }}>{p.value}</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ marginTop: 20, padding: 16, background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: colors.blue, marginBottom: 8 }}>How to refresh this data</div>
        <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.6 }}>
          Download the four reports from Value Melody / Customer Dashboard (filter: ACCT0213754). Upload to Claude. The data arrays are regenerated in the JSX and pushed to Vercel. Takes five minutes monthly.
        </div>
      </div>
    </div>
  );
}

// ─── License Entitlements View ────────────────────────────────────────────────
const LICENSE_DATA = [
  { bu: "ITSM", code: "PROD11356", name: "IT Service Management Professional", type: "Unrestricted User", units: "70,000", acv: 1470000, tcv: 5113651, order: "OF1 + OF2" },
  { bu: "Platform", code: "PROD19351", name: "App Engine Enterprise", type: "Fulfiller User", units: "535", acv: 288900, tcv: 1004989, order: "OF1" },
  { bu: "Platform", code: "PROD12492", name: "Agile Team", type: "Module", units: "1", acv: 0, tcv: 0, order: "OF1" },
  { bu: "Platform", code: "PROD17800", name: "Business Stakeholder", type: "Bus. Stakeholder User", units: "600", acv: 14400, tcv: 50093, order: "OF1" },
  { bu: "Platform", code: "PROD15406", name: "Mobile Publishing", type: "Application", units: "1", acv: 22500, tcv: 78270, order: "OF1" },
  { bu: "HRSD", code: "PROD17238", name: "HR Service Delivery Enterprise", type: "HR User", units: "80,000", acv: 1689600, tcv: 5877567, order: "OF1" },
  { bu: "Risk", code: "PROD23799", name: "Integrated Risk Management Professional", type: "Unrestricted User", units: "70,000", acv: 588000, tcv: 2045460, order: "OF1 + OF3" },
  { bu: "Risk", code: "PROD20914", name: "Third-party Risk Management Base", type: "Module", units: "1", acv: 17640, tcv: 61364, order: "OF1" },
  { bu: "Risk", code: "PROD20917", name: "Third-party Risk Management Standard", type: "Transactions", units: "2,000", acv: 180000, tcv: 626161, order: "OF3" },
  { bu: "Risk", code: "PROD14201", name: "Business Continuity Management Professional", type: "BCM Operator", units: "300", acv: 180000, tcv: 626161, order: "OF3" },
  { bu: "Risk", code: "PROD03427", name: "Performance Analytics for GRC", type: "Application", units: "1", acv: 0, tcv: 0, order: "OF1" },
  { bu: "SecOps", code: "PROD16744", name: "Security Operations Professional – SIR", type: "Unrestricted User", units: "70,000", acv: 655200, tcv: 2279227, order: "OF3" },
  { bu: "SecOps", code: "PROD18276", name: "Security Operations Professional – VR", type: "Unrestricted User", units: "70,000", acv: 394800, tcv: 1373380, order: "OF1" },
  { bu: "ITOM", code: "PROD14995", name: "ITOM AIOps Professional", type: "Subscription Unit", units: "60,000", acv: 1692000, tcv: 5885916, order: "OF1" },
  { bu: "ITAM", code: "PROD13583", name: "Hardware Asset Management Professional", type: "Subscription Unit", units: "50,000", acv: 672000, tcv: 2337669, order: "OF1" },
  { bu: "ITAM", code: "PROD15033", name: "Software Asset Management Professional", type: "Subscription Unit", units: "65,000", acv: 686400, tcv: 2387762, order: "OF1" },
  { bu: "Ent. Arch", code: "PROD23527", name: "Enterprise Architecture Professional", type: "Business Application", units: "2,000", acv: 384000, tcv: 1335811, order: "OF1" },
  { bu: "AI", code: "PROD25226", name: "Now Assist for Enterprise", type: "Assist", units: "2 (30M/yr)", acv: 897192, tcv: 3121038, order: "OF2" },
  { bu: "AI", code: "PROD26238", name: "AI Control Tower", type: "Subscription Unit", units: "500", acv: 72000, tcv: 250465, order: "OF2" },
  { bu: "AI", code: "PROD23494", name: "RaptorDB Professional", type: "Application", units: "1", acv: 495150, tcv: 1722467, order: "OF2" },
  { bu: "AI", code: "PROD15338", name: "AI Search Starter", type: "Documents", units: "500K docs", acv: 0, tcv: 0, order: "OF1" },
  { bu: "WDF", code: "PROD24512", name: "Workflow Data Fabric Standard", type: "Unattended Robot", units: "1", acv: 49500, tcv: 172194, order: "OF1" },
  { bu: "WDF", code: "PROD18254", name: "WDF Bundle – 100M IntHub Transactions", type: "Transaction Pack", units: "1", acv: 36000, tcv: 125232, order: "OF1" },
  { bu: "Infra", code: "PROD20936", name: "Dedicated Environment Capacity (6TB)", type: "Ded. Environment", units: "14", acv: 428400, tcv: 1490264, order: "OF1" },
  { bu: "Infra", code: "PROD18696", name: "Included Production Instance", type: "Ded. Environment", units: "1", acv: 0, tcv: 0, order: "OF1" },
  { bu: "Infra", code: "PROD18698", name: "Additional Production Instance", type: "Ded. Environment", units: "1", acv: 0, tcv: 0, order: "OF1" },
  { bu: "Infra", code: "PROD18697", name: "Included Non-Production Instance", type: "Ded. Environment", units: "2", acv: 0, tcv: 0, order: "OF1" },
  { bu: "Infra", code: "PROD18699", name: "Additional Non-Production Instance", type: "Ded. Environment", units: "6", acv: 61200, tcv: 212895, order: "OF1" },
  { bu: "Infra", code: "PROD25331", name: "Platform Encryption", type: "Application", units: "1", acv: 414000, tcv: 1440171, order: "OF1" },
  { bu: "Success", code: "PROD19214", name: "Impact Guided – MSP Dedicated Instance", type: "Success", units: "1", acv: 485817, tcv: 1689998, order: "OF1" },
  { bu: "Success", code: "PROD22474", name: "Managed Support", type: "Success", units: "3", acv: 225000, tcv: 782702, order: "OF1" },
];

function LicenseView() {
  const [filterBU, setFilterBU] = useState("All");
  const buOptions = ["All", ...new Set(LICENSE_DATA.map(p => p.bu))];
  const filtered = filterBU === "All" ? LICENSE_DATA : LICENSE_DATA.filter(p => p.bu === filterBU);
  const totalAcv = filtered.reduce((s, p) => s + p.acv, 0);
  const totalTcv = filtered.reduce((s, p) => s + p.tcv, 0);
  const fmt = (n) => n === 0 ? "–" : "$" + n.toLocaleString("en-US");

  const buColors = {
    "ITSM": { bg: `${colors.blue}15`, color: colors.blue },
    "Platform": { bg: `${colors.textMuted}15`, color: colors.textMuted },
    "HRSD": { bg: colors.greenGlow, color: colors.green },
    "Risk": { bg: colors.amberGlow, color: colors.amber },
    "SecOps": { bg: `${colors.red}15`, color: colors.red },
    "ITOM": { bg: `rgba(167,139,250,0.12)`, color: "#a78bfa" },
    "ITAM": { bg: `rgba(45,212,191,0.12)`, color: "#2dd4bf" },
    "Ent. Arch": { bg: `rgba(251,191,36,0.08)`, color: "#fcd34d" },
    "AI": { bg: `rgba(56,189,248,0.18)`, color: "#7dd3fc" },
    "WDF": { bg: `${colors.textMuted}15`, color: colors.textMuted },
    "Infra": { bg: `${colors.textMuted}15`, color: colors.textMuted },
    "Success": { bg: `rgba(168,85,247,0.12)`, color: "#c084fc" },
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.textPrimary, margin: "0 0 4px" }}>License Entitlements</h1>
          <p style={{ fontSize: 13, color: colors.textSecondary, margin: 0 }}>Infosys–Standard Chartered · Contract LCN0025670 · Term: 29 Jun 2025 – 21 Dec 2028</p>
        </div>
        <div style={{ textAlign: "right", fontSize: 10, color: colors.textMuted, fontFamily: "monospace" }}>
          <div>Account # ACCT0213754</div>
          <div>3 Order Forms Consolidated</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Active Products", value: "31", sub: "Across 9 BU domains" },
          { label: "Combined ACV", value: "$12.0M", sub: "Annual subscription" },
          { label: "Total Contract Value", value: "$37.6M", sub: "~41-month term" },
          { label: "ITSM Users", value: "70,000", sub: "Unrestricted" },
          { label: "HR Users", value: "80,000", sub: "HRSD Enterprise" },
          { label: "IRM Users", value: "70,000", sub: "Unrestricted" },
        ].map((s, i) => (
          <div key={i} style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "12px 14px" }}>
            <div style={{ fontSize: 9, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: colors.blue }}>{s.value}</div>
            <div style={{ fontSize: 10, color: colors.textSecondary, marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 11, color: colors.textMuted }}>Filter by BU:</span>
        <select value={filterBU} onChange={(e) => setFilterBU(e.target.value)}
          style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 6, padding: "6px 10px", color: colors.textPrimary, fontSize: 11, cursor: "pointer" }}>
          {buOptions.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <span style={{ marginLeft: "auto", fontSize: 11, color: colors.textMuted }}>Showing {filtered.length} of {LICENSE_DATA.length} products</span>
      </div>

      {/* Table */}
      <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "0.7fr 1fr 2.5fr 1.2fr 0.8fr 1fr 1fr 0.6fr", gap: 8, padding: "12px 16px", background: colors.bgPanel, borderBottom: `1px solid ${colors.border}` }}>
          {["BU", "Code", "Product Name", "Licence Type", "Units", "ACV (USD)", "TCV (USD)", "Order"].map(h => (
            <div key={h} style={{ fontSize: 10, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", textAlign: h.includes("USD") || h === "Units" ? "right" : "left" }}>{h}</div>
          ))}
        </div>
        {filtered.map((p, i) => {
          const buStyle = buColors[p.bu] || buColors["Platform"];
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "0.7fr 1fr 2.5fr 1.2fr 0.8fr 1fr 1fr 0.6fr", gap: 8, padding: "10px 16px", borderBottom: i < filtered.length - 1 ? `1px solid ${colors.border}` : "none" }}>
              <div><span style={{ fontSize: 9, fontWeight: 600, color: buStyle.color, background: buStyle.bg, padding: "2px 8px", borderRadius: 10 }}>{p.bu}</span></div>
              <div style={{ fontSize: 10, color: colors.textMuted, fontFamily: "monospace" }}>{p.code}</div>
              <div style={{ fontSize: 11, fontWeight: 500, color: colors.textPrimary }}>{p.name}</div>
              <div style={{ fontSize: 10, color: colors.textSecondary }}>{p.type}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: colors.textPrimary, textAlign: "right", fontFamily: "monospace" }}>{p.units}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: colors.green, textAlign: "right", fontFamily: "monospace" }}>{fmt(p.acv)}</div>
              <div style={{ fontSize: 11, color: colors.textSecondary, textAlign: "right", fontFamily: "monospace" }}>{fmt(p.tcv)}</div>
              <div style={{ fontSize: 9, color: colors.textMuted, background: `${colors.textMuted}10`, padding: "2px 6px", borderRadius: 3, fontFamily: "monospace" }}>{p.order}</div>
            </div>
          );
        })}
        {/* Totals row */}
        <div style={{ display: "grid", gridTemplateColumns: "0.7fr 1fr 2.5fr 1.2fr 0.8fr 1fr 1fr 0.6fr", gap: 8, padding: "12px 16px", background: colors.bgPanel, borderTop: `2px solid ${colors.border}` }}>
          <div style={{ gridColumn: "1 / 6", fontSize: 10, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "right" }}>Total ({filtered.length} products)</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: colors.green, textAlign: "right", fontFamily: "monospace" }}>{fmt(totalAcv)}</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: colors.textSecondary, textAlign: "right", fontFamily: "monospace" }}>{fmt(totalTcv)}</div>
          <div></div>
        </div>
      </div>

      {/* Key Notes */}
      <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginTop: 20 }}>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: colors.blue, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Key Contractual Notes</h3>
        {[
          "Dual Instance: SCB may use licences across scbnow01 and scsg until 31 Dec 2025. After that, scbnow01 must be decommissioned or +$3,750/month applies.",
          "IRM Professional: Usage limited to Policy & Compliance, GRC, Risk Mgmt, Use Case Accelerators, Operational Resilience. Expanded scope via new order form.",
          "Product Exchange: OF1 includes flexible exchange clause (60-day notice) across 16 products at locked monthly rates.",
          "Now Assist for Enterprise: 2 Assists × 15M = 30M Assists annually. Requires Next Experience and GenAI Controller.",
          "AI Control Tower: 500 Subscription Units. GRC apps restricted to AI Asset governance only.",
          "Impact Guided: Fee pegged at 4.29% of total annual subscription product fees. Scales with additional purchases.",
          "RaptorDB Professional: Fee indexed to total annual subscription fees across all products.",
          "EU AI Act: Explicit compliance clause for Advanced AI and Data Products under Regulation (EU) 2024/1689.",
          "Hosting: Europe data centre, dedicated environments. 14 × 6TB = 84TB total storage.",
          "All three Order Forms (ORD2198466-11, ORD3650930-1, ORD3651142-1) must be fully executed for any to be enforceable.",
        ].map((note, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <span style={{ color: colors.blue, fontSize: 12, lineHeight: 1 }}>•</span>
            <span style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.5 }}>{note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SCBAccountPlan() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard": return <DashboardView />;
      case "apac": return <APACReviewView />;
      case "customer": return <CustomerView />;
      case "strategy": return <StrategyView />;
      case "financials": return <FinancialsView />;
      case "orgchart": return <OrgChartView />;
      case "team": return <AccountTeamView />;
      case "adoption": return <AdoptionView />;
      case "growth": return <GrowthView />;
      case "actions": return <ActionsView />;
      case "telemetry": return <TelemetryView />;
      case "migration": return <MigrationView />;
      case "licenses": return <LicenseView />;
      default: return <DashboardView />;
    }
  };

  useEffect(() => {
    const handler = (e) => {
      const sections = ["dashboard", "apac", "customer", "strategy", "financials", "orgchart", "team", "adoption", "growth", "actions"];
      const idx = sections.indexOf(activeSection);
      if (e.key === "ArrowRight" && idx < sections.length - 1) setActiveSection(sections[idx + 1]);
      if (e.key === "ArrowLeft" && idx > 0) setActiveSection(sections[idx - 1]);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeSection]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: colors.bg, fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif", color: colors.textPrimary }}>
      <Sidebar active={activeSection} setActive={setActiveSection} />
      <main style={{ flex: 1, marginLeft: 220, padding: "24px 32px", overflowY: "auto" }}>
        {renderSection()}
      </main>
    </div>
  );
}
