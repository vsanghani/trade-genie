import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { ServiceAreaHero } from '@/components/ServiceAreaHero';

// The mock data — in production this would come from a DB call
const SERVICE_AREAS = [
    { slug: 'plumber-in-sandy-bay', trade: 'Plumber', suburb: 'Sandy Bay', description: 'Fast, reliable plumbing for Sandy Bay homes and businesses — from emergency leaks to full fit-outs.', demandLevel: 'High' as const, population: '12,000' },
    { slug: 'plumber-in-battery-point', trade: 'Plumber', suburb: 'Battery Point', description: 'Careful plumbing work in heritage Battery Point properties, plus same-day callouts across Hobart.', demandLevel: 'High' as const, population: '2,500' },
    { slug: 'plumber-in-west-hobart', trade: 'Plumber', suburb: 'West Hobart', description: 'Trusted local plumber for West Hobart — blocked drains, hot water, and bathroom upgrades.', demandLevel: 'Medium' as const, population: '6,500' },
    { slug: 'plumber-in-moonah', trade: 'Plumber', suburb: 'Moonah', description: 'Same-day plumbing in Moonah and Glenorchy — no-nonsense pricing and tidy workmanship.', demandLevel: 'Medium' as const, population: '5,500' },
    { slug: 'plumber-in-kingston', trade: 'Plumber', suburb: 'Kingston', description: 'Kingston and Channel area plumbing — renovations, gas fitting, and emergency repairs.', demandLevel: 'High' as const, population: '11,000' },
    { slug: 'electrician-in-glenorchy', trade: 'Electrician', suburb: 'Glenorchy', description: 'Licensed electricians for Glenorchy — switchboards, safety switches, and commercial fit-outs.', demandLevel: 'High' as const, population: '15,000' },
    { slug: 'electrician-in-new-town', trade: 'Electrician', suburb: 'New Town', description: 'Residential and light commercial electrical work across New Town and northern Hobart.', demandLevel: 'Medium' as const, population: '5,500' },
    { slug: 'roofer-in-bellerive', trade: 'Roofer', suburb: 'Bellerive', description: 'Roof repairs and replacements on the Eastern Shore — Bellerive, wind exposure, and coastal conditions covered.', demandLevel: 'Medium' as const, population: '4,500' },
];

// Pre-render all known service area pages at build time for maximum SEO
export function generateStaticParams() {
    return SERVICE_AREAS.map((area) => ({ slug: area.slug }));
}

// Dynamic SEO metadata per page
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const area = SERVICE_AREAS.find((a) => a.slug === slug);
    if (!area) {
        return { title: 'Service Area Not Found | Trade Genie' };
    }

    const title = `${area.trade} in ${area.suburb} | Trade Genie`;
    const description = `Looking for a trusted ${area.trade.toLowerCase()} in ${area.suburb}? ${area.description} Book online instantly.`;

    return {
        title,
        description,
        openGraph: { title, description },
    };
}

export default async function ServiceAreaPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const area = SERVICE_AREAS.find((a) => a.slug === slug);

    if (!area) {
        return (
            <main>
                <Navbar />
                <section style={{ padding: '12rem 0', textAlign: 'center' }}>
                    <div className="container">
                        <h1 className="section-title">Service area not found</h1>
                        <p className="section-subtitle">The page you&apos;re looking for doesn&apos;t exist.</p>
                        <Link href="/" className="btn btn-primary" style={{ marginTop: '2rem', display: 'inline-block' }}>Back to Home</Link>
                    </div>
                </section>
            </main>
        );
    }

    // Schema.org LocalBusiness markup for this specific location
    const schemaData = {
        '@context': 'https://schema.org',
        '@type': area.trade === 'Electrician' ? 'Electrician' : area.trade === 'Roofer' ? 'RoofingContractor' : 'Plumber',
        name: `Trade Genie ${area.trade} — ${area.suburb}`,
        description: area.description,
        url: `https://tradegenie.com/services/${area.slug}`,
        areaServed: {
            '@type': 'City',
            name: area.suburb,
        },
        address: {
            '@type': 'PostalAddress',
            addressLocality: area.suburb,
            addressCountry: 'AU',
        },
    };

    return (
        <main>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
            />
            <Navbar />
            <ServiceAreaHero
                trade={area.trade}
                suburb={area.suburb}
                description={area.description}
                population={area.population}
                demandLevel={area.demandLevel}
            />

            <footer style={{
                textAlign: 'center',
                padding: '3rem',
                borderTop: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                fontSize: '0.875rem'
            }}>
                <p>&copy; {new Date().getFullYear()} TradeGenie. All rights reserved.</p>
                <p>Built and manager by <a href="https://vrtxlabs.tech" target="_blank">Vrtx Labs</a></p>
            </footer>
        </main>
    );
}
