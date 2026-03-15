import { NextResponse } from 'next/server';
import { sanitizeString, isValidEmail, getMissingFields, isOneOf } from '@/lib/validation';

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

        // In production, this would create a real Stripe Checkout Session
        // for a recurring subscription using stripe.checkout.sessions.create()
        // with mode: 'subscription' and the appropriate price ID.

        const plans: Record<string, { name: string; monthlyPrice: number }> = {
            free: { name: 'Free', monthlyPrice: 0 },
            pro: { name: 'Pro', monthlyPrice: 29 },
            enterprise: { name: 'Enterprise', monthlyPrice: 79 },
        };

        const plan = plans[planId]!;

        const price = billingCycle === 'annual'
            ? Math.round(plan.monthlyPrice * 12 * 0.8) // 20% discount
            : plan.monthlyPrice;

        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log(`[Stripe Sub Mock] ${email || 'anonymous'} → ${plan.name} (${billingCycle}) at £${price}`);

        return NextResponse.json({
            success: true,
            mock: true,
            plan: plan.name,
            billingCycle,
            price,
            currency: 'gbp',
            message: `Subscription to ${plan.name} (${billingCycle}) initiated successfully.`,
            checkoutUrl: '/subscription-success-mock',
        });
    } catch (error) {
        console.error('Subscribe Error:', error);
        return NextResponse.json(
            { success: false, error: 'Subscription failed. Please try again later.' },
            { status: 500 }
        );
    }
}
