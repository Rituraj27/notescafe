'use client';

import { useEffect, useState } from 'react';
import Footer from '@/Components/layout/Footer/Footer';
import Hero from '@/Components/layout/Hero/Hero';
import Navbar from '@/Components/layout/Navbar/Navbar';
import NoteCard from '@/Components/ui/NoteCard/NoteCard';

export default function Page() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('/api/notes');
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

  return (
    <main>
      <Hero />
      <div className='max-w-7xl mx-auto px-4 py-8'>
        {loading ? (
          <div className='grid gap-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {[...Array(8)].map((_, i) => (
              <div key={i} className='animate-pulse'>
                <div className='bg-gray-200 h-56 rounded-md'></div>
                <div className='mt-4 space-y-2'>
                  <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                  <div className='h-4 bg-gray-200 rounded w-1/2'></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className='grid gap-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {notes.map((note) => (
              <NoteCard
                key={note._id.toString()}
                note={{ ...note, _id: note._id.toString() }}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
