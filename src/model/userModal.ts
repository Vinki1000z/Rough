// models/User.ts

import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the User document
export interface IUser extends Document {
  name: string;
  email: string;
  points: number; // Points field to track user progress
  createdAt: Date;
  updatedAt: Date;
}

// Create the Mongoose schema for the User model
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  points: { type: Number, default: 0 }, // Default value of points is 0
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create the User model
const User = mongoose.model<IUser>('User', userSchema);

export default User;
