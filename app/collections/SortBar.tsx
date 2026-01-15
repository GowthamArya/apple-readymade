"use client";
import { Select, theme } from 'antd';
import { FilterState } from "@/hooks/useProductFilters";

interface SortBarProps {
    totalCount: number;
    currentCount: number;
    filters: FilterState;
    updateFilters: (filters: Partial<FilterState>) => void;
}

const sortOptions = [
    { value: 'created_on-desc', label: 'Newest Arrivals' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'mrp-desc', label: 'Discount: High to Low' },
];

export default function SortBar({
    totalCount,
    currentCount,
    filters,
    updateFilters
}: SortBarProps) {
    const { token } = theme.useToken();
    // Combine sortBy and sortOrder for the Select value
    const currentSortValue = `${filters.sortBy}-${filters.sortOrder}`;

    const handleSortChange = (value: string) => {
        const [sortBy, sortOrder] = value.split('-');
        updateFilters({ sortBy, sortOrder: sortOrder as 'asc' | 'desc' });
    };

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <span className="font-medium" style={{ color: token.colorTextSecondary }}>
                Showing {currentCount} of {totalCount} Products
            </span>

            <div className="flex items-center gap-2">
                <label className="font-medium hidden sm:block" style={{ color: token.colorTextSecondary }}>Sort By:</label>
                <Select
                    className="w-48"
                    value={currentSortValue}
                    onChange={handleSortChange}
                    options={sortOptions}
                    size="middle"
                    variant="filled"
                />
            </div>
        </div>
    );
}
