"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import NoteCard from "@/Components/ui/NoteCard/NoteCard";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await axios.get(`/api/search-notes?q=${query}`);
        setNotes(data.notes);
      } catch (error) {
        console.error(error);
      }
    };

    if (query) {
      fetchNotes();
    }
  }, [query]);

  if (!query) {
    return <div className="text-center mt-10">Please enter a search term.</div>;
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Results for "{query}"</h1>

      {notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <NoteCard
              key={note._id.toString()}
              note={{ ...note, _id: note._id.toString() }}
            />
          ))}
        </div>
      )}
    </main>
  );
}
