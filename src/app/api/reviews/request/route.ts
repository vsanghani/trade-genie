import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        // ---- Authentication ----
        const auth = await requireAuth();
        if (!auth.authenticated) return auth.response;

        const body = await req.json();
        const { customerName, customerPhone, businessName, googleReviewLink = 'https://g.page/r/demo/review' } = body;

        // In a real application, this endpoint would be triggered by a background job (like Inngest or Upstash)
        // 3 days after a job is marked "complete" in the business owner's dashboard.
        // It would then use the Twilio or WhatsApp Cloud API to send the message directly to the customer.

        // Here, we simulate generating the message that would be sent.
        const message = `Hi ${customerName}, thanks for choosing ${businessName}! We hope you were happy with the service. We'd love it if you could leave a quick review here: ${googleReviewLink}`;

        // For demonstration purposes, we'll return a wa.me link that the business owner can click
        // to manually send the review request if they prefer not to use full automation.
        const encodedMessage = encodeURIComponent(message);
        const manualReviewLink = `https://wa.me/${customerPhone.replace(/\D/g, '')}?text=${encodedMessage}`;

        return NextResponse.json({
            success: true,
            message: 'Automated review request simulated successfully.',
            simulatedMessage: message,
            manualReviewLink: manualReviewLink
        });

    } catch (error: unknown) {
        console.error('Review Request Error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to process review request'
        }, { status: 500 });
    }
}
