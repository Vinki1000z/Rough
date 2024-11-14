import { NextRequest, NextResponse } from 'next/server'; // Use NextRequest and NextResponse
import Event from '@/model/eventModal'; // Adjust the path to your Event model
import { getDataFromToken } from '@/helper/getDataFromToken'; // Adjust the path to the utility function
import { connect } from '@/dbConfig/dbConfig'; // Ensure the database connection is correct

// GET - Fetch events for a specific user based on the user ID
export const GET = async () => {
  try {
    // Get the user ID from the token
    const userId = getDataFromToken(); // This will get the user ID from the token
    if (!userId) {
      return NextResponse.json({ message: 'User is not authenticated' }, { status: 401 });
    }

    await connect();

    // Fetch the events for the specific user
    const events = await Event.find({ user: userId }).populate('user', 'name'); // Populate user data if needed
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ message: 'Error fetching events for the user' }, { status: 500 });
  }
};

// POST - Add a new event (with completionDate handling)
export const POST = async (req: NextRequest) => {
  try {
    await connect();

    // Get the user ID from the token
    const userId = getDataFromToken();  // This will use the function you wrote to get the user ID from the token
    if (!userId) {
      return NextResponse.json({ message: 'User is not authenticated' }, { status: 401 });
    }

    // Parse the request body
    const { title, description, date, status, completionDate } = await req.json(); // Use req.json() to parse body

    // Make sure the required fields are present
    if (!title || !description || !date) {
      console.log(title, description, date, status, completionDate);
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Create a new event document
    const newEvent = new Event({
      title,
      description,
      date,
      status: status || 'pending',  // Default to 'pending' if no status is provided
      user: userId,  // Set the user to the ID fetched from the token
      // Only include completionDate if it's provided
      ...(completionDate && { completionDate }),
    });

    await newEvent.save();
    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error('Error adding event:', error);
    return NextResponse.json({ message: 'Error adding event' }, { status: 500 });
  }
};
