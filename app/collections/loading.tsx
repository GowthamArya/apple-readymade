import React from 'react';

export default function Loading() {
  return (
    <div className="relative min-h-screen bg-white">
      {/* Flash Sale Banner Skeleton */}
      <div className="w-full h-12 bg-gray-200 animate-pulse mb-4"></div>

      {/* Filter Bar Skeleton */}
      <div className="sticky top-0 z-40 w-full shadow-sm py-3 px-4 flex flex-col gap-3 bg-white">
        <div className="flex md:flex-row md:flex-row-reverse flex-col justify-center md:justify-between items-center gap-2">
          <div className="flex gap-2">
            <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Product Grid Skeleton */}
      <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-2">
            {/* Image Skeleton */}
            <div className="w-full aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
            {/* Title Skeleton */}
            <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
            {/* Price Skeleton */}
            <div className="w-1/2 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
