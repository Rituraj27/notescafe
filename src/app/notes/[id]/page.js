import clientPromise from '@/lib/mongodb';
import Image from 'next/image';
import { ObjectId } from 'mongodb';
import { use } from 'react';

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
      _id: ObjectId.createFromHexString(id),
    });
  };

  // Use React.use to unwrap the promise
  const note = use(fetchNote());

  if (!note) {
    return (
      <div className='text-center mt-10'>Note not found or invalid ID</div>
    );
  }

  return (
    <main className='max-w-4xl mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-4 text-black'>{note.title}</h1>
      <div className='relative w-full h-[400px] mb-6'>
        <Image
          src={note.image || '/placeholder.jpg'}
          alt={note.title || 'Note image'}
          fill
          className='object-cover rounded-xl'
        />
      </div>
      <p className='text-lg text-gray-800 dark:text-gray-200 mb-4'>
        {note.description || 'No description available.'}
      </p>
      <p className='text-xl font-semibold'>₹{note.price}</p>
    </main>
  );
}
