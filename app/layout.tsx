import React from 'react';
import './globals.css';
import { getCompanyConfig, getNavigationConfig, getSEOConfig } from '@/server/settings/service';
import { generateCustomMetadata, generateOrganizationJsonLd } from '@/server/seo/generator';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';

export async function generateMetadata() {
  return await generateCustomMetadata({});
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const company = await getCompanyConfig();
  const nav = await getNavigationConfig();
  const jsonLd = generateOrganizationJsonLd();

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-background text-white antialiased selection:bg-gold-400 selection:text-slate-950 flex flex-col min-h-screen">
        <Navbar company={company} nav={nav} />
        <main className="flex-grow">{children}</main>
        <Footer company={company} nav={nav} />
      </body>
    </html>
  );
}
