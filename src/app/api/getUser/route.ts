// pages/api/getUser.ts
import { ObjectId } from 'mongodb'; // Make sure to import ObjectId
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../utils/jwt'; // Adjust the path as necessary
import { connectToDatabase } from '../../utils/mongodb'; // Adjust the path as necessary
import { JwtPayload } from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  const verifiedToken = verifyToken(request);
  console.log('verifiedToken:', verifiedToken); // Debugging

  if (!verifiedToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const { db } = await connectToDatabase();
    // Assuming the token contains the user's ID in a `userId` claim
    const userId = new ObjectId((verifiedToken as any).userId);
    console.log('userId:', userId); // Debugging

    const user = await db.collection('users').findOne({ _id: userId });
    if (!user) {
        return new Response(JSON.stringify({ error: 'User not found' }), {
            status: 404,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    return NextResponse.json({
      email: user.email,
      name: user.name,
    });
  } catch (err) {
    console.error('Error retrieving user:', err);
    return new Response(JSON.stringify({ error: 'Failed to retrieve user' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
