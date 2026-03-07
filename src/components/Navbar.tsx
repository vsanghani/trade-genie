'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import './Navbar.css';

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'navbar-scrolled glass' : ''}`}>
            <div className="container navbar-container">
                <a href="/" className="navbar-logo">
                    <div className="logo-icon glass">TG</div>
                    <span className="logo-text">Trade<span className="text-gradient">Genie</span></span>
                </a>

                <div className="navbar-links">
                    <a href="#features" className="nav-link">Features</a>
                    <a href="#how-it-works" className="nav-link">How it Works</a>
                    <a href="#pricing" className="nav-link">Pricing</a>
                </div>

                <div className="navbar-actions">
                    <Button variant="outline" size="sm" className="hidden-mobile">Log In</Button>
                    <Button size="sm">Get Started</Button>
                </div>
            </div>
        </nav>
    );
}
