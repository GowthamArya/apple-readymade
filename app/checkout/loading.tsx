'use client';

import React from 'react';
import { theme } from 'antd';

export default function Loading() {
    const { token } = theme.useToken();

    return (
        <div className="px-4 md:px-10 lg:px-16 py-10" style={{ backgroundColor: token.colorBgContainer }}>
            <div className="h-8 w-32 mb-6 rounded animate-pulse" style={{ backgroundColor: token.colorFillSecondary }}></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 flex flex-col gap-6">
                    <div className="w-full h-64 rounded-lg animate-pulse" style={{ backgroundColor: token.colorFillSecondary }}></div>
                    <div className="w-full h-48 rounded-lg animate-pulse" style={{ backgroundColor: token.colorFillSecondary }}></div>
                </div>
                <div className="md:col-span-1">
                    <div className="w-full h-64 rounded-lg animate-pulse" style={{ backgroundColor: token.colorFillSecondary }}></div>
                </div>
            </div>
        </div>
    );
}
