// pages/api/retrieve-session.ts (or .js)
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Assuming the use of Edge Functions, which supports using `NextRequest` and `NextResponse`.


export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const session_id = url.searchParams.get('session_id');

  if (!session_id) {
    return new Response(JSON.stringify({ error: 'Session ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
    });
    const session = await stripe.checkout.sessions.retrieve(session_id);

    const response = JSON.stringify({
      success: true,
      session: {
        name: session.customer_details?.name,
        email: session.customer_details?.email,
      },
    });

    return new Response(response, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to retrieve session:', error);
    return new Response(JSON.stringify({ error: 'Failed to retrieve session' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
