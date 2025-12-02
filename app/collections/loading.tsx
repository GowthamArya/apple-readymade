'use client';

import React from 'react';
import { theme } from 'antd';

export default function Loading() {
  const { token } = theme.useToken();

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: token.colorBgContainer }}>

      {/* Filter Bar Skeleton */}
      <div className="sticky top-0 z-40 w-full shadow-sm py-3 px-4 flex flex-col gap-3" style={{ backgroundColor: token.colorBgContainer }}>
        <div className="flex md:flex-row md:flex-row-reverse flex-col justify-center md:justify-between items-center gap-2">
          <div className="flex gap-2">
            <div className="w-24 h-8 rounded animate-pulse" style={{ backgroundColor: token.colorFillSecondary }}></div>
            <div className="w-24 h-8 rounded animate-pulse" style={{ backgroundColor: token.colorFillSecondary }}></div>
          </div>
        </div>
      </div>

      {/* Product Grid Skeleton */}
      <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-2">
            {/* Image Skeleton */}
            <div className="w-full aspect-square rounded-lg animate-pulse" style={{ backgroundColor: token.colorFillSecondary }}></div>
            {/* Title Skeleton */}
            <div className="w-3/4 h-4 rounded animate-pulse" style={{ backgroundColor: token.colorFillSecondary }}></div>
            {/* Price Skeleton */}
            <div className="w-1/2 h-4 rounded animate-pulse" style={{ backgroundColor: token.colorFillSecondary }}></div>
          </div>
        ))}
      </div>
    </div>
  );
}
