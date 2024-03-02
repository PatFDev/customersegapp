import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { connectToDatabase } from '../../utils/mongodb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Use named export for the GET method
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const session_id = url.searchParams.get('session_id');

  if (!session_id) {
    return new Response(JSON.stringify({ error: 'Session ID is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    console.log('Retrieving session:', session_id);
    const session = await stripe.checkout.sessions.retrieve(session_id as string);
    const { db } = await connectToDatabase();
    
    const user = {
      email: session.customer_details?.email,
      name: session.customer_details?.name,
      stripeCustomerId: session.customer,
      stripeSubscriptionId: session.subscription,
      activated: false,
    };

    try {
      await db.collection('users').updateOne(
        { email: user.email },
        { $set: user },
        { upsert: true }
      );

      return new Response(JSON.stringify({ success: true, session }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (dbError) {
      // Check if the error is a duplicate key error
      if (dbError.code === 11000) { // MongoDB duplicate key error code
        return new Response(JSON.stringify({ error: 'User already exists and cannot be updated' }), {
          status: 409, // Conflict
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        throw dbError; // Rethrow the error if it's not a duplicate key error
      }
    }
  } catch (error) {
    console.error('Failed to retrieve session or interact with DB:', error);
    return new Response(JSON.stringify({ error: 'Failed to process the request', details: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
