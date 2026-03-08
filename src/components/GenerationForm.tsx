'use client';

import React, { useState } from 'react';
import { Card } from './Card';
import { Input } from './Input';
import { Button } from './Button';
import { BookingModal } from './BookingModal';
import { Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import './GenerationForm.css';

export function GenerationForm() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showBookingMock, setShowBookingMock] = useState(false);

    const [formData, setFormData] = useState({
        businessName: '',
        industry: '',
        phone: '',
        description: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API Call for generation
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);

            // Reset form after short delay
            setTimeout(() => {
                setSuccess(false);
                setFormData({ businessName: '', industry: '', phone: '', description: '' });
            }, 5000);

        }, 2500);
    };

    return (
        <section id="onboarding" className="gen-form-section">
            <div className="container">
                <div className="gen-form-wrapper">

                    <div className="gen-form-content">
                        <div className="gen-badge glass">
                            <span className="live-dot"></span> Try It Now
                        </div>
                        <h2 className="gen-title">Generate Your Website <br />in <span className="text-gradient">30 Seconds</span></h2>
                        <p className="gen-subtitle">
                            Fill out the basics below and watch our AI instantly build a production-ready website tailored to your exact industry. No credit card required to demo.
                        </p>

                        <ul className="gen-benefits">
                            <li><CheckCircle2 size={18} className="gen-check text-gradient" /> Free Custom Design</li>
                            <li><CheckCircle2 size={18} className="gen-check text-gradient" /> SEO Copywriting Included</li>
                            <li><CheckCircle2 size={18} className="gen-check text-gradient" /> Mobile Responsive</li>
                        </ul>
                    </div>

                    <Card variant="panel" className="gen-form-card">
                        {success ? (
                            <div className="gen-success glass fade-in">
                                <div className="success-icon-wrapper">
                                    <Sparkles size={32} className="success-icon text-gradient" />
                                </div>
                                <h3>Generation Complete!</h3>
                                <p>We've created a stunning mock website for <strong>{formData.businessName || 'Your Business'}</strong>.</p>
                                <Button
                                    fullWidth
                                    className="mt-6"
                                    variant="primary"
                                    onClick={() => setShowBookingMock(true)}
                                >
                                    Preview Booking Flow (Mock)
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="gen-form fade-in">
                                <div className="grid-cols-2" style={{ gap: '1rem' }}>
                                    <Input
                                        label="Business Name"
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        placeholder="e.g. Mike's Plumbing"
                                        required
                                    />
                                    <Input
                                        label="Industry / Trade"
                                        name="industry"
                                        value={formData.industry}
                                        onChange={handleChange}
                                        placeholder="e.g. Plumber, Electrician"
                                        required
                                    />
                                </div>

                                <Input
                                    label="WhatsApp Number (for leads)"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+44 7700 900077"
                                    required
                                />

                                <div className="input-wrapper input-full mb-6">
                                    <label className="input-label" htmlFor="description">Briefly describe what you do</label>
                                    <div className="input-container">
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="input-field glass textarea-field"
                                            placeholder="I provide 24/7 emergency plumbing services in South London. My diagnostic fee is £50."
                                            rows={4}
                                            required
                                        ></textarea>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    fullWidth
                                    size="lg"
                                    disabled={loading}
                                    leftIcon={loading ? <Loader2 size={20} className="spin" /> : <Sparkles size={20} />}
                                >
                                    {loading ? 'AI is generating...' : 'Generate My Website'}
                                </Button>

                                <p className="form-disclaimer">By submitting this form, you agree to our Terms of Service.</p>
                            </form>
                        )}
                    </Card>

                </div>
            </div>

            {/* Background Decor */}
            <div className="form-blob"></div>

            {/* Demo Booking Modal triggered after an AI Website is generated */}
            <BookingModal
                isOpen={showBookingMock}
                onClose={() => setShowBookingMock(false)}
                serviceName="Emergency Plumbing Call-out"
                depositAmount={50}
            />
        </section>
    );
}
