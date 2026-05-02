'use client';

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
          <div
            key={i}
            className="mb-2 h-4 w-3/4 animate-pulse rounded-lg bg-slate-800"
          />
        ))}
      </div>
    );
  }

  if (type === 'line') {
    return (
      <div className={className}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="mb-3 h-2 w-full animate-pulse rounded bg-slate-800"
          />
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="mb-4 h-48 w-full animate-pulse rounded-2xl bg-slate-800/50 border border-slate-800"
        />
      ))}
    </div>
  );
}
