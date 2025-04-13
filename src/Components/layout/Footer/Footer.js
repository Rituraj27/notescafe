import { FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
import ThemeToggle from '@/Components/ui/ThemeToggle/ThemeToggle';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='px-[3vw] pt-10 pb-6 transition-colors duration-300 w-full'>
      <div className='max-w-10xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-52'>
        {/* Column 1 */}
        <div className=' '>
          <div className='w-[80px] sm:w-[150px] '>
            <Image
              src='/notescafe-Logo.png'
              alt='Logo'
              width='220'
              height='220'
              className=''
            />
          </div>

          <p className='text-sm mt-2'>
            We are a smart platform offering curated handwritten notes for
            students, making learning easier, faster, and accessible anytime.
            Your one-stop solution for quality study material.
          </p>
        </div>

        {/* Column 2 */}
        <div className='flex flex-col items-start '>
          <h4 className='text-lg font-semibold mb-4'>Notescafe</h4>
          <ul className='space-y-2 text-sm'>
            <li>
              <Link href='#'>
                <span className='hover:underline'>About Us</span>
              </Link>
            </li>
            <li>
              <Link href='#'>
                <span className='hover:underline'>carrers</span>
              </Link>
            </li>
            <li>
              <Link href='#'>
                <span className='hover:underline'>Privacy Policy</span>
              </Link>
            </li>
            <li>
              <Link href='#'>
                <span className='hover:underline'>Terms & Services</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className='  flex flex-col items-start '>
          <h4 className='text-lg font-semibold mb-4'>Contact</h4>
          <p className='text-sm mb-2 '>📞 +91 8144XXXX60</p>
          <p className='text-sm mb-6 '>✉️ support@notescafe.com</p>

          <div className='flex gap-4 text-xl'>
            <a
              href='https://instagram.com'
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaInstagram className='hover:text-pink-500 transition' />
            </a>
            <a
              href='https://linkedin.com'
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaLinkedin className='hover:text-blue-400 transition' />
            </a>
            <a
              href='https://github.com'
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaGithub className='hover:text-gray-400 transition' />
            </a>
          </div>
        </div>
      </div>

      <div className='text-center text-sm mt-10 border-t border-gray-300 dark:border-gray-700 pt-4'>
        © {new Date().getFullYear()} NotesCafe. All rights reserved.
      </div>
    </footer>
  );
}
