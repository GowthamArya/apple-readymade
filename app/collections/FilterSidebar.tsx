"use client";
import { useState, useEffect } from "react";
import { Slider, Checkbox, Button, Collapse, theme, Switch } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { FilterState } from "@/hooks/useProductFilters";

const { Panel } = Collapse;

interface FilterSidebarProps {
    filters: FilterState;
    updateFilters: (filters: Partial<FilterState>) => void;
    resetFilters: () => void;
    categories: any[];
    className?: string;
}

export default function FilterSidebar({
    filters,
    updateFilters,
    resetFilters,
    categories,
    className = ""
}: FilterSidebarProps) {
    const { token } = theme.useToken();
    const [facets, setFacets] = useState<{
        colors: string[];
        sizes: string[];
        minPrice: number;
        maxPrice: number;
    }>({
        colors: [],
        sizes: [],
        minPrice: 0,
        maxPrice: 10000
    });

    // Local state for slider dragging
    const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);

    // Fetch facets
    useEffect(() => {
        fetch('/api/facets')
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setFacets(data);
                    // Update local state if filters are not set
                    if (filters.minPrice === undefined && filters.maxPrice === undefined) {
                        setPriceRange([data.minPrice, data.maxPrice]);
                    }
                }
            })
            .catch(err => console.error("Failed to fetch facets", err));
    }, []);

    // Sync local state with filters
    useEffect(() => {
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            setPriceRange([
                filters.minPrice ?? facets.minPrice,
                filters.maxPrice ?? facets.maxPrice
            ]);
        } else {
            // If filters cleared, reset to facets limits
            setPriceRange([facets.minPrice, facets.maxPrice]);
        }
    }, [filters.minPrice, filters.maxPrice, facets.minPrice, facets.maxPrice]);


    const handlePriceChange = (value: number[]) => {
        setPriceRange(value);
    };

    const handlePriceAfterChange = (value: number[]) => {
        updateFilters({ minPrice: value[0], maxPrice: value[1] });
    };

    const handleColorChange = (color: string) => {
        const newColors = filters.colors.includes(color)
            ? filters.colors.filter(c => c !== color)
            : [...filters.colors, color];
        updateFilters({ colors: newColors });
    };

    const handleSizeChange = (size: string) => {
        const newSizes = filters.sizes.includes(size)
            ? filters.sizes.filter(s => s !== size)
            : [...filters.sizes, size];
        updateFilters({ sizes: newSizes });
    };

    return (
        <div className={`w-full max-w-xs space-y-6 ${className}`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold" style={{ color: token.colorText }}>Filters</h3>
                <Button type="link" onClick={resetFilters} className="text-sm p-0 hover:text-red-500" style={{ color: token.colorTextSecondary }}>
                    Clear All
                </Button>
            </div>

            <Collapse
                defaultActiveKey={['categories', 'price', 'color', 'size']}
                ghost
                expandIconPosition="end"
                expandIcon={({ isActive }) => isActive ? <MinusOutlined /> : <PlusOutlined />}
            >
                {/* Categories */}
                <Panel header={<span className="font-semibold text-base">Categories</span>} key="categories">
                    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                        {categories.map((cat: any) => (
                            <Checkbox
                                key={cat.id}
                                checked={filters.category === cat.name}
                                onChange={(e) => updateFilters({ category: e.target.checked ? cat.name : "" })}
                                style={{ color: token.colorText }}
                            >
                                {cat.name}
                            </Checkbox>
                        ))}
                        {categories.length === 0 && <span className="text-sm" style={{ color: token.colorTextDisabled }}>No categories</span>}
                    </div>
                </Panel>

                {/* Price Range */}
                <Panel header={<span className="font-semibold text-base">Price Range</span>} key="price">
                    <div className="px-2">
                        <Slider
                            range
                            min={facets.minPrice}
                            max={facets.maxPrice}
                            value={[priceRange[0], priceRange[1]]}
                            onChange={handlePriceChange}
                            onChangeComplete={handlePriceAfterChange}
                            tooltip={{ formatter: (value) => `₹${value}` }}
                        />
                        <div className="flex justify-between text-sm mt-2" style={{ color: token.colorTextSecondary }}>
                            <span>₹{priceRange[0]}</span>
                            <span>₹{priceRange[1]}</span>
                        </div>
                    </div>
                </Panel>

                {/* Colors */}
                <Panel header={<span className="font-semibold text-base">Colors</span>} key="color">
                    <div className="flex flex-wrap gap-2">
                        {facets.colors.map((color) => (
                            <div
                                key={color}
                                onClick={() => handleColorChange(color)}
                                className={`w-8 h-8 rounded-full border cursor-pointer flex items-center justify-center transition-all ${filters.colors.includes(color) ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-110'
                                    }`}
                                style={{ backgroundColor: color.toLowerCase() }}
                                title={color}
                            >
                                {/* Checkmark for white/light colors could be tricky, adding shadow */}
                                {filters.colors.includes(color) && (
                                    <span className="w-2 h-2 bg-white rounded-full shadow-sm" />
                                )}
                            </div>
                        ))}
                    </div>
                </Panel>

                {/* Sizes */}
                <Panel header={<span className="font-semibold text-base">Sizes</span>} key="size">
                    <div className="flex flex-wrap gap-2">
                        {facets.sizes.map((size) => (
                            <div
                                key={size}
                                onClick={() => handleSizeChange(size)}
                                className={`px-3 py-1 border rounded-md cursor-pointer text-sm transition-all hover:border-gray-400`}
                                style={{
                                    backgroundColor: filters.sizes.includes(size) ? token.colorText : token.colorBgContainer,
                                    color: filters.sizes.includes(size) ? token.colorBgContainer : token.colorText,
                                    borderColor: filters.sizes.includes(size) ? token.colorText : token.colorBorder
                                }}
                            >
                                {size}
                            </div>
                        ))}
                    </div>
                </Panel>

                {/* Availability */}
                <Panel header={<span className="font-semibold text-base">Availability</span>} key="stock">
                    <div className="flex items-center justify-between">
                        <span style={{ color: token.colorText }}>In Stock Only</span>
                        <Switch
                            checked={filters.inStock}
                            onChange={(checked) => updateFilters({ inStock: checked })}
                        />
                    </div>
                </Panel>
            </Collapse>
        </div >
    );
}
