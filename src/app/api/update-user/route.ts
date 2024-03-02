// pages/api/update-user.js
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../../utils/mongodb';

export async function POST(request: NextRequest) {
  try {
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await request.json();
    const { email, password } = data;

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { db } = await connectToDatabase();
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

    await db.collection('users').updateOne(
      { email },
      {
        $set: {
          password: hashedPassword,
          activated: true,
        },
      },
      { upsert: true }
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return new Response(JSON.stringify({ error: 'Failed to update user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
