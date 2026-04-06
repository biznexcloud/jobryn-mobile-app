// ─── Centralized Mock / Demo Data ──────────────────────────────────────────────
// Used as fallbacks whenever API calls return empty results during development
// or when the backend is not reachable.
// ────────────────────────────────────────────────────────────────────────────────

// ── Jobs ─────────────────────────────────────────────────────────────────────
export const MOCK_JOBS = [
  {
    id: 1,
    title: 'Senior Product Designer',
    company_name: 'Netflix',
    location: 'Remote',
    job_type: 'full_time',
    salary_min: '140k',
    salary_max: '180k',
    company_logo: 'https://logo.clearbit.com/netflix.com',
    featured_image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
    description: 'We are looking for a creative visionary to join our design team. You will be responsible for defining the user experience for millions of subscribers.',
    experience_level: 'senior',
    payment_type: 'fixed',
    is_remote: true,
    is_onsite: false,
    currency: 'USD',
    requirements: '5+ years of product design experience, Figma, Design systems.',
    benefits: 'Health, Dental, Vision, 401k, Unlimited PTO',
    application_deadline: null,
    company: 101,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Backend Engineer (Go)',
    company_name: 'Airbnb',
    location: 'San Francisco, CA',
    job_type: 'full_time',
    salary_min: '160k',
    salary_max: '210k',
    company_logo: 'https://logo.clearbit.com/airbnb.com',
    featured_image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    description: 'Join our infrastructure team to build highly scalable services. Experience with Go, Kubernetes, and distributed systems is a must.',
    experience_level: 'mid',
    payment_type: 'payroll',
    is_remote: false,
    is_onsite: true,
    currency: 'USD',
    requirements: '3+ years Go experience, Kubernetes, Docker, AWS.',
    benefits: 'Equity, Comprehensive health plan, Commuter benefits',
    application_deadline: null,
    company: 102,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    title: 'UX Researcher',
    company_name: 'Spotify',
    location: 'Stockholm (Hybrid)',
    job_type: 'full_time',
    salary_min: '90k',
    salary_max: '120k',
    company_logo: 'https://logo.clearbit.com/spotify.com',
    featured_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    description: 'Help us understand our users better. You will conduct user interviews, usability tests, and synthesize qualitative and quantitative data.',
    experience_level: 'mid',
    payment_type: 'payroll',
    is_remote: false,
    is_onsite: true,
    currency: 'EUR',
    requirements: '3+ years UX research, Dovetail, Qualtrics.',
    benefits: 'Spotify Premium, Flex work, Annual retreat',
    application_deadline: null,
    company: 103,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 4,
    title: 'Mobile Developer (RN)',
    company_name: 'Discord',
    location: 'Remote',
    job_type: 'contract',
    salary_min: '80',
    salary_max: '120',
    company_logo: 'https://logo.clearbit.com/discord.com',
    featured_image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
    description: 'Build the future of communication. We need a React Native expert to help us polish our mobile experience.',
    experience_level: 'senior',
    payment_type: 'fixed',
    is_remote: true,
    is_onsite: false,
    currency: 'USD',
    requirements: 'React Native, TypeScript, Expo, Redux.',
    benefits: 'Flexible hours, Remote, Competitive hourly rate',
    application_deadline: null,
    company: 104,
    created_at: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: 5,
    title: 'Frontend Lead',
    company_name: 'Stripe',
    location: 'New York, NY',
    job_type: 'full_time',
    salary_min: '170k',
    salary_max: '230k',
    company_logo: 'https://logo.clearbit.com/stripe.com',
    featured_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    description: 'Set the technical direction for our frontend infrastructure. You will mentor engineers and drive the adoption of modern web standards.',
    experience_level: 'lead',
    payment_type: 'payroll',
    is_remote: false,
    is_onsite: true,
    currency: 'USD',
    requirements: 'React, TypeScript, Web Performance, 7+ years.',
    benefits: 'Equity, 6-month parental leave, Learning budget',
    application_deadline: null,
    company: 105,
    created_at: new Date(Date.now() - 432000000).toISOString(),
  },
  {
    id: 6,
    title: 'DevOps Engineer',
    company_name: 'GitHub',
    location: 'Remote',
    job_type: 'full_time',
    salary_min: '130k',
    salary_max: '160k',
    company_logo: 'https://logo.clearbit.com/github.com',
    featured_image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
    description: 'Optimize our developer workflows and maintain our global infrastructure. Experience with CI/CD and cloud-native solutions required.',
    experience_level: 'mid',
    payment_type: 'payroll',
    is_remote: true,
    is_onsite: false,
    currency: 'USD',
    requirements: 'GitHub Actions, Terraform, Azure, Prometheus.',
    benefits: 'Remote-first, Full equipment budget, Wellness stipend',
    application_deadline: null,
    company: 106,
    created_at: new Date(Date.now() - 518400000).toISOString(),
  },
  {
    id: 7,
    title: 'Data Scientist',
    company_name: 'OpenAI',
    location: 'San Francisco, CA',
    job_type: 'full_time',
    salary_min: '200k',
    salary_max: '280k',
    company_logo: 'https://logo.clearbit.com/openai.com',
    featured_image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
    description: 'Help shape the future of AI. You will work on cutting-edge ML models and research to advance the state of artificial intelligence.',
    experience_level: 'senior',
    payment_type: 'payroll',
    is_remote: false,
    is_onsite: true,
    currency: 'USD',
    requirements: 'Python, PyTorch, NLP, Deep Learning research publications preferred.',
    benefits: 'Equity, Top-of-market salary, Housing stipend',
    application_deadline: null,
    company: 107,
    created_at: new Date(Date.now() - 604800000).toISOString(),
  },
  {
    id: 8,
    title: 'Product Manager',
    company_name: 'Figma',
    location: 'Remote (US)',
    job_type: 'full_time',
    salary_min: '150k',
    salary_max: '200k',
    company_logo: 'https://logo.clearbit.com/figma.com',
    featured_image: 'https://images.unsplash.com/photo-1497366754035-f200581a2be9?w=800&q=80',
    description: 'Define and drive the product strategy for Figma\'s collaborative design platform. Own the roadmap from conception to launch.',
    experience_level: 'senior',
    payment_type: 'payroll',
    is_remote: true,
    is_onsite: false,
    currency: 'USD',
    requirements: '5+ years PM experience, Design background a plus, Data-driven.',
    benefits: 'Remote, Design credits, Annual offsite, Equity',
    application_deadline: null,
    company: 108,
    created_at: new Date(Date.now() - 691200000).toISOString(),
  },
];

