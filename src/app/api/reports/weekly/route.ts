import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // In production, this would aggregate data from:
        // - Vercel Analytics (page views, unique visitors)
        // - Supabase (leads generated, bookings completed)
        // - Google Search Console API (keyword ranking changes)

        // Generate slightly randomised mock data so the UI feels dynamic
        const baseVisitors = 120 + Math.floor(Math.random() * 60);
        const baseLeads = 3 + Math.floor(Math.random() * 5);
        const rankingDelta = Math.floor(Math.random() * 5) - 1; // -1 to +3

        const weeklyReport = {
            period: {
                start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
                end: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            },
            stats: {
                visitors: baseVisitors,
                visitorsChange: '+12%',
                leads: baseLeads,
                leadsChange: `+${Math.floor(Math.random() * 3) + 1}`,
                googleRanking: rankingDelta,
                bookingsCompleted: Math.floor(Math.random() * 3) + 1,
                topPage: '/services/emergency-plumbing',
                reviewsReceived: Math.floor(Math.random() * 3),
            },
            // Sparkline data points for a mini visitor chart (last 7 days)
            sparkline: Array.from({ length: 7 }, () => 10 + Math.floor(Math.random() * 25)),
        };

        return NextResponse.json({
            success: true,
            data: weeklyReport,
        });
    } catch (error: any) {
        console.error('Weekly Report Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to generate weekly report' },
            { status: 500 }
        );
    }
}
