import { MetadataRoute } from 'next';
import { getSEOConfig } from '@/server/settings/service';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seoConfig = await getSEOConfig();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/admin/'],
    },
    sitemap: `${seoConfig.siteUrl}/sitemap.xml`,
  };
}
