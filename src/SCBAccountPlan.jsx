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
    lastEngagement: "Chris Bedi 1:1 — 12 June; HK MT — 29 July with Melissa", risk: "Low — strongest advocate",
    opportunityIds: [1, 2, 4], strategicThemes: ["ffg"] },
  { id: "pb", name: "Pete Burrill", title: "Interim Group Chief Financial Officer", tier: 1, division: "Finance", status: "red", parentId: "bw", location: "London",
    commentary: "⚠️ NEVER MET — CRITICAL ENGAGEMENT. Appointed Interim GCFO on 10 Feb 2026, replacing Diego De Giorgi who stepped down. Permanent GCFO search underway — new appointee becomes mandatory early engagement. Pete’s immediate focus: delivering 2026 guidance (statutory RoTE >12%, costs broadly flat) and preparing the May 2026 medium-term financial framework. Key for TCO analysis, FFG ROI, post-FFG cost base sustainability, and 2028 renewal business case. Must arm with shelfware quantification and platform consolidation savings.",
    priorities: "2026 guidance delivery, statutory RoTE >12%, cost discipline (final FFG year), May medium-term framework, shareholder returns continuity",
    lastEngagement: "Never met — engagement required BEFORE May 2026 framework", risk: "CRITICAL — must engage before budgets are set for new framework",
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
  { id: "rh", name: "Roberto Hoornweg", title: "CEO, Corporate & Investment Banking", tier: 1, division: "CIB", status: "grey", parentId: "bw", location: "Dubai",
    commentary: "Appointed CEO of CIB in December 2025 (previously Co-Head with Sunil Kaushal). Over 30 years banking experience — joined SCB 2017 as Global Head of Financial Markets. Retains oversight of Americas, Europe, Africa and Middle East markets. Member of Group Management Team. MIT economics graduate. Prior experience at Brevan Howard, UBS Investment Bank, Morgan Stanley. Evaluating if engagement is needed at this stage.",
    priorities: "Cross-border strategy, CIB growth, financial markets, EMEA regional oversight",
    lastEngagement: "Never met — evaluate engagement need", risk: "Low — evaluating relevance",
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
  { id: "ag", name: "Alvaro Garrido", title: "CIO, Information Security & Data", tier: 2, division: "Technology", status: "amber", parentId: "ne", location: "Singapore",
    commentary: "Security champion. 250 security engineers reporting to him. Evaluating Veza, Armis, and other security platforms. SecOps engagement opportunity. DORA compliance driver. Supporter but we need to increase engagement with him.",
    priorities: "Zero trust architecture, DORA compliance, security operations modernisation",
    lastEngagement: "Q3 2025 via Constance Chang — need to increase engagement", risk: "Medium — supporter, needs more engagement",
    opportunityIds: [3], strategicThemes: ["techRes"] },
  { id: "mk", name: "Melinda McKinley", title: "COO, Strategy & Talent", tier: 2, division: "Strategy & Talent", status: "green", parentId: "tk", location: "Singapore",
    commentary: "Day-to-day operational champion for OneSC. Leads HR service delivery transformation. Strong advocate for platform consolidation. Direct access. HR Hub success story owner.",
    priorities: "OneSC platform delivery, HR transformation, employee experience",
    lastEngagement: "John Aisen met Melinda 29 Jan; Chris Bedi follow-up pending", risk: "Low — operationally engaged",
    opportunityIds: [1], strategicThemes: ["ffg"] },
  { id: "sb", name: "Shelley Boland", title: "Head of Global CRES & Workplace Services", tier: 2, division: "Strategy & Talent", status: "green", parentId: "tk", location: "Singapore",
    commentary: "CRES Digital Vision programme sponsor. $2.5M pipeline owner. Interested in Knowledge 2026 showcase. Workplace transformation champion. Strong ServiceNow advocate.",
    priorities: "CRES digital transformation, workplace experience, cost efficiency",
    lastEngagement: "Melissa Ries (GVP Asia) met 26 Jan; follow-up 24 Feb", risk: "Low — strong sponsorship",
    opportunityIds: [4], strategicThemes: ["ffg"] },
  { id: "cp", name: "Cezary Piekarski", title: "Chief Security Officer", tier: 2, division: "Technology", status: "amber", parentId: "ne", location: "Singapore",
    commentary: "CISO. Works closely with Alvaro Garrido. SecOps opportunity. IRM/GRC potential. DORA and IBS 2025 compliance mandates. Generally supportive but relationship needs revival for Veza and Armis use cases.",
    priorities: "DORA compliance, security governance, threat intelligence",
    lastEngagement: "Dec 2024 via Lou Fiorello (GVP & GM Security & Risk) — need to revive", risk: "Medium — supportive, action needed for Veza/Armis",
    opportunityIds: [3], strategicThemes: ["techRes"] },
  { id: "sc", name: "Sean Coppinger", title: "CIO, Group Functions", tier: 2, division: "Technology", status: "amber", parentId: "ne", location: "Singapore",
    commentary: "Reports to Noelle Eder. Technology resilience programme lead. IRM natural buyer. DORA timeline pressure creates urgency. Supportive but often torn between SAP and ServiceNow — not always strong to make decisions in our favour.",
    priorities: "Technology resilience, operational risk, DORA compliance, Functions technology",
    lastEngagement: "Nov 2025 via Arun Ragothaman (Client Director)", risk: "Medium — supportive but wavering on SAP vs ServiceNow",
    opportunityIds: [5], strategicThemes: ["techRes"] },
  { id: "cdo", name: "TBH — Chief Data Officer", title: "Chief Data Officer (To Be Hired)", tier: 2, division: "Technology", status: "grey", parentId: "ne", location: "TBD",
    commentary: "Position vacant — previous CDO departed. Critical hire for data strategy and AI governance. David Hardoon (Chief AI Officer) will report to this role once filled. Watch for appointment announcement.",
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
  // Tier 3 — Senior Leaders
  { id: "jw", name: "Januar Wayong", title: "Global Head, Engineering", tier: 3, division: "Technology", status: "red", parentId: "bi", location: "Singapore",
    commentary: "⚠️ SAME SENTIMENT AS BEN ISSA. Reports to Ben Issa. Leads global engineering organisation. Previously Head of Technology at ING Neo Innovation, built mobile-only bank for ING Philippines. Background: ING Australia, UBS. Strong engineering culture advocate — likely aligned with Ben Issa's 'build' preference. University of Melbourne (Computer Science/Engineering).",
    priorities: "Engineering excellence, platform development, cloud-first strategy, developer experience",
    lastEngagement: "No direct engagement", risk: "HIGH — aligned with Ben Issa's build preference",
    opportunityIds: [], strategicThemes: [] },
  { id: "dh", name: "David Hardoon", title: "Chief AI Officer", tier: 3, division: "Technology", status: "green", parentId: "cdo", location: "Singapore",
    commentary: "AI Control Tower stakeholder. Published 'AI Cognitive Dissonance' research — leverage for positioning. 200+ AI use cases under governance. Strategic voice on AI strategy. Reports to CDO (currently vacant).",
    priorities: "AI governance, ethical AI deployment, AI use case management",
    lastEngagement: "Monthly via AI Control Tower", risk: "Low — governance partnership",
    opportunityIds: [1, 6], strategicThemes: ["ffg", "clientExp"] },
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
    lastEngagement: "Limited engagement — needs development", risk: "Medium — key for security and FSO financial crime",
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

const ADOPTION_DATA = {
  products: [
    { family: "ITSM", products: ["Incident", "Problem", "Change", "Request", "Knowledge"], adoption: "High", users: "18,000+", status: "green", notes: "Core platform — HR Hub success (86% sat, 85% deflection)" },
    { family: "HRSD", products: ["Case Management", "Employee Centre", "Lifecycle Events", "Document Management"], adoption: "High", users: "82,000", status: "green", notes: "104K productive hours saved annually; OneSC flagship" },
    { family: "WSD", products: ["Workplace Reservation", "Facilities Management", "Space Management"], adoption: "Emerging", users: "5,000+", status: "amber", notes: "Go-live early 2026; $600K NNACV in pipeline" },
    { family: "ITOM", products: ["Discovery", "Service Mapping", "Event Management", "Cloud Observability"], adoption: "Low", users: "<500", status: "red", notes: "⚠️ Significant shelfware risk — ServiceBench replacement threat" },
    { family: "SecOps", products: ["Vulnerability Response", "Threat Intelligence"], adoption: "Low", users: "<300", status: "red", notes: "⚠️ Databricks integration incomplete; ServiceBench threat" },
    { family: "IRM", products: ["Policy & Compliance", "Audit", "Risk", "Vendor Risk"], adoption: "Low", users: "<200", status: "red", notes: "⚠️ Risk function not engaged; 6,000 potential users" },
    { family: "ITAM", products: ["Hardware Asset Management", "Software Asset Management"], adoption: "Low", users: "<400", status: "red", notes: "⚠️ SAM optimisation opportunity — $1B tech spend; ServiceBench threat" },
    { family: "ITBM", products: ["Project Portfolio", "Agile Development", "Test Management"], adoption: "Medium", users: "2,000+", status: "amber", notes: "Engineering teams — Ben Issa domain" },
    { family: "Customer Service", products: ["CSM Core", "Field Service"], adoption: "None", users: "0", status: "red", notes: "Opportunity in WRB client service" },
    { family: "AI & Automation", products: ["NowAssist", "AI Control Tower", "Process Automation"], adoption: "Emerging", users: "Pilot", status: "amber", notes: "$750K NowAssist expansion; David Hardoon partnership" },
    { family: "App Engine", products: ["Custom Apps", "Integrations", "Workflows"], adoption: "Medium", users: "Dev teams", status: "amber", notes: "Counter Ben Issa's 'build' preference — innovation ON platform" },
    { family: "FSO", products: ["Order Management", "Disputes", "KYC/AML"], adoption: "None", users: "0", status: "red", notes: "Trade Finance pilot — $800K opportunity" },
    { family: "Legal", products: ["Legal Service Delivery", "Contract Management"], adoption: "None", users: "0", status: "amber", notes: "New domain — Legal ops transformation" },
    { family: "Supply Chain", products: ["Procurement", "Sourcing", "Vendor Management"], adoption: "Low", users: "<300", status: "amber", notes: "FFG programme alignment — vendor optimisation" },
    { family: "Health & Safety", products: ["EHS Management", "Incident Tracking"], adoption: "Emerging", users: "Pilot", status: "amber", notes: "Go-live early 2026 with WSD" },
    { family: "Integration Hub", products: ["Spoke Library", "Custom Integrations"], adoption: "Medium", users: "Integration teams", status: "amber", notes: "SAP, Workday, Databricks integrations" },
    { family: "Performance Analytics", products: ["Dashboards", "Reports", "KPIs"], adoption: "Medium", users: "1,500+", status: "amber", notes: "Business intelligence layer" },
    { family: "Now Mobile", products: ["Mobile Apps", "Virtual Agent"], adoption: "Low", users: "<1,000", status: "amber", notes: "Employee mobile experience — OneSC component" },
  ],
  downsellRisk: {
    total: "$4M",
    at36Months: true,
    products: ["ITOM", "HAM", "SAM", "SecOps VR"],
    mainThreat: "ServiceBench",
    threatDescription: "Homegrown bank solution actively being positioned as replacement for underutilised ServiceNow capabilities. Engineering team (Ben Issa / Januar Wayong) advocates for ServiceBench expansion.",
  },
  successMeasure: {
    metric: "Critical Apps Adoption",
    target: ">70%",
    description: "Adoption rate for at-risk solutions (ITOM, HAM, SAM, SecOps VR)",
  },
};

const GROWTH_OPPORTUNITIES = [
  { id: 1, pursuit: "EmployeeWorks & AI Expansion", nnacv: "$1M", probability: "High", stage: "Active", theme: "ffg", year: "2026",
    products: ["EmployeeWorks", "NowAssist", "Agentic AI", "AI Control Tower"],
    sponsor: "Tanuj Kapilashrami / Melinda McKinley",
    executiveIds: ["tk", "mk", "dh", "wy", "bon", "mkor", "id", "sl"],
    competes: "ServiceBench (displace)", partner: "Infosys (MSP)",
    description: "Scale OneSC with EmployeeWorks + Moveworks capabilities. Agentic AI for onboarding, NowAssist expansion, AI Control Tower governance. FY2025 intelligence: eNPS declined 3.9pts to 17.56 (board KPI) — position as recovery vehicle. HR Hub’s 104K hours saved directly contributes to new revenue-per-FTE CEO scorecard KPI. Reframe AI Control Tower from governance tool to enterprise GenAI foundation (Bill Winters’ personal 2026 objective).",
    items: [
      { name: "EmployeeWorks Expansion", est: "$400K", status: "Active", detail: "Moveworks acquisition — action layer positioning" },
      { name: "Agentic AI for Onboarding", est: "$200K", status: "Building", detail: "March 2025 go-live target. MVP presented." },
      { name: "NowAssist Expansion", est: "$250K", status: "Pipeline", detail: "Contracted June 2025. Expansion beyond HR to ITSM/ITOM." },
      { name: "AI Control Tower", est: "$150K", status: "Active", detail: "David Hardoon stakeholder. Governance positioning." },
    ]},
  { id: 2, pursuit: "Legal Service Delivery & Contract Management", nnacv: "$500K", probability: "High", stage: "Active", theme: "ffg", year: "2026",
    products: ["Legal Service Delivery", "Contract Lifecycle Management", "Matter Management"],
    sponsor: "Legal function / Tanuj Kapilashrami",
    executiveIds: ["tk", "wy", "bon"],
    competes: "ServiceBench (displace)", partner: "Infosys (MSP)",
    description: "New domain: digitise legal ops with matter management, contract lifecycle, and approval workflows. Strong executive sponsorship under Tanuj. Extends platform consolidation into FFG final-year savings.",
    items: [
      { name: "Legal Service Delivery", est: "$250K", status: "Requirements gathering", detail: "Legal ops transformation — matter management, request intake" },
      { name: "Contract Lifecycle Management", est: "$250K", status: "Opportunity", detail: "Contract authoring, approval workflows, obligation tracking" },
    ]},
  { id: 3, pursuit: "Security Platform Expansion (Veza & Armis)", nnacv: "$1.5M", probability: "Medium", stage: "Developing", theme: "techRes", year: "2027",
    products: ["Veza", "Armis", "SecOps VR", "IRM", "AI Governance"],
    sponsor: "Alvaro Garrido / Cezary Piekarski",
    executiveIds: ["ag", "cp", "ne", "ls"],
    competes: "MetricStream (incumbent)", partner: "Infosys (MSP)",
    description: "Veza (identity security) and Armis (asset visibility) for DORA compliance. SecOps integration with Databricks. Software write-offs ($588M to $42M) signal custom-build depreciation complete — strengthens consolidation case.",
    items: [
      { name: "Veza Identity Security", est: "$500K", status: "Evaluation", detail: "Identity threat detection, access governance — Alvaro Garrido evaluating" },
      { name: "Armis Asset Intelligence", est: "$500K", status: "Evaluation", detail: "Asset visibility, vulnerability management — security engineering priority" },
      { name: "SecOps Integration Completion", est: "$500K", status: "Developing", detail: "Databricks security stack integration — reduce downsell risk" },
    ]},
  { id: 4, pursuit: "CRES Digital Vision Programme", nnacv: "$1M", probability: "High", stage: "Active", theme: "ffg", year: "2026",
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
  { id: 5, pursuit: "Technology Resilience & ITOM", nnacv: "$500K", probability: "Medium", stage: "Developing", theme: "techRes", year: "2027",
    products: ["IRM", "ITOM Discovery", "SAM", "Cloud Observability"],
    sponsor: "Sean Coppinger / Jason Forrester",
    executiveIds: ["sc", "jf", "ne", "rg", "ls"],
    competes: "MetricStream (incumbent)", partner: "Infosys (MSP)",
    description: "IRM/GRC for the bank's 6,000+ risk function (Jason Forrester). ITOM Discovery for hybrid cloud visibility. SAM optimisation across $1B annual tech spend. DORA compliance driver.",
    items: [
      { name: "IRM / GRC Adoption", est: "$150K", status: "Opportunity", detail: "Jason Forrester's Risk function — 6,000 employees" },
      { name: "ITOM Discovery Deployment", est: "$150K", status: "Opportunity", detail: "Hybrid cloud visibility; supports 50% cloud target" },
      { name: "SAM / HAM Optimisation", est: "$100K", status: "Opportunity", detail: "$1B annual tech spend justifies focus" },
      { name: "Cloud Observability", est: "$100K", status: "Opportunity", detail: "Multi-cloud monitoring — AWS, Azure, GCP" },
    ]},
  { id: 6, pursuit: "Financial Services Operations (FSO)", nnacv: "$3M", probability: "Medium", stage: "Visionary", theme: "clientExp", year: "2027",
    products: ["FSO", "App Engine", "Agentic AI", "Workflow Data Fabric", "VISA Disputes"],
    sponsor: "Guillermo Veiga / Roberto Hoornweg",
    executiveIds: ["gv", "rh", "dh", "ls"],
    competes: "Microsoft, ServiceBench, Pega (incumbent CIB)", partner: "TCS (to explore)",
    description: "Middle-to-back office for CIB and WRB. Trade Finance KYC/AML, VISA disputes, RM productivity tools. Supports bank's $1.5B wealth investment and 275K NTB affluent growth. Cross-border income at 61.5% of CIB.",
    items: [
      { name: "FSO — Trade Finance KYC/AML", est: "$1.2M", status: "Opportunity", detail: "Case management, regulatory compliance — pilot stage" },
      { name: "App Engine First Use Case", est: "$600K", status: "Opportunity", detail: "Counters Ben Issa's 'build' preference — innovation ON platform" },
      { name: "Disputes Management (VISA)", est: "$800K", status: "Early", detail: "Co-exist with ServiceBench" },
      { name: "Workflow Data Fabric", est: "$400K", status: "Concept", detail: "Cross-process automation for FFG" },
    ]},
  { id: 7, pursuit: "Revenue Growth & Client Experience", nnacv: "$2.5M", probability: "Medium", stage: "Visionary", theme: "clientExp", year: "2027",
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
  { id: 8, pursuit: "Strategic Customer Success", nnacv: "$1M", probability: "High", stage: "Active", theme: "ffg", year: "2026",
    products: ["Customer Success", "Adoption Services", "Value Realisation", "Executive Health Review"],
    sponsor: "Tanuj Kapilashrami / Melinda McKinley",
    executiveIds: ["tk", "mk", "wy", "bon"],
    competes: "N/A — strategic investment", partner: "Infosys (MSP)",
    description: "Dedicated senior customer success engagement to drive adoption, protect $4M at-risk CACV, and build the quantified value narrative for the 2028 renewal. Directly supports revenue-per-FTE measurement and post-FFG productivity sustainability.",
    items: [
      { name: "Senior CSE (2 days/week onsite)", est: "$400K", status: "Requested", detail: "Dedicated resource to drive adoption across stalled product areas" },
      { name: "Platform Architect engagement", est: "$300K", status: "Requested", detail: "3-month sprint for ITOM, HAM, SAM, SecOps, IRM acceleration" },
      { name: "Telemetry-based value assessment", est: "$200K", status: "Not Started", detail: "Quantify $value delivered to support revenue-per-FTE narrative and renewal positioning" },
      { name: "Executive Health Review", est: "$100K", status: "Not Started", detail: "Annual domain review with CEG leadership and bank executives" },
    ]},
];

// ─── Theme & Styles ──────────────────────────────────────────────────────────
const colors = {
  bg: "#0a1628",
  bgCard: "#0f1f35",
  bgHover: "#152a45",
  bgPanel: "#0d1a2e",
  border: "#1a3050",
  borderLight: "#243d5c",
  green: "#3ddc84",
  greenDark: "#2ba864",
  greenGlow: "rgba(61,220,132,0.15)",
  blue: "#4a9eff",
  blueGlow: "rgba(74,158,255,0.15)",
  amber: "#f5a623",
  amberGlow: "rgba(245,166,35,0.12)",
  red: "#ff4757",
  redGlow: "rgba(255,71,87,0.12)",
  textPrimary: "#e8edf5",
  textSecondary: "#8a9bb5",
  textMuted: "#5a6d85",
  white: "#ffffff",
};

const statusColors = {
  green: { bg: colors.greenGlow, color: colors.green, label: "Strong Ally" },
  amber: { bg: colors.amberGlow, color: colors.amber, label: "Needs Development" },
  red: { bg: colors.redGlow, color: colors.red, label: "Risk / No Relationship" },
  grey: { bg: "rgba(138,155,181,0.12)", color: "#8a9bb5", label: "Evaluating Need" },
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
  ];
  return (
    <div style={{ width: 220, minHeight: "100vh", background: `linear-gradient(180deg, ${colors.bgPanel} 0%, ${colors.bg} 100%)`, borderRight: `1px solid ${colors.border}`, display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, zIndex: 100 }}>
      <div style={{ padding: "24px 20px 16px", borderBottom: `1px solid ${colors.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: `linear-gradient(135deg, ${colors.green}, ${colors.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: colors.bg }}>SC</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: colors.textPrimary, letterSpacing: "0.02em" }}>Standard Chartered</div>
            <div style={{ fontSize: 10, color: colors.textMuted, letterSpacing: "0.05em", textTransform: "uppercase" }}>Marquee Account Plan</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "12px 8px" }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => setActive(s.id)}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", marginBottom: 2, border: "none", borderRadius: 8, cursor: "pointer", transition: "all 0.2s",
              background: active === s.id ? colors.greenGlow : "transparent",
              color: active === s.id ? colors.green : colors.textSecondary,
              fontWeight: active === s.id ? 600 : 400, fontSize: 13 }}>
            <span style={{ fontSize: 16, opacity: active === s.id ? 1 : 0.5 }}>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: "16px 20px", borderTop: `1px solid ${colors.border}`, fontSize: 10, color: colors.textMuted }}>
        <div>CACV: <span style={{ color: colors.green, fontWeight: 700 }}>$13.1M</span></div>
        <div>Next Renewal: <span style={{ color: colors.amber, fontWeight: 600 }}>28 Dec 2028</span></div>
        <div style={{ marginTop: 4, opacity: 0.6 }}>ServiceNow · FY2026</div>
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
        <div style={{ width: 50, height: 50, background: `linear-gradient(135deg, ${colors.green}, ${colors.blue})`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 20, color: colors.bg }}>SC</div>
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
        <MetricCard label="Total NNACV Potential" value="$9-11M" sub="Conservative estimate" accent={colors.green} />
      </div>
      
      {/* WATERFALL CHART - FOURTH */}
      <div style={{ background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary, margin: "0 0 16px" }}>CACV Waterfall: The Mathematics of Growth</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 220, padding: "0 20px" }}>
          {/* Current CACV */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: colors.green, marginBottom: 8 }}>$13.1M</div>
            <div style={{ width: "100%", height: 130, background: `linear-gradient(180deg, ${colors.green}, ${colors.greenDark})`, borderRadius: "6px 6px 0 0", position: "relative" }}>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: 11, fontWeight: 600, color: colors.bg, textAlign: "center" }}>Current<br/>CACV</div>
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
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: 11, fontWeight: 600, color: colors.bg, textAlign: "center" }}>Protected<br/>Floor</div>
              </div>
            </div>
            <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 8, textAlign: "center" }}>If at-risk<br/>lost</div>
          </div>
          
          {/* Expansion (positive) */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: colors.blue, marginBottom: 8 }}>+$9-11M</div>
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
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: 11, fontWeight: 600, color: colors.bg, textAlign: "center" }}>Target<br/>CACV</div>
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
            { label: "myHR / OneSC Adoption", status: "green", detail: "86% satisfaction · 85% deflection" },
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
            { label: "CRES Digital Vision programme — $2.5M pipeline", priority: "ACTIVE", color: colors.green },
            { label: "WSD + H&S go-live (early 2026)", priority: "ACTIVE", color: colors.green },
            { label: "Knowledge 2026 — Melinda & Shelley engagement with P5", priority: "HIGH", color: colors.amber },
            { label: "EmployeeWorks opportunity pursuit", priority: "HIGH", color: colors.green },
            { label: "Neutralise Ben Issa via platform mandate", priority: "HIGH", color: colors.amber },
            { label: "IRM + SecOps adoption campaign", priority: "HIGH", color: colors.amber },
            { label: "Assign Customer Success Executive", priority: "URGENT", color: colors.red },
          ].map((p, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: i < 7 ? `1px solid ${colors.border}` : "none" }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: p.color, background: `${p.color}18`, padding: "2px 6px", borderRadius: 4, whiteSpace: "nowrap" }}>{p.priority}</span>
              <span style={{ fontSize: 12, color: colors.textPrimary }}>{p.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* VALUE DELIVERED - SIXTH */}
      <div style={{ background: colors.bgCard, border: `2px solid ${colors.green}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{ fontSize: 22 }}>📈</div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: colors.green, margin: 0 }}>Value Delivered: HR Hub Success Story</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 16 }}>
          <div style={{ background: colors.greenGlow, borderRadius: 8, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: colors.green }}>104K+</div>
            <div style={{ fontSize: 11, color: colors.green, fontWeight: 500 }}>Productive Hours Saved Annually</div>
          </div>
          <div style={{ background: colors.greenGlow, borderRadius: 8, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: colors.green }}>86%</div>
            <div style={{ fontSize: 11, color: colors.green, fontWeight: 500 }}>Employee Satisfaction</div>
          </div>
          <div style={{ background: colors.greenGlow, borderRadius: 8, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: colors.green }}>85%</div>
            <div style={{ fontSize: 11, color: colors.green, fontWeight: 500 }}>Case Deflection Rate</div>
          </div>
          <div style={{ background: colors.greenGlow, borderRadius: 8, padding: 16, textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: colors.green }}>82K</div>
            <div style={{ fontSize: 11, color: colors.green, fontWeight: 500 }}>Employees Served</div>
          </div>
        </div>
        <p style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 1.6, margin: 0 }}>
          The OneSC HR Hub is our flagship success story — demonstrating the art of the possible when ServiceNow is fully adopted. This proven value must be replicated across ITSM, ITOM, Security, and Workplace domains to protect the renewal base and justify expansion investment.
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
    { priority: "Sustain Productivity Gains", value: "$3-3.5M (2026)", description: "Lock in run-rate savings delivered via OneSC and platform consolidation. Expand unified service management into Legal, Finance, CRES, and Supply Chain. Directly drives revenue-per-FTE (CEO 2026 KPI). Address eNPS decline through improved employee experience.", theme: "ffg" },
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
      nnacv: "$3-3.5M",
      nnacvYear: "2026",
    },
    {
      title: "Govern: AI & Risk at Enterprise Scale",
      subtitle: "Board-level AI confidence, regulatory compliance",
      theme: "techRes",
      whatItIs: "Deploy AI Control Tower as the governance foundation for GenAI at scale, plus integrated risk management and security operations for DORA compliance.",
      whyItMatters: "Bill Winters’ 2026 personal objective: ‘Lead creation of a bank-specific approach to GenAI.’ Board hosted AI governance stewardship event Nov 2025. DORA compliance is non-negotiable. Software write-offs ($588M to $42M) suggest custom-build depreciation cycle complete.",
      howWeHelp: "AI Control Tower governs 200+ use cases with David Hardoon’s framework. IRM/GRC for policy and compliance. SecOps VR with Databricks integration. Software impairment cycle complete ($588M→$42M) — strengthens consolidation case.",
      whoBuys: "Noelle Eder (Group Head T&O), Jason Forrester (Group CRO), Alvaro Garrido (CIO InfoSec), David Hardoon (Chief AI Officer)",
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
      whoBuys: "Judy Hsu (CEO WRB), Guillermo Veiga (Group CIO), Roberto Hoornweg (CEO CIB), David Hardoon (Chief AI Officer)",
      nnacv: "$3.5-5.5M",
      nnacvYear: "2027",
    },
  ];
  
  const measuresOfSuccess = [
    "NNACV: $9-11M over 2 years — Sustain $3-3.5M in 2026; Govern $1.5-2M + Grow $3.5-5.5M in 2027",
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
                  <div style={{ fontSize: 9, fontWeight: 700, color: colors.bg, position: "absolute", top: 4, left: 0, right: 0, textAlign: "center" }}>${d.income}B</div>
                </div>
                <div style={{ flex: 1, background: `linear-gradient(180deg, ${colors.blue}, #3577cc)`, borderRadius: "4px 4px 0 0", position: "relative", height: `${(d.pbt / maxIncome) * 100}%`, minHeight: 20 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: colors.bg, position: "absolute", top: 4, left: 0, right: 0, textAlign: "center" }}>${d.pbt}B</div>
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
          <div style={{ fontSize: 10, color: colors.textMuted }}>{exec.division}</div>
          {exec.location && <div style={{ fontSize: 10, color: colors.blue }}>📍 {exec.location}</div>}
        </div>
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
                        <span style={{ fontSize: 9, fontWeight: 600, color: colors.bg, background: theme.primary, padding: "1px 6px", borderRadius: 3 }}>{opp.stage}</span>
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
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.textPrimary, margin: "0 0 4px" }}>Adoption & Renewal Status</h1>
      <p style={{ fontSize: 13, color: colors.textSecondary, margin: "0 0 20px" }}>Product portfolio health · 18 families · Next renewal: 28 Dec 2028</p>
      
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
      
      <h2 style={{ fontSize: 16, fontWeight: 600, color: colors.textPrimary, margin: "0 0 12px" }}>Product Portfolio — 18 Families</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {ADOPTION_DATA.products.map((p, i) => (
          <div key={i} onClick={() => setExpandedFamily(expandedFamily === i ? null : i)}
            style={{ background: expandedFamily === i ? colors.bgHover : colors.bgCard, border: `1px solid ${expandedFamily === i ? colors.green + "40" : colors.border}`, borderRadius: 10, padding: "14px 18px", cursor: "pointer", transition: "all 0.2s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <StatusDot status={p.status} size={10} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: colors.textPrimary }}>{p.family}</div>
                {expandedFamily === i && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>Products: {p.products.join(", ")}</div>
                    <div style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 4 }}>Users: <span style={{ fontWeight: 600, color: colors.textPrimary }}>{p.users}</span></div>
                    <div style={{ fontSize: 11, color: colors.textSecondary }}>{p.notes}</div>
                  </div>
                )}
              </div>
              <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, fontWeight: 600,
                background: p.adoption === "High" ? colors.greenGlow : p.adoption === "Medium" || p.adoption === "Emerging" ? colors.amberGlow : colors.redGlow,
                color: p.adoption === "High" ? colors.green : p.adoption === "Medium" || p.adoption === "Emerging" ? colors.amber : colors.red }}>
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
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.textPrimary, marginBottom: 4 }}>Senior Customer Success Executive</div>
                <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.5 }}>Dedicated resource as part of the account team, spending at least <strong style={{ color: colors.blue }}>2 days per week onsite</strong> with the customer to drive adoption and engagement.</div>
              </div>
            </div>
          </div>
          
          {/* Investment 2: Platform Architect */}
          <div style={{ background: colors.bgPanel, border: `1px solid ${colors.blue}40`, borderRadius: 8, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: colors.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: colors.white, flexShrink: 0 }}>2</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.textPrimary, marginBottom: 4 }}>Platform Architect Investment</div>
                <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.5 }}><strong style={{ color: colors.blue }}>3-month engagement</strong> to enable stalled or at-risk areas: ITOM, HAM, SAM, SecOps VR, IRM (DORA), and AI Control Tower.</div>
              </div>
            </div>
          </div>
          
          {/* Investment 3: Paid Services via CEG */}
          <div style={{ background: colors.bgPanel, border: `1px solid ${colors.green}40`, borderRadius: 8, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: colors.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: colors.bg, flexShrink: 0 }}>3</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.textPrimary, marginBottom: 4 }}>Paid Services via CEG</div>
                <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.5 }}>Pitching for paid services in parallel with investment asks. <strong style={{ color: colors.green }}>2 Expert Services SoWs already in play</strong> to support implementation and adoption.</div>
              </div>
            </div>
          </div>
          
          {/* Investment 4: Training Credits */}
          <div style={{ background: colors.bgPanel, border: `1px solid ${colors.amber}40`, borderRadius: 8, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: colors.amber, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: colors.bg, flexShrink: 0 }}>4</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.textPrimary, marginBottom: 4 }}>Pro-active Training Credits Guidance</div>
                <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.5 }}>The bank has <strong style={{ color: colors.amber }}>$30K/year in training credits</strong> that have not been used effectively. We need pro-active guidance to maximise utilisation.</div>
              </div>
            </div>
          </div>
          
          {/* Investment 5: Executive Review Forum */}
          <div style={{ background: colors.bgPanel, border: `1px solid ${colors.blue}40`, borderRadius: 8, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: colors.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: colors.white, flexShrink: 0 }}>5</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.textPrimary, marginBottom: 4 }}>Bi-Monthly Executive Review Forum</div>
                <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.5 }}>Proposing an <strong style={{ color: colors.blue }}>operational cadence</strong> with the bank covering innovations, progress, and value realised. CEG leaders and Product BU representatives to attend.</div>
              </div>
            </div>
          </div>
          
          {/* Investment 6: Telemetry & Value Assessment */}
          <div style={{ background: `linear-gradient(135deg, ${colors.redGlow}, ${colors.amberGlow})`, border: `2px solid ${colors.red}`, borderRadius: 8, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: colors.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: colors.white, flexShrink: 0 }}>⚡</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.red, marginBottom: 4 }}>CRITICAL: Telemetry & Value Assessment</div>
                <div style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 1.5 }}>We need help to use <strong style={{ color: colors.red }}>telemetry to assess $value delivered</strong> as a starting point. This will be fine-tuned over time but is essential for demonstrating ROI and protecting the renewal.</div>
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
          <div style={{ fontSize: 28, fontWeight: 800, color: colors.green }}>$9-11M</div>
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
            <div style={{ marginBottom: 4 }}><strong style={{ color: colors.textPrimary }}>Incumbent:</strong> MetricStream (IRM/GRC), Pega (CIB systems)</div>
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
            <div><strong style={{ color: colors.textPrimary }}>FSO:</strong> TCS — to explore for financial services operations</div>
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
              <span style={{ fontSize: 9, color: theme.primary, fontWeight: 600 }}>{o.stage}</span>
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
                    <span style={{ fontSize: 11, fontWeight: 700, color: colors.bg, background: theme.primary, padding: "2px 8px", borderRadius: 4 }}>{o.stage}</span>
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
  { id: 1, category: "Growth", action: "Secure meeting with Noelle Eder", criticality: "Critical", bankContact: "Noelle Eder (Group Head T&O)", snContact: "Chris Bedi / Arun Ragothaman", dueDate: "Q1 2026", status: "Not Started", notes: "Single most critical engagement gap — controls all technology strategy. Board confirmed strategic weight of her appointment.", marqueeOffer: "Access: Global Advisory Council" },
  { id: 2, category: "Growth", action: "Meet Guillermo Veiga for FSO positioning", criticality: "High", bankContact: "Guillermo Veiga (Group CIO)", snContact: "Arun Ragothaman / FSO Specialist", dueDate: "Mar 2026", status: "Not Started", notes: "Critical for FSO opportunity — must meet to land use cases. CIB cross-border at 61.5%, digital transactions at 72.1%.", marqueeOffer: "Advantage: AI Advantage Team" },
  { id: 3, category: "Growth", action: "Revive Cezary Piekarski relationship for Veza/Armis", criticality: "High", bankContact: "Cezary Piekarski (CISO)", snContact: "Lou Fiorello / Security Team", dueDate: "Feb 2026", status: "Not Started", notes: "Last engagement Dec 2024 — need to revive for security platform expansion. DORA compliance creates urgency.", marqueeOffer: "Advantage: Industry Customer Advisory Board" },
  { id: 4, category: "Growth", action: "Engage Lavy Stokhamer for SecOps and Financial Crime", criticality: "Medium", bankContact: "Lavy Stokhamer (Global Head Cyber & Anti-Crime)", snContact: "Arun Ragothaman / Security Team", dueDate: "Mar 2026", status: "Not Started", notes: "Reports to Cezary. Key for security and FSO financial crime use cases." },
  { id: 5, category: "Growth", action: "Progress CRES Digital Vision requirements with Shelley", criticality: "High", bankContact: "Shelley Boland (Head CRES)", snContact: "Melissa Ries / Arun Ragothaman", dueDate: "Feb 2026", status: "In Progress", notes: "Requirements gathered for 7 experiences. Potential Platinum programme candidate. Drives eNPS recovery and revenue-per-FTE.", marqueeOffer: "Access: Complimentary Knowledge Passes" },
  { id: 6, category: "Growth", action: "Agentic AI for Onboarding go-live", criticality: "High", bankContact: "Melinda McKinley / David Hardoon", snContact: "AI Team / Arun Ragothaman", dueDate: "Mar 2026", status: "In Progress", notes: "MVP presented. Directly supports GenAI governance mandate and revenue-per-FTE KPI.", marqueeOffer: "Advantage: AI Advantage Team" },
  { id: 7, category: "Growth", action: "Legal Service Delivery requirements gathering", criticality: "Medium", bankContact: "Legal Function / Tanuj Kapilashrami", snContact: "Arun Ragothaman", dueDate: "Q2 2026", status: "In Progress", notes: "New domain — strong executive sponsorship from Tanuj. Extends platform consolidation into FFG final-year savings." },
  { id: 8, category: "Growth", action: "Engage Pete Burrill (Interim GCFO) for value/TCO narrative", criticality: "Critical", bankContact: "Pete Burrill (Interim GCFO)", snContact: "Chris Bedi / Arun Ragothaman", dueDate: "Q1 2026", status: "Not Started", notes: "Must engage before May 2026 medium-term framework. Build value narrative on reported basis for 2028 renewal.", marqueeOffer: "Access: Dedicated Executive Sponsor" },
  // Post-FFG & Intelligence Actions
  { id: 20, category: "Growth", action: "Identify Platinum programmes via Tanuj/Warren Young", criticality: "Critical", bankContact: "Tanuj Kapilashrami / Warren Young", snContact: "Arun Ragothaman", dueDate: "Q1 2026", status: "Not Started", notes: "2026 board scorecard (15% weighting) includes Platinum programmes. If ServiceNow is not in one, risk of budget marginalisation.", marqueeOffer: "Access: Marquee Leaders Advantage" },
  { id: 21, category: "Growth", action: "Prepare for May 2026 medium-term financial framework", criticality: "Critical", bankContact: "Pete Burrill / Tanuj Kapilashrami", snContact: "Arun Ragothaman / Account Team", dueDate: "Apr 2026", status: "Not Started", notes: "SCB publishes new multi-year framework in May 2026. ServiceNow must be embedded in the post-FFG narrative before budgets are set.", marqueeOffer: "Acceleration: Commercial Strategy & Advisory" },
  { id: 22, category: "Growth", action: "Build revenue-per-FTE value narrative", criticality: "High", bankContact: "Pete Burrill / Warren Young", snContact: "Arun Ragothaman", dueDate: "Q2 2026", status: "Not Started", notes: "NEW 2026 CEO scorecard KPI. Quantify HR Hub 104K hours + CRES + Legal productivity gains into board-ready narrative.", marqueeOffer: "Acceleration: Annual Executive Health Review" },
  { id: 23, category: "Growth", action: "Position eNPS recovery story with Melinda/Tanuj", criticality: "High", bankContact: "Melinda McKinley / Tanuj Kapilashrami", snContact: "Arun Ragothaman", dueDate: "Q2 2026", status: "Not Started", notes: "eNPS declined 3.9pts to 17.56 (board KPI). HR Hub shows 86% satisfaction. Position WSD, EmployeeWorks, Agentic AI as recovery vehicle.", marqueeOffer: "Advantage: AI Benchmarking & Insights Report" },
  { id: 24, category: "Growth", action: "Map AI Control Tower to GenAI governance mandate", criticality: "High", bankContact: "David Hardoon / Noelle Eder", snContact: "AI Team / Arun Ragothaman", dueDate: "Q2 2026", status: "Not Started", notes: "Bill Winters' 2026 personal objective: GenAI strategy. Board held AI governance stewardship event Nov 2025. Reframe AI Control Tower as enterprise foundation for GenAI at scale.", marqueeOffer: "Advantage: AI Solutions Product Advisory Council" },
  // Adoption & Renewal Actions
  { id: 9, category: "Adoption", action: "Deploy Senior Customer Success Executive (2 days/week onsite)", criticality: "Critical", bankContact: "Melinda McKinley / Tanuj Kapilashrami", snContact: "ServiceNow Leadership", dueDate: "Q1 2026", status: "Requested", notes: "Investment ask to drive adoption and protect $4M at-risk CACV.", marqueeOffer: "Acceleration: Now on Now Concierge" },
  { id: 10, category: "Adoption", action: "Platform Architect engagement for stalled areas", criticality: "Critical", bankContact: "Technology Teams", snContact: "Platform Architect (TBD)", dueDate: "Q1 2026", status: "Requested", notes: "3-month engagement for ITOM, HAM, SAM, SecOps VR, IRM (DORA), AICT.", marqueeOffer: "Acceleration: Deployment & Adoption Roundtables" },
  { id: 11, category: "Adoption", action: "Progress Expert Services SoWs", criticality: "High", bankContact: "SCB Procurement", snContact: "CEG Team", dueDate: "Q1 2026", status: "In Progress", notes: "2 Expert Services SoWs already in play.", marqueeOffer: "Acceleration: Commercial Strategy & Advisory" },
  { id: 12, category: "Adoption", action: "Maximise $30K training credits utilisation", criticality: "Medium", bankContact: "HR / Training Teams", snContact: "Training Team", dueDate: "Q2 2026", status: "Not Started", notes: "Bank has unused training credits — need proactive guidance." },
  { id: 13, category: "Adoption", action: "Establish bi-monthly Executive Review Forum", criticality: "High", bankContact: "Tanuj / Melinda", snContact: "CEG Leaders / Product BU", dueDate: "Mar 2026", status: "Not Started", notes: "Operational cadence covering innovations, progress, value realised.", marqueeOffer: "Access: Marquee Leaders Advantage" },
  { id: 14, category: "Adoption", action: "Implement telemetry-based value assessment", criticality: "Critical", bankContact: "Warren Young / Brian O'Neill", snContact: "Value Engineering / Arun Ragothaman", dueDate: "Q1 2026", status: "Not Started", notes: "Use telemetry to assess $value delivered — critical for renewal positioning.", marqueeOffer: "Advantage: AI Benchmarking & Insights Report" },
  { id: 15, category: "Adoption", action: "ITOM/HAM/SAM adoption acceleration", criticality: "High", bankContact: "Sean Coppinger / Technology Teams", snContact: "Platform Team", dueDate: "Q2 2026", status: "Not Started", notes: "$4M at-risk CACV. Est. 20-30% utilisation outside HR — critical gap." },
  { id: 16, category: "Adoption", action: "SecOps VR Databricks integration completion", criticality: "High", bankContact: "Alvaro Garrido / Lavy Stokhamer", snContact: "Security Team", dueDate: "Q2 2026", status: "Developing", notes: "Reduce downsell risk — security stack integration with Databricks." },
];

function ActionsView() {
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterCriticality, setFilterCriticality] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  
  const categories = ["All", "Growth", "Adoption"];
  const criticalities = ["All", "Critical", "High", "Medium", "Low"];
  const statuses = ["All", "Not Started", "In Progress", "Requested", "Developing", "Complete"];
  
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
              <div style={{ marginBottom: 6 }}><strong style={{ color: colors.green }}>Go-Lives:</strong> Agentic AI for Onboarding, OneSC</div>
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
