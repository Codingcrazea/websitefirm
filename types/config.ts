export interface CompanyConfig {
  companyName: string;
  tagline: string;
  description: string;
  email: string;
  salesEmail: string;
  phone: string;
  whatsapp: string;
  address: string;
  country: string;
  website: string;
  logo: string;
  logoIcon: string;
  social: {
    linkedin: string;
    github: string;
    twitter: string;
    youtube: string;
    instagram: string;
  };
  metrics: {
    projectsCompleted: string;
    clientSatisfaction: string;
    uptimeGuarantee: string;
    globalClients: string;
  };
}

export interface SiteConfig {
  siteName: string;
  domain: string;
  defaultLocale: string;
  theme: {
    defaultMode: string;
    primaryColor: string;
    accentColor: string;
  };
}

export interface NavItem {
  label: string;
  path: string;
  isExternal?: boolean;
  badge?: string;
  children?: {
    label: string;
    path: string;
    description: string;
    icon?: string;
  }[];
}

export interface NavigationConfig {
  mainNav: NavItem[];
  footerNav: {
    services: { label: string; path: string }[];
    solutions: { label: string; path: string }[];
    company: { label: string; path: string }[];
    legal: { label: string; path: string }[];
  };
}

export interface SEOConfig {
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  defaultOgImage: string;
  siteUrl: string;
  twitterHandle: string;
  organizationSchema: {
    name: string;
    url: string;
    logo: string;
    sameAs: string[];
  };
}
