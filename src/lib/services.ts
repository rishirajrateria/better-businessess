/**
 * Service catalogue. Core services get the full programmatic location matrix
 * (service × province × city). Sub-services get dedicated pages and are linked
 * from their parent service everywhere.
 */
export type Faq = { question: string; answer: string };

export type Service = {
  slug: string;
  name: string;
  shortName: string;
  /** Short noun phrase used in sentences, e.g. "lead generation" */
  noun: string;
  parent?: string;
  core: boolean;
  tagline: string;
  metaDescription: string;
  icon: "target" | "search" | "code" | "palette" | "megaphone" | "share" | "map-pin" | "shopping-bag" | "pen-tool" | "layers";
  accent: string; // hex accent for visuals
  intro: string[];
  whatIsIt: string;
  deliverables: string[];
  process: { title: string; text: string }[];
  benefits: { title: string; text: string }[];
  outcomes: { label: string; value: string }[];
  idealFor: string[];
  faqs: Faq[];
  keywords: string[];
  related: string[];
  schemaServiceType: string;
};

export const services: Service[] = [
  {
    slug: "lead-generation",
    name: "Lead Generation",
    shortName: "Lead Gen",
    noun: "lead generation",
    core: true,
    tagline: "Predictable pipelines of qualified leads, not vanity traffic.",
    metaDescription:
      "Lead generation services in Canada. Better Businesses builds Google Ads, Meta Ads, landing page and conversion systems that deliver qualified, sales-ready leads.",
    icon: "target",
    accent: "#C19A3E",
    intro: [
      "Lead generation is the engine of a growing business. At Better Businesses we design, launch and continuously optimize full-funnel lead generation systems for Canadian companies: paid search on Google, paid social on Meta and LinkedIn, high-converting landing pages, call tracking, CRM integration and follow-up automation. Every campaign is built around one metric that matters to you: cost per qualified lead.",
      "Most agencies report clicks and impressions. We report booked calls, quote requests and closed revenue. Our team combines media buying, conversion-rate optimization and analytics so you know exactly which channel, keyword and creative produced each lead, and what it cost.",
    ],
    whatIsIt:
      "Lead generation is the process of attracting potential customers and converting their interest into contact information or a sales conversation. For most Canadian businesses this means paid advertising, search visibility and landing pages that turn visitors into enquiries, followed by fast, tracked follow-up.",
    deliverables: [
      "Google Ads (Search, Performance Max, Local Services Ads)",
      "Meta Ads (Facebook & Instagram) and LinkedIn Ads",
      "Conversion-focused landing pages and A/B testing",
      "Call tracking, form tracking and CRM integration",
      "Lead qualification workflows and instant notifications",
      "Retargeting and remarketing sequences",
      "Weekly performance reporting with cost-per-lead and ROI",
    ],
    process: [
      { title: "Discover", text: "We audit your offer, margins, sales process and competitors to define what a qualified lead is worth to you." },
      { title: "Build", text: "We create the campaign structure, ad creative, landing pages and tracking stack in 2 to 3 weeks." },
      { title: "Launch", text: "Campaigns go live with tight budgets and daily monitoring while data accumulates." },
      { title: "Optimize", text: "Bids, audiences, creative and pages are refined weekly to lower cost per lead and raise lead quality." },
      { title: "Scale", text: "Winning channels get more budget; we add new channels only once the economics are proven." },
    ],
    benefits: [
      { title: "Qualified, not just quantity", text: "Lead scoring and qualification questions keep tire-kickers out of your inbox." },
      { title: "Full attribution", text: "Know which keyword, ad or post produced every phone call and form." },
      { title: "Speed to lead", text: "Instant SMS and email alerts so your team responds within minutes, when conversion rates are highest." },
      { title: "Own your assets", text: "Ad accounts, landing pages and data belong to you. No lock-in." },
    ],
    outcomes: [
      { label: "Average cost-per-lead reduction", value: "-38%" },
      { label: "Median lead volume increase in 90 days", value: "2.4x" },
      { label: "Campaign launch time", value: "14 days" },
    ],
    idealFor: ["Home services and trades", "Law firms and accountants", "Dental, medical and wellness clinics", "B2B services and SaaS", "Real estate and mortgage", "Education and training providers"],
    faqs: [
      { question: "How quickly can lead generation campaigns start producing leads?", answer: "Paid campaigns typically produce their first leads within days of launch. Most clients see stable, optimized cost-per-lead numbers within 60 to 90 days as we gather data and refine targeting, creative and landing pages." },
      { question: "What budget do I need for lead generation in Canada?", answer: "Most small and mid-sized Canadian businesses start with CAD $1,500 to $5,000 per month in ad spend plus management. We size budgets around your target cost per lead and how many new customers you can actually handle." },
      { question: "Do you guarantee a number of leads?", answer: "No honest agency can guarantee volume before testing. What we do guarantee is full transparency: you see every lead, its source and its cost in real time, and we agree on cost-per-lead targets up front." },
      { question: "Which channels work best for lead generation?", answer: "Google Search captures high-intent buyers actively looking for your service. Meta and LinkedIn work well for building demand and retargeting. We usually start with the channel closest to purchase intent and expand from there." },
      { question: "Do I own the ad accounts and landing pages?", answer: "Yes. Everything is set up in accounts you own, and you keep every asset if you ever leave." },
      { question: "Can you integrate leads with my CRM?", answer: "Yes. We integrate with HubSpot, Salesforce, Pipedrive, GoHighLevel, Zoho, Jobber, ServiceTitan and most other platforms, or send leads via email, SMS and Slack." },
    ],
    keywords: ["lead generation services", "lead generation agency Canada", "B2B lead generation", "PPC management", "Google Ads agency", "Facebook ads agency", "landing page design"],
    related: ["google-ads", "social-media-advertising", "seo", "website-development"],
    schemaServiceType: "Lead Generation Service",
  },
  {
    slug: "seo",
    name: "SEO",
    shortName: "SEO",
    noun: "search engine optimization",
    core: true,
    tagline: "Rank on Google and get recommended by AI. Compounding organic growth.",
    metaDescription:
      "SEO services in Canada. Technical SEO, local SEO, content strategy, link building and AI search optimization from Better Businesses. Rank higher on Google and get cited by ChatGPT, Gemini and Perplexity.",
    icon: "search",
    accent: "#9A7628",
    intro: [
      "Search engine optimization (SEO) is the most cost-effective growth channel most Canadian businesses never fully use. Better Businesses delivers technical SEO, local SEO, content strategy, digital PR and link building, plus a new discipline we call AI search optimization: structuring your website and your brand so that ChatGPT, Claude, Gemini, Perplexity and Google AI Overviews cite and recommend you.",
      "We start with a deep audit of crawlability, indexation, Core Web Vitals, site architecture and search intent. Then we build a keyword and topic map for every service and every city you serve, produce content that actually answers buyer questions, and earn authoritative Canadian backlinks. Rankings compound month after month while your paid acquisition costs fall.",
    ],
    whatIsIt:
      "SEO is the practice of improving a website's visibility in organic (unpaid) search results on Google, Bing and increasingly in AI assistants. It includes technical optimization, on-page content, local signals such as Google Business Profile, and off-page authority through backlinks and brand mentions.",
    deliverables: [
      "Technical SEO audit and fixes (crawl, index, speed, Core Web Vitals)",
      "Keyword research and topical authority mapping",
      "On-page optimization and internal linking architecture",
      "Local SEO: Google Business Profile, citations, reviews strategy",
      "Content strategy, briefs and SEO copywriting",
      "Digital PR and Canadian link building",
      "AI search optimization: schema, entity SEO, llms.txt, citations",
      "Monthly ranking, traffic and lead reporting",
    ],
    process: [
      { title: "Audit", text: "A 200-point technical and content audit benchmarks your site against the top competitors in your market." },
      { title: "Strategy", text: "We map keywords to pages, define the content roadmap and prioritize the highest-impact fixes." },
      { title: "Foundations", text: "Technical fixes, schema markup, site speed and architecture are implemented first." },
      { title: "Content & authority", text: "We publish optimized pages and articles and earn links from relevant Canadian sources." },
      { title: "Compound", text: "Monthly iterations based on Search Console, rankings and revenue data keep growth accelerating." },
    ],
    benefits: [
      { title: "Lower acquisition cost", text: "Organic leads cost a fraction of paid leads once rankings are established." },
      { title: "Built for AI search", text: "Structured data and entity-rich content help AI assistants understand and recommend your business." },
      { title: "Local dominance", text: "Show up in the map pack and 'near me' searches across every city you serve." },
      { title: "Transparent reporting", text: "Dashboards show rankings, clicks, leads and revenue, not vanity metrics." },
    ],
    outcomes: [
      { label: "Average organic traffic growth in 12 months", value: "+187%" },
      { label: "Keywords ranked on page one (median client)", value: "340+" },
      { label: "Typical time to first-page rankings", value: "3-6 mo" },
    ],
    idealFor: ["Local service businesses", "Multi-location companies", "E-commerce brands", "Professional services", "Healthcare and clinics", "B2B and industrial"],
    faqs: [
      { question: "How long does SEO take to work in Canada?", answer: "Most sites see meaningful movement within 3 to 6 months and significant growth in 6 to 12 months. Competitive terms in large markets like Toronto or Vancouver can take longer, while local and long-tail keywords often move within weeks." },
      { question: "What is AI search optimization (AEO / GEO)?", answer: "It is the practice of optimizing content, structured data and brand entities so AI assistants such as ChatGPT, Claude, Gemini and Perplexity understand, trust and cite your business. It builds on classic SEO with clear factual content, FAQ schema, consistent entity data and authoritative mentions." },
      { question: "Do you do local SEO for multiple locations?", answer: "Yes. We build location and service-area pages, optimize each Google Business Profile, manage citations and reviews and structure the site so every city you serve can rank." },
      { question: "Is SEO better than Google Ads?", answer: "They work best together. Ads deliver immediate, controllable volume; SEO builds a compounding asset that lowers your blended cost per lead over time. We often start with ads for cash flow while SEO ramps up." },
      { question: "Do you follow Google's guidelines?", answer: "Strictly. We only use sustainable, white-hat methods: genuinely useful content, technical excellence and earned links. No private blog networks, no spun content." },
      { question: "How do you report SEO results?", answer: "You get a live dashboard plus a monthly report covering rankings, organic traffic, conversions and leads from organic search, with clear next actions." },
    ],
    keywords: ["SEO services Canada", "SEO agency", "local SEO", "technical SEO", "SEO company", "AI search optimization", "generative engine optimization"],
    related: ["local-seo", "website-development", "lead-generation", "branding"],
    schemaServiceType: "Search Engine Optimization",
  },
  {
    slug: "website-development",
    name: "Website Development",
    shortName: "Websites",
    noun: "website development",
    core: true,
    tagline: "Fast, beautiful, conversion-engineered websites built to rank.",
    metaDescription:
      "Website design and development in Canada. Better Businesses builds fast, SEO-ready, conversion-optimized websites on Next.js, WordPress and Shopify for Canadian businesses.",
    icon: "code",
    accent: "#1C1C1C",
    intro: [
      "Your website is your hardest-working salesperson. Better Businesses designs and develops websites that load in under a second, look stunning on every device and are engineered from the first wireframe to rank in search and convert visitors into enquiries. We build on modern stacks such as Next.js and headless CMS platforms, as well as WordPress and Shopify when they are the right fit.",
      "Every build includes UX strategy, custom design, accessible and semantic code, structured data, analytics, Core Web Vitals optimization and a content management system your team can actually use. The result is a website that is an asset for your SEO and lead generation rather than an obstacle.",
    ],
    whatIsIt:
      "Website development covers the strategy, design, engineering and launch of a business website, including UX design, front-end and back-end development, CMS integration, performance optimization, SEO foundations and ongoing maintenance.",
    deliverables: [
      "UX research, sitemap and wireframes",
      "Custom UI design aligned with your brand",
      "Next.js, WordPress, Webflow or Shopify development",
      "Headless CMS setup so you can edit content easily",
      "Core Web Vitals and page-speed optimization",
      "On-page SEO, schema markup and analytics",
      "Accessibility (WCAG 2.2 AA) and security hardening",
      "Hosting, maintenance and support plans",
    ],
    process: [
      { title: "Strategy", text: "We define goals, audiences, conversion paths and content requirements before any design." },
      { title: "Design", text: "Wireframes become high-fidelity designs with your brand system applied, reviewed with you at each step." },
      { title: "Develop", text: "Clean, fast, accessible code with a CMS your team can use. Everything is version-controlled." },
      { title: "Launch", text: "QA across devices, SEO migration checks, analytics and redirects are handled so nothing is lost." },
      { title: "Grow", text: "Post-launch we monitor performance and iterate based on real user behaviour." },
    ],
    benefits: [
      { title: "Sub-second load times", text: "Speed is a ranking factor and a conversion factor. Our builds score 95+ on Core Web Vitals." },
      { title: "SEO built in", text: "Semantic HTML, structured data, clean URLs and content architecture from day one." },
      { title: "Conversion-engineered", text: "Every page has a purpose, a clear CTA and tracked events so you can measure what works." },
      { title: "Easy to manage", text: "Update pages, blogs and projects yourself with a modern, intuitive CMS." },
    ],
    outcomes: [
      { label: "Typical PageSpeed score after launch", value: "95+" },
      { label: "Average conversion-rate lift vs. old site", value: "+64%" },
      { label: "Standard build timeline", value: "4-8 wk" },
    ],
    idealFor: ["Service businesses that need leads", "Professional firms", "E-commerce and DTC brands", "Startups and SaaS", "Franchises and multi-location groups", "Non-profits and associations"],
    faqs: [
      { question: "How much does a website cost in Canada?", answer: "A professionally designed and developed business website in Canada typically ranges from CAD $6,000 to $25,000 depending on size, features and integrations. E-commerce and custom web applications range higher. We scope every project with a fixed quote after a discovery call." },
      { question: "How long does it take to build a website?", answer: "Most business websites launch within 4 to 8 weeks. Larger e-commerce or multi-language projects can take 8 to 14 weeks. The timeline depends largely on how quickly content and feedback are provided." },
      { question: "Which platform do you recommend?", answer: "For performance, SEO and flexibility we favour Next.js with a headless CMS. WordPress remains a strong choice for content-heavy sites, Shopify for e-commerce. We recommend based on your goals, not our preferences." },
      { question: "Will my website be optimized for SEO?", answer: "Yes. Every site includes technical SEO foundations, structured data, optimized page templates, fast load times and clean URL structure. We also handle redirects and migrations to protect existing rankings." },
      { question: "Can I update the website myself?", answer: "Absolutely. You get a modern CMS with training so your team can edit pages, publish blogs and add projects without touching code." },
      { question: "Do you offer hosting and maintenance?", answer: "Yes. We offer managed hosting on fast Canadian and global edge infrastructure, security updates, backups, uptime monitoring and support plans." },
    ],
    keywords: ["website development Canada", "web design company", "web development agency", "Next.js developers", "WordPress development", "Shopify development", "custom website design"],
    related: ["ecommerce-development", "seo", "branding", "lead-generation"],
    schemaServiceType: "Web Development",
  },
  {
    slug: "branding",
    name: "Branding & Graphic Design",
    shortName: "Branding",
    noun: "branding",
    core: true,
    tagline: "Logos, identities and design systems that make you the obvious choice.",
    metaDescription:
      "Branding agency in Canada. Logo design, brand identity, brand strategy and graphic design from Better Businesses. Build a brand your customers remember and trust.",
    icon: "palette",
    accent: "#E3C97F",
    intro: [
      "A strong brand lowers your cost of acquisition, raises what customers will pay and makes every marketing dollar work harder. Better Businesses offers brand strategy, logo design, full visual identity systems and ongoing graphic design for Canadian businesses that want to look as good as they are.",
      "Our branding process moves from positioning and messaging to logo, colour, typography and imagery, and then into the tangible assets your business needs: business cards, signage, vehicle wraps, presentations, social templates, packaging and brand guidelines. Everything is delivered in production-ready files with clear usage rules.",
    ],
    whatIsIt:
      "Branding is the strategic process of defining how a business is perceived: its positioning, name, messaging, logo, colours, typography and visual style. Graphic design turns that identity into marketing materials, digital assets and print collateral.",
    deliverables: [
      "Brand strategy: positioning, audience, messaging and voice",
      "Logo design with multiple concepts and refinements",
      "Colour palette, typography and visual language",
      "Brand guidelines document",
      "Business cards, letterhead, signage and print collateral",
      "Social media templates and ad creative",
      "Pitch decks, brochures and sales collateral",
      "Packaging and merchandise design",
    ],
    process: [
      { title: "Discovery", text: "Workshops uncover your story, audience, competitors and the perception you want to own." },
      { title: "Strategy", text: "We define positioning, messaging pillars and a creative direction before design begins." },
      { title: "Identity design", text: "Logo concepts, colour systems and typography are explored, refined and finalized." },
      { title: "Application", text: "The identity is rolled out across print, digital, signage and social assets." },
      { title: "Guidelines", text: "A clear brand book ensures consistency across your team and partners." },
    ],
    benefits: [
      { title: "Stand out in your market", text: "Differentiated positioning and design that customers notice and remember." },
      { title: "Consistency everywhere", text: "Templates and guidelines keep your brand sharp across every channel." },
      { title: "Premium perception", text: "Professional design lets you charge what you are worth." },
      { title: "Ownership", text: "You receive all source files and full rights to your brand assets." },
    ],
    outcomes: [
      { label: "Logo concepts presented", value: "3-5" },
      { label: "Typical brand identity timeline", value: "3-5 wk" },
      { label: "Deliverable file formats", value: "SVG, PDF, PNG, AI" },
    ],
    idealFor: ["New businesses and startups", "Established companies rebranding", "Franchises", "Professional practices", "Consumer products", "Real estate and construction"],
    faqs: [
      { question: "How much does logo design and branding cost in Canada?", answer: "Professional logo design in Canada typically ranges from CAD $1,500 to $5,000. A complete brand identity with strategy, guidelines and collateral generally ranges from CAD $5,000 to $20,000 depending on scope." },
      { question: "How many logo concepts will I see?", answer: "We present three to five distinct concepts grounded in strategy, then refine your preferred direction through multiple rounds until it is right." },
      { question: "Do I get the source files?", answer: "Yes. You receive vector files (SVG, AI, EPS), PDFs, PNGs in every colour variation plus a brand guidelines document, and you hold full rights." },
      { question: "Can you refresh my existing brand instead of starting over?", answer: "Yes. A brand refresh modernizes your existing logo and identity while preserving recognition and equity you have already built." },
      { question: "Do you do ongoing graphic design?", answer: "Yes. Many clients retain us for monthly design support covering social media, ads, brochures, presentations and campaign creative." },
      { question: "How does branding help SEO and lead generation?", answer: "Recognizable brands earn more clicks in search results, higher conversion rates on landing pages and more branded searches, which are strong trust signals for Google and AI models." },
    ],
    keywords: ["branding agency Canada", "logo design", "brand identity design", "graphic design services", "brand strategy", "rebranding"],
    related: ["logo-design", "graphic-design", "website-development", "seo"],
    schemaServiceType: "Brand Design",
  },

  // ---------------- Sub-services ----------------
  {
    slug: "google-ads",
    name: "Google Ads Management",
    shortName: "Google Ads",
    noun: "Google Ads management",
    parent: "lead-generation",
    core: false,
    tagline: "Capture buyers at the exact moment they search for you.",
    metaDescription:
      "Google Ads management in Canada. Certified PPC specialists at Better Businesses build and optimize Search, Performance Max and Local Services campaigns that lower cost per lead.",
    icon: "megaphone",
    accent: "#C19A3E",
    intro: [
      "Google Ads puts your business in front of Canadians at the exact moment they search for what you sell. Better Businesses plans, builds and manages Search, Performance Max, Display, YouTube and Local Services Ads campaigns with one goal: profitable, qualified leads at the lowest sustainable cost.",
      "We obsess over the details that separate profitable accounts from expensive ones: tight keyword and negative-keyword structure, intent-matched ad copy, dedicated landing pages, conversion tracking that counts real leads, and bidding strategies aligned to your margins.",
    ],
    whatIsIt:
      "Google Ads management is the ongoing planning, creation, monitoring and optimization of paid advertising campaigns on Google Search, Display, YouTube, Shopping and Maps, with the goal of driving conversions at a target cost.",
    deliverables: ["Account and competitor audit", "Campaign architecture and keyword strategy", "Ad copy, extensions and creative", "Landing page design and CRO", "Conversion and call tracking setup", "Bid strategy and budget management", "Negative keyword and placement hygiene", "Transparent weekly reporting"],
    process: [
      { title: "Audit", text: "We review existing accounts or research the market to size opportunity and cost per click." },
      { title: "Structure", text: "Campaigns are built around intent clusters with clean tracking." },
      { title: "Launch", text: "Controlled launch with conservative bids and daily checks." },
      { title: "Optimize", text: "Weekly search-term reviews, bid and creative tests drive cost per lead down." },
      { title: "Scale", text: "Budgets grow only where returns are proven." },
    ],
    benefits: [
      { title: "Immediate visibility", text: "Be on page one for high-intent searches from day one." },
      { title: "Precise control", text: "Target by keyword, city, device, time and audience." },
      { title: "Measurable ROI", text: "Every dollar traced to leads and revenue." },
      { title: "No wasted spend", text: "Aggressive negative keywords and placement exclusions." },
    ],
    outcomes: [{ label: "Average wasted spend eliminated in audits", value: "22%" }, { label: "Typical CPL improvement within 90 days", value: "-35%" }, { label: "Certification", value: "Google Partner" }],
    idealFor: ["Trades and home services", "Legal and financial services", "Clinics and healthcare", "B2B services", "E-commerce", "Local retail"],
    faqs: [
      { question: "What is the minimum Google Ads budget?", answer: "We recommend at least CAD $1,500 per month in ad spend for local campaigns so the algorithm has enough conversion data to optimize. Competitive industries in major cities often require more." },
      { question: "Do you charge a percentage of ad spend?", answer: "We offer flat monthly management fees for most clients so our incentives stay aligned with performance, not spend." },
      { question: "How is Google Ads different from SEO?", answer: "Google Ads delivers instant, paid visibility you control by budget. SEO builds unpaid rankings over time. Together they capture the most search demand." },
    ],
    keywords: ["Google Ads management Canada", "PPC agency", "Google Ads agency", "pay per click management"],
    related: ["lead-generation", "social-media-advertising", "seo"],
    schemaServiceType: "Pay-Per-Click Advertising",
  },
  {
    slug: "social-media-advertising",
    name: "Social Media Advertising",
    shortName: "Social Ads",
    noun: "social media advertising",
    parent: "lead-generation",
    core: false,
    tagline: "Meta, Instagram, LinkedIn and TikTok campaigns that turn attention into leads.",
    metaDescription:
      "Social media advertising agency in Canada. Better Businesses runs Facebook, Instagram, LinkedIn and TikTok ad campaigns engineered for leads and sales, not likes.",
    icon: "share",
    accent: "#9A7628",
    intro: [
      "Paid social lets you reach the right Canadians before they ever search. Better Businesses builds Meta (Facebook and Instagram), LinkedIn and TikTok campaigns with scroll-stopping creative, precise audiences and lead-capture flows that feed your CRM directly.",
      "We manage creative production, audience testing, retargeting and reporting so you know exactly what each lead and sale cost, and where to invest next.",
    ],
    whatIsIt:
      "Social media advertising is paid promotion on platforms such as Facebook, Instagram, LinkedIn and TikTok, using demographic, interest and behavioural targeting to generate awareness, leads and sales.",
    deliverables: ["Audience research and strategy", "Ad creative: static, video and carousel", "Lead forms and landing pages", "Pixel, Conversions API and CRM setup", "Retargeting funnels", "Creative testing framework", "Monthly reporting and insights"],
    process: [
      { title: "Plan", text: "Offer, audience and creative angles are defined." },
      { title: "Produce", text: "We design and write ad creative built for each platform." },
      { title: "Launch", text: "Campaigns go live with structured tests." },
      { title: "Iterate", text: "Creative and audience winners scale; losers are cut fast." },
      { title: "Report", text: "Clear cost-per-lead and ROAS reporting." },
    ],
    benefits: [
      { title: "Reach beyond search", text: "Create demand with people who do not yet know they need you." },
      { title: "Creative that converts", text: "Design and copy tested for each platform." },
      { title: "Lower cost per lead", text: "Instant forms and retargeting keep acquisition efficient." },
      { title: "Brand lift", text: "Consistent presence builds recognition that lifts every other channel." },
    ],
    outcomes: [{ label: "Creative variations tested per month", value: "12+" }, { label: "Typical retargeting ROAS", value: "4-8x" }, { label: "Platforms managed", value: "5" }],
    idealFor: ["Consumer brands", "Clinics and wellness", "Real estate", "Events and education", "B2B via LinkedIn", "Local services"],
    faqs: [
      { question: "Which social platform is best for my business?", answer: "Meta suits most B2C and local services; LinkedIn excels for B2B; TikTok and Instagram Reels work for younger audiences and visual products. We recommend based on where your buyers actually are." },
      { question: "Do you create the ad videos and images?", answer: "Yes. Our design team produces static, carousel and short-form video creative, and we can direct user-generated content when needed." },
      { question: "How do you track social media leads?", answer: "Through Meta Pixel and Conversions API, LinkedIn Insight Tag, UTM parameters and direct CRM integration so every lead is attributed." },
    ],
    keywords: ["social media advertising Canada", "Facebook ads agency", "Instagram ads", "LinkedIn ads agency", "TikTok ads"],
    related: ["lead-generation", "google-ads", "branding"],
    schemaServiceType: "Social Media Advertising",
  },
  {
    slug: "local-seo",
    name: "Local SEO",
    shortName: "Local SEO",
    noun: "local SEO",
    parent: "seo",
    core: false,
    tagline: "Own the map pack and every 'near me' search in your service area.",
    metaDescription:
      "Local SEO services in Canada. Google Business Profile optimization, citations, reviews and location pages from Better Businesses to rank in the map pack across your service area.",
    icon: "map-pin",
    accent: "#C19A3E",
    intro: [
      "When a Canadian searches for a plumber, dentist, lawyer or contractor, Google shows a map with three businesses. Local SEO gets you into that map pack and keeps you there. Better Businesses optimizes your Google Business Profile, builds consistent citations, grows and manages reviews and creates location pages that rank across every city you serve.",
      "Local SEO is also one of the strongest signals for AI assistants: consistent name, address and phone data, verified reviews and clear service-area content help ChatGPT, Gemini and Google recommend you when someone asks for 'the best X near me'.",
    ],
    whatIsIt:
      "Local SEO is the optimization of a business's online presence to appear in location-based searches, including the Google Maps 'local pack', localized organic results and voice or AI assistant recommendations.",
    deliverables: ["Google Business Profile optimization", "Citation building and NAP cleanup", "Review generation and response strategy", "Location and service-area pages", "Local schema markup", "Local link building and sponsorships", "Rank tracking by city and neighbourhood"],
    process: [
      { title: "Audit", text: "Profile, citations, reviews and competitor visibility are benchmarked." },
      { title: "Fix", text: "Data consistency, categories and profile completeness are corrected." },
      { title: "Build", text: "Location pages and local content are created." },
      { title: "Grow", text: "Reviews and local links accumulate." },
      { title: "Track", text: "Map pack rankings are monitored by area." },
    ],
    benefits: [
      { title: "Map pack visibility", text: "Appear in the three-pack for your key services." },
      { title: "More calls and directions", text: "Local searchers act fast; be there when they do." },
      { title: "Multi-city reach", text: "Rank in every suburb and town you serve, not just your address." },
      { title: "AI-ready entity data", text: "Consistent information helps AI assistants recommend you." },
    ],
    outcomes: [{ label: "Average increase in Google Business Profile calls", value: "+92%" }, { label: "Citations built per campaign", value: "60+" }, { label: "Time to map pack movement", value: "4-8 wk" }],
    idealFor: ["Home services", "Medical and dental", "Legal", "Restaurants and retail", "Auto services", "Fitness and wellness"],
    faqs: [
      { question: "How do I rank in the Google map pack?", answer: "Rankings depend on relevance (categories, services, content), distance and prominence (reviews, citations, links). We optimize all three and create content for each area you serve." },
      { question: "Can I rank in cities where I do not have an office?", answer: "Yes, in organic results through well-built service-area pages. Map pack rankings favour proximity, so multiple verified locations help there." },
      { question: "How important are Google reviews?", answer: "Very. Review quantity, velocity, rating and keyword content influence rankings and conversion. We set up systems to earn reviews consistently." },
    ],
    keywords: ["local SEO Canada", "Google Business Profile optimization", "map pack SEO", "local SEO services"],
    related: ["seo", "website-development", "lead-generation"],
    schemaServiceType: "Local Search Engine Optimization",
  },
  {
    slug: "ecommerce-development",
    name: "E-commerce Development",
    shortName: "E-commerce",
    noun: "e-commerce development",
    parent: "website-development",
    core: false,
    tagline: "Online stores that load fast, rank high and sell more.",
    metaDescription:
      "E-commerce website development in Canada. Shopify, headless and custom online stores from Better Businesses with conversion optimization, SEO and payment integration.",
    icon: "shopping-bag",
    accent: "#1C1C1C",
    intro: [
      "Better Businesses builds e-commerce stores that convert. From Shopify and Shopify Plus to headless commerce on Next.js, we design shopping experiences that are fast, trustworthy and optimized for Canadian buyers, including bilingual support, Canadian tax and shipping rules and local payment methods.",
      "We combine UX design, product-page optimization, technical SEO for collections and product data, and analytics so you can see exactly what drives revenue.",
    ],
    whatIsIt:
      "E-commerce development is the design and build of online stores, including product catalogues, checkout, payments, shipping, tax, inventory integrations and the marketing and SEO infrastructure that drives sales.",
    deliverables: ["Shopify, Shopify Plus or headless store build", "Custom theme and UX design", "Product and collection SEO", "Payment, tax and shipping configuration", "ERP, POS and inventory integrations", "Conversion-rate optimization", "Email and retention flows", "Analytics and revenue tracking"],
    process: [
      { title: "Discovery", text: "Catalogue, operations and growth goals are mapped." },
      { title: "Design", text: "Mobile-first store design focused on trust and speed." },
      { title: "Build", text: "Theme development, integrations and data migration." },
      { title: "Launch", text: "QA, SEO redirects and tracking verification." },
      { title: "Optimize", text: "Ongoing CRO and merchandising improvements." },
    ],
    benefits: [
      { title: "Higher conversion", text: "Frictionless checkout and persuasive product pages." },
      { title: "Search visibility", text: "Structured product data and fast pages rank and appear in Shopping." },
      { title: "Canadian-ready", text: "GST/HST/PST, Canada Post, Interac and bilingual support." },
      { title: "Scalable", text: "Architecture that grows with your catalogue and traffic." },
    ],
    outcomes: [{ label: "Average conversion-rate lift", value: "+41%" }, { label: "Typical store launch", value: "6-10 wk" }, { label: "Platforms", value: "Shopify / Headless" }],
    idealFor: ["DTC brands", "Retailers going online", "Wholesale and B2B commerce", "Subscription businesses", "Food and beverage", "Fashion and beauty"],
    faqs: [
      { question: "Shopify or custom e-commerce?", answer: "Shopify fits most Canadian merchants with excellent reliability and apps. Headless or custom builds suit complex catalogues, unique experiences or heavy integrations. We advise based on your roadmap." },
      { question: "Can you migrate my existing store?", answer: "Yes. We migrate products, customers, orders and SEO redirects from WooCommerce, Magento, Squarespace, Wix and other platforms." },
      { question: "Do you support French and English stores?", answer: "Yes. We build fully bilingual storefronts with localized SEO for Quebec and the rest of Canada." },
    ],
    keywords: ["e-commerce development Canada", "Shopify developers", "online store design", "headless commerce"],
    related: ["website-development", "seo", "google-ads"],
    schemaServiceType: "E-commerce Development",
  },
  {
    slug: "logo-design",
    name: "Logo Design",
    shortName: "Logo Design",
    noun: "logo design",
    parent: "branding",
    core: false,
    tagline: "A mark your customers recognize in a heartbeat.",
    metaDescription:
      "Professional logo design in Canada. Better Businesses creates timeless, strategic logos with full vector files, colour variations and usage guidelines.",
    icon: "pen-tool",
    accent: "#E3C97F",
    intro: [
      "A logo is the most visible expression of your brand. Better Businesses designs logos that are strategic, timeless and versatile: they work on a storefront sign, a phone screen, an invoice and an Instagram avatar. Every logo begins with research into your market and audience, so the final mark communicates the right idea instantly.",
      "You receive a complete logo system: primary logo, secondary marks, icon, colour and monochrome versions, in every format your printers and developers will ever ask for, plus simple usage guidelines.",
    ],
    whatIsIt:
      "Logo design is the creation of a distinctive visual mark that identifies a business, typically comprising a wordmark, symbol or combination mark along with defined colours, spacing and usage rules.",
    deliverables: ["Discovery and competitive research", "3 to 5 concept directions", "Refinement rounds", "Primary, secondary and icon marks", "Colour, reversed and monochrome versions", "Vector and raster files (SVG, AI, EPS, PDF, PNG)", "Logo usage guidelines"],
    process: [
      { title: "Brief", text: "We learn your story, audience and competitors." },
      { title: "Concepts", text: "Distinct directions are sketched and presented with rationale." },
      { title: "Refine", text: "Your chosen direction is perfected." },
      { title: "System", text: "Variations and files are produced." },
      { title: "Deliver", text: "Files and guidelines handed over with full rights." },
    ],
    benefits: [
      { title: "Timeless design", text: "Built to last decades, not follow trends." },
      { title: "Versatile", text: "Scales from favicon to billboard." },
      { title: "Strategic", text: "Grounded in positioning, not personal taste." },
      { title: "Complete files", text: "Everything your team and vendors need." },
    ],
    outcomes: [{ label: "Concept directions", value: "3-5" }, { label: "Typical timeline", value: "2-3 wk" }, { label: "Revision rounds included", value: "3" }],
    idealFor: ["Startups", "Trades and contractors", "Professional practices", "Restaurants", "Real estate teams", "Product brands"],
    faqs: [
      { question: "How much does a logo cost in Canada?", answer: "Professional logo design from an agency typically costs CAD $1,500 to $5,000 depending on research depth, number of concepts and the size of the deliverable system." },
      { question: "Will I own the logo?", answer: "Yes. Full rights and all source files transfer to you upon final payment." },
      { question: "Can you trademark my logo?", answer: "We design with distinctiveness in mind and can coordinate with a trademark agent for registration with CIPO." },
    ],
    keywords: ["logo design Canada", "logo designer", "professional logo design", "custom logo"],
    related: ["branding", "graphic-design", "website-development"],
    schemaServiceType: "Logo Design",
  },
  {
    slug: "graphic-design",
    name: "Graphic Design",
    shortName: "Graphic Design",
    noun: "graphic design",
    parent: "branding",
    core: false,
    tagline: "Print, digital and social design that stays perfectly on-brand.",
    metaDescription:
      "Graphic design services in Canada. Brochures, social media graphics, ads, presentations, signage and packaging from Better Businesses' in-house design team.",
    icon: "layers",
    accent: "#C19A3E",
    intro: [
      "Great design compounds. Better Businesses provides ongoing graphic design for Canadian businesses that need consistently excellent creative without hiring a full-time team: social media graphics, digital ads, brochures, flyers, presentations, trade show displays, signage, vehicle wraps, packaging and more.",
      "Choose project-based design or a monthly design retainer with fast turnaround. Every asset follows your brand guidelines so your marketing looks unified across every channel.",
    ],
    whatIsIt:
      "Graphic design is the creation of visual content for communication and marketing, spanning print materials, digital graphics, advertising creative, presentations and environmental design such as signage.",
    deliverables: ["Social media graphics and templates", "Digital and print advertising creative", "Brochures, flyers and catalogues", "Pitch decks and presentations", "Trade show and signage design", "Vehicle wraps and environmental graphics", "Packaging and labels", "Email newsletter design"],
    process: [
      { title: "Request", text: "Submit briefs through a simple portal." },
      { title: "Design", text: "Our team designs to your guidelines." },
      { title: "Review", text: "Fast feedback rounds." },
      { title: "Deliver", text: "Print-ready and web-ready files." },
      { title: "Repeat", text: "Retainers keep a steady flow of creative." },
    ],
    benefits: [
      { title: "Consistent brand", text: "Every piece matches your identity." },
      { title: "Fast turnaround", text: "Most requests delivered in 2 to 3 business days." },
      { title: "Cost effective", text: "Senior design without full-time overhead." },
      { title: "Print expertise", text: "Correct specs for Canadian printers every time." },
    ],
    outcomes: [{ label: "Typical turnaround", value: "48-72 h" }, { label: "Retainer plans from", value: "10 h/mo" }, { label: "Formats delivered", value: "Print + Web" }],
    idealFor: ["Marketing teams", "Franchises", "Retail and hospitality", "Real estate", "Events", "Non-profits"],
    faqs: [
      { question: "Do you offer monthly graphic design retainers?", answer: "Yes. Retainers start at 10 hours per month with priority turnaround and roll-over flexibility." },
      { question: "Can you work with my existing brand guidelines?", answer: "Absolutely. We follow your guidelines precisely, and can help formalize them if they are incomplete." },
      { question: "Do you handle printing?", answer: "We prepare print-ready files and can coordinate with trusted Canadian print partners on your behalf." },
    ],
    keywords: ["graphic design services Canada", "graphic designer", "social media graphics", "brochure design"],
    related: ["branding", "logo-design", "social-media-advertising"],
    schemaServiceType: "Graphic Design",
  },
];

export const coreServices = services.filter((s) => s.core);
export const subServices = services.filter((s) => !s.core);
export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const getSubServices = (parentSlug: string) => services.filter((s) => s.parent === parentSlug);
export const getParent = (s: Service) => (s.parent ? getService(s.parent) : undefined);
