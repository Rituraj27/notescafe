'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

export default function EditNote({ params }) {
  // Properly unwrap params
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const isNewNote = id === 'new';
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image: '',
  });
  const [loading, setLoading] = useState(!isNewNote);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If creating a new note, no need to fetch data
    if (isNewNote) return;

    const fetchNote = async () => {
      try {
        const response = await fetch(`/api/admin/notes/${id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch note');
        }

        const note = await response.json();
        setFormData({
          title: note.title || '',
          description: note.description || '',
          price: note.price?.toString() || '',
          image: note.image || '',
        });
      } catch (error) {
        console.error('Error fetching note:', error);
        setError('Error loading note data');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, isNewNote]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = isNewNote ? '/api/admin/notes' : `/api/admin/notes/${id}`;

      const method = isNewNote ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save note');
      }

      // Redirect to notes list on success
      router.push('/admin/notes');
    } catch (error) {
      console.error('Error saving note:', error);
      setError(error.message || 'Error saving note');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      !isNewNote &&
      window.confirm('Are you sure you want to delete this note?')
    ) {
      try {
        const response = await fetch(`/api/admin/notes/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete note');
        }

        router.push('/admin/notes');
      } catch (error) {
        console.error('Error deleting note:', error);
        setError('Error deleting note');
      }
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='text-lg'>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <div className='flex items-center'>
          <Link
            href='/admin/notes'
            className='mr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          >
            <ArrowLeft className='h-5 w-5' />
          </Link>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            {isNewNote ? 'Add New Note' : 'Edit Note'}
          </h1>
        </div>

        {!isNewNote && (
          <button
            onClick={handleDelete}
            className='flex items-center text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
          >
            <Trash2 className='h-5 w-5 mr-1' />
            <span>Delete</span>
          </button>
        )}
      </div>

      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'
      >
        <div className='grid grid-cols-1 gap-6'>
          <div>
            <label
              htmlFor='title'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
            >
              Title *
            </label>
            <input
              type='text'
              id='title'
              name='title'
              value={formData.title}
              onChange={handleChange}
              required
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
            />
          </div>

          <div>
            <label
              htmlFor='description'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
            >
              Description
            </label>
            <textarea
              id='description'
              name='description'
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
            />
          </div>

          <div>
            <label
              htmlFor='price'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
            >
              Price (₹) *
            </label>
            <input
              type='number'
              id='price'
              name='price'
              value={formData.price}
              onChange={handleChange}
              required
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
            />
          </div>

          <div>
            <label
              htmlFor='image'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
            >
              Image URL
            </label>
            <input
              type='text'
              id='image'
              name='image'
              value={formData.image}
              onChange={handleChange}
              placeholder='/placeholder.jpg'
              className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
            />
            {formData.image && (
              <div className='mt-2'>
                <p className='text-sm text-gray-500 dark:text-gray-400 mb-1'>
                  Preview:
                </p>
                <img
                  src={formData.image}
                  alt='Preview'
                  className='w-40 h-40 object-cover rounded-md'
                  onError={(e) => {
                    e.target.src = '/placeholder.jpg';
                    e.target.onerror = null;
                  }}
                />
              </div>
            )}
          </div>

          <div className='flex justify-end'>
            <button
              type='submit'
              disabled={saving}
              className='flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50'
            >
              <Save className='h-4 w-4 mr-2' />
              {saving ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
