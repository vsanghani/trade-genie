import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { HowItWorks } from '@/components/HowItWorks';
import { ReviewCarousel } from '@/components/ReviewCarousel';
import { GenerationForm } from '@/components/GenerationForm';
import { BlogSection } from '@/components/BlogSection';
import { SchemaInjector } from '@/components/SchemaInjector';

export default function Home() {
  return (
    <main>
      <SchemaInjector
        businessName="Trade Genie Demo Site"
        industry="Plumbing"
        phone="+44 7700 900077"
        url="https://tradegeniedemo.com"
      />
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <ReviewCarousel />
      <BlogSection />
      <GenerationForm />

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
