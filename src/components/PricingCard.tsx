'use client';

import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Check, Sparkles, Loader2 } from 'lucide-react';
import './PricingCard.css';

interface PricingCardProps {
    name: string;
    description: string;
    monthlyPrice: number;
    annualPrice: number;
    isAnnual: boolean;
    features: string[];
    highlighted?: boolean;
    planId: string;
    cta: string;
}

export function PricingCard({
    name,
    description,
    monthlyPrice,
    annualPrice,
    isAnnual,
    features,
    highlighted = false,
    planId,
    cta,
}: PricingCardProps) {
    const [loading, setLoading] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    const price = isAnnual ? annualPrice : monthlyPrice;
    const perMonth = isAnnual ? Math.round(annualPrice / 12) : monthlyPrice;

    const handleSubscribe = async () => {
        if (planId === 'free') {
            setSubscribed(true);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    planId,
                    billingCycle: isAnnual ? 'annual' : 'monthly',
                }),
            });
            const data = await res.json();
            if (data.success) {
                setSubscribed(true);
            }
        } catch (error) {
            console.error('Subscription failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className={`pricing-card glass ${highlighted ? 'pricing-highlighted' : ''}`}>
            {highlighted && (
                <div className="popular-badge">
                    <Sparkles size={12} /> Most Popular
                </div>
            )}

            <div className="pricing-card-header">
                <h3 className="plan-name">{name}</h3>
                <p className="plan-desc">{description}</p>
            </div>

            <div className="price-block">
                {monthlyPrice === 0 ? (
                    <span className="price-amount">Free</span>
                ) : (
                    <>
                        <span className="price-currency">£</span>
                        <span className="price-amount">{perMonth}</span>
                        <span className="price-period">/mo</span>
                    </>
                )}
            </div>

            {isAnnual && monthlyPrice > 0 && (
                <p className="annual-total">£{price} billed annually</p>
            )}

            <ul className="feature-list">
                {features.map((feature, i) => (
                    <li key={i} className="feature-item">
                        <Check size={16} className="feature-check" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            <div className="pricing-cta">
                {subscribed ? (
                    <div className="subscribed-msg fade-in">
                        <Check size={18} /> Subscribed!
                    </div>
                ) : (
                    <Button
                        fullWidth
                        variant={highlighted ? 'primary' : 'secondary'}
                        size="lg"
                        onClick={handleSubscribe}
                        disabled={loading}
                    >
                        {loading ? <Loader2 size={18} className="spin" /> : cta}
                    </Button>
                )}
            </div>
        </Card>
    );
}
