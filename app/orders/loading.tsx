'use client';

import React from 'react';
import { theme } from 'antd';

export default function Loading() {
    const { token } = theme.useToken();

    return (
        <div className="px-4 md:px-8 lg:px-16 py-5" style={{ backgroundColor: token.colorBgContainer }}>
            <div className="h-8 w-48 mb-4 rounded animate-pulse" style={{ backgroundColor: token.colorFillSecondary }}></div>
            <div className="flex flex-col gap-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="w-full h-32 rounded-lg animate-pulse" style={{ backgroundColor: token.colorFillSecondary }}></div>
                ))}
            </div>
        </div>
    );
}