// ── Social Feed Posts ──────────────────────────────────────────────────────────
export const MOCK_FEED_POSTS = [
  {
    id: 'post_1',
    content: '🚀 Excited to share that I just got promoted to Senior Engineer! Grateful for an amazing team and all the learning opportunities at Stripe. The journey is just getting started. #career #growth',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    likes_count: 312,
    comments_count: 48,
    shares_count: 17,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    user: {
      id: 'u1',
      name: 'Aisha Morales',
      avatar: 'https://i.pravatar.cc/150?u=aisha',
      role: 'Senior Engineer @ Stripe',
    },
  },
  {
    id: 'post_2',
    content: '📊 Hot take: Most "senior" developers are not senior by skill — they\'re senior by tenure. True seniority is measured in: systems thinking, communication, mentorship, and knowing when NOT to code.\n\nAgree or disagree? 👇',
    image: null,
    likes_count: 1204,
    comments_count: 237,
    shares_count: 89,
    created_at: new Date(Date.now() - 18000000).toISOString(),
    user: {
      id: 'u2',
      name: 'Daniel Park',
      avatar: 'https://i.pravatar.cc/150?u=dpark',
      role: 'Staff Engineer @ Airbnb',
    },
  },
  {
    id: 'post_3',
    content: 'We\'re hiring a Head of Design at Figma! 🎨 Looking for someone who can blend systems thinking with creative vision to define the future of collaborative design tools.\n\nDM me or apply via the link in bio!',
    image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&q=80',
    likes_count: 567,
    comments_count: 104,
    shares_count: 201,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    user: {
      id: 'u3',
      name: 'Priya Anand',
      avatar: 'https://i.pravatar.cc/150?u=priya',
      role: 'VP of Design @ Figma',
    },
  },
  {
    id: 'post_4',
    content: 'After 18 months of grinding, my open-source project just hit 10,000 GitHub stars ⭐. What started as a weekend hack is now used by teams at Google, Shopify, and Vercel.\n\nNever underestimate what you can build in your spare time. 🔥',
    image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&q=80',
    likes_count: 4820,
    comments_count: 432,
    shares_count: 918,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    user: {
      id: 'u4',
      name: 'Lena Brandt',
      avatar: 'https://i.pravatar.cc/150?u=lena',
      role: 'Open Source Dev & Indie Hacker',
    },
  },
  {
    id: 'post_5',
    content: 'I turned down a $280k offer from a FAANG company. Here\'s why:\n\n1. The team culture felt off\n2. The problem space didn\'t excite me\n3. Money isn\'t everything if you\'re miserable 8h/day\n\nTruly grateful to still be at a company where I feel like I\'m making an impact. 🙏',
    image: null,
    likes_count: 9182,
    comments_count: 1043,
    shares_count: 2156,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    user: {
      id: 'u5',
      name: 'Marcus Thompson',
      avatar: 'https://i.pravatar.cc/150?u=marcus',
      role: 'Principal Eng @ Notion',
    },
  },
  {
    id: 'post_6',
    content: '📚 I read 40 books this year. Here are my top 5 for anyone in tech:\n\n1. The Pragmatic Programmer\n2. Staff Engineer (Will Larson)\n3. An Elegant Puzzle\n4. Designing Data-Intensive Applications\n5. The Manager\'s Path\n\nSave this post for later! 🔖',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
    likes_count: 2341,
    comments_count: 388,
    shares_count: 742,
    created_at: new Date(Date.now() - 345600000).toISOString(),
    user: {
      id: 'u6',
      name: 'Sofia Reyes',
      avatar: 'https://i.pravatar.cc/150?u=sofia',
      role: 'Engineering Manager @ Shopify',
    },
  },
];

