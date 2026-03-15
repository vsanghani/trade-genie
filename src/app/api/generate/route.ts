import { NextResponse } from 'next/server';
import { sanitizeString, isValidPhone, getMissingFields } from '@/lib/validation';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // ---- Input Validation ----
        const missing = getMissingFields(['businessName', 'industry', 'phone', 'description'], body);
        if (missing.length > 0) {
            return NextResponse.json(
                { success: false, error: `Missing required fields: ${missing.join(', ')}` },
                { status: 400 }
            );
        }

        if (!isValidPhone(String(body.phone))) {
            return NextResponse.json(
                { success: false, error: 'Invalid phone number format.' },
                { status: 400 }
            );
        }

        const businessName = sanitizeString(body.businessName, 200);
        const industry = sanitizeString(body.industry, 100);
        const phone = sanitizeString(body.phone, 20);
        const description = sanitizeString(body.description, 1000);

        // Simulate AI Processing Time
        await new Promise(resolve => setTimeout(resolve, 2000));

        // In a real application, you would pass these variables to OpenAI/Claude here,
        // and receive a JSON structure determining the website template payload.

        // For now, we stub a mock successful generation response
        const mockGeneratedSiteData = {
            heroTitle: `Expert ${industry} Services`,
            heroSubtitle: description,
            businessName: businessName,
            contactWhatsApp: phone,
            themeColors: {
                primary: '#6366f1',
                secondary: '#a855f7'
            },
            status: 'ready'
        };

        return NextResponse.json({
            success: true,
            websiteConfig: mockGeneratedSiteData,
            message: 'Website dynamically generated via AI'
        });

    } catch (error) {
        console.error('Generate Error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to generate website. Please try again later.'
        }, { status: 500 });
    }
}
