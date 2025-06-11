import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET a specific note
export async function GET(request, context) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Properly access params from context
    const id = context.params.id;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid note ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('notescafe');

    const note = await db.collection('notes').findOne({
      _id: ObjectId.createFromHexString(id),
    });

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    // Transform MongoDB ObjectId to string for JSON serialization
    return NextResponse.json({
      ...note,
      _id: note._id.toString(),
    });
  } catch (error) {
    console.error('Error fetching note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update a note
export async function PUT(request, context) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Properly access params from context
    const id = context.params.id;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid note ID' }, { status: 400 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('notescafe');

    // Check if note exists
    const noteExists = await db.collection('notes').findOne({
      _id: ObjectId.createFromHexString(id),
    });

    if (!noteExists) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData = {
      title: data.title,
      description: data.description || '',
      updatedAt: new Date().toISOString(),
    };

    // Only update image if provided
    if (data.image) {
      updateData.image = data.image;
    }

    // Only update PDF URL if provided
    if (data.pdfUrl) {
      updateData.pdfUrl = data.pdfUrl;
    }

    await db
      .collection('notes')
      .updateOne(
        { _id: ObjectId.createFromHexString(id) },
        { $set: updateData }
      );

    return NextResponse.json({
      message: 'Note updated successfully',
    });
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE a note
export async function DELETE(request, context) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Properly access params from context
    const id = context.params.id;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid note ID' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('notescafe');

    // Delete the note
    const result = await db.collection('notes').deleteOne({
      _id: ObjectId.createFromHexString(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Note deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
