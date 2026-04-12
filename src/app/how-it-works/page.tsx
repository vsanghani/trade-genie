import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { HowItWorks } from '@/components/HowItWorks';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata: Metadata = {
    title: 'How it works | Trade Genie',
    description:
        'Tell us about your business, let AI publish your site, and receive bookings on WhatsApp—in three simple steps.',
};

export default function HowItWorksPage() {
    return (
        <main>
            <Navbar />
            <HowItWorks standalone />
            <SiteFooter />
        </main>
    );
}
