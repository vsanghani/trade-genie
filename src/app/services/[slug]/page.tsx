import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { ServiceAreaHero } from '@/components/ServiceAreaHero';

// The mock data — in production this would come from a DB call
const SERVICE_AREAS = [
    { slug: 'plumber-in-richmond', trade: 'Plumber', suburb: 'Richmond', description: 'Fast, reliable plumbing services across Richmond for homes and businesses.', demandLevel: 'High' as const, population: '28,000' },
    { slug: 'plumber-in-south-yarra', trade: 'Plumber', suburb: 'South Yarra', description: 'Expert plumbing repairs, installations, and emergency callouts in South Yarra.', demandLevel: 'High' as const, population: '24,000' },
    { slug: 'plumber-in-hawthorn', trade: 'Plumber', suburb: 'Hawthorn', description: 'Trusted local plumber serving Hawthorn households for over a decade.', demandLevel: 'Medium' as const, population: '22,000' },
    { slug: 'plumber-in-collingwood', trade: 'Plumber', suburb: 'Collingwood', description: 'Same-day plumbing service in Collingwood. No callout fee.', demandLevel: 'Medium' as const, population: '10,000' },
    { slug: 'plumber-in-fitzroy', trade: 'Plumber', suburb: 'Fitzroy', description: 'Professional plumbing solutions in Fitzroy — from leaks to full renovations.', demandLevel: 'Medium' as const, population: '11,000' },
    { slug: 'electrician-in-richmond', trade: 'Electrician', suburb: 'Richmond', description: 'Licensed electricians serving Richmond for residential and commercial jobs.', demandLevel: 'High' as const, population: '28,000' },
    { slug: 'electrician-in-south-yarra', trade: 'Electrician', suburb: 'South Yarra', description: 'Reliable electrical services in South Yarra — safety checks, rewiring, and more.', demandLevel: 'Medium' as const, population: '24,000' },
    { slug: 'roofer-in-richmond', trade: 'Roofer', suburb: 'Richmond', description: 'Roof repairs, replacements, and inspections across Richmond.', demandLevel: 'Low' as const, population: '28,000' },
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
                        <a href="/" className="btn btn-primary" style={{ marginTop: '2rem', display: 'inline-block' }}>Back to Home</a>
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
            </footer>
        </main>
    );
}
