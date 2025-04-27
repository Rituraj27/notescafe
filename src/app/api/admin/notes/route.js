import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';

// GET all notes
export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('notescafe');

    const notes = await db
      .collection('notes')
      .find({})
      .sort({ createdAt: -1 })
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

// POST create new note
export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.price) {
      return NextResponse.json(
        { error: 'Title and price are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('notescafe');

    // Prepare note object
    const note = {
      title: data.title,
      description: data.description || '',
      price: parseFloat(data.price),
      image: data.image || '/placeholder.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await db.collection('notes').insertOne(note);

    return NextResponse.json(
      {
        message: 'Note created successfully',
        noteId: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
