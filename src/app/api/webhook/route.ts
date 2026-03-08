import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { type, orderDetails, customerName, customerPhone, businessWhatsApp } = body;

        // We handle two types of webhooks now:
        // 1. 'lead' - A standard inquiry
        // 2. 'invoice_request' - Tradesperson wants to send a quote

        if (type === 'lead') {
            // Create a 1-click WhatsApp quote reply link for the Tradesperson
            // This is the formatted text the tradesperson will see when they click the link
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
        return NextResponse.json({
            success: false,
            error: 'Webhook processing failed'
        }, { status: 500 });
    }
}
