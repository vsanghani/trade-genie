import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sanitizeString, isValidEmail, getMissingFields, isPositiveNumber } from '@/lib/validation';

// Initialize Stripe with a key from environment variables.
// In development, set STRIPE_SECRET_KEY in .env.local
// In production, set it via your hosting provider's environment config.
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set. See .env.example for required variables.');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // ---- Input Validation ----
    const missing = getMissingFields(['service', 'customerEmail', 'businessId'], body);
    if (missing.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missing.join(', ')}` },
        { status: 400 }
      );
    }

    if (!isPositiveNumber(body.price)) {
      return NextResponse.json(
        { success: false, error: 'Price must be a positive number.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(String(body.customerEmail))) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address.' },
        { status: 400 }
      );
    }

    const service = sanitizeString(body.service, 200);
    const price = Number(body.price);
    const customerEmail = sanitizeString(body.customerEmail, 254);
    const businessId = sanitizeString(body.businessId, 100);
    const origin = req.headers.get('origin');

    if (!origin) {
      return NextResponse.json(
        { success: false, error: 'Request origin is required.' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: {
              name: `${service} Deposit`,
              description: `Booking deposit for ${service}`,
            },
            unit_amount: Math.round(price * 100), // Stripe expects minor units
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/booking-cancelled`,
      customer_email: customerEmail,
      metadata: {
        businessId,
        serviceType: service
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { success: false, error: 'Stripe checkout session did not return a URL.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, url: session.url });

  } catch (error: unknown) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({
      success: false,
      error: 'An internal error occurred. Please try again later.'
    }, { status: 500 });
  }
}
