import Searching from '@/Components/ui/Searching/Searching';
import ThemeToggle from '@/Components/ui/ThemeToggle/ThemeToggle';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className='bg-[#2d303c] flex items-center justify-between py-2 w-full transition-colors duration-200 relative h-[10vh]'>
      <div className='flex items-center'>
        <div className='absolute top-[-50px]'>
          <Image
            src='/logo.png'
            alt='Logo'
            width='220'
            height='220'
            className=''
          />
        </div>
        <div className='xl:pl-[60vw] md:pl-[50vw] sm:pl-[30vw] pl-[200px] flex w-[100vw] justify-between items-center px-[3vw]'>
          <div>
            <Searching />
          </div>
          <div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
