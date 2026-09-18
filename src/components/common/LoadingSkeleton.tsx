import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-darkBg-card rounded-2xl overflow-hidden border border-gray-100 dark:border-darkBg-border shadow-sm animate-pulse"
        >
          <div className="aspect-[16/9] bg-gray-200 dark:bg-darkBg-surface" />
          <div className="p-4 space-y-3">
            <div className="h-5 bg-gray-200 dark:bg-darkBg-surface rounded w-3/4" />
            <div className="h-4 bg-gray-100 dark:bg-darkBg-border rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};
