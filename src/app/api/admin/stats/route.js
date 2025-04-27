import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import clientPromise from '@/lib/mongodb';

export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('notescafe');

    // Get database stats
    const [totalNotes, totalUsers, recentNotes] = await Promise.all([
      db.collection('notes').countDocuments(),
      db.collection('users').countDocuments(),
      db
        .collection('notes')
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray(),
    ]);

    // Calculate total revenue - this is a simplified example
    // In a real app, you might have an orders/payments collection
    const notesWithPrice = await db.collection('notes').find({}).toArray();
    const totalRevenue = notesWithPrice.reduce(
      (sum, note) => sum + (note.price || 0),
      0
    );

    // Transform _id to string for serialization
    const formattedRecentNotes = recentNotes.map((note) => ({
      ...note,
      _id: note._id.toString(),
      createdAt: note.createdAt || new Date().toISOString(),
    }));

    return NextResponse.json({
      stats: {
        totalNotes,
        totalUsers,
        totalRevenue,
      },
      recentNotes: formattedRecentNotes,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
