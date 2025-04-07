import Footer from "@/Components/layout/Footer/Footer";
import Navbar from "@/Components/layout/Navbar/Navbar";
import clientPromise from "@/lib/mongodb";
export default async function Page() {
  const client = await clientPromise;
  const db = client.db("notescafe");
  const notes = await db.collection("notes").find({}).toArray();
  return (
    <main>
      {notes.map((note) => (
        <div
          key={note._id}
          className="bg-white dark:bg-[#2d303c] p-4 rounded-xl shadow"
        >
          <h3 className="text-lg font-bold">{note.title}</h3>
        </div>
      ))}
    </main>
  );
}
