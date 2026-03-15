import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        // ---- Authentication ----
        const auth = await requireAuth();
        if (!auth.authenticated) return auth.response;

        const body = await req.json();
        const { businessOwnerName, businessOwnerPhone, stats } = body;

        // In production, this would be triggered by a CRON job (e.g., Vercel Cron or Inngest)
        // every Monday morning, pulling the weekly analytics and sending it via the
        // WhatsApp Cloud API or Twilio automatically.

        const message =
            `Hey ${businessOwnerName}! 📊 Your Trade Genie weekly summary is here:\n\n` +
            `🌐 Website visitors: ${stats.visitors} (${stats.visitorsChange})\n` +
            `📩 New leads: ${stats.leads}\n` +
            `📈 Google ranking: ${stats.googleRanking >= 0 ? `Up ${stats.googleRanking} positions` : `Down ${Math.abs(stats.googleRanking)} position`}\n` +
            `✅ Bookings completed: ${stats.bookingsCompleted}\n` +
            `⭐ Reviews received: ${stats.reviewsReceived}\n\n` +
            `Keep it up! Your online presence is working hard for you. 💪`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappLink = `https://wa.me/${businessOwnerPhone.replace(/\D/g, '')}?text=${encodedMessage}`;

        return NextResponse.json({
            success: true,
            message: 'Weekly report WhatsApp delivery simulated.',
            simulatedMessage: message,
            whatsappLink,
        });
    } catch (error: any) {
        console.error('Report Send Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to send weekly report' },
            { status: 500 }
        );
    }
}
