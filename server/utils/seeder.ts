import { ArticleModel, IArticle } from '../models/Article';

const SEEDED_ARTICLES: Omit<IArticle, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'The Rise of Agentic AI: How Autonomous Assistants are Redefining Productivity',
    content: 'Autonomous AI agents are transforming from simple chat interfaces into intelligent systems capable of planning, executing multi-step workflows, and integrating with enterprise software. Unlike static LLMs, agentic workflows use iterative feedback loops, tool calling, and self-reflection to achieve goals autonomously. Companies are already deploying these agents to automate software engineering, complex customer support, and financial analysis, leading to a massive boost in operational efficiency.',
    summary: 'Autonomous AI agents are evolving from static conversational interfaces into proactive assistants that can plan and execute complex, multi-step tasks across enterprise integrations, dramatically boosting efficiency.',
    keyTakeaways: [
      'Agentic AI shifts from human-driven prompts to goal-directed execution.',
      'Core components include planning, memory, and native tool-use integration.',
      'Industries like engineering and finance are seeing early high-impact adoption.'
    ],
    importantFacts: [
      'Gartner predicts 40% of mobile apps will have embedded AI agents by 2027.',
      'Agentic workflows have shown up to a 5x improvement in task completion rates compared to single-prompt systems.'
    ],
    simplifiedContent: 'AI is getting smarter. Instead of just answering questions, AI agents can now act like digital employees—managing calendars, writing code, and handling emails without needing constant human guidance.',
    author: 'Elena Rostova',
    source: 'AI Horizons',
    date: '2026-07-05',
    readTime: 5,
    category: 'AI',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    viewsCount: 342,
    isFeatured: true,
    isBreaking: false,
    isAIPick: true
  },
  {
    title: 'Transformers vs. State Space Models: The Battle for the Next Gen AI Architecture',
    content: 'While Transformer architectures like GPT-4 continue to dominate, State Space Models (SSMs) like Mamba are gaining serious momentum. Transformers suffer from quadratic computational complexity as context windows grow, making long-context processing highly expensive. SSMs offer linear scaling, allowing them to process millions of tokens with far less compute power. Researchers are investigating hybrid models that combine the expressive power of Transformers with the efficiency of Mamba.',
    summary: 'State Space Models (SSMs) like Mamba are challenging Transformers by offering linear computational scaling, enabling massive context windows with significantly lower resource requirements.',
    keyTakeaways: [
      'Transformers suffer from O(N^2) complexity with respect to context length.',
      'SSMs scale linearly O(N), representing a breakthrough for running local models on smaller hardware.',
      'Hybrid architectures are the current frontier in advanced foundational modeling.'
    ],
    importantFacts: [
      'Mamba can process sequences up to 1 million tokens 10x faster than traditional Transformers on consumer GPUs.'
    ],
    simplifiedContent: 'Most AI today uses a method that gets very slow and expensive when reading long books. A new method called Mamba is super fast and cheap, allowing AI to read massive amounts of text in seconds.',
    author: 'Marcus Chen',
    source: 'Deep Neural Review',
    date: '2026-07-06',
    readTime: 6,
    category: 'Machine Learning',
    imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80',
    viewsCount: 289,
    isFeatured: false,
    isBreaking: true,
    isAIPick: true
  },
  {
    title: 'Java 25 Released: Stream Gathering, Structured Concurrency, and Beyond',
    content: 'Oracle has officially shipped Java 25, delivering key stability updates to Project Loom and Project Amber. The highlights include Stream Gatherers graduating to a stable standard, making complex stream operations far more readable. Structured Concurrency and Scoped Values are now fully production-ready, allowing developers to write high-throughput concurrent code that is easy to debug, maintain, and profile.',
    summary: 'Java 25 brings major features to general availability, emphasizing performance optimizations in Stream Gatherers and advanced concurrent programming via Project Loom’s structured concurrency.',
    keyTakeaways: [
      'Stream Gatherers provide custom intermediate stream operations without boilerplate.',
      'Structured concurrency treats groups of related tasks as a single unit of work.',
      'Memory footprints for virtual threads have been reduced by another 15%.'
    ],
    importantFacts: [
      'Java 25 is a Long Term Support (LTS) release, ensuring support and security updates for at least 8 years.'
    ],
    simplifiedContent: 'Java, a popular language used to build big websites and apps, just got a major update that makes it faster and helps programmer write clean code that runs many tasks at once.',
    author: 'Sarah Jenkins',
    source: 'Tech JDK',
    date: '2026-07-01',
    readTime: 4,
    category: 'Java',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    viewsCount: 154,
    isFeatured: false,
    isBreaking: false,
    isAIPick: false
  },
  {
    title: 'Spring Boot 4.0: Native Compilation and Cloud-Native Defaults',
    content: 'The Spring team has announced Spring Boot 4.0, built from the ground up to leverage Java 25 and native GraalVM compilation by default. Startup times have plummeted into milliseconds, and memory consumption has been slashed, making Spring Boot highly competitive for serverless environments. With autoconfigured support for OpenTelemetry and advanced connection pooling, booting up resilient microservices has never been faster.',
    summary: 'Spring Boot 4.0 targets cloud-native environments with native GraalVM compilation, ultra-low startup latency, and out-of-the-box OpenTelemetry telemetry integrations.',
    keyTakeaways: [
      'GraalVM Native Image support is now a first-class citizen.',
      'Out of the box support for Serverless deployments like AWS Lambda and Cloud Run.',
      'OpenTelemetry observability is pre-integrated into Spring Boot Starters.'
    ],
    importantFacts: [
      'Spring Boot 4.0 native compilation yields up to a 10x faster startup and a 3x reduction in memory usage.'
    ],
    simplifiedContent: 'Spring Boot is a tool that helps developers build Java web applications easily. Version 4.0 is designed to start up instantly and use much less computer memory, saving server costs.',
    author: 'Dieter Meyer',
    source: 'Enterprise Architect',
    date: '2026-07-04',
    readTime: 5,
    category: 'Spring Boot',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    viewsCount: 198,
    isFeatured: false,
    isBreaking: false,
    isAIPick: false
  },
  {
    title: 'React 19 Server Components: A Paradigm Shift in Web Development',
    content: 'React 19 is officially here, and with it comes the maturity of React Server Components (RSC) and Actions. RSCs allow components to render on the server, drastically reducing the JavaScript bundle size shipped to clients and improving SEO and performance. Actions simplify asynchronous state management and form handling, removing the need for verbose dispatch systems. Web development will never be the same as client and server merge seamlessly.',
    summary: 'React 19 introduces React Server Components and Actions as production-standard patterns, reducing client bundles and simplifying form-based data operations.',
    keyTakeaways: [
      'RSCs run exclusively on the server, fetching data directly from local APIs or databases.',
      'The new useActionState and useFormStatus hooks reduce boilerplate state setup.',
      'Automatic asset loading and preloading headers improve Time to Interactive (TTI).'
    ],
    importantFacts: [
      'By using React Server Components, large-scale web applications have reported reducing client-side JS bundles by up to 60%.'
    ],
    simplifiedContent: 'React is a tool used to build website screens. The new update allows websites to load much faster because the heavy lifting is done on the server instead of on your phone or laptop.',
    author: 'Aria Takahashi',
    source: 'Frontend Weekly',
    date: '2026-07-03',
    readTime: 4,
    category: 'React',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    viewsCount: 420,
    isFeatured: true,
    isBreaking: false,
    isAIPick: true
  },
  {
    title: 'Node.js 26: V8 Engine Upgrade, Native TypeScript Execution, and WASM Milestones',
    content: 'Node.js 26 has hit the stable channel, bringing native TypeScript stripping as a fully production-ready feature. Developers can now run .ts files directly with Node without external compilation pipelines. The V8 engine has been updated, bringing significant performance improvements to asynchronous execution and regular expression parsing. Additionally, WebAssembly (WASM) support has been expanded to support multi-threading natively.',
    summary: 'Node.js 26 stabilizes native TypeScript support and boosts speed with the latest V8 engine, along with advanced WebAssembly multi-threading features.',
    keyTakeaways: [
      'Run TypeScript directly with node --experimental-strip-types.',
      'Significant performance improvements for high-concurrency event loops.',
      'WebAssembly threads allow high-performance operations to run in parallel in Node.'
    ],
    importantFacts: [
      'Node.js 26 delivers a 12% boost in JSON parsing and string manipulation performance over Node 24.'
    ],
    simplifiedContent: 'Node.js is what programmers use to run server code. The new version lets them run TypeScript—a clean, safe version of JavaScript—directly without needing extra setup tools.',
    author: 'Lucas Vance',
    source: 'OpenJS Insights',
    date: '2026-07-05',
    readTime: 4,
    category: 'Node.js',
    imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80',
    viewsCount: 310,
    isFeatured: false,
    isBreaking: false,
    isAIPick: false
  },
  {
    title: 'Multi-Cloud Deployments: Orchestrating Across AWS, Azure, and Google Cloud',
    content: 'Enterprise cloud strategies are rapidly shifting from single-provider structures to highly redundant multi-cloud setups. Deploying microservices across Amazon Web Services (AWS), Microsoft Azure, and Google Cloud Platform (GCP) protects against service outages and prevents vendor lock-in. Tools like HashiCorp Terraform and Kubernetes are crucial to standardizing deployments, while service meshes manage secure networking across virtual networks.',
    summary: 'Multi-cloud architectures use AWS, Azure, and Google Cloud to eliminate single points of failure, governed by Kubernetes, Terraform, and cross-cloud network meshes.',
    keyTakeaways: [
      'Avoids vendor lock-in and leverages distinct specialized cloud tools.',
      'Enables high availability and localized data compliance options.',
      'Requires standardized IAC (Infrastructure as Code) templates.'
    ],
    importantFacts: [
      'According to a 2026 Flexera report, 89% of enterprises now have a multi-cloud strategy.'
    ],
    simplifiedContent: 'Using just one company (like Amazon) to host your website is risky. If their servers go down, your business stops. Multi-cloud means spreading your website across Amazon, Microsoft, and Google so it never goes offline.',
    author: 'Jordan Sterling',
    source: 'Cloud Scale',
    date: '2026-07-02',
    readTime: 6,
    category: 'Cloud',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    viewsCount: 225,
    isFeatured: false,
    isBreaking: false,
    isAIPick: false
  },
  {
    title: 'Zero-Trust Architectures: Safeguarding the Remote Corporate Network',
    content: 'With remote and hybrid work becoming permanent, the traditional "perimeter security" model is obsolete. Cyber Security is shifting entirely to Zero-Trust, which operates on the principle of "never trust, always verify." Every user and device, whether inside or outside the company network, must be authenticated, authorized, and continuously validated before being granted access to applications and data.',
    summary: 'Zero-Trust Network Access (ZTNA) is replacing VPNs with strict identity verification, device health checks, and micro-segmentation to secure hybrid workforces.',
    keyTakeaways: [
      'Eliminates the concept of an inherently secure internal network.',
      'Requires continuous authentication, device checks, and least-privilege access.',
      'Protects against lateral movement inside a breached network.'
    ],
    importantFacts: [
      'The global Zero-Trust security market is projected to reach $60 billion by 2027, driven by cloud adoption and remote work security.'
    ],
    simplifiedContent: 'Instead of just locking the front door of an office building, Zero-Trust security puts a fingerprint scanner on every single door inside the building. Everyone has to prove who they are, every single time.',
    author: 'Sarah Jenkins',
    source: 'SecOps Journal',
    date: '2026-07-06',
    readTime: 5,
    category: 'Cyber Security',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    viewsCount: 254,
    isFeatured: false,
    isBreaking: false,
    isAIPick: false
  },
  {
    title: 'The Open Source Sustainability Crisis: Balancing Funding and Community Contributions',
    content: 'Open Source software powers the global economy, yet many of the most critical libraries are maintained by unpaid volunteers. The sustainability crisis has reached a boiling point as multi-billion dollar tech companies use open source code without returning financial support or code contributions. Communities are exploring new license models, dual licensing, and decentralized funding platforms like Open Collective to support maintainers.',
    summary: 'Essential digital infrastructure depends heavily on underfunded open source maintainers, triggering a search for sustainable funding and corporate stewardship models.',
    keyTakeaways: [
      'Most internet infrastructure relies on code maintained by fewer than five people.',
      'Corporations are coming under pressure to contribute funds and engineering time.',
      'New legal licenses seek to restrict cloud hyperscalers from re-selling open software.'
    ],
    importantFacts: [
      'Over 90% of modern software projects include open-source packages, but less than 3% of corporate users actively fund them.'
    ],
    simplifiedContent: 'The entire internet is built on free code made by volunteers. Because big companies use it without paying, the programmers who make this free software are burned out, creating a security risk for everyone.',
    author: 'Alex Riverstone',
    source: 'OSS Community',
    date: '2026-07-03',
    readTime: 5,
    category: 'Open Source',
    imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=800&q=80',
    viewsCount: 178,
    isFeatured: false,
    isBreaking: false,
    isAIPick: false
  },
  {
    title: 'The Next Generation of Space Tech: Reusable Rockets and Asteroid Mining',
    content: 'The commercial space sector is entering a golden age. Reusable rocket technology has brought launch costs down to historic lows, opening the door for private space stations, orbital manufacturing, and deep-space exploration. Startups are focusing on asteroid mining, eyeing space rocks rich in rare metals like platinum and gold, which could trigger the first trillion-dollar space economy.',
    summary: 'Plunging launch costs driven by reusable heavy rockets are paving the way for private space habitats, commercial manufacturing, and space resource exploration.',
    keyTakeaways: [
      'Reusable rocket boosters reduce launch costs by up to 90%.',
      'Startups are preparing spacecraft to map mineral-rich asteroids.',
      'Orbital factories could soon manufacture materials impossible to produce in Earth’s gravity.'
    ],
    importantFacts: [
      'The space economy is predicted to expand from $350 billion in 2020 to more than $1.1 trillion by 2040.'
    ],
    simplifiedContent: 'Rockets that can land back on Earth and be used again have made space travel super cheap. Startups are now building spaceships to mine gold and platinum from space rocks.',
    author: 'Dr. Neil Sterling',
    source: 'Cosmos & Tech',
    date: '2026-07-06',
    readTime: 5,
    category: 'Space',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    viewsCount: 395,
    isFeatured: false,
    isBreaking: true,
    isAIPick: true
  }
];

