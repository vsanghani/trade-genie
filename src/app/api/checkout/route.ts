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
    const price = body.price;
    const customerEmail = sanitizeString(body.customerEmail, 254);
    const businessId = sanitizeString(body.businessId, 100);

    // We are mocking the Stripe Checkout Session creation since we don't have
    // real API keys configured in the environment yet.

    /* PRODUCTION IMPLEMENTATION:
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
            unit_amount: price * 100, // Stripe expects amounts in pence/cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/booking-cancelled`,
      customer_email: customerEmail,
      metadata: {
        businessId,
        serviceType: service
      }
    });
    
    return NextResponse.json({ url: session.url });
    */

    // MOCK RESPONSE for UI Development
    console.log(`[Stripe Mock] Created session for ${service} at A$${price}`);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({
      success: true,
      mock: true,
      url: '/payment-success-mock', // We will route to a mock success page
      message: 'Deposit checkout session created successfully.'
    });

  } catch (error: unknown) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({
      success: false,
      error: 'An internal error occurred. Please try again later.'
    }, { status: 500 });
  }
}
