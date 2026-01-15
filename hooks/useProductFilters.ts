import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export interface FilterState {
    searchQuery: string;
    category: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    minPrice?: number;
    maxPrice?: number;
    colors: string[];
    sizes: string[];
    inStock: boolean;
}

const initialState: FilterState = {
    searchQuery: '',
    category: '',
    sortBy: 'created_on',
    sortOrder: 'desc',
    colors: [],
    sizes: [],
    inStock: false
};

export const useProductFilters = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [filters, setFilters] = useState<FilterState>(initialState);

    // Sync state with URL params on mount/update
    useEffect(() => {
        const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
        const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
        const colors = searchParams.get('colors') ? searchParams.get('colors')!.split(',') : [];
        const sizes = searchParams.get('sizes') ? searchParams.get('sizes')!.split(',') : [];
        const inStock = searchParams.get('inStock') === 'true';

        setFilters({
            searchQuery: searchParams.get('searchQuery') || '',
            category: searchParams.get('category') || '',
            sortBy: searchParams.get('sortBy') || 'created_on',
            sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
            minPrice,
            maxPrice,
            colors,
            sizes,
            inStock
        });
    }, [searchParams]);

    const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
        const updated = { ...filters, ...newFilters };

        // Construct URLSearchParams
        const params = new URLSearchParams();
        if (updated.searchQuery) params.set('searchQuery', updated.searchQuery);
        if (updated.category) params.set('category', updated.category);
        params.set('sortBy', updated.sortBy);
        params.set('sortOrder', updated.sortOrder);

        if (updated.minPrice !== undefined) params.set('minPrice', String(updated.minPrice));
        if (updated.maxPrice !== undefined) params.set('maxPrice', String(updated.maxPrice));

        if (updated.colors.length > 0) params.set('colors', updated.colors.join(','));
        if (updated.sizes.length > 0) params.set('sizes', updated.sizes.join(','));
        if (updated.inStock) params.set('inStock', 'true');

        // Reset pagination to 1 when filters change
        params.set('page', '1');

        router.push(`/collections?${params.toString()}`);
    }, [filters, router]);

    const resetFilters = useCallback(() => {
        router.push('/collections');
    }, [router]);

    return {
        filters,
        updateFilters,
        resetFilters
    };
};
