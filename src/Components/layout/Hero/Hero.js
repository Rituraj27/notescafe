'use client';

import { useTheme } from 'next-themes';

export function Hero() {
  const { theme } = useTheme();

  return (
    <header
      className='h-screen bg-cover bg-center flex items-center justify-center'
      style={{
        backgroundImage: "url('/Backgound/2837037.jpg')",
      }}
    ></header>
  );
}
export default Hero;
