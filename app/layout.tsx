import './globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { ThemeProvider } from 'next-themes';
import { appName, docsTitle, siteUrl } from '@/lib/shared';
import { cn } from '@/lib/utils';
const geistSans = Geist({ subsets: ['latin'], variable: '--font-sans' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' });
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: docsTitle, template: `%s | ${docsTitle}` },
  description:
    'Official documentation for ToonUI, the protocol and runtime for AI-generated UI blocks rendered safely in React apps.',
  applicationName: appName,
  creator: 'Jefferson Lopez',
  publisher: appName,
  keywords: [
    'ToonUI',
    'documentation',
    'AI UI',
    'LLM UI',
    'React',
    'chat interface',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: docsTitle,
    title: docsTitle,
    description:
      'Official documentation for ToonUI, the protocol and runtime for AI-generated UI blocks rendered safely in React apps.',
  },
  twitter: {
    card: 'summary_large_image',
    title: docsTitle,
    description:
      'Official documentation for ToonUI, the protocol and runtime for AI-generated UI blocks rendered safely in React apps.',
  },
  robots: {
    index: true,
    follow: true,
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" suppressHydrationWarning className={cn(geistSans.variable, geistMono.variable)}><body className="flex min-h-screen flex-col antialiased"><ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange><RootProvider>{children}</RootProvider></ThemeProvider></body></html>; }