// ── Stories ────────────────────────────────────────────────────────────────────
export const MOCK_STORIES = [
  {
    id: 's1',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80',
    user: { id: 'u1', name: 'Aisha M.', avatar: 'https://i.pravatar.cc/100?u=aisha' },
  },
  {
    id: 's2',
    image: 'https://images.unsplash.com/photo-1497366754035-f200581a2be9?w=600&q=80',
    user: { id: 'u2', name: 'Daniel P.', avatar: 'https://i.pravatar.cc/100?u=dpark' },
  },
  {
    id: 's3',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80',
    user: { id: 'u3', name: 'Priya A.', avatar: 'https://i.pravatar.cc/100?u=priya' },
  },
  {
    id: 's4',
    image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=600&q=80',
    user: { id: 'u4', name: 'Lena B.', avatar: 'https://i.pravatar.cc/100?u=lena' },
  },
  {
    id: 's5',
    image: 'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=600&q=80',
    user: { id: 'u5', name: 'Marcus T.', avatar: 'https://i.pravatar.cc/100?u=marcus' },
  },
];

// ── Notifications ─────────────────────────────────────────────────────────────
export const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'job', title: 'New job match: "Senior Product Designer"', subtitle: 'Netflix is hiring in your area. Your skills are a strong fit.', time: '2h', unread: true },
  { id: 2, type: 'conn', title: 'Kiran Singh connected with you', subtitle: 'Talent Acquisition @ GlobalTech | 8 mutual connections', time: '4h', unread: true },
  { id: 3, type: 'post', title: 'Daniel Park liked your post', subtitle: '"Optimizing the grid infrastructure for scale..." 312 others also liked this.', time: '5h', unread: true },
  { id: 4, type: 'msg', title: 'New message from Sarah Jenkins', subtitle: '"We reviewed your application — can we schedule a quick call?"', time: '1d', unread: false },
  { id: 5, type: 'job', title: 'Job alert: "Frontend Lead" at Stripe', subtitle: 'Salary: $170k–$230k • New York, NY • 12 applicants', time: '1d', unread: false },
  { id: 6, type: 'conn', title: 'Rohan Gupta accepted your request', subtitle: 'Staff Product Designer at a top tech company', time: '2d', unread: false },
  { id: 7, type: 'post', title: 'Your post is gaining traction', subtitle: 'Your post has been seen by 1,240 people in the last 24 hours.', time: '2d', unread: false },
  { id: 8, type: 'job', title: '3 jobs are expiring soon in your saved list', subtitle: 'Apply before they close. Tap to review.', time: '3d', unread: false },
];

