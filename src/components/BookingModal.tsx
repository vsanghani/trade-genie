'use client';

import React, { useState } from 'react';
import { Card } from './Card';
import { Input } from './Input';
import { Button } from './Button';
import { X, CreditCard, CheckCircle, MessageCircle } from 'lucide-react';
import './BookingModal.css';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceName: string;
    depositAmount: number;
}

export function BookingModal({ isOpen, onClose, serviceName, depositAmount }: BookingModalProps) {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [loading, setLoading] = useState(false);
    const [quoteLink, setQuoteLink] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        issue: ''
    });

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2); // Move to Payment step
    };

    const handlePaymentSubmit = async () => {
        setLoading(true);

        try {
            // 1. Simulate Stripe Checkout Session Creation
            const checkoutRes = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service: serviceName,
                    price: depositAmount,
                    customerEmail: 'test@example.com',
                    businessId: 'biz_123'
                })
            });

            // 2. Simulate Webhook processing to generate the instant quote link
            const webhookRes = await fetch('/api/webhook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'lead',
                    orderDetails: formData.issue,
                    customerName: formData.name,
                    customerPhone: formData.phone,
                    businessWhatsApp: '+447000000000'
                })
            });

            const webhookData = await webhookRes.json();

            if (webhookData.quoteLink) {
                setQuoteLink(webhookData.quoteLink);
            }

            setStep(3); // Move to Success Step

        } catch (error) {
            console.error('Payment intent failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container fade-in">
                <Card variant="panel" className="modal-card">
                    <button onClick={onClose} className="modal-close">
                        <X size={20} />
                    </button>

                    <div className="modal-header">
                        <h3 className="modal-title">Book {serviceName}</h3>
                        {step < 3 && <p className="modal-subtitle">Deposit required: £{depositAmount}</p>}
                    </div>

                    <div className="modal-content">
                        {step === 1 && (
                            <form onSubmit={handleDetailsSubmit} className="modal-form">
                                <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                                <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required />
                                <Input label="Address" name="address" value={formData.address} onChange={handleChange} required />

                                <div className="input-wrapper input-full mb-4">
                                    <label className="input-label">Describe the issue</label>
                                    <textarea
                                        name="issue"
                                        value={formData.issue}
                                        onChange={handleChange}
                                        className="input-field glass textarea-field"
                                        rows={3}
                                        required
                                    />
                                </div>

                                <Button fullWidth size="lg" type="submit">Continue to Payment</Button>
                            </form>
                        )}

                        {step === 2 && (
                            <div className="payment-step fade-in">
                                <div className="payment-summary glass">
                                    <div className="flex-between">
                                        <span>Call-out Deposit</span>
                                        <strong>£{depositAmount}.00</strong>
                                    </div>
                                </div>

                                {/* Mock Stripe Element */}
                                <div className="mock-stripe-element glass">
                                    <div className="stripe-row">
                                        <span className="stripe-label">Card Number</span>
                                        <span className="stripe-value">**** **** **** 4242</span>
                                    </div>
                                    <div className="flex-between mt-2">
                                        <div className="stripe-row">
                                            <span className="stripe-label">Expiry</span>
                                            <span className="stripe-value">12/26</span>
                                        </div>
                                        <div className="stripe-row">
                                            <span className="stripe-label">CVC</span>
                                            <span className="stripe-value">***</span>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    fullWidth
                                    size="lg"
                                    onClick={handlePaymentSubmit}
                                    disabled={loading}
                                    leftIcon={<CreditCard size={18} />}
                                >
                                    {loading ? 'Processing...' : `Pay £${depositAmount}`}
                                </Button>
                                <button className="back-btn" onClick={() => setStep(1)}>Back to details</button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="success-step fade-in">
                                <div className="success-icon-large">
                                    <CheckCircle size={48} className="text-gradient" />
                                </div>
                                <h4 className="success-title">Booking Confirmed!</h4>
                                <p className="success-text">Your deposit has been paid securely via Stripe. The tradesperson has been notified instantly via WhatsApp.</p>

                                {quoteLink && (
                                    <div className="tradesperson-view glass">
                                        <p className="tradesperson-label">tradesperson view preview</p>
                                        <p className="tradesperson-desc">The business owner received your lead and can reply instantly with a quote using this auto-generated WhatsApp link:</p>
                                        <a href={quoteLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm btn-full" style={{ marginTop: '0.5rem' }}>
                                            <MessageCircle size={16} className="btn-icon-left" /> Send Quote via WhatsApp
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
