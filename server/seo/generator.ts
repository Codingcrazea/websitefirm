import { Metadata } from 'next';
import { getSEOConfig } from '../settings/service';

export async function generateCustomMetadata({
  title,
  description,
  ogImage,
  slug,
}: {
  title?: string;
  description?: string;
  ogImage?: string;
  slug?: string;
}): Promise<Metadata> {
  const seoConfig = await getSEOConfig();

  const metaTitle = title
    ? seoConfig.titleTemplate.replace('%s', title)
    : seoConfig.defaultTitle;
  const metaDescription = description || seoConfig.defaultDescription;
  const metaOgImage = ogImage || seoConfig.defaultOgImage;
  const pageUrl = slug ? `${seoConfig.siteUrl}/${slug}` : seoConfig.siteUrl;

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: pageUrl,
      siteName: seoConfig.organizationSchema.name,
      images: [
        {
          url: metaOgImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaOgImage],
      creator: seoConfig.twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ohmtech Developers',
    url: 'https://ohmtechdevelopers.com',
    logo: 'https://ohmtechdevelopers.com/brand/logo.png',
    sameAs: [
      'https://linkedin.com/company/ohmtech-developers',
      'https://github.com/ohmtech-developers',
      'https://twitter.com/ohmtech_dev',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+918305712353',
      contactType: 'sales',
      email: 'sanjayaswal2003@gmail.com',
    },
  };
}
