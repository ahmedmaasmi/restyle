"use client";
import { useEffect, useRef, useState } from 'react';

interface SplitTextProps {
  children: string;
  delay?: number;
  duration?: number;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
}

export function SplitText({ 
  children, 
  delay = 0, 
  duration = 600,
  className = '',
  as: Component = 'h2'
}: SplitTextProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLHeadingElement | HTMLParagraphElement | HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const words = children.split(' ');

  return (
    <Component 
      ref={elementRef as any}
      className={className}
      style={{ display: 'inline-block' }}
    >
      {words.map((word, index) => (
        <span
          key={index}
          style={{
            display: 'inline-block',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity ${duration}ms ease-out ${index * 50}ms, transform ${duration}ms ease-out ${index * 50}ms`,
            marginRight: '0.25em',
          }}
        >
          {word}
        </span>
      ))}
    </Component>
  );
}

