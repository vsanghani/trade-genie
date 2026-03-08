'use client';

import React, { useEffect, useState } from 'react';
import { BlogCard } from './BlogCard';
import { Sparkles, Loader2 } from 'lucide-react';
import './BlogSection.css';

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    imageUrl: string;
}

export function BlogSection() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch mock generated localized blogs on mount to demonstrate the feature
        const fetchBlogs = async () => {
            try {
                const res = await fetch('/api/generate-blog', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        industry: 'Plumbing',
                        location: 'London',
                        businessName: 'Trade Genie Demo'
                    })
                });

                const data = await res.json();
                if (data.success) {
                    setBlogs(data.data);
                }
            } catch (error) {
                console.error('Failed to fetch blogs', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <section className="blog-section relative">
            <div className="container">
                <div className="section-header">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full glass text-sm font-medium">
                        <Sparkles size={14} className="mr-2 text-gradient" />
                        <span className="text-secondary">Autopilot SEO feature</span>
                    </div>
                    <h2 className="section-title">We write your <span className="text-gradient">content</span> automatically</h2>
                    <p className="section-subtitle">
                        Local service businesses that blog get 55% more organic traffic.
                        Trade Genie generates localized, high-ranking SEO articles on your behalf every single month.
                    </p>
                </div>

                {loading ? (
                    <div className="blog-loading glass">
                        <Loader2 size={32} className="spin text-gradient mb-4" />
                        <p>AI is analyzing local search trends and writing articles...</p>
                    </div>
                ) : (
                    <div className="blog-grid fade-in">
                        {blogs.map((blog) => (
                            <BlogCard key={blog.id} {...blog} />
                        ))}
                    </div>
                )}
            </div>

            {/* Background glow for the section */}
            <div className="blog-glow"></div>
        </section>
    );
}
