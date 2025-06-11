import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('notescafe');

    const notes = await db
      .collection('notes')
      .find({})
      .sort({ createdAt: -1 })
      .limit(8)
      .toArray();

    // Transform MongoDB ObjectIds to strings for JSON serialization
    const serializedNotes = notes.map((note) => ({
      ...note,
      _id: note._id.toString(),
      createdAt: note.createdAt || new Date().toISOString(),
    }));

    return NextResponse.json({ notes: serializedNotes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
