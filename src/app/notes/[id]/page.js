import clientPromise from "@/lib/mongodb";
import Image from "next/image";
import { BSON } from "mongodb"; // modern import
import Link from "next/link"; // not needed but nice to have

export default async function NoteDetailPage({ params }) {
  const client = await clientPromise;
  const db = client.db("notescafe");

  // Validate ObjectId first
  if (!BSON.ObjectId.isValid(params.id)) {
    return <div className="text-center mt-10">Invalid Note ID</div>;
  }

  const note = await db.collection("notes").findOne({
    _id: new BSON.ObjectId(params.id),
  });

  if (!note) {
    return <div className="text-center mt-10">Note not found</div>;
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{note.title}</h1>

      <div className="relative w-full h-[400px] mb-6">
        <Image
          src={note.image || "/placeholder.jpg"}
          alt={note.title || "Note image"}
          fill
          className="object-cover rounded-xl"
        />
      </div>

      <p className="text-lg text-gray-800 dark:text-gray-200 mb-4">
        {note.description || "No description available."}
      </p>

      <p className="text-xl font-semibold mb-6">₹{note.price}</p>

      {/* Download Button */}
      {note.file_path && (
        <a
          href={note.file_path}
          download
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
        >
          Download Note
        </a>
      )}
    </main>
  );
}
