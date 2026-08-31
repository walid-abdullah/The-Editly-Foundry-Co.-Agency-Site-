import "./globals.css";
import ClientScripts from "@/components/ClientScripts";
import LayoutWrapper from "@/components/LayoutWrapper";
import PromoBanner from "@/components/PromoBanner";

import { client } from '@/sanity/client';

import { urlFor } from '@/sanity/client';

export async function generateMetadata() {
  const query = `*[_type == "globalSettings"][0]`;
  const settings = await client.fetch(query);
  
  const seoTitle = settings?.seoTitle || "The Editly Foundry Co. | Premium Video Editing Agency";
  const seoDescription = settings?.seoDescription || "The Editly Foundry Co. is a premiere video editing agency specializing in Reels, Podcasts, Talking Head, UGC Ads, and SaaS Animations.";
  const seoKeywords = settings?.seoKeywords ? settings.seoKeywords.split(',').map(k => k.trim()) : ["video editing", "agency", "reels", "SaaS"];
  
  const metadata = {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
    }
  };

  if (settings?.seoImage) {
    const imageUrl = urlFor(settings.seoImage).url();
    metadata.openGraph.images = [{ url: imageUrl }];
    metadata.twitter.images = [imageUrl];
  }

  return metadata;
}

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default async function RootLayout({ children }) {
  const query = `*[_type == "globalSettings"][0]`;
  const settings = await client.fetch(query);
  
  const bannerQuery = `*[_type == "promoBanner"][0]`;
  const bannerSettings = await client.fetch(bannerQuery);
  
  const defaultTheme = settings?.defaultTheme || 'dark';

  return (
    <html lang="en" data-theme={defaultTheme}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@1,400;1,600&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body>
        {settings?.primaryColor && (
          <style dangerouslySetInnerHTML={{__html: `
            :root {
              --primary: ${settings.primaryColor};
              --accent-blue: ${settings.primaryColor};
              --accent-orange: ${settings.accentColor || '#F2994A'};
            }
          `}} />
        )}
        <PromoBanner banner={bannerSettings} />
        <ClientScripts />
        <LayoutWrapper settings={settings}>{children}</LayoutWrapper>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
