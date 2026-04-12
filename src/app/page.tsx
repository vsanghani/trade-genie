import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { HowItWorks } from '@/components/HowItWorks';
import { ReviewCarousel } from '@/components/ReviewCarousel';
import { GenerationForm } from '@/components/GenerationForm';
import { BlogSection } from '@/components/BlogSection';
import { WeeklyReport } from '@/components/WeeklyReport';
import { ServiceAreaGrid } from '@/components/ServiceAreaGrid';
import { SchemaInjector } from '@/components/SchemaInjector';
import { SiteFooter } from '@/components/SiteFooter';

export default function Home() {
  return (
    <main>
      <SchemaInjector
        businessName="Trade Genie Demo Site"
        industry="Plumbing"
        phone="+61 400 000 000"
        url="https://tradegeniedemo.com"
      />
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <ReviewCarousel />
      <ServiceAreaGrid />
      <BlogSection />
      <WeeklyReport />
      <GenerationForm />
      <SiteFooter />
    </main>
  );
}
