'use client';

import React from 'react';
import { theme } from 'antd';

export default function Loading() {
    const { token } = theme.useToken();

    return (
        <div className="min-h-[90vh] flex items-center justify-center p-4" style={{ backgroundColor: token.colorBgContainer }}>
            <div className="w-full max-w-md h-96 rounded-lg animate-pulse" style={{ backgroundColor: token.colorFillSecondary }}></div>
        </div>
    );
}
