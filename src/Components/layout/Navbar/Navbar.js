'use client';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';
import Searching from '@/Components/ui/Searching/Searching';
import ThemeToggle from '@/Components/ui/ThemeToggle/ThemeToggle';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import Login from '@/Components/ui/Login/Login';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { theme } = useTheme();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50);
  });

  const getBackgroundColor = () => {
    if (!isScrolled) return 'rgba(0, 0, 0, 0)';
    return theme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 245, .6)';
  };
  const router = useRouter();

  return (
    <motion.nav
      initial={false}
      animate={{
        backgroundColor: getBackgroundColor(),
        backdropFilter: isScrolled ? 'none' : 'blur(0px)',
        boxShadow: isScrolled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
      }}
      transition={{ duration: 0.3 }}
      className='fixed top-0 z-50 flex items-center justify-between py-2 w-full h-[10vh]'
    >
      <div className='w-full flex items-center justify-between px-[3vw]'>
        <div className='w-[80px] sm:w-[150px] cursor-pointer'>
          <Image
            src='/notescafe-Logo.png'
            alt='Logo'
            width='220'
            height='220'
            className=''
            onClick={() => router.push('/')}
          />
        </div>
        <div className='flex items-center gap-[2vw]'>
          <div>
            <Searching />
          </div>
          <div>
            <Login />
          </div>
          <div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
