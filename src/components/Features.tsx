'use client';

import React from 'react';
import { Card } from './Card';
import { Smartphone, Zap, MessageCircle, BarChart3, Globe, Shield } from 'lucide-react';
import './Features.css';

const features = [
    {
        icon: <Globe size={24} className="feature-icon-svg" />,
        title: 'Instant Professional Website',
        description: 'Our AI analyzes your business and generates a stunning, SEO-optimized website in seconds. No drag-and-drop required.'
    },
    {
        icon: <MessageCircle size={24} className="feature-icon-svg" />,
        title: 'Direct WhatsApp Leads',
        description: 'Forget complicated CRM dashboards. Every new customer inquiry or booking is sent instantly to your WhatsApp.'
    },
    {
        icon: <Smartphone size={24} className="feature-icon-svg" />,
        title: 'Mobile-First Design',
        description: 'Over 80% of local searches happen on phones. Your generated site looks perfect on every device.'
    },
    {
        icon: <Zap size={24} className="feature-icon-svg" />,
        title: 'Lightning Fast Hosting',
        description: 'Hosted on global edge networks. Fast loading times mean higher rankings on Google and happier customers.'
    },
    {
        icon: <BarChart3 size={24} className="feature-icon-svg" />,
        title: 'Built-in Analytics',
        description: 'Know exactly how many people are visiting your site and converting into paying customers.'
    },
    {
        icon: <Shield size={24} className="feature-icon-svg" />,
        title: 'Secure & Reliable',
        description: 'Enterprise-grade security and free SSL certificates come standard with every generated website.'
    }
];

export function Features() {
    return (
        <section id="features" className="features-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Everything you need to <span className="text-gradient">grow online</span></h2>
                    <p className="section-subtitle">
                        We handle the complex technology so you can focus on what you do best: running your business.
                    </p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <Card key={index} className="feature-card">
                            <div className="feature-icon-wrapper glass">
                                {feature.icon}
                            </div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
