import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Event from '@/model/eventModal';
import User, { IUser } from "@/model/userModal";

// Define the Params type as a Promise
type Params = Promise<{ eventId: string }>;

export const PATCH = async (req: NextRequest, { params }: { params: Params }) => {
  try {
    // Wait for the params to resolve
    const { eventId } = await params;

    await connect(); // Ensure database connection

    // Get the user ID from the headers
    const userId = req.headers.get('userId');
    if (!userId) {
      return NextResponse.json({ message: 'User is not authenticated' }, { status: 401 });
    }

    // Retrieve the status from the request body
    const { status } = await req.json();

    // Find the event by ID, ensuring it belongs to the user
    const event = await Event.findOne({ _id: eventId, userId });
    if (!event) {
      return NextResponse.json({ message: 'Event not found or not authorized' }, { status: 404 });
    }

    // Initialize points for the updated points value
    let points = 0;

    // Retrieve the user and update points based on status
    const user = await User.findById(userId) as IUser;
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (status === "Completed" && event.status !== "Completed") {
      // If changing to "Completed", add points
      user.points += 10;
    } else if (event.status === "Completed" && status !== "Completed") {
      // If status was "Completed" and is changing, subtract points
      user.points -= 10;
    }

    await user.save(); // Save the updated user points
    points = user.points; // Store the updated points

    // Update the event status and save
    event.status = status;
    await event.save();

    // Return updated event and points in response
    return NextResponse.json({ event, points }, { status: 200 });

  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ message: 'Error updating event' }, { status: 500 });
  }
};
