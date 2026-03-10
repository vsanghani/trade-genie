'use client';

import React from 'react';
import { Button } from './Button';
import { ArrowRight, Sparkles } from 'lucide-react';
import './Hero.css';

export function Hero() {
    return (
        <section className="hero-section">
            <div className="container">
                <div className="hero-content">
                    <div className="hero-badge glass">
                        <Sparkles className="hero-badge-icon" size={16} />
                        <span>AI-Powered Websites for Local Businesses</span>
                    </div>

                    <h1 className="hero-title">
                        Stop losing customers to a <br />
                        <span className="text-gradient">non-existent online presence.</span>
                    </h1>

                    <p className="hero-subtitle">
                        Get a beautifully designed, high-converting website generated instantly by AI.
                        All your new leads and bookings sent directly to your WhatsApp.
                    </p>

                    <div className="hero-cta-group">
                        <a href="/pricing">
                            <Button size="lg" rightIcon={<ArrowRight size={20} />}>
                                View Pricing
                            </Button>
                        </a>
                        <a href="#generate">
                            <Button variant="outline" size="lg">
                                Generate My Website
                            </Button>
                        </a>
                    </div>

                    <div className="hero-stats">
                        <div className="stat-item">
                            <span className="stat-value text-gradient">Instant</span>
                            <span className="stat-label">Generation</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-value text-gradient">100%</span>
                            <span className="stat-label">Automated Leads</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <span className="stat-value text-gradient">Zero</span>
                            <span className="stat-label">Coding Required</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Abstract Glassmorphism Shapes */}
            <div className="hero-shape shape-1 glass"></div>
            <div className="hero-shape shape-2 glass"></div>
            <div className="hero-shape shape-3 glass"></div>
        </section>
    );
}
