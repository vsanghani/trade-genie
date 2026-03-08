import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with a dummy key for development/mocking purposes.
const stripe = new Stripe('sk_test_mock_dummy_key_12345');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { service, price, customerEmail, businessId } = body;

    // We are mocking the Stripe Checkout Session creation since we don't have
    // real API keys configured in the environment yet.

    /* PRODUCTION IMPLEMENTATION:
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
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
    console.log(`[Stripe Mock] Created session for ${service} at £${price}`);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({
      success: true,
      mock: true,
      url: '/payment-success-mock', // We will route to a mock success page
      message: 'Deposit checkout session created successfully.'
    });

  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal Server Error'
    }, { status: 500 });
  }
}
