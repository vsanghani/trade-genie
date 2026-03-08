'use client';

import React from 'react';
import { Card } from './Card';
import { ArrowRight, Clock } from 'lucide-react';
import './BlogCard.css';

interface BlogCardProps {
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    imageUrl: string;
}

export function BlogCard({ title, excerpt, date, readTime, imageUrl }: BlogCardProps) {
    return (
        <Card className="blog-card glass">
            <div className="blog-image-wrapper">
                <img src={imageUrl} alt={title} className="blog-image" loading="lazy" />
                <div className="blog-meta glass">
                    <Clock size={14} className="mr-1" /> {readTime}
                </div>
            </div>

            <div className="blog-content">
                <div className="blog-date">{date}</div>
                <h3 className="blog-title">{title}</h3>
                <p className="blog-excerpt">{excerpt}</p>

                <a href="#" className="blog-read-more" onClick={(e) => e.preventDefault()}>
                    Read Article <ArrowRight size={16} className="ml-1" />
                </a>
            </div>
        </Card>
    );
}
