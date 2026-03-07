'use client';

import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, fullWidth = true, className = '', ...props }, ref) => {
        const containerClasses = [
            'input-wrapper',
            fullWidth ? 'input-full' : '',
            className
        ].filter(Boolean).join(' ');

        return (
            <div className={containerClasses}>
                {label && (
                    <label className="input-label" htmlFor={props.id || props.name}>
                        {label}
                    </label>
                )}
                <div className="input-container">
                    <input
                        ref={ref}
                        className={`input-field glass ${error ? 'input-error' : ''}`}
                        {...props}
                    />
                </div>
                {error && <span className="input-error-msg">{error}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';
