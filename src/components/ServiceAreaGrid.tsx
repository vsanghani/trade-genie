'use client';

import React, { useEffect, useState } from 'react';
import { Card } from './Card';
import { MapPin, TrendingUp, ArrowRight, Loader2 } from 'lucide-react';
import './ServiceAreaGrid.css';

interface ServiceArea {
    slug: string;
    trade: string;
    suburb: string;
    description: string;
    demandLevel: 'High' | 'Medium' | 'Low';
    population: string;
}

export function ServiceAreaGrid() {
    const [areas, setAreas] = useState<ServiceArea[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const res = await fetch('/api/locations');
                const data = await res.json();
                if (data.success) {
                    setAreas(data.data.slice(0, 6)); // Show first 6
                }
            } catch (error) {
                console.error('Failed to fetch areas', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAreas();
    }, []);

    return (
        <section className="area-grid-section">
            <div className="container">
                <div className="section-header">
                    <div className="area-grid-badge glass">
                        <MapPin size={14} className="text-gradient" />
                        <span className="text-secondary text-sm">Multi-location SEO</span>
                    </div>
                    <h2 className="section-title">
                        Auto-generated pages for <span className="text-gradient">every suburb</span>
                    </h2>
                    <p className="section-subtitle">
                        We create a dedicated SEO landing page for each area you serve — targeting long-tail keywords that rank on Google Maps.
                    </p>
                </div>

                {loading ? (
                    <div className="area-loading glass">
                        <Loader2 size={28} className="spin text-gradient" />
                        <p>Generating service area pages...</p>
                    </div>
                ) : (
                    <div className="area-card-grid fade-in">
                        {areas.map((area) => {
                            const demandColor = area.demandLevel === 'High' ? '#10b981' : area.demandLevel === 'Medium' ? '#f59e0b' : '#6b7280';
                            return (
                                <a href={`/services/${area.slug}`} key={area.slug} className="area-card-link">
                                    <Card className="area-card glass">
                                        <div className="area-card-top">
                                            <MapPin size={18} className="text-gradient" />
                                            <span className="area-demand-badge" style={{ color: demandColor, borderColor: demandColor }}>
                                                <TrendingUp size={12} /> {area.demandLevel}
                                            </span>
                                        </div>
                                        <h3 className="area-card-title">{area.trade} in {area.suburb}</h3>
                                        <p className="area-card-desc">{area.description}</p>
                                        <div className="area-card-footer">
                                            <span className="area-card-pop">{area.population} residents</span>
                                            <ArrowRight size={16} className="area-card-arrow" />
                                        </div>
                                    </Card>
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
