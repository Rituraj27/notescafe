"use client";
import Image from "next/image";
import Link from "next/link";

export default function NoteCard({ note }) {
  console.log(note.image);
  return (
    <Link href={`/notes/${note._id}`}>
      <div className="bg-white dark:bg-[#2d303c] w-[250px] rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
        {/* Image */}
        <div className="relative w-full h-[200px]">
          <Image
            src={note.image || "/placeholder.jpg"} // Use your fallback if image not found
            alt={note.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Title and Price */}
        <div className="p-4 space-y-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {note.title}
          </h3>
          <button className="mt-2 px-4 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition">
            ₹{note.price}
          </button>
        </div>
      </div>
    </Link>
  );
}
