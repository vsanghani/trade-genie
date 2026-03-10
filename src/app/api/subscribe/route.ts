import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { planId, billingCycle, email = 'user@example.com' } = body;

        // In production, this would create a real Stripe Checkout Session
        // for a recurring subscription using stripe.checkout.sessions.create()
        // with mode: 'subscription' and the appropriate price ID.

        const plans: Record<string, { name: string; monthlyPrice: number }> = {
            free: { name: 'Free', monthlyPrice: 0 },
            pro: { name: 'Pro', monthlyPrice: 29 },
            enterprise: { name: 'Enterprise', monthlyPrice: 79 },
        };

        const plan = plans[planId];
        if (!plan) {
            return NextResponse.json({ success: false, error: 'Invalid plan' }, { status: 400 });
        }

        const price = billingCycle === 'annual'
            ? Math.round(plan.monthlyPrice * 12 * 0.8) // 20% discount
            : plan.monthlyPrice;

        // Simulate processing delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log(`[Stripe Sub Mock] ${email} → ${plan.name} (${billingCycle}) at £${price}`);

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
    } catch (error: any) {
        console.error('Subscribe Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Subscription failed' },
            { status: 500 }
        );
    }
}
