'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// Skeleton components
const SkeletonTable = () => (
  <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6 animate-pulse'>
    <div className='flex justify-between items-center mb-4'>
      <div className='h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/4'></div>
      <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-20'></div>
    </div>
    <div className='overflow-x-auto'>
      <table className='w-full'>
        <thead className='text-left bg-gray-50 dark:bg-gray-700'>
          <tr>
            {[...Array(3)].map((_, i) => (
              <th key={i} className='px-4 py-3'>
                <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-20'></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
          {[...Array(3)].map((_, rowIdx) => (
            <tr key={rowIdx}>
              <td className='px-4 py-3'>
                <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-32'></div>
              </td>
              <td className='px-4 py-3'>
                <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-24'></div>
              </td>
              <td className='px-4 py-3'>
                <div className='flex gap-2'>
                  <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-10'></div>
                  <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-12'></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SkeletonHero = () => (
  <div className='mb-6 flex items-center gap-6'>
    <div className='w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse'></div>
    <div className='flex-1'>
      <div className='h-8 bg-gray-300 dark:bg-gray-600 rounded w-48 mb-2 animate-pulse'></div>
      <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-64 animate-pulse'></div>
    </div>
  </div>
);

export default function AdminDashboard() {
  const { data: session, status: sessionStatus } = useSession();
  const [recentNotes, setRecentNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setRecentNotes(data.recentNotes || []);
        }
      } catch (error) {
        // Handle error silently
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchStats();
    }
  }, [session]);

  // Format date nicely
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Show full-page loading skeleton when session is loading
  if (sessionStatus === 'loading') {
    return (
      <div>
        <SkeletonHero />
        <SkeletonTable />
      </div>
    );
  }

  // Show component skeleton when stats are loading but session is available
  if (loading) {
    return (
      <div>
        <SkeletonHero />
        <SkeletonTable />
      </div>
    );
  }

  return (
    <div>
      <div className='mb-6 flex items-center gap-6'>
        <div className='w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center'>
          <span className='text-2xl font-bold text-gray-600 dark:text-gray-300'>
            {session?.user?.name?.[0]?.toUpperCase() || 'A'}
          </span>
        </div>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Dashboard
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            Welcome back, {session?.user?.name || 'Admin'}
          </p>
        </div>
      </div>

      {/* Recent Notes Table */}
      <div className='bg-white dark:bg-gray-800 shadow rounded-lg p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
            Recent Notes
          </h2>
          <Link
            href='/admin/notes'
            className='text-sm text-blue-600 dark:text-blue-400 hover:underline'
          >
            View all
          </Link>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='text-left bg-gray-50 dark:bg-gray-700'>
              <tr>
                <th className='px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300'>
                  Title
                </th>
                <th className='px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300'>
                  Created
                </th>
                <th className='px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
              {recentNotes.map((note) => (
                <tr key={note._id}>
                  <td className='px-4 py-3'>
                    <div className='flex items-center'>
                      <div className='text-sm font-medium text-gray-900 dark:text-white'>
                        {note.title}
                      </div>
                    </div>
                  </td>
                  <td className='px-4 py-3 text-sm text-gray-500 dark:text-gray-400'>
                    {formatDate(note.createdAt)}
                  </td>
                  <td className='px-4 py-3 text-sm'>
                    <div className='flex gap-2'>
                      <Link
                        href={`/admin/notes/${note._id}`}
                        className='text-blue-600 dark:text-blue-400 hover:underline'
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(note._id)}
                        className='text-red-600 dark:text-red-400 hover:underline'
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
