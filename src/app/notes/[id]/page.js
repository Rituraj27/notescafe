import clientPromise from '@/lib/mongodb';
import Image from 'next/image';
import { ObjectId } from 'mongodb';
import { use } from 'react';
import {
  Download,
  Calendar,
  User,
  Clock,
  BookOpen,
  Star,
  Share2,
  Bookmark,
} from 'lucide-react';

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

  console.log('Note data:', note);
  console.log('PDF URL:', note.pdfUrl);
  console.log(
    'Cloudinary URL:',
    `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/raw/upload/${note.pdfUrl.split('/').pop()}`
  );

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Clean up PDF URL if it has duplicate paths
  const cleanPdfUrl = note.pdfUrl?.replace(
    'notescafe/pdf/notescafe/pdf/',
    'notescafe/pdf/'
  );

  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900 pt-16'>
      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
          {/* Left Column - Main Content */}
          <div className='lg:col-span-8'>
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden'>
              <div className='relative h-[500px]'>
                <Image
                  src={note.image || '/placeholder.jpg'}
                  alt={note.title || 'Note image'}
                  fill
                  className='object-cover'
                  priority
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>
                <div className='absolute bottom-0 left-0 right-0 p-8 text-white'>
                  <h1 className='text-4xl font-bold mb-4'>{note.title}</h1>
                  <div className='flex items-center space-x-6'>
                    <div className='flex items-center'>
                      <User className='h-5 w-5 mr-2' />
                      <span>{note.author || 'Admin'}</span>
                    </div>
                    <div className='flex items-center'>
                      <Clock className='h-5 w-5 mr-2' />
                      <span>Last updated {formatDate(note.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='p-8'>
                <div className='prose dark:prose-invert max-w-none'>
                  <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                    About This Note
                  </h2>
                  <p className='text-lg text-gray-700 dark:text-gray-300'>
                    {note.description || 'No description available.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className='lg:col-span-4 h-full flex items-center'>
            <div className='space-y-6 w-full'>
              {/* Download Card */}
              <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6'>
                <div className='flex items-center justify-between mb-6'>
                  <span className='text-2xl font-bold text-[#981d12]'>
                    Free
                  </span>
                  <div className='flex items-center text-yellow-400'>
                    <Star className='h-5 w-5 fill-current' />
                    <span className='ml-1 text-gray-700 dark:text-gray-300'>
                      4.8
                    </span>
                  </div>
                </div>
                {note.pdfUrl && (
                  <a
                    href={cleanPdfUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-full bg-[#FFD700] hover:bg-[#FFC800] text-black font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2'
                  >
                    <Download className='w-5 h-5' />
                    Download PDF
                  </a>
                )}
              </div>

              {/* Features Card */}
              <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6'>
                <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center'>
                  What&apos;s Included
                </h3>
                <ul className='space-y-4'>
                  <li className='flex items-start'>
                    <BookOpen className='h-6 w-6 text-[#981d12] mr-3 flex-shrink-0 mt-1' />
                    <div>
                      <h4 className='font-medium text-gray-900 dark:text-white'>
                        Comprehensive Content
                      </h4>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Detailed notes covering all important topics
                      </p>
                    </div>
                  </li>
                  <li className='flex items-start'>
                    <Clock className='h-6 w-6 text-[#981d12] mr-3 flex-shrink-0 mt-1' />
                    <div>
                      <h4 className='font-medium text-gray-900 dark:text-white'>
                        Regular Updates
                      </h4>
                      <p className='text-sm text-gray-600 dark:text-gray-400'>
                        Content is regularly updated with latest information
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Share Card */}
              <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6'>
                <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center'>
                  Share This Note
                </h3>
                <div className='flex space-x-4'>
                  <button className='flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center'>
                    <Share2 className='h-5 w-5 mr-2' />
                    Share
                  </button>
                  <button className='flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center'>
                    <Bookmark className='h-5 w-5 mr-2' />
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
