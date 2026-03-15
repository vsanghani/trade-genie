import { NextResponse } from 'next/server';
import { sanitizeString, isValidPhone, getMissingFields, isOneOf } from '@/lib/validation';

// =============================================================================
// Webhook Signature Verification (PRODUCTION)
// =============================================================================
// When using real Stripe webhooks, verify the signature using the raw body:
//
//   import Stripe from 'stripe';
//   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
//   const sig = req.headers.get('stripe-signature')!;
//   const rawBody = await req.text();
//   const event = stripe.webhooks.constructEvent(
//     rawBody,
//     sig,
//     process.env.STRIPE_WEBHOOK_SECRET!
//   );
//
// Never process a webhook event without verifying its signature first.
// =============================================================================

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // ---- Input Validation ----
        if (!body.type || !isOneOf(body.type, ['lead'])) {
            return NextResponse.json(
                { success: false, error: 'Invalid or missing webhook type. Supported types: lead.' },
                { status: 400 }
            );
        }

        if (body.type === 'lead') {
            const missing = getMissingFields(
                ['orderDetails', 'customerName', 'customerPhone', 'businessWhatsApp'],
                body
            );
            if (missing.length > 0) {
                return NextResponse.json(
                    { success: false, error: `Missing required fields: ${missing.join(', ')}` },
                    { status: 400 }
                );
            }

            if (!isValidPhone(String(body.customerPhone))) {
                return NextResponse.json(
                    { success: false, error: 'Invalid customer phone number format.' },
                    { status: 400 }
                );
            }

            if (!isValidPhone(String(body.businessWhatsApp))) {
                return NextResponse.json(
                    { success: false, error: 'Invalid business WhatsApp number format.' },
                    { status: 400 }
                );
            }

            const orderDetails = sanitizeString(body.orderDetails, 1000);
            const customerName = sanitizeString(body.customerName, 200);
            const customerPhone = sanitizeString(body.customerPhone, 20);
            const businessWhatsApp = sanitizeString(body.businessWhatsApp, 20);

            // Create a 1-click WhatsApp quote reply link for the Tradesperson
            const encodedMessage = encodeURIComponent(
                `Hi ${customerName}, thanks for reaching out via my website! I've reviewed your request for: "${orderDetails}". I can provide a formal quote of £___ for this job. Let me know if you'd like to proceed and I'll send over a payment link.`
            );

            const oneClickQuoteLink = `https://wa.me/${customerPhone.replace(/\D/g, '')}?text=${encodedMessage}`;

            // In production, we send the notification to the *Tradesperson* (businessWhatsApp)
            // containing the lead info AND the handy 1-click reply link back to the *Customer*.
            console.log(`[Webhook Mock] Sending lead to Tradesperson: ${businessWhatsApp}`);
            console.log(`[Webhook Mock] 1-Click Quote Link generated: ${oneClickQuoteLink}`);

            return NextResponse.json({
                success: true,
                message: 'Lead forwarded successfully via WhatsApp webhook mock',
                quoteLink: oneClickQuoteLink
            });
        }

        return NextResponse.json({
            success: false,
            error: 'Unknown webhook type'
        }, { status: 400 });

    } catch (error) {
        console.error('Webhook Processing Error:', error);
        return NextResponse.json({
            success: false,
            error: 'Webhook processing failed. Please try again later.'
        }, { status: 500 });
    }
}
