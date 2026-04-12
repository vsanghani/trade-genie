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
    { slug: 'plumber-in-sandy-bay', trade: 'Plumber', suburb: 'Sandy Bay', description: 'Fast, reliable plumbing for Sandy Bay homes and businesses — from emergency leaks to full fit-outs.', demandLevel: 'High', population: '12,000' },
    { slug: 'plumber-in-battery-point', trade: 'Plumber', suburb: 'Battery Point', description: 'Careful plumbing work in heritage Battery Point properties, plus same-day callouts across Hobart.', demandLevel: 'High', population: '2,500' },
    { slug: 'plumber-in-west-hobart', trade: 'Plumber', suburb: 'West Hobart', description: 'Trusted local plumber for West Hobart — blocked drains, hot water, and bathroom upgrades.', demandLevel: 'Medium', population: '6,500' },
    { slug: 'plumber-in-moonah', trade: 'Plumber', suburb: 'Moonah', description: 'Same-day plumbing in Moonah and Glenorchy — no-nonsense pricing and tidy workmanship.', demandLevel: 'Medium', population: '5,500' },
    { slug: 'plumber-in-kingston', trade: 'Plumber', suburb: 'Kingston', description: 'Kingston and Channel area plumbing — renovations, gas fitting, and emergency repairs.', demandLevel: 'High', population: '11,000' },
    { slug: 'electrician-in-glenorchy', trade: 'Electrician', suburb: 'Glenorchy', description: 'Licensed electricians for Glenorchy — switchboards, safety switches, and commercial fit-outs.', demandLevel: 'High', population: '15,000' },
    { slug: 'electrician-in-new-town', trade: 'Electrician', suburb: 'New Town', description: 'Residential and light commercial electrical work across New Town and northern Hobart.', demandLevel: 'Medium', population: '5,500' },
    { slug: 'roofer-in-bellerive', trade: 'Roofer', suburb: 'Bellerive', description: 'Roof repairs and replacements on the Eastern Shore — Bellerive, wind exposure, and coastal conditions covered.', demandLevel: 'Medium', population: '4,500' },
];

export async function GET() {
    return NextResponse.json({
        success: true,
        data: SERVICE_AREAS,
    });
}
