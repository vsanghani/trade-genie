'use client';

import React from 'react';
import { Button } from './Button';
import { MapPin, Users, TrendingUp, Phone, ArrowRight, Shield, Clock, Star } from 'lucide-react';
import './ServiceAreaHero.css';

interface ServiceAreaHeroProps {
    trade: string;
    suburb: string;
    description: string;
    population: string;
    demandLevel: 'High' | 'Medium' | 'Low';
}

export function ServiceAreaHero({ trade, suburb, description, population, demandLevel }: ServiceAreaHeroProps) {
    const demandColor = demandLevel === 'High' ? '#10b981' : demandLevel === 'Medium' ? '#f59e0b' : '#6b7280';

    return (
        <section className="area-hero">
            <div className="container">
                <div className="area-hero-content">
                    <div className="area-badge glass">
                        <MapPin size={14} className="text-gradient" />
                        <span>Service Area Page — AI Generated</span>
                    </div>

                    <h1 className="area-title">
                        Your Trusted <span className="text-gradient">{trade}</span> in {suburb}
                    </h1>

                    <p className="area-description">{description}</p>

                    <div className="area-stats-bar glass">
                        <div className="area-stat">
                            <Users size={16} />
                            <span><strong>{population}</strong> residents</span>
                        </div>
                        <div className="area-stat-divider" />
                        <div className="area-stat">
                            <TrendingUp size={16} style={{ color: demandColor }} />
                            <span>Demand: <strong style={{ color: demandColor }}>{demandLevel}</strong></span>
                        </div>
                        <div className="area-stat-divider" />
                        <div className="area-stat">
                            <Star size={16} style={{ color: '#fbbf24' }} />
                            <span><strong>4.9</strong> avg rating</span>
                        </div>
                    </div>

                    <div className="area-cta-group">
                        <a href="/pricing">
                            <Button size="lg" rightIcon={<ArrowRight size={18} />}>
                                Get a Free Quote
                            </Button>
                        </a>
                        <a href="tel:+447700900077">
                            <Button variant="outline" size="lg" leftIcon={<Phone size={18} />}>
                                Call Now
                            </Button>
                        </a>
                    </div>

                    <div className="area-trust-strip">
                        <div className="trust-item">
                            <Shield size={14} /> Fully Insured
                        </div>
                        <div className="trust-item">
                            <Clock size={14} /> Same-Day Service
                        </div>
                        <div className="trust-item">
                            <Star size={14} /> 5-Star Rated
                        </div>
                    </div>
                </div>
            </div>

            {/* Background shapes */}
            <div className="area-shape area-shape-1 glass" />
            <div className="area-shape area-shape-2 glass" />
        </section>
    );
}
