// models/Event.ts

import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './userModal'; // Assuming the User model is defined

// Define the interface for the Event document
export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  completionTime?: Date;  // Optional, will be set when the event is completed
  status: 'pending' | 'completed' | 'done';  // Event status
  user: IUser['_id']; // Reference to the User model (_id of the user)
  createdAt: Date;
  updatedAt: Date;
}

// Create the Mongoose schema for the Event model
const eventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  completionTime: { type: Date, default: null }, // Optional field
  status: {
    type: String,
    enum: ['pending', 'completed', 'done'],
    default: 'pending',
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create the Event model
const Event = mongoose.model<IEvent>('Event', eventSchema);

export default Event;
