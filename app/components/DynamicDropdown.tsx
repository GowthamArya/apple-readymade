import React, { useState, useEffect, useCallback } from "react";
import { Form, Select, Spin } from "antd";

interface OptionType {
  label: string;
  value: string;
}

export default function DynamicDropdown({
  name,
  label,
  apiUrl,
}: {
  name: string;
  label: string;
  apiUrl: string;
}) {
  const [options, setOptions] = useState<OptionType[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const fetchOptions = useCallback(
    async (searchValue: string, pageNumber: number, append = false) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          search: JSON.stringify({ column: "name", query: searchValue }),
          pagination: JSON.stringify({ page: pageNumber, limit: 50 }),
        });
        const response = await fetch(`${apiUrl}?${params.toString()}`);
        const json = await response.json();
        const mapped: OptionType[] = json.data.map((item: any) => ({
          label: item.name || item.label,
          value: item.id,
        }));

        if (append) {
          setOptions((prev) => [...prev, ...mapped]);
        } else {
          setOptions(mapped);
        }
        setHasMore(mapped.length === 20);
      } catch (e) {
        setOptions([]);
      }
      setLoading(false);
    },
    [apiUrl]
  );

  // Debounced search
  const debouncedFetch = useCallback(
    debounce((searchValue: string) => {
      setPage(1);
      fetchOptions(searchValue, 1, false);
    }, 500),
    [fetchOptions]
  );

  useEffect(() => {
    fetchOptions("", 1, false);
  }, [apiUrl, fetchOptions]);

  // Handle scroll for infinite pagination
  const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (!loading && hasMore && target.scrollTop + target.offsetHeight >= target.scrollHeight - 10) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchOptions(search, nextPage, true);
    }
  };

  return (
    <Form.Item name={name} label={label} rules={[{ required: true }]}>
      <Select
        showSearch
        filterOption={false}
        notFoundContent={loading ? <Spin size="small" /> : null}
        onSearch={value => {
          setSearch(value);
          debouncedFetch(value);
        }}
        onPopupScroll={handlePopupScroll}
        options={options}
        placeholder={`Select ${label}`}
        allowClear
      />
    </Form.Item>
  );
}


function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
