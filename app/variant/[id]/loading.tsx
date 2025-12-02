'use client';

import React from 'react';
import { theme } from 'antd';

export default function Loading() {
  const { token } = theme.useToken();

  return (
    <div className="flex flex-col md:grid md:grid-cols-2 gap-6 min-h-screen px-4 md:px-8 lg:px-16 py-8" style={{ backgroundColor: token.colorBgContainer }}>
      {/* Left: Image Skeleton */}
      <div className="w-full">
        <div className="w-full h-[50vh] md:h-[70vh] rounded-lg animate-pulse" style={{ backgroundColor: token.colorFillSecondary }}></div>
        <div className="grid grid-cols-4 gap-2 mt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 w-full rounded animate-pulse" style={{ backgroundColor: token.colorFillSecondary }}></div>
          ))}
        </div>
      </div>

      {/* Right: Details Skeleton */}
      <div className="w-full flex flex-col gap-6">
        <div>
          <div className="h-8 w-3/4 mb-4 rounded animate-pulse" style={{ backgroundColor: token.colorFillSecondary }}></div>
          <div className="h-4 w-full mb-2 rounded animate-pulse" style={{ backgroundColor: token.colorFillSecondary }}></div>
          <div className="h-4 w-2/3 rounded animate-pulse" style={{ backgroundColor: token.colorFillSecondary }}></div>
        </div>

        {/* Variant Selector Skeleton */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-lg animate-pulse" style={{ backgroundColor: token.colorFillSecondary }}></div>
          ))}
        </div>

        {/* Price & Info Skeleton */}
        <div className="space-y-3">
          <div className="h-8 w-1/3 rounded animate-pulse" style={{ backgroundColor: token.colorFillSecondary }}></div>
          <div className="h-4 w-1/2 rounded animate-pulse" style={{ backgroundColor: token.colorFillSecondary }}></div>
          <div className="h-4 w-1/2 rounded animate-pulse" style={{ backgroundColor: token.colorFillSecondary }}></div>
        </div>

        {/* Buttons Skeleton */}
        <div className="flex gap-3 mt-4">
          <div className="h-12 flex-1 rounded animate-pulse" style={{ backgroundColor: token.colorFillSecondary }}></div>
          <div className="h-12 flex-1 rounded animate-pulse" style={{ backgroundColor: token.colorFillSecondary }}></div>
          <div className="h-12 w-12 rounded animate-pulse" style={{ backgroundColor: token.colorFillSecondary }}></div>
          <div className="h-12 w-12 rounded animate-pulse" style={{ backgroundColor: token.colorFillSecondary }}></div>
        </div>
      </div>
    </div>
  );
}