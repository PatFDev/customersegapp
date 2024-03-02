// app/api/checkout/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

console.log(process.env.STRIPE_SECRET_KEY!); // Debugging

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});


export async function POST(request: NextRequest) {
  try {
    const { priceId } = await request.json(); // Extract priceId from the request body
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${new URL(request.url).origin}/return?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${new URL(request.url).origin}/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    console.error(err); // Log the error for debugging
    return new Response(JSON.stringify({ error: { message: 'Failed to create session' }}), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('session_id');
    if (!sessionId) {
      throw new Error('Session ID is required');
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      status: session.payment_status,
      customer_email: session.customer_details?.email,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: { message: 'Failed to retrieve session' }}), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
