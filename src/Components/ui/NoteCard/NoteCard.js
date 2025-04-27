'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function NoteCard({ note }) {
  return (
    <Link href={`/notes/${note._id}`}>
      <div className='relative block rounded-md overflow-hidden shadow-lg transform transition-transform duration-200 hover:scale-105'>
        <div className='relative h-56'>
          <Image
            src={note.image || '/placeholder.jpg'}
            alt={note.title}
            className='object-cover'
            fill
          />
        </div>

        <div className='p-4 bg-white'>
          <h3 className='font-semibold mb-1 truncate text-black'>
            {note.title}
          </h3>

          <div className='flex justify-between items-center mt-2'>
            <div className='text-gray-600 text-sm'>
              {note.author || 'Unknown'}
            </div>
            <div className='font-bold text-[#981d12]'>₹{note.price}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
