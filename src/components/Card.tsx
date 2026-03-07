'use client';

import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'panel';
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
    const baseClass = variant === 'panel' ? 'glass-panel' : 'glass';

    return (
        <div className={`${baseClass} p-6 ${className}`} style={{ padding: '1.5rem' }}>
            {children}
        </div>
    );
}
