'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Card } from './Card';
import { Star, Quote, Loader2 } from 'lucide-react';
import './ReviewCarousel.css';

interface Review {
    id: string;
    authorName: string;
    rating: number;
    text: string;
    timeAgo: string;
    profilePhotoUrl: string;
}

export function ReviewCarousel() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    // We double the reviews list for seamless infinite marquee scrolling
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch('/api/reviews/sync');
                const data = await res.json();
                if (data.success) {
                    setReviews(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch reviews', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    if (loading) {
        return (
            <div className="review-loading glass flex justify-center py-8 my-10 rounded-2xl mx-auto max-w-lg text-center">
                <Loader2 size={24} className="spin text-gradient mr-3" />
                <span className="text-secondary text-sm">Syncing latest Google Reviews...</span>
            </div>
        );
    }

    if (reviews.length === 0) return null;

    // Duplicate the array to create a seamless infinite scrolling loop
    const duplicatedReviews = [...reviews, ...reviews];

    return (
        <section className="review-section">
            <div className="container relative z-10 text-center mb-8">
                <h3 className="text-2xl font-bold font-heading mb-3">Trusted by locals who matter</h3>
                <p className="text-secondary max-w-xl mx-auto">
                    We automatically sync your 5-star Google reviews straight to your website, proving your reliability day and night.
                </p>
            </div>

            <div className="carousel-wrapper">
                <div className="carousel-track" ref={scrollRef}>
                    {duplicatedReviews.map((review, idx) => (
                        <Card key={`${review.id}-${idx}`} className="review-card glass fade-in">
                            <Quote size={24} className="quote-icon mb-4" />
                            <div className="stars mb-3">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} size={16} fill="currentColor" stroke="none" />
                                ))}
                            </div>
                            <p className="review-text">{review.text}</p>

                            <div className="review-author mt-auto">
                                <img src={review.profilePhotoUrl} alt={review.authorName} className="author-photo" loading="lazy" />
                                <div className="author-info">
                                    <div className="author-name">{review.authorName}</div>
                                    <div className="review-time">{review.timeAgo}</div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
