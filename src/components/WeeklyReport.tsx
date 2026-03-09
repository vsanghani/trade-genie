'use client';

import React, { useEffect, useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { TrendingUp, Users, Mail, Star, BarChart3, MessageCircle, Loader2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import './WeeklyReport.css';

interface ReportStats {
    visitors: number;
    visitorsChange: string;
    leads: number;
    leadsChange: string;
    googleRanking: number;
    bookingsCompleted: number;
    reviewsReceived: number;
    topPage: string;
}

interface ReportData {
    period: { start: string; end: string };
    stats: ReportStats;
    sparkline: number[];
}

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 1200;
        const step = Math.ceil(value / (duration / 16));
        const timer = setInterval(() => {
            start += step;
            if (start >= value) {
                setDisplay(value);
                clearInterval(timer);
            } else {
                setDisplay(start);
            }
        }, 16);
        return () => clearInterval(timer);
    }, [value]);

    return <span>{display}{suffix}</span>;
}

function MiniSparkline({ data }: { data: number[] }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const height = 40;
    const width = 120;
    const stepX = width / (data.length - 1);

    const points = data
        .map((val, i) => `${i * stepX},${height - ((val - min) / range) * height}`)
        .join(' ');

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="sparkline-svg" preserveAspectRatio="none">
            <defs>
                <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon
                points={`0,${height} ${points} ${width},${height}`}
                fill="url(#sparkGrad)"
            />
            <polyline
                points={points}
                fill="none"
                stroke="var(--accent-primary)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function WeeklyReport() {
    const [report, setReport] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [whatsappLink, setWhatsappLink] = useState('');

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const res = await fetch('/api/reports/weekly');
                const data = await res.json();
                if (data.success) {
                    setReport(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch weekly report', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, []);

    const handleSendViaWhatsApp = async () => {
        if (!report) return;
        setSending(true);
        try {
            const res = await fetch('/api/reports/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    businessOwnerName: 'Mike',
                    businessOwnerPhone: '+447700900077',
                    stats: report.stats,
                }),
            });
            const data = await res.json();
            if (data.whatsappLink) {
                setWhatsappLink(data.whatsappLink);
            }
        } catch (error) {
            console.error('Failed to send report', error);
        } finally {
            setSending(false);
        }
    };

    return (
        <section className="report-section">
            <div className="container">
                <div className="section-header">
                    <div className="report-badge glass">
                        <BarChart3 size={14} className="text-gradient mr-2" />
                        <span className="text-secondary text-sm">Automated reporting</span>
                    </div>
                    <h2 className="section-title">
                        Weekly performance, <span className="text-gradient">straight to WhatsApp</span>
                    </h2>
                    <p className="section-subtitle">
                        No dashboards. No logins. Every Monday, your business stats arrive in a single WhatsApp message.
                    </p>
                </div>

                {loading ? (
                    <div className="report-loading glass">
                        <Loader2 size={28} className="spin text-gradient mb-3" />
                        <p>Generating your weekly performance summary...</p>
                    </div>
                ) : report ? (
                    <div className="report-grid fade-in">
                        {/* Main Report Card */}
                        <Card className="report-card glass">
                            <div className="report-card-header">
                                <h3>Weekly Summary</h3>
                                <span className="report-period text-secondary">{report.period.start} – {report.period.end}</span>
                            </div>

                            <div className="stat-grid">
                                <div className="stat-tile glass">
                                    <Users size={20} className="stat-icon" />
                                    <div className="stat-value"><AnimatedCounter value={report.stats.visitors} /></div>
                                    <div className="stat-label">Visitors</div>
                                    <div className="stat-change positive">{report.stats.visitorsChange}</div>
                                </div>

                                <div className="stat-tile glass">
                                    <Mail size={20} className="stat-icon" />
                                    <div className="stat-value"><AnimatedCounter value={report.stats.leads} /></div>
                                    <div className="stat-label">Leads</div>
                                    <div className="stat-change positive">+{report.stats.leadsChange}</div>
                                </div>

                                <div className="stat-tile glass">
                                    <TrendingUp size={20} className="stat-icon" />
                                    <div className="stat-value">
                                        {report.stats.googleRanking >= 0 ? (
                                            <><ArrowUpRight size={18} className="text-green" /> {report.stats.googleRanking}</>
                                        ) : (
                                            <><ArrowDownRight size={18} className="text-red" /> {Math.abs(report.stats.googleRanking)}</>
                                        )}
                                    </div>
                                    <div className="stat-label">Ranking Δ</div>
                                </div>

                                <div className="stat-tile glass">
                                    <Star size={20} className="stat-icon" />
                                    <div className="stat-value"><AnimatedCounter value={report.stats.reviewsReceived} /></div>
                                    <div className="stat-label">Reviews</div>
                                </div>
                            </div>

                            {/* Mini Sparkline */}
                            <div className="sparkline-wrapper glass">
                                <div className="sparkline-header">
                                    <span className="text-sm font-medium">Daily Visitors</span>
                                    <span className="text-xs text-secondary">Last 7 days</span>
                                </div>
                                <MiniSparkline data={report.sparkline} />
                            </div>
                        </Card>

                        {/* WhatsApp Preview Card */}
                        <Card className="whatsapp-card glass">
                            <div className="whatsapp-header">
                                <div className="whatsapp-dot"></div>
                                <span className="text-sm font-medium">WhatsApp Preview</span>
                            </div>

                            <div className="whatsapp-bubble glass">
                                <p className="whatsapp-text">
                                    Hey Mike! 📊 Your Trade Genie weekly summary is here:
                                </p>
                                <p className="whatsapp-text mt-2">
                                    🌐 Website visitors: <strong>{report.stats.visitors}</strong> ({report.stats.visitorsChange})<br />
                                    📩 New leads: <strong>{report.stats.leads}</strong><br />
                                    📈 Google ranking: <strong>{report.stats.googleRanking >= 0 ? `Up ${report.stats.googleRanking}` : `Down ${Math.abs(report.stats.googleRanking)}`} positions</strong><br />
                                    ✅ Bookings completed: <strong>{report.stats.bookingsCompleted}</strong><br />
                                    ⭐ Reviews received: <strong>{report.stats.reviewsReceived}</strong>
                                </p>
                                <p className="whatsapp-text mt-2">Keep it up! Your online presence is working hard for you. 💪</p>
                                <span className="whatsapp-time">Mon 9:00 AM</span>
                            </div>

                            {!whatsappLink ? (
                                <Button
                                    fullWidth
                                    onClick={handleSendViaWhatsApp}
                                    disabled={sending}
                                    leftIcon={<MessageCircle size={16} />}
                                >
                                    {sending ? 'Sending...' : 'Simulate WhatsApp Delivery'}
                                </Button>
                            ) : (
                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary btn-full"
                                    style={{ background: '#25D366', textAlign: 'center' }}
                                >
                                    <MessageCircle size={16} className="btn-icon-left" /> Open in WhatsApp
                                </a>
                            )}
                        </Card>
                    </div>
                ) : null}
            </div>
        </section>
    );
}
