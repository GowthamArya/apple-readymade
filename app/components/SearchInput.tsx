"use client";

import { Input, Button, Space, theme } from "antd";
import { SearchOutlined, CloseCircleFilled } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface SearchInputProps {
    mobile?: boolean;
    onCloseMobile?: () => void;
}

export default function SearchInput({ mobile, onCloseMobile }: SearchInputProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("searchQuery") || "");
    const { token } = theme.useToken();

    useEffect(() => {
        setSearch(searchParams.get("searchQuery") || "");
    }, [searchParams]);

    function handleSearch(val: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (val) {
            params.set("searchQuery", val);
        } else {
            params.delete("searchQuery");
        }
        router.push(`/collections?${params.toString()}`);
        if (mobile && onCloseMobile) {
            onCloseMobile();
        }
    }

    return (
        <Space.Compact style={{ width: '100%' }} onBlur={() => mobile && onCloseMobile && onCloseMobile()}>
            <Input
                autoFocus={mobile}
                placeholder={mobile ? "Search..." : "Search products"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onPressEnter={() => handleSearch(search)}
                allowClear
                style={{
                    width: !mobile ? 'calc(100% - 46px)' : undefined,
                    backgroundColor: token.colorBgContainer,
                    color: token.colorText,
                    borderColor: token.colorBorder,
                }}
            />
            <Button
                icon={<SearchOutlined />}
                onClick={() => handleSearch(search)}
                style={{
                    backgroundColor: token.colorBgContainer,
                    color: token.colorText,
                    borderColor: token.colorBorder,
                }}
            />
        </Space.Compact>
    );
}
