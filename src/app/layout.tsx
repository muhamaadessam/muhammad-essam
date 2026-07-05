import type { Metadata } from 'next';
import { Fira_Code } from 'next/font/google';
import './globals.css';

const firaCode = Fira_Code({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://muhamaadessam.github.io'),
  title: 'Muhammad Essam | Flutter Developer',
  description: 'Experienced Flutter Developer building beautiful, scalable, and high-performance cross-platform applications.',
  keywords: ['Muhammad Essam', 'Flutter Developer', 'Mobile Developer', 'Dart', 'React', 'Portfolio'],
  authors: [{ name: 'Muhammad Essam' }],
  creator: 'Muhammad Essam',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://muhamaadessam.github.io/',
    title: 'Muhammad Essam | Flutter Developer',
    description: 'Experienced Flutter Developer building beautiful, scalable, and high-performance cross-platform applications.',
    siteName: 'Muhammad Essam Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muhammad Essam | Flutter Developer',
    description: 'Experienced Flutter Developer building beautiful, scalable, and high-performance cross-platform applications.',
    creator: '@muhammadessam',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${firaCode.className} antialiased selection:bg-primary/30 selection:text-primary-dark`}>
        {children}
      </body>
    </html>
  );
}
