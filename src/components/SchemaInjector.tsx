'use client';

import React from 'react';

// Example Schema for a typical Trade Business Generated site
interface SchemaInjectorProps {
    businessName: string;
    industry: string;
    phone: string;
    url: string;
}

export function SchemaInjector({ businessName, industry, phone, url }: SchemaInjectorProps) {
    // Mapping our simplified industry strings to actual Schema.org types where possible
    const getSchemaType = (industryStr: string) => {
        const map: Record<string, string> = {
            'Plumbing': 'Plumber',
            'Plumber': 'Plumber',
            'Electrician': 'Electrician',
            'HVAC': 'HVACBusiness',
            'Roofing': 'RoofingContractor'
        };
        return map[industryStr] || 'LocalBusiness';
    };

    const schemaData = {
        '@context': 'https://schema.org',
        '@type': getSchemaType(industry),
        name: businessName,
        telephone: phone,
        url: url,
        image: 'https://images.unsplash.com/photo-1541888086225-ee5e119cebc6?w=800', // Mock Image
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '08:00',
                closes: '18:00'
            }
        ],
        // Hardcoded London for demo mockup purposes
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'London',
            addressCountry: 'UK'
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
    );
}
