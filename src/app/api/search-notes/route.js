import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ notes: [] });
  }

  const client = await clientPromise;
  const db = client.db("notescafe");

  const notes = await db
    .collection("notes")
    .find({ title: { $regex: query, $options: "i" } })
    .toArray();

  return NextResponse.json({ notes });
}
