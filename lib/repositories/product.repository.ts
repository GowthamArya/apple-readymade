import { BaseRepository } from "./base.repository";
import supabase, { fetchWithRelations } from "@/lib/supabase";
import { Product } from "@/Entities/Product";

export class ProductRepository extends BaseRepository<Product> {
    constructor() {
        super("product");
    }

    async getCategories() {
        const { data, error } = await fetchWithRelations("category")
            .order('name', { ascending: true });

        if (error) throw error;
        return data || [];
    }

    async searchByVector(embedding: number[], matchCount: number = 20) {
        const { data, error } = await supabase.rpc('match_variants', {
            query_embedding: embedding,
            match_threshold: 0.5,
            match_count: matchCount
        });

        if (error) throw error;
        return data;
    }

    async findProducts(params: {
        searchQuery?: string;
        category?: string;
        sortBy?: string;
        sortOrder?: string;
        page?: number;
        pageSize?: number;
        variantIds?: number[];
        minPrice?: number;
        maxPrice?: number;
        colors?: string[];
        sizes?: string[];
        inStock?: boolean;
    }) {
        const {
            searchQuery,
            category,
            sortBy = 'created_on',
            sortOrder = 'desc',
            page = 1,
            pageSize = 20,
            variantIds,
            minPrice,
            maxPrice,
            colors,
            sizes,
            inStock
        } = params;

        let query = fetchWithRelations("variant", ["product.category"], { count: 'exact' })
            .eq("is_default", true);

        if (variantIds && variantIds.length > 0) {
            query = query.in('id', variantIds);
        } else if (searchQuery) {
            query = query.ilike("product.name", `%${searchQuery}%`);
        }

        if (category) {
            query = query.ilike("product.category.name", `%${category}%`);
        }

        if (minPrice !== undefined) {
            query = query.gte('price', minPrice);
        }
        if (maxPrice !== undefined) {
            query = query.lte('price', maxPrice);
        }

        if (colors && colors.length > 0) {
            query = query.in('color', colors);
        }

        if (sizes && sizes.length > 0) {
            query = query.in('size', sizes);
        }

        if (inStock) {
            query = query.gt('stock', 0);
        }

        // Sorting
        if (sortBy === 'price') {
            query = query.order('price', { ascending: sortOrder === 'asc' });
        } else if (sortBy === 'mrp') {
            query = query.order('mrp', { ascending: sortOrder === 'asc' });
        } else {
            query = query.order('created_on', { ascending: sortOrder === 'asc' });
        }

        // Pagination
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);

        const { data, error, count } = await query;

        if (error) throw error;

        return { data: data || [], totalCount: count || 0 };
    }

    async getVariantEmbedding(variantId: number) {
        const { data, error } = await supabase
            .from('variant')
            .select('embedding')
            .eq('id', variantId)
            .single();

        if (error) throw error;
        return data?.embedding;
    }

    async getVariantsByIds(ids: number[]) {
        const { data, error } = await fetchWithRelations("variant", ["product.category"])
            .in('id', ids);

        if (error) throw error;
        return data || [];
    }

    async getFilterFacets() {
        // Fetch specific columns to build facets
        // Note: distinct() is not directly exposed by the used supabase helper wrapper context here easily, 
        // asking for all variants might be heavy but for now it's the safest way to get all options without raw SQL.
        // Optimally we would use an RPC call for this.
        const { data: colorsData } = await supabase.from('variant').select('color');
        const { data: sizesData } = await supabase.from('variant').select('size');
        const { data: priceData } = await supabase.from('variant').select('price');

        const uniqueColors = Array.from(new Set(colorsData?.map(c => c.color).filter(Boolean)));
        const uniqueSizes = Array.from(new Set(sizesData?.map(s => s.size).filter(Boolean)));

        let minPrice = 0;
        let maxPrice = 10000;

        if (priceData && priceData.length > 0) {
            const prices = priceData.map(p => p.price);
            minPrice = Math.min(...prices);
            maxPrice = Math.max(...prices);
        }

        return {
            colors: uniqueColors,
            sizes: uniqueSizes,
            minPrice,
            maxPrice
        };
    }
}
