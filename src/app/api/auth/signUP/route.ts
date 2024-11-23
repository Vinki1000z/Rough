// app/api/auth/signUp/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import {connect} from '@/dbConfig/dbConfig'; // Import the database connection
import User from '@/model/userModal'; // Import the User model

// Define schema for request validation
const signupSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    console.log("API endpoint hit");

    // Parse the request body
    const body = await request.json();
    const { username, email, password } = signupSchema.parse(body);

    // Connect to the database
    await connect();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'Email is already registered' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = new User({
      name: username,
      email,
      points: 0, // Initial points set to 0
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });
  } catch (error) {
    console.error('Error during signup:', error);
    const message = error instanceof z.ZodError ? error.errors : 'Failed to create user';
    return NextResponse.json({ message }, { status: 400 });
  }
}
