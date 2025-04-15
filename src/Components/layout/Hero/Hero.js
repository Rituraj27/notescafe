'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';

export function Hero() {
  const { theme } = useTheme();

  return (
    <header className='h-screen w-full flex items-center sm:justify-between justify-center bg-[linear-gradient(90deg,_rgba(255,49,49,1)_0%,_rgba(255,145,77,1)_100%)] overflow-hidden relative px-[10vw]'>
      <div className='relative w-[300px] sm:w-[700px] md:w-[900px] h-[500px] sm:h-[400px] md:h-[1000px] -ml-[15vw] hidden sm:block'>
        <Image
          src='/hero.png'
          alt='Hero Image'
          fill
          className='object-contain'
          priority
        />
      </div>
      <div className=''>
        <h1 className='uppercase mb-[-120px] text-[#d0cfcd]'>
          <span
            className='mr-[20px]'
            style={{ fontFamily: 'Extenda', fontSize: '133px' }}
          >
            Let&#39;s
          </span>
          <span style={{ fontFamily: 'Extenda50Omega', fontSize: '133px' }}>
            Learn
          </span>
        </h1>
        <h1
          className='uppercase text-[#981d12]'
          style={{ fontFamily: 'Extenda30Deca', fontSize: '166px' }}
        >
          Something
        </h1>
        <h1 className='uppercase mt-[-112px] text-[#981d12]'>
          <span style={{ fontFamily: 'Extenda10Pica', fontSize: '125px' }}>
            new
          </span>
          <span style={{ fontFamily: 'Extenda90Exa', fontSize: '125px' }}>
            here
          </span>
        </h1>
        <div className='flex justify-between items-center -mt-9'>
          <h3 className='text-black text-[18px]'>Unlock your potential</h3>
          <button className='bg-[#981d12] rounded-3xl px-7 py-2 text-white'>
            Learn more
          </button>
        </div>
      </div>
    </header>
  );
}
export default Hero;
