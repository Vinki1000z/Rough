import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Event from '@/model/eventModal';
import User, { IUser } from "@/model/userModal"; // Import IUser for type checking

export const PATCH = async (req: NextRequest, context: { params: { eventId: string } }) => {
    try {
        await connect();  // Ensure you're connected to the database

        // Get the user ID from the headers
        const userId = req.headers.get('userId');

        // Validate that the user ID is provided
        if (!userId) {
            return NextResponse.json({ message: 'User is not authenticated' }, { status: 401 });
        }

        // Destructure and retrieve the eventId from context.params
        const { eventId } = context.params;

        // Parse the JSON body to get the status
        const { status } = await req.json();

        // Find the event by ID and ensure it belongs to the user
        const event = await Event.findOne({ _id: eventId, userId });
        
        if (!event) {
            return NextResponse.json({ message: 'Event not found or not authorized' }, { status: 404 });
        }

        // Initialize points to hold the updated points value
        let points = 0;

        // If status is "Completed", add points to the user
        if (status === "Completed") {
            const user = await User.findById(userId); // Find the user by userId
            
            if (!user) {
                return NextResponse.json({ message: 'User not found' }, { status: 404 });
            }

            // Type the user as IUser to access points
            const typedUser = user as IUser;

            // Add 10 points to the user's score
            typedUser.points += 10;
            await typedUser.save(); // Save the updated user

            // Store the updated points value
            points = typedUser.points;
        } else if (event.status === "Completed" && status !== "Completed") {
            // If the event status was "Completed" and is changing to something else, subtract points
            const user = await User.findById(userId); // Find the user by userId
            
            if (!user) {
                return NextResponse.json({ message: 'User not found' }, { status: 404 });
            }

            // Type the user as IUser to access points
            const typedUser = user as IUser;

            // Subtract 10 points from the user's score
            typedUser.points -= 10;
            await typedUser.save(); // Save the updated user

            // Store the updated points value
            points = typedUser.points;
        }

        // Now, update the event status
        event.status = status;
        await event.save(); // Save the updated event

        // Return the updated event and points in the response
        return NextResponse.json({ event, points }, { status: 200 });

    } catch (error) {
        console.error('Error updating event:', error);
        return NextResponse.json({ message: 'Error updating event' }, { status: 500 });
    }
};
