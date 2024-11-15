// src/app/api/user/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import User from '@/model/userModal'; // Import User model

// Handle GET request to retrieve user score
export const GET = async (req: NextRequest, { params }: { params: Promise<{ userId: string }> }) => {
  try {
    await connect(); // Ensure you're connected to the database

    const { userId } = await params; // Await params to access userId

    // Find the user by userId
    const user = await User.findById(userId);
    
    // If user is not found, return an error
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Return the user score (points)
    return NextResponse.json({ points: user.points }, { status: 200 });

  } catch (error) {
    console.error('Error fetching user score:', error);
    return NextResponse.json({ message: 'Error fetching user score' }, { status: 500 });
  }
};
