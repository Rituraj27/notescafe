import Footer from "@/Components/layout/Footer/Footer";
import Hero from "@/Components/layout/Hero/Hero";
import Navbar from "@/Components/layout/Navbar/Navbar";
import clientPromise from "@/lib/mongodb";
import NoteCard from "@/Components/ui/NoteCard/NoteCard";
export default async function Page() {
  const client = await clientPromise;
  const db = client.db("notescafe");
  const notes = await db.collection("notes").find({}).limit(6).toArray();

  return (
    <main>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {notes.map((note) => (
            <NoteCard
              key={note._id.toString()}
              note={{ ...note, _id: note._id.toString() }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
