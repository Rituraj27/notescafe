'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Layers, Users, FileText, Settings, LogOut } from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  // If path is exactly /admin/login, return just the children without layout
  if (pathname === '/admin/login') {
    return children;
  }

  // Handle logout
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Layers },
    { name: 'Notes', href: '/admin/notes', icon: FileText },
  ];

  return (
    <div className='min-h-screen flex bg-gray-100 dark:bg-gray-900'>
      {/* Sidebar */}
      <div className='pt-[10vh] w-64 bg-white dark:bg-gray-800 shadow-md'>
        <div className='h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700'>
          <h1 className='text-xl font-bold text-gray-900 dark:text-white'>
            Admin Panel
          </h1>
        </div>

        <div className='p-4'>
          {session?.user && (
            <div className='mb-6 pb-4 border-b border-gray-200 dark:border-gray-700'>
              <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                Logged in as
              </p>
              <p className='text-sm font-bold text-gray-900 dark:text-white'>
                {session.user.email}
              </p>
            </div>
          )}

          <nav className='space-y-1'>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive
                        ? 'text-blue-500 dark:text-blue-300'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}

            <button
              onClick={handleLogout}
              className='w-full group flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md dark:text-gray-300 dark:hover:bg-gray-700'
            >
              <LogOut className='mr-3 h-5 w-5 text-gray-500 dark:text-gray-400' />
              Logout
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className='pt-[10vh] flex-1 overflow-auto'>
        <main className='p-6'>{children}</main>
      </div>
    </div>
  );
}
