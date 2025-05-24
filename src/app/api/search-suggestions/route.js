import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ suggestions: [] });
  }

  const client = await clientPromise;
  const db = client.db("notescafe");

  const suggestions = await db
    .collection("notes")
    .find({ title: { $regex: query, $options: "i" } })
    .limit(10)
    .toArray();

  // Only send back title and id (not full note)
  return NextResponse.json({
    suggestions: suggestions.map((note) => ({
      _id: note._id,
      title: note.title,
    })),
  });
}
