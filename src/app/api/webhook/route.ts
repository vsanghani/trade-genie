import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sanitizeString, isValidPhone, getMissingFields, isOneOf } from '@/lib/validation';

function validateLeadPayload(payload: Record<string, unknown>) {
    if (!payload.type || !isOneOf(payload.type, ['lead'])) {
        return {
            valid: false as const,
            response: NextResponse.json(
                { success: false, error: 'Invalid or missing webhook type. Supported types: lead.' },
                { status: 400 }
            ),
        };
    }

    const missing = getMissingFields(
        ['orderDetails', 'customerName', 'customerPhone', 'businessWhatsApp'],
        payload
    );
    if (missing.length > 0) {
        return {
            valid: false as const,
            response: NextResponse.json(
                { success: false, error: `Missing required fields: ${missing.join(', ')}` },
                { status: 400 }
            ),
        };
    }

    if (!isValidPhone(String(payload.customerPhone))) {
        return {
            valid: false as const,
            response: NextResponse.json(
                { success: false, error: 'Invalid customer phone number format.' },
                { status: 400 }
            ),
        };
    }

    if (!isValidPhone(String(payload.businessWhatsApp))) {
        return {
            valid: false as const,
            response: NextResponse.json(
                { success: false, error: 'Invalid business WhatsApp number format.' },
                { status: 400 }
            ),
        };
    }

    return { valid: true as const };
}

export async function POST(req: Request) {
    try {
        const signature = req.headers.get('stripe-signature');
        const rawBody = await req.text();

        // Production-grade path: verify Stripe signature using raw request body.
        if (signature) {
            if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
                return NextResponse.json(
                    { success: false, error: 'Webhook environment not configured.' },
                    { status: 500 }
                );
            }

            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
            let event: Stripe.Event;

            try {
                event = stripe.webhooks.constructEvent(
                    rawBody,
                    signature,
                    process.env.STRIPE_WEBHOOK_SECRET
                );
            } catch {
                return NextResponse.json(
                    { success: false, error: 'Invalid Stripe webhook signature.' },
                    { status: 400 }
                );
            }

            // Keep handler idempotent and narrow by event type.
            if (event.type === 'checkout.session.completed') {
                console.log('[Stripe Webhook] checkout.session.completed received');
            }

            return NextResponse.json({ success: true, received: true });
        }

        // Dev fallback: allow unsigned local mock payloads for UI development.
        if (process.env.NODE_ENV !== 'development') {
            return NextResponse.json(
                { success: false, error: 'Missing Stripe webhook signature.' },
                { status: 400 }
            );
        }

        const body = JSON.parse(rawBody) as Record<string, unknown>;
        const validation = validateLeadPayload(body);
        if (!validation.valid) return validation.response;

        const orderDetails = sanitizeString(body.orderDetails, 1000);
        const customerName = sanitizeString(body.customerName, 200);
        const customerPhone = sanitizeString(body.customerPhone, 20);
        const businessWhatsApp = sanitizeString(body.businessWhatsApp, 20);

        // Create a 1-click WhatsApp quote reply link for the Tradesperson
        const encodedMessage = encodeURIComponent(
            `Hi ${customerName}, thanks for reaching out via my website! I've reviewed your request for: "${orderDetails}". I can provide a formal quote of £___ for this job. Let me know if you'd like to proceed and I'll send over a payment link.`
        );
        const oneClickQuoteLink = `https://wa.me/${customerPhone.replace(/\D/g, '')}?text=${encodedMessage}`;

        console.log(`[Webhook Mock] Sending lead to Tradesperson: ${businessWhatsApp}`);
        console.log(`[Webhook Mock] 1-Click Quote Link generated: ${oneClickQuoteLink}`);

        return NextResponse.json({
            success: true,
            message: 'Lead forwarded successfully via WhatsApp webhook mock',
            quoteLink: oneClickQuoteLink
        });
    } catch (error: unknown) {
        console.error('Webhook Processing Error:', error);
        return NextResponse.json({
            success: false,
            error: 'Webhook processing failed. Please try again later.'
        }, { status: 500 });
    }
}