import { generateArticlesBatch } from '../services/gemini';

const CATEGORIES = [
  'AI', 'Machine Learning', 'Java', 'Spring Boot', 'React', 'Node.js',
  'Cloud', 'AWS', 'Azure', 'Google Cloud', 'Cyber Security', 'Programming',
  'Open Source', 'Startups', 'Space', 'Business', 'Current Affairs'
];

export async function seedArticles() {
  try {
    // 1. Seed initial core articles if database is completely empty
    const currentCount = await ArticleModel.countDocuments();
    if (currentCount === 0) {
      console.log('Seeding initial news articles into the database...');
      for (const article of SEEDED_ARTICLES) {
        await ArticleModel.create(article);
      }
      console.log('Successfully seeded core articles!');
    }

    // 2. Ensure every category has at least 2 articles
    console.log('[SEEDER] Checking category article coverage...');
    for (const category of CATEGORIES) {
      const count = await ArticleModel.countDocuments({
        category: { $regex: new RegExp('^' + category + '$', 'i') }
      });

      if (count === 0) {
        console.log(`[SEEDER] "${category}" has 0 articles. Auto-generating news...`);
        const generated = await generateArticlesBatch(category, 2);
        for (const art of generated) {
          await ArticleModel.create(art);
        }
      }
    }
    console.log('[SEEDER] All categories populated successfully.');
  } catch (err) {
    console.error('Error seeding database:', err);
  }
}
