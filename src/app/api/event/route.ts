import { NextRequest, NextResponse } from 'next/server'; // Use NextRequest and NextResponse
import Event from '@/model/eventModal'; // Adjust the path to your Event models
import { connect } from '@/dbConfig/dbConfig'; // Ensure the database connection is correct
export const GET = async (req: Request) => {
    try {
      // Get the user ID from the headers
      const userId = req.headers.get('userId');

      console.log(userId)
      // Validate that the user ID is provided
      if (!userId) {
        return NextResponse.json({ message: 'User ID is missing' }, { status: 400 });
      }
  
      await connect();
  
      // Fetch the events for the specific user
      const events = await Event.find({ userId: userId })// Populate user data if needed
      console.log(events);
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
  
      // Get the user ID from the headers
      const userId = req.headers.get('userId');
      // console.log(userId+"wdqdq");
      // Validate that the user ID is provided
      if (!userId) {
        return NextResponse.json({ message: 'User is not authenticated' }, { status: 401 });
      }
  
      // Parse the request body
      const { title, description, date, status, completionDate } = await req.json();
  
      // Check for required fields
      if (!title || !description || !date) {
        // console.log(title, description, date, status, completionDate);
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
      }
  
      // Create a new event document
      const newEvent = new Event({
        title,
        description,
        date,
        status: status || 'pending',
        userId: userId,
        ...(completionDate && { completionDate }),
      });

      // console.log(newEvent);
      await newEvent.save();
      return NextResponse.json(newEvent, { status: 201 });
    } catch (error) {
      console.error('Error adding event:', error);
      return NextResponse.json({ message: 'Error adding event' }, { status: 500 });
    }
  };

  