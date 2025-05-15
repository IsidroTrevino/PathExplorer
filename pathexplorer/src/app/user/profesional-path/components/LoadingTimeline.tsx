'use client';

import React from 'react';

interface LoadingTimelineProps {
  count?: number;
}

export const LoadingTimeline: React.FC<LoadingTimelineProps> = ({ count = 4 }) => (
  <div className="relative mt-12">
    {/* Línea vertical */}
    <div className="absolute top-0 bottom-0 left-8 w-1 bg-gradient-to-b from-purple-300 to-purple-100 rounded-full z-0" />
    <div className="space-y-16">
      {[...Array(count)].map((_, idx) => (
        <div key={idx} className="relative flex items-start gap-6 pl-16">
          {/* Punto skeleton */}
          <div className="absolute left-6 top-1 w-5 h-5 bg-gray-300 rounded-full animate-pulse z-10" />
          {/* Texto skeleton */}
          <div className="ml-12 space-y-2 w-full">
            <div className="h-4 bg-gray-300 rounded w-1/4 animate-pulse" />
            <div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse" />
            <div className="h-4 bg-gray-300 rounded w-1/2 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  </div>
);
