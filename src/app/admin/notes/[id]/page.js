'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';
import Image from 'next/image';

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
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

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

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      try {
        setSaving(true);
        setError('');

        // Create form data
        const formData = new FormData();
        formData.append('file', file);

        // Upload to our API
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Upload failed');
        }

        setFormData((prev) => ({ ...prev, image: data.url }));
        setPreviewUrl(data.url);
      } catch (error) {
        console.error('Error uploading file:', error);
        setError(error.message || 'Failed to upload image');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      try {
        setSaving(true);
        setError('');

        // Create form data
        const formData = new FormData();
        formData.append('file', file);

        // Upload to our API
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Upload failed');
        }

        setFormData((prev) => ({ ...prev, image: data.url }));
        setPreviewUrl(data.url);
      } catch (error) {
        console.error('Error uploading file:', error);
        setError(error.message || 'Failed to upload image');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleUploadSuccess = (result) => {
    console.log('Upload result:', result);
    setFormData((prev) => ({ ...prev, image: result.info.secure_url }));
    setPreviewUrl(result.info.secure_url);
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
              Image
            </label>
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center ${
                isDragging
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600'
              } transition-colors duration-200`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type='file'
                id='image'
                name='image'
                accept='image/*'
                onChange={handleFileChange}
                className='hidden'
              />
              <label htmlFor='image' className='cursor-pointer block'>
                {previewUrl ? (
                  <div className='relative w-40 h-40 mx-auto'>
                    <Image
                      src={previewUrl}
                      alt='Preview'
                      fill
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      className='object-cover rounded-md'
                      priority
                    />
                    <button
                      type='button'
                      onClick={(e) => {
                        e.preventDefault();
                        setPreviewUrl('');
                        setFormData((prev) => ({ ...prev, image: '' }));
                      }}
                      className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600'
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-4 w-4'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className='space-y-2'>
                    <svg
                      className='mx-auto h-12 w-12 text-gray-400'
                      stroke='currentColor'
                      fill='none'
                      viewBox='0 0 48 48'
                      aria-hidden='true'
                    >
                      <path
                        d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                        strokeWidth={2}
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                    <div className='text-sm text-gray-600 dark:text-gray-400'>
                      <span className='font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500'>
                        Click to upload
                      </span>{' '}
                      or drag and drop
                    </div>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </label>
            </div>
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
