import { NextResponse } from 'next/server';

export interface ServiceArea {
    slug: string;
    trade: string;
    suburb: string;
    description: string;
    demandLevel: 'High' | 'Medium' | 'Low';
    population: string;
}

// In production, these would be stored per-business in Supabase
// and the tradesperson could add/remove suburbs from their dashboard.
const SERVICE_AREAS: ServiceArea[] = [
    { slug: 'plumber-in-richmond', trade: 'Plumber', suburb: 'Richmond', description: 'Fast, reliable plumbing services across Richmond for homes and businesses.', demandLevel: 'High', population: '28,000' },
    { slug: 'plumber-in-south-yarra', trade: 'Plumber', suburb: 'South Yarra', description: 'Expert plumbing repairs, installations, and emergency callouts in South Yarra.', demandLevel: 'High', population: '24,000' },
    { slug: 'plumber-in-hawthorn', trade: 'Plumber', suburb: 'Hawthorn', description: 'Trusted local plumber serving Hawthorn households for over a decade.', demandLevel: 'Medium', population: '22,000' },
    { slug: 'plumber-in-collingwood', trade: 'Plumber', suburb: 'Collingwood', description: 'Same-day plumbing service in Collingwood. No callout fee.', demandLevel: 'Medium', population: '10,000' },
    { slug: 'plumber-in-fitzroy', trade: 'Plumber', suburb: 'Fitzroy', description: 'Professional plumbing solutions in Fitzroy — from leaks to full renovations.', demandLevel: 'Medium', population: '11,000' },
    { slug: 'electrician-in-richmond', trade: 'Electrician', suburb: 'Richmond', description: 'Licensed electricians serving Richmond for residential and commercial jobs.', demandLevel: 'High', population: '28,000' },
    { slug: 'electrician-in-south-yarra', trade: 'Electrician', suburb: 'South Yarra', description: 'Reliable electrical services in South Yarra — safety checks, rewiring, and more.', demandLevel: 'Medium', population: '24,000' },
    { slug: 'roofer-in-richmond', trade: 'Roofer', suburb: 'Richmond', description: 'Roof repairs, replacements, and inspections across Richmond.', demandLevel: 'Low', population: '28,000' },
];

export async function GET() {
    return NextResponse.json({
        success: true,
        data: SERVICE_AREAS,
    });
}