// ── Messages / Conversations ──────────────────────────────────────────────────
export const MOCK_CONVERSATIONS = [
  { id: '1', name: 'Sarah Jenkins', role: 'Talent Acquisition @ Nexus Corp', last_msg: 'We reviewed your sync profile — impressive! Can we schedule a quick call?', time: '2h', unread: true, avatar: 'https://i.pravatar.cc/150?u=sarah_j', online: true },
  { id: '2', name: 'NetflixRecruiter', role: 'Senior Recruiter @ Netflix', last_msg: 'Hi! We have an opening that matches your profile perfectly.', time: '4h', unread: true, avatar: 'https://logo.clearbit.com/netflix.com', online: false },
  { id: '3', name: 'Dev Ops Guild', role: '14 members', last_msg: 'M: The new CI/CD pipeline is fully optimized. Deploying tonight.', time: '5h', unread: false, avatar: 'https://i.pravatar.cc/150?u=g1', online: false },
  { id: '4', name: 'Alex Rivers', role: 'Fullstack Engineer @ Discord', last_msg: 'Let me know when you are back. I have a referral for you.', time: '1d', unread: false, avatar: 'https://i.pravatar.cc/150?u=alex_r', online: true },
  { id: '5', name: 'Priya Anand', role: 'VP of Design @ Figma', last_msg: 'Your portfolio is stunning. I shared it with our Head of Talent.', time: '2d', unread: false, avatar: 'https://i.pravatar.cc/150?u=priya', online: false },
  { id: '6', name: 'Daniel Park', role: 'Staff Engineer @ Airbnb', last_msg: 'Great post! Would love to grab a virtual coffee sometime.', time: '3d', unread: false, avatar: 'https://i.pravatar.cc/150?u=dpark', online: false },
];

