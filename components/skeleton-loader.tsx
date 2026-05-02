'use client';

import React from 'react';

interface SkeletonLoaderProps {
  count?: number;
  type?: 'card' | 'text' | 'line';
  className?: string;
}

export function SkeletonLoader({
  count = 1,
  type = 'card',
  className = '',
}: SkeletonLoaderProps) {
  if (type === 'text') {
    return (
      <div className={className}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="mb-2 h-4 w-3/4 animate-shimmer rounded" />
        ))}
      </div>
    );
  }

  if (type === 'line') {
    return (
      <div className={className}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="mb-3 h-2 w-full animate-shimmer rounded" />
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="mb-4 h-40 w-full animate-shimmer rounded-lg border border-gray-100"
        />
      ))}
    </div>
  );
}
