import type { Metadata } from 'next';
import { appName, docsTitle, siteUrl } from '@/lib/shared';

type BuildPageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

const defaultKeywords = [
  'ToonUI',
  'AI UI',
  'AI interface',
  'LLM UI',
  'chat UI',
  'structured UI',
  'React',
  'documentation',
];

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
}: BuildPageMetadataInput): Metadata {
  const url = new URL(path, siteUrl);
  const allKeywords = [...defaultKeywords, ...keywords];

  return {
    title,
    description,
    keywords: allKeywords,
    alternates: {
      canonical: url.pathname,
    },
    category: 'technology',
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url,
      siteName: docsTitle,
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    applicationName: appName,
  };
}
