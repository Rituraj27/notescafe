import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import Navbar from '@/Components/layout/Navbar/Navbar';
import Footer from '@/Components/layout/Footer/Footer';
import { Providers } from './Providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Notes Cafe',
  description: 'Get your notes here',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
        document.documentElement.setAttribute(
          'data-theme',
          localStorage.getItem('theme') || 'light'
        );
      `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-200`}
      >
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
