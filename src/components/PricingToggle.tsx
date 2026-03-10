'use client';

import React from 'react';
import './PricingCard.css';

interface PricingToggleProps {
    isAnnual: boolean;
    onToggle: () => void;
}

export function PricingToggle({ isAnnual, onToggle }: PricingToggleProps) {
    return (
        <div className="pricing-toggle-wrapper">
            <span className={`toggle-label ${!isAnnual ? 'active' : ''}`}>Monthly</span>
            <button className="toggle-switch" onClick={onToggle} aria-label="Toggle billing cycle">
                <span className={`toggle-knob ${isAnnual ? 'annual' : ''}`} />
            </button>
            <span className={`toggle-label ${isAnnual ? 'active' : ''}`}>
                Annual <span className="save-badge">Save 20%</span>
            </span>
        </div>
    );
}
