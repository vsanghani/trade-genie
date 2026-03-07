import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { HowItWorks } from '@/components/HowItWorks';
import { GenerationForm } from '@/components/GenerationForm';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
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
