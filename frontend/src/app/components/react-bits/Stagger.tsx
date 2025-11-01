"use client";
import { useEffect, useRef, useState, Children } from 'react';

interface StaggerProps {
  children: React.ReactNode;
  delay?: number;
  staggerDelay?: number;
  duration?: number;
  className?: string;
}

export function Stagger({ 
  children, 
  delay = 0,
  staggerDelay = 100,
  duration = 600,
  className = '' 
}: StaggerProps) {
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);
  const childrenArray = Children.toArray(children);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            childrenArray.forEach((_, index) => {
              setTimeout(() => {
                setVisibleIndices(prev => new Set(prev).add(index));
              }, delay + index * staggerDelay);
            });
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [childrenArray, delay, staggerDelay]);

  return (
    <div ref={containerRef} className={className}>
      {childrenArray.map((child, index) => (
        <div
          key={index}
          style={{
            opacity: visibleIndices.has(index) ? 1 : 0,
            transform: visibleIndices.has(index) ? 'translateY(0)' : 'translateY(30px)',
            transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

