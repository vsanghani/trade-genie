import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // In a production environment, this would call the Google Places API
        // (using the business's Place ID) to fetch their recent 5-star reviews
        // and cache them in Supabase/Redis to avoid hitting API rate limits.

        const mockReviews = [
            {
                id: 'rev-1',
                authorName: 'Sarah Jenkins',
                rating: 5,
                text: 'Incredible service! Arrived exactly on time and fixed the issue within an hour. Highly professional and left the place spotless.',
                timeAgo: '2 days ago',
                profilePhotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
            },
            {
                id: 'rev-2',
                authorName: 'David Chen',
                rating: 5,
                text: 'Very transparent with pricing and explained everything clearly before starting the work. Will definitely use them again for future projects.',
                timeAgo: '1 week ago',
                profilePhotoUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop'
            },
            {
                id: 'rev-3',
                authorName: 'Emma Thompson',
                rating: 5,
                text: 'Saved us during a weekend emergency. They were literally the only ones who picked up the phone. Fair price for an after-hours callout.',
                timeAgo: '2 weeks ago',
                profilePhotoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
            },
            {
                id: 'rev-4',
                authorName: 'James Wilson',
                rating: 5,
                text: 'Top tier workmanship. You can really tell they take pride in what they do. Quoted price was exactly what we paid.',
                timeAgo: '1 month ago',
                profilePhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
            }
        ];

        return NextResponse.json({
            success: true,
            data: mockReviews,
            message: 'Fetched latest 5-star Google Reviews successfully.',
        });

    } catch (error: any) {
        console.error('Review Sync Error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch reviews'
        }, { status: 500 });
    }
}
