import type { Metadata } from 'next';
import { Newsreader, Nunito_Sans, Geist_Mono } from 'next/font/google';
import './globals.css';

const newsreader = Newsreader({
  variable: '--font-newsreader',
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const nunitoSans = Nunito_Sans({
  variable: '--font-nunito-sans',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PhySense | The Intuition & Calculus Spark',
  description:
    'An interactive mechanics lab connecting everyday motion, visual experiments, and calculus-based physics.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${newsreader.variable} ${nunitoSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head><script dangerouslySetInnerHTML={{__html:"try{document.documentElement.dataset.appearance=localStorage.getItem('physense.appearance')==='dusk'?'dusk':'day'}catch(e){document.documentElement.dataset.appearance='day'}"}}/></head>
      <body
        className="min-h-full flex flex-col"
        style={{
          fontFamily: 'var(--font-nunito-sans), "Segoe UI", system-ui, sans-serif',
        }}
      >
        {children}
      </body>
    </html>
  );
}
