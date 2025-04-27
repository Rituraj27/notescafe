'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { UserCircle, LogOut, ShieldCheck } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Login() {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isAdmin = session?.user?.role === 'admin';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // Show loading indicator while session is loading
  if (status === 'loading') {
    return (
      <div className='flex items-center gap-[1vw]'>
        <div className='w-8 h-8 rounded-full animate-pulse bg-gray-300 dark:bg-gray-600'></div>
      </div>
    );
  }

  // If user is authenticated
  if (status === 'authenticated') {
    return (
      <div className='relative' ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className='flex items-center gap-2 focus:outline-none rounded-full px-3 py-1 hover:bg-white/10 dark:hover:bg-black/10 transition-colors'
        >
          <div className='flex items-center gap-1'>
            {isAdmin ? (
              <ShieldCheck className='w-5 h-5 text-[#981d12] dark:text-[#f87171]' />
            ) : (
              <UserCircle className='w-5 h-5 text-[#000000] dark:text-[#fff]' />
            )}
            <span
              className={`text-sm font-medium ${
                isAdmin
                  ? 'text-[#981d12] dark:text-[#f87171] font-bold'
                  : 'text-[#000000] dark:text-[#fff]'
              } hidden sm:inline`}
            >
              {isAdmin ? 'Admin' : session.user.name || session.user.email}
            </span>
          </div>
        </button>

        {dropdownOpen && (
          <div className='absolute right-0 mt-2 w-48 bg-white dark:bg-[#1a1a1a] rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700'>
            {isAdmin && (
              <Link
                href='/admin/dashboard'
                className='block px-4 py-2 text-sm text-[#000000] dark:text-[#fff] hover:bg-gray-100 dark:hover:bg-gray-800'
                onClick={() => setDropdownOpen(false)}
              >
                <div className='flex items-center'>
                  <ShieldCheck className='w-4 h-4 mr-2 text-[#981d12] dark:text-[#f87171]' />
                  <span>Admin Dashboard</span>
                </div>
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className='flex items-center w-full text-left px-4 py-2 text-sm text-[#000000] dark:text-[#fff] hover:bg-gray-100 dark:hover:bg-gray-800'
            >
              <LogOut className='w-4 h-4 mr-2' />
              Sign Out
            </button>
          </div>
        )}
      </div>
    );
  }

  // Default view for not authenticated users
  return (
    <div className='flex items-center gap-[1vw]'>
      <Link href='/login'>
        <button className='bg-[#fff] text-[#000000] px-[10px] py-[0.5vh] rounded-lg text-sm'>
          Login
        </button>
      </Link>
      <Link href='/signup'>
        <button className='bg-[#981d12] text-[#fff] px-[10px] py-[0.5vh] rounded-lg flex-shrink-0 text-sm'>
          Sign Up
        </button>
      </Link>
    </div>
  );
}
