'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { FileText, Users, DollarSign, TrendingUp } from 'lucide-react';
import Link from 'next/link';

// Skeleton components
const SkeletonCard = () => (
  <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow animate-pulse'>
    <div className='flex items-center'>
      <div className='bg-gray-300 dark:bg-gray-600 p-3 rounded-full mr-4 w-12 h-12'></div>
      <div className='w-full'>
        <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2'></div>
        <div className='h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/4'></div>
      </div>
    </div>
  </div>
);

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
            {[...Array(4)].map((_, i) => (
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
                <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-16'></div>
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

export default function AdminDashboard() {
  const { data: session, status: sessionStatus } = useSession();
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [recentNotes, setRecentNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
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

  const statCards = [
    {
      title: 'Total Notes',
      value: stats.totalNotes,
      icon: FileText,
      color: 'bg-blue-500',
      link: '/admin/notes',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-green-500',
      link: '/admin/users',
    },
    {
      title: 'Revenue',
      value: `₹${stats.totalRevenue}`,
      icon: DollarSign,
      color: 'bg-purple-500',
      link: '/admin/sales',
    },
    {
      title: 'Growth',
      value: '12%',
      icon: TrendingUp,
      color: 'bg-amber-500',
      link: '/admin/analytics',
    },
  ];

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
        <div className='mb-6'>
          <div className='h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-2'></div>
          <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4'></div>
        </div>

        {/* Skeleton Stats Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>

        {/* Skeleton Recent Notes Table */}
        <SkeletonTable />
      </div>
    );
  }

  // Show component skeleton when stats are loading but session is available
  if (loading) {
    return (
      <div>
        <div className='mb-6'>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Dashboard
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            Welcome back, {session?.user?.name || 'Admin'}
          </p>
        </div>

        {/* Skeleton Stats Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>

        {/* Skeleton Recent Notes Table */}
        <SkeletonTable />
      </div>
    );
  }

  return (
    <div>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Dashboard
        </h1>
        <p className='text-gray-600 dark:text-gray-400'>
          Welcome back, {session?.user?.name || 'Admin'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        {statCards.map((stat, i) => (
          <Link
            href={stat.link}
            key={i}
            className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md transition-shadow'
          >
            <div className='flex items-center'>
              <div className={`${stat.color} p-3 rounded-full mr-4`}>
                <stat.icon className='h-6 w-6 text-white' />
              </div>
              <div>
                <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                  {stat.title}
                </p>
                <p className='text-2xl font-semibold text-gray-900 dark:text-white'>
                  {stat.value}
                </p>
              </div>
            </div>
          </Link>
        ))}
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
                  Price
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
                <tr
                  key={note._id}
                  className='hover:bg-gray-50 dark:hover:bg-gray-700'
                >
                  <td className='px-4 py-3 text-sm text-gray-900 dark:text-white'>
                    {note.title}
                  </td>
                  <td className='px-4 py-3 text-sm text-gray-900 dark:text-white'>
                    ₹{note.price}
                  </td>
                  <td className='px-4 py-3 text-sm text-gray-900 dark:text-white'>
                    {formatDate(note.createdAt)}
                  </td>
                  <td className='px-4 py-3 text-sm'>
                    <Link
                      href={`/admin/notes/${note._id}`}
                      className='text-blue-600 dark:text-blue-400 hover:underline mr-3'
                    >
                      Edit
                    </Link>
                    <button className='text-red-600 dark:text-red-400 hover:underline'>
                      Delete
                    </button>
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
