import { NextResponse } from 'next/server';
import { sanitizeString, getMissingFields } from '@/lib/validation';
import { requireAuth } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        // ---- Authentication ----
        const auth = await requireAuth();
        if (!auth.authenticated) return auth.response;

        const body = await req.json();

        // ---- Input Validation ----
        const missing = getMissingFields(['industry'], body);
        if (missing.length > 0) {
            return NextResponse.json(
                { success: false, error: `Missing required fields: ${missing.join(', ')}` },
                { status: 400 }
            );
        }

        const industry = sanitizeString(body.industry, 100);
        const location = sanitizeString(body.location || 'your area', 200);
        const businessName = sanitizeString(body.businessName || 'this business', 200);

        // Simulate AI Generation Delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Mock AI Blog Return Payload
        // In production, this would be an OpenAI call instructed to write an SEO-optimized JSON array of blog articles
        const mockBlogs = [
            {
                id: 'blog-1',
                title: `5 Signs You Need Emergency ${industry} Services in ${location}`,
                excerpt: `Don't wait until it's too late. Learn the top warning signs that indicate you need professional ${industry.toLowerCase()} help immediately to avoid costly damages...`,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                readTime: '4 min read',
                imageUrl: `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800&h=500` // generic placeholder
            },
            {
                id: 'blog-2',
                title: `How Much Does a ${industry} Cost in ${location}? (2025 Guide)`,
                excerpt: `Pricing out a project can be stressful. We break down the average costs for common ${industry.toLowerCase()} jobs in ${location} and what to look out for when hiring a pro...`,
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                readTime: '6 min read',
                imageUrl: `https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800&h=500`
            },
            {
                id: 'blog-3',
                title: `Why Routine Maintenance is Crucial for Your Home's Value`,
                excerpt: `Protect your biggest investment. ${businessName} explains why setting up a regular maintenance schedule can save you thousands of dollars in the long run.`,
                date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                readTime: '3 min read',
                imageUrl: `https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800&h=500`
            }
        ];

        return NextResponse.json({
            success: true,
            data: mockBlogs,
            message: 'Generated localized SEO blog posts successfully.',
        });
    } catch (error) {
        console.error('Blog Generation Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to generate blog posts. Please try again later.' },
            { status: 500 }
        );
    }
}