// ── Network Suggestions ───────────────────────────────────────────────────────
export const MOCK_NETWORK_SUGGESTIONS = [
  { id: '1', name: 'Sanjiv Mahat', role: 'CTO at TechHive', avatar: 'https://i.pravatar.cc/150?u=12', mutual: 12, banner: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=400' },
  { id: '2', name: 'Priya Sharma', role: 'HR Director @ Jobryn', avatar: 'https://i.pravatar.cc/150?u=18', mutual: 5, banner: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=400' },
  { id: '3', name: 'Rohan Gupta', role: 'Staff Product Designer', avatar: 'https://i.pravatar.cc/150?u=4', mutual: 8, banner: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=400' },
  { id: '4', name: 'Aashish Rai', role: 'Frontend Architect', avatar: 'https://i.pravatar.cc/150?u=9', mutual: 21, banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400' },
  { id: '5', name: 'Keiko Nakamura', role: 'Lead ML Engineer @ Google', avatar: 'https://i.pravatar.cc/150?u=keiko', mutual: 14, banner: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=400' },
  { id: '6', name: 'Carlos Mendez', role: 'Principal Designer @ Adobe', avatar: 'https://i.pravatar.cc/150?u=carlos', mutual: 3, banner: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=400' },
];

// ── Profile: Experience ───────────────────────────────────────────────────────
export const MOCK_EXPERIENCE = [
  {
    id: 'exp1',
    position: 'Senior Frontend Engineer',
    company_name: 'Stripe',
    location: 'New York, NY (Remote)',
    start_date: 'Jan 2023',
    end_date: null,
    current: true,
    description: 'Leading the redesign of the Stripe Dashboard UI. Migrating legacy components to a modern React + TypeScript design system used by millions of businesses.',
  },
  {
    id: 'exp2',
    position: 'Software Engineer II',
    company_name: 'Airbnb',
    location: 'San Francisco, CA',
    start_date: 'Jun 2021',
    end_date: 'Dec 2022',
    current: false,
    description: 'Built and maintained core booking-flow features. Improved page load times by 40% through code splitting and lazy loading.',
  },
  {
    id: 'exp3',
    position: 'Junior Developer',
    company_name: 'Startup Studio Kathmandu',
    location: 'Kathmandu, Nepal',
    start_date: 'Sep 2019',
    end_date: 'May 2021',
    current: false,
    description: 'Built mobile and web applications for local and international clients using React Native and Node.js.',
  },
];

// ── Profile: Education ────────────────────────────────────────────────────────
export const MOCK_EDUCATION = [
  {
    id: 'edu1',
    school: 'Tribhuvan University',
    degree: "Bachelor of Engineering",
    field: 'Computer Science',
    start_date: '2015',
    end_date: '2019',
    description: 'Graduated with First Division. Thesis on "Real-time Collaborative Web Editors using CRDTs".',
  },
  {
    id: 'edu2',
    school: 'Coursera / Stanford Online',
    degree: 'Certificate',
    field: 'Machine Learning',
    start_date: '2020',
    end_date: '2021',
    description: 'Completed Andrew Ng\'s Machine Learning Specialization with distinction.',
  },
];

// ── Profile: Projects ─────────────────────────────────────────────────────────
export const MOCK_PROJECTS = [
  {
    id: 'proj1',
    name: 'Jobryn Mobile App',
    description: 'A LinkedIn-inspired job platform for Nepal built with React Native + Expo. Features social feed, job listing, real-time chat, and wallet.',
    url: 'https://github.com/jobryn/mobile-app',
    start_date: '2024',
    end_date: '2025',
  },
  {
    id: 'proj2',
    name: 'OpenMetrics Dashboard',
    description: 'An open-source observability dashboard built with Next.js and D3.js. 10k+ GitHub stars. Used by teams at Vercel, Shopify, and Notion.',
    url: 'https://github.com/openmetrics/dashboard',
    start_date: '2022',
    end_date: '2023',
  },
  {
    id: 'proj3',
    name: 'NepalPay Gateway SDK',
    description: 'A TypeScript SDK for integrating eSewa, Khalti, and ConnectIPS payment gateways into any Node.js or browser app.',
    url: 'https://github.com/user/nepalpay-sdk',
    start_date: '2021',
    end_date: '2022',
  },
];

// ── Saved Jobs ────────────────────────────────────────────────────────────────
export const MOCK_SAVED_JOBS = MOCK_JOBS.slice(0, 5).map(job => ({
  ...job,
  saved_at: new Date(Date.now() - Math.random() * 7 * 24 * 3600 * 1000).toISOString(),
}));

// ── Applied Jobs ──────────────────────────────────────────────────────────────
export const MOCK_APPLICATIONS = [
  {
    id: 'app1',
    job: MOCK_JOBS[0],
    status: 'shortlisted',
    applied_date: 'Oct 12, 2026',
    cover_letter: 'I am deeply passionate about design systems...',
  },
  {
    id: 'app2',
    job: MOCK_JOBS[1],
    status: 'applied',
    applied_date: 'Oct 10, 2026',
    cover_letter: 'My experience with Go and distributed systems...',
  },
  {
    id: 'app3',
    job: MOCK_JOBS[2],
    status: 'interviewing',
    applied_date: 'Oct 08, 2026',
    cover_letter: 'User research is my passion...',
  },
];

// ── Wallet Transactions & Invoices ────────────────────────────────────────────
export const MOCK_TRANSACTIONS = [
   { id: 1, type: 'outgoing', label: 'Premium Subscription', date: 'Oct 12, 2026', amount: '$29.00' },
   { id: 2, type: 'incoming', label: 'Wallet Topup', date: 'Oct 05, 2026', amount: '$50.00' },
   { id: 3, type: 'outgoing', label: 'Course Enrollment', date: 'Sep 28, 2026', amount: '$15.00' },
];

export const MOCK_INVOICES = [
  { id: 'inv_101', from: 'Tech Corp LLC', amount: '$450.00', status: 'unpaid', due: 'Oct 20, 2026' },
];

// ── Meetings / Interviews ─────────────────────────────────────────────────────
export const MOCK_MEETINGS = [
   { id: '1', title: 'Technical Interview', company: 'Nexus Corp', time: '10:00 AM - 11:00 AM', date: 'Oct 15, 2026', status: 'upcoming', link: 'https://meet.google.com/abc-defg-hij', attendees: [{ avatar: 'https://i.pravatar.cc/100?u=int1' }, { avatar: 'https://i.pravatar.cc/100?u=int2' }] },
   { id: '2', title: 'HR Screening Room', company: 'FiberLink', time: '02:30 PM - 03:00 PM', date: 'Oct 14, 2026', status: 'completed', link: '', attendees: [{ avatar: 'https://i.pravatar.cc/100?u=int3' }] },
];

// ── Portfolio Photos ──────────────────────────────────────────────────────────
export const MOCK_PHOTOS = [
  'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
  'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80'
];
