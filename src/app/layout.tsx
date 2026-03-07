import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Trade Genie | Websites & Leads for Local Businesses',
  description: 'AI-generated stunning websites for sole traders and small businesses. Get bookings directly to your WhatsApp.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
