"use client";

import React from 'react';
import { Layout, Skeleton, theme } from 'antd';
import Sider from 'antd/es/layout/Sider';

const { Content } = Layout;

export default function EntityLoading() {
    const { token } = theme.useToken();

    return (
        <Layout className='flex flex-row!'>
            {/* Sidebar Skeleton */}
            <Sider
                trigger={null}
                breakpoint="lg"
                collapsedWidth={0}
                className="hidden lg:block"
                width={250}
                style={{
                    position: "fixed",
                    left: 0,
                    height: `calc(95vh)`,
                    background: "#001529",
                    zIndex: 10,
                }}
            >
                <div className="font-bold p-3 text-xl text-start sticky top-0 z-10" style={{ background: token.colorText, color: token.colorBgContainer }}>
                    <Skeleton.Input active size="small" style={{ width: 100 }} />
                </div>
                <div className="p-4">
                    <Skeleton active paragraph={{ rows: 12 }} title={false} />
                </div>
            </Sider>

            <Layout
                className={`p-5! min-h-[95vh]!`}
                style={{
                    background: token.colorBgContainer,
                }}
            >
                <Content
                    style={{
                        // Mimic the marginLeft logic for desktop (assuming expanded by default for skeleton)
                        // On mobile, this marging might be wrong if we hardcode it, 
                        // but we can use Tailwind's lg:ml-[250px] or similar if we want to be responsive-ish without state.
                        // GenericListing uses inline styles with state. 
                        // We'll use a responsive class approach for better skeleton behavior.
                    }}
                    className="lg:ml-[250px] transition-all duration-1000"
                >
                    {/* Header Area Skeleton */}
                    <div className='flex justify-between! pb-5'>
                        {/* Mobile Menu Button Skeleton */}
                        <Skeleton.Button active className='md:hidden!' size='large' />

                        <div className="mx-auto">
                            <Skeleton.Input active size="large" style={{ width: 200 }} />
                        </div>

                        <div className='flex items-center gap-2'>
                            <Skeleton.Button active />
                            <Skeleton.Button active />
                        </div>
                    </div>

                    {/* Search and Actions Skeleton */}
                    <div className='flex justify-between! pb-5'>
                        <div className='flex gap-2 w-full max-w-md'>
                            <Skeleton.Input active block style={{ width: '100%' }} />
                            <Skeleton.Button active />
                        </div>
                        <div className='flex gap-2 pl-2'>
                            <Skeleton.Button active />
                            <Skeleton.Button active />
                        </div>
                    </div>

                    {/* Table Skeleton */}
                    <div className="border rounded-md p-4">
                        <Skeleton active />
                        <Skeleton active />
                        <Skeleton active />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}
