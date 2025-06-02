import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
// import { NavigationProvider } from '@/context/NavigationContext';

import Navbar from '@/Components/layout/Navbar/Navbar';
import Footer from '@/Components/layout/Footer/Footer';
import { Providers } from './Providers';

export const metadata = {
  title: 'Notes Cafe',
  description: 'Get your notes here',
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head></head>
      <body className={`antialiased transition-colors duration-200`}>
        {/* <NavigationProvider> */}
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
        {/* </NavigationProvider> */}
      </body>
    </html>
  );
}
