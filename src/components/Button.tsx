'use client';

import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'glass' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    leftIcon,
    rightIcon,
    className = '',
    ...props
}: ButtonProps) {
    const classes = [
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth ? 'btn-full' : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <button className={classes} {...props}>
            {leftIcon && <span className="btn-icon-left">{leftIcon}</span>}
            <span className="btn-text">{children}</span>
            {rightIcon && <span className="btn-icon-right">{rightIcon}</span>}
        </button>
    );
}
