import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Features } from '@/components/Features';
import { SiteFooter } from '@/components/SiteFooter';

export const metadata: Metadata = {
    title: 'Features | Trade Genie',
    description:
        'AI websites, WhatsApp leads, SEO blogs, reviews, and weekly reports—built for Australian tradies and local businesses.',
};

export default function FeaturesPage() {
    return (
        <main>
            <Navbar />
            <Features />
            <SiteFooter />
        </main>
    );
}
