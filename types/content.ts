export interface BaseContentMeta {
  title: string;
  slug: string;
  description: string;
  published: boolean;
  publishDate: string;
  updatedDate?: string;
  featured?: boolean;
  order?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
  };
}

export interface BlogItem extends BaseContentMeta {
  content: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  featuredImage: string;
  readingTime: string;
}

export interface PortfolioItem extends BaseContentMeta {
  content: string;
  client: string;
  industry: string;
  services: string[];
  technologies: string[];
  featuredImage: string;
  gallery?: string[];
  architectureSummary?: string;
  businessResults: {
    metric: string;
    label: string;
  }[];
}

export interface ServiceItem extends BaseContentMeta {
  icon: string;
  tagline: string;
  overview: string;
  businessProblems: string[];
  keyFeatures: {
    title: string;
    description: string;
    icon: string;
  }[];
  techStack: string[];
  deliverables: string[];
}

export interface CaseStudyItem extends BaseContentMeta {
  clientName: string;
  industry: string;
  category?: string;
  role?: string;
  status?: string;
  problem: string;
  challenge: string;
  solution: string;
  mainImage?: string;
  dashboardImages?: string[];
  beforeImage?: string;
  afterImage?: string;
  technologies?: string[];
  overviewSummary?: string;
  overviewProblems?: string[];
  lifecycleSteps?: {
    num: string;
    title: string;
    desc: string;
  }[];
  features?: {
    category: string;
    component: string;
    desc: string;
    status: string;
  }[];
  auditHighlights?: string[];
  auditBugs?: {
    title: string;
    severity: string;
    file: string;
    issue: string;
    impact: string;
    fix: string;
    darkGlow?: boolean;
  }[];
  recommendations?: {
    step: string;
    title: string;
    desc: string;
  }[];
  results?: {
    metric: string;
    label?: string;
    description?: string;
  }[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  skills: string[];
  social: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  order: number;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  designation: string;
  company: string;
  companyLogo?: string;
  photo?: string;
  quote: string;
  rating: number;
  serviceCategory: string;
  featured: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}
