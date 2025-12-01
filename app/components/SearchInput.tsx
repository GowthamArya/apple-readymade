"use client";

import { Input, Button, Space } from "antd";
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
                style={!mobile ? { width: 'calc(100% - 46px)' } : undefined}
            />
            <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => handleSearch(search)}
            />
        </Space.Compact>
    );
}
