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
    }) {
        const {
            searchQuery,
            category,
            sortBy = 'created_on',
            sortOrder = 'desc',
            page = 1,
            pageSize = 20,
            variantIds
        } = params;

        let query = fetchWithRelations("variant", ["product.category"])
            .eq("is_default", true);

        if (variantIds && variantIds.length > 0) {
            query = query.in('id', variantIds);
        } else if (searchQuery) {
            query = query.ilike("product.name", `%${searchQuery}%`);
        }

        if (category) {
            query = query.ilike("product.category.name", `%${category}%`);
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
}
