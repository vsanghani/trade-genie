'use client';

import React from 'react';
import { Card } from './Card';
import './HowItWorks.css';

const steps = [
    {
        number: '01',
        title: 'Tell us about your business',
        description: 'Answer a few simple questions about your services, pricing, and contact details.'
    },
    {
        number: '02',
        title: 'AI generates your site',
        description: 'In seconds, our AI writes your copy, selects layout, and publishes your modern website.'
    },
    {
        number: '03',
        title: 'Start receiving leads',
        description: 'Customers book through your site, and you get instantly notified on WhatsApp.'
    }
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="hiw-section">
            <div className="container">

                <div className="hiw-container glass-panel">
                    <div className="hiw-content">
                        <h2 className="hiw-title">From zero to online in <br /><span className="text-gradient">3 simple steps</span></h2>
                        <p className="hiw-subtitle">
                            No technical skills needed. Simply type what you do, and the Genie does the rest.
                        </p>
                    </div>

                    <div className="hiw-steps">
                        {steps.map((step, index) => (
                            <div key={index} className="hiw-step">
                                <div className="step-connector">
                                    <div className="step-number glass">{step.number}</div>
                                    {index < steps.length - 1 && <div className="step-line hidden-mobile"></div>}
                                </div>
                                <div className="step-content">
                                    <h3 className="step-title">{step.title}</h3>
                                    <p className="step-description">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}
