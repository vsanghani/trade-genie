import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sanitizeString, isValidEmail, getMissingFields, isOneOf } from '@/lib/validation';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY environment variable is not set. See .env.example for required variables.');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_ID_ENV_MAP = {
    pro: {
        monthly: 'STRIPE_PRICE_ID_PRO_MONTHLY',
        annual: 'STRIPE_PRICE_ID_PRO_ANNUAL',
    },
    enterprise: {
        monthly: 'STRIPE_PRICE_ID_ENTERPRISE_MONTHLY',
        annual: 'STRIPE_PRICE_ID_ENTERPRISE_ANNUAL',
    },
} as const;

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // ---- Input Validation ----
        const missing = getMissingFields(['planId', 'billingCycle'], body);
        if (missing.length > 0) {
            return NextResponse.json(
                { success: false, error: `Missing required fields: ${missing.join(', ')}` },
                { status: 400 }
            );
        }

        const planId = sanitizeString(body.planId, 50);
        const billingCycle = sanitizeString(body.billingCycle, 20);
        const email = sanitizeString(body.email || '', 254);
        const origin = req.headers.get('origin');

        if (!isOneOf(planId, ['free', 'pro', 'enterprise'])) {
            return NextResponse.json(
                { success: false, error: 'Invalid plan. Must be one of: free, pro, enterprise.' },
                { status: 400 }
            );
        }

        if (!isOneOf(billingCycle, ['monthly', 'annual'])) {
            return NextResponse.json(
                { success: false, error: 'Invalid billing cycle. Must be "monthly" or "annual".' },
                { status: 400 }
            );
        }

        if (email && !isValidEmail(email)) {
            return NextResponse.json(
                { success: false, error: 'Invalid email address.' },
                { status: 400 }
            );
        }

        if (!origin) {
            return NextResponse.json(
                { success: false, error: 'Request origin is required.' },
                { status: 400 }
            );
        }

        if (planId === 'free') {
            return NextResponse.json({
                success: true,
                plan: 'Free',
                billingCycle,
                message: 'No checkout needed for the free plan.',
                checkoutUrl: `${origin}/subscription-success-mock`,
            });
        }

        const envKey = PRICE_ID_ENV_MAP[planId as 'pro' | 'enterprise'][billingCycle as 'monthly' | 'annual'];
        const priceId = process.env[envKey];

        if (!priceId) {
            return NextResponse.json(
                { success: false, error: `Stripe price ID missing: ${envKey}` },
                { status: 500 }
            );
        }

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${origin}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/pricing`,
            customer_email: email || undefined,
            metadata: {
                planId,
                billingCycle,
            },
        });

        if (!session.url) {
            return NextResponse.json(
                { success: false, error: 'Stripe subscription session did not return a URL.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            plan: planId,
            billingCycle,
            checkoutUrl: session.url,
        });
    } catch (error: unknown) {
        console.error('Subscribe Error:', error);
        return NextResponse.json(
            { success: false, error: 'Subscription failed. Please try again later.' },
            { status: 500 }
        );
    }
}
