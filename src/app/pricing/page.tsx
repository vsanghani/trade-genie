'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { PricingCard } from '@/components/PricingCard';
import { PricingToggle } from '@/components/PricingToggle';
import { SiteFooter } from '@/components/SiteFooter';
import { Shield } from 'lucide-react';

const plans = [
    {
        planId: 'free',
        name: 'Free',
        description: 'Perfect for testing the waters. Get your first AI website live instantly.',
        monthlyPrice: 0,
        annualPrice: 0,
        cta: 'Start Free',
        features: [
            '1 AI-generated website',
            'Basic SEO optimisation',
            '5 WhatsApp leads/month',
            'Trade Genie branding',
        ],
    },
    {
        planId: 'pro',
        name: 'Pro',
        description: 'Everything you need to grow. The most popular plan for active tradespeople.',
        monthlyPrice: 59,
        annualPrice: 566,
        cta: 'Start Pro Trial',
        highlighted: true,
        features: [
            'Up to 3 AI websites',
            '2 SEO blog posts/month',
            'Unlimited WhatsApp leads',
            'Automated review requests',
            'Weekly WhatsApp reports',
            'Remove Trade Genie branding',
        ],
    },
    {
        planId: 'enterprise',
        name: 'Enterprise',
        description: 'For established businesses scaling fast. Full-service white-label solution.',
        monthlyPrice: 159,
        annualPrice: 1526,
        cta: 'Contact Sales',
        features: [
            'Unlimited AI websites',
            'Unlimited blog posts',
            'Unlimited WhatsApp leads',
            'Automated review requests',
            'Weekly WhatsApp reports',
            'Custom domain support',
            'Priority support',
            'White-label branding',
        ],
    },
];

export default function PricingPage() {
    const [isAnnual, setIsAnnual] = useState(false);

    return (
        <main>
            <Navbar />
            <section className="pricing-page">
                <div className="container">
                    <div className="section-header">
                        <h1 className="section-title">
                            Simple, transparent <span className="text-gradient">pricing</span>
                        </h1>
                        <p className="section-subtitle">
                            No hidden fees. No contracts. Cancel anytime. Start free and upgrade when you&apos;re ready to grow.
                        </p>
                        <p className="pricing-currency-note">All prices in Australian dollars (AUD), inclusive of GST where applicable.</p>
                    </div>

                    <PricingToggle isAnnual={isAnnual} onToggle={() => setIsAnnual(!isAnnual)} />

                    <div className="pricing-grid">
                        {plans.map((plan) => (
                            <PricingCard key={plan.planId} {...plan} isAnnual={isAnnual} />
                        ))}
                    </div>

                    <div className="pricing-guarantee glass">
                        <p>
                            <Shield size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                            <strong>30-day money-back guarantee.</strong> If you&apos;re not seeing results, we&apos;ll refund your subscription—no questions asked.
                        </p>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </main>
    );
}
