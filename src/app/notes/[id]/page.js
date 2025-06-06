import clientPromise from '@/lib/mongodb';
import Image from 'next/image';
import { ObjectId } from 'mongodb';
import { use } from 'react';
import { Download, Calendar, User } from 'lucide-react';

export default function NoteDetailPage({ params }) {
  // Unwrap params with React.use
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  // This function handles the async work
  const fetchNote = async () => {
    const client = await clientPromise;
    const db = client.db('notescafe');

    // Validate ObjectId first
    if (!ObjectId.isValid(id)) {
      return null;
    }

    return db.collection('notes').findOne({
      _id: new ObjectId(id),
    });
  };

  // Use React.use to unwrap the promise
  const note = use(fetchNote());

  if (!note) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
            Note Not Found
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            The note you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900 py-12'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header Section */}
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-8'>
          <div className='relative h-[400px]'>
            <Image
              src={note.image || '/placeholder.jpg'}
              alt={note.title || 'Note image'}
              fill
              className='object-cover'
              priority
            />
          </div>

          <div className='p-8'>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
              {note.title}
            </h1>

            <div className='flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400 mb-6'>
              <div className='flex items-center'>
                <Calendar className='h-4 w-4 mr-2' />
                <span>{formatDate(note.createdAt)}</span>
              </div>
              <div className='flex items-center'>
                <User className='h-4 w-4 mr-2' />
                <span>{note.author || 'Admin'}</span>
              </div>
            </div>

            <p className='text-lg text-gray-700 dark:text-gray-300 mb-8'>
              {note.description || 'No description available.'}
            </p>

            {note.pdfUrl && (
              <div className='flex items-center space-x-4'>
                <a
                  href={note.pdfUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200'
                >
                  <Download className='h-5 w-5 mr-2' />
                  Download PDF
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
