'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

// Skeleton component for notes table
const SkeletonNotesTable = () => (
  <div className='bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden animate-pulse'>
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
        <thead className='bg-gray-50 dark:bg-gray-700'>
          <tr>
            {[...Array(4)].map((_, i) => (
              <th key={i} className='px-6 py-3 text-left'>
                <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-24'></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
          {[...Array(5)].map((_, i) => (
            <tr key={i}>
              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='flex items-center'>
                  <div className='h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600'></div>
                  <div className='ml-4'>
                    <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-32'></div>
                  </div>
                </div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-16'></div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap'>
                <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-24'></div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-right'>
                <div className='flex justify-end gap-4'>
                  <div className='h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded'></div>
                  <div className='h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded'></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default function AdminNotes() {
  const { status: sessionStatus } = useSession();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('/api/admin/notes');
        if (response.ok) {
          const data = await response.json();
          setNotes(data.notes);
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // Mock data for initial display
  useEffect(() => {
    if (!loading && notes.length === 0) {
      // Set mock data if API returns empty
      setNotes([
        {
          _id: '1',
          title: 'Physics Notes Class 12',
          price: 250,
          image: '/placeholder.jpg',
          createdAt: new Date().toISOString(),
        },
        {
          _id: '2',
          title: 'Chemistry Notes Class 12',
          price: 180,
          image: '/placeholder.jpg',
          createdAt: new Date().toISOString(),
        },
        {
          _id: '3',
          title: 'Biology Notes Class 12',
          price: 200,
          image: '/placeholder.jpg',
          createdAt: new Date().toISOString(),
        },
        {
          _id: '4',
          title: 'Mathematics Notes Class 12',
          price: 220,
          image: '/placeholder.jpg',
          createdAt: new Date().toISOString(),
        },
        {
          _id: '5',
          title: 'English Notes Class 12',
          price: 150,
          image: '/placeholder.jpg',
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  }, [loading, notes]);

  // Handle delete note
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        const response = await fetch(`/api/admin/notes/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Remove the deleted note from the state
          setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
        } else {
          alert('Failed to delete note');
        }
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('Error occurred while deleting');
      }
    }
  };

  // Format date nicely
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Filter notes based on search query
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show full-page loading skeleton when session is loading
  if (sessionStatus === 'loading') {
    return (
      <div>
        <div className='flex justify-between items-center mb-6'>
          <div className='h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/3'></div>
          <div className='h-10 bg-gray-300 dark:bg-gray-600 rounded w-32'></div>
        </div>

        {/* Search Skeleton */}
        <div className='mb-6'>
          <div className='h-10 bg-gray-300 dark:bg-gray-600 rounded w-full'></div>
        </div>

        {/* Notes Table Skeleton */}
        <SkeletonNotesTable />
      </div>
    );
  }

  // Show component skeleton when notes are loading but session is available
  if (loading) {
    return (
      <div>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Manage Notes
          </h1>
          <Link
            href='/admin/notes/new'
            className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors'
          >
            <Plus className='h-4 w-4' />
            <span>Add New Note</span>
          </Link>
        </div>

        {/* Search */}
        <div className='mb-6'>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <Search className='h-5 w-5 text-gray-400' />
            </div>
            <input
              type='text'
              placeholder='Search notes by title...'
              className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Notes Table Skeleton */}
        <SkeletonNotesTable />
      </div>
    );
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Manage Notes
        </h1>
        <Link
          href='/admin/notes/new'
          className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors'
        >
          <Plus className='h-4 w-4' />
          <span>Add New Note</span>
        </Link>
      </div>

      {/* Search */}
      <div className='mb-6'>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <Search className='h-5 w-5 text-gray-400' />
          </div>
          <input
            type='text'
            placeholder='Search notes by title...'
            className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Notes Table */}
      <div className='bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
            <thead className='bg-gray-50 dark:bg-gray-700'>
              <tr>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                >
                  Title
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                >
                  Price
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                >
                  Created
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
              {filteredNotes.map((note) => (
                <tr
                  key={note._id}
                  className='hover:bg-gray-50 dark:hover:bg-gray-700'
                >
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='flex items-center'>
                      <div className='h-10 w-10 flex-shrink-0'>
                        <img
                          className='h-10 w-10 rounded-full object-cover'
                          src={note.image || '/placeholder.jpg'}
                          alt={note.title}
                        />
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900 dark:text-white'>
                          {note.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900 dark:text-white'>
                      ₹{note.price}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                      {formatDate(note.createdAt)}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <button
                      onClick={() => router.push(`/admin/notes/${note._id}`)}
                      className='text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4'
                    >
                      <Edit className='h-5 w-5' />
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className='text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                    >
                      <Trash2 className='h-5 w-5' />
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
