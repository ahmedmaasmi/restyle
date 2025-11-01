"use client";
import { Button } from '../ui/button';
import { ReactNode } from 'react';

interface ButtonHoverProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ButtonHover({ 
  children, 
  onClick,
  className = '',
  variant = 'default',
  size = 'default'
}: ButtonHoverProps) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className={`relative overflow-hidden group ${className}`}
    >
      <span className="relative z-10 transition-transform duration-300 group-hover:scale-105">
        {children}
      </span>
      <span 
        className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
        style={{ transition: 'transform 0.3s ease-out' }}
      />
    </Button>
  );
}

