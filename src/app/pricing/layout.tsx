import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Pricing | Trade Genie',
    description:
        'Simple AUD pricing for AI websites, WhatsApp leads, and growth tools. Start free, upgrade when you are ready.',
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
    return children;
}
