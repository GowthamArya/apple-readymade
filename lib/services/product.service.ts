import { ProductRepository } from "@/lib/repositories/product.repository";
import redis from "@/lib/infrastructure/redis";
import { generateEmbedding } from "@/lib/gemini";

export class ProductService {
    private repo: ProductRepository;

    constructor() {
        this.repo = new ProductRepository();
    }

    private async getFromCache<T>(key: string): Promise<T | null> {
        try {
            const cached = await redis.get(key);
            return cached ? JSON.parse(cached) : null;
        } catch (e) {
            console.warn("Redis get error:", e);
            return null;
        }
    }

    private async setCache(key: string, data: any, ttlSeconds: number = 300) {
        try {
            await redis.set(key, JSON.stringify(data), "EX", ttlSeconds);
        } catch (e) {
            console.warn("Redis set error:", e);
        }
    }

    async getAllCategories() {
        const cacheKey = "categories:all";
        const cached = await this.getFromCache<any[]>(cacheKey);
        if (cached) return cached;

        const categories = await this.repo.getCategories();
        await this.setCache(cacheKey, categories, 3600);
        return categories;
    }

    async getProducts(params: {
        searchQuery?: string;
        category?: string;
        sortBy?: string;
        sortOrder?: string;
        page?: number;
        pageSize?: number;
        minPrice?: number;
        maxPrice?: number;
        colors?: string[];
        sizes?: string[];
        inStock?: boolean;
    }) {
        const cacheKey = `product:${JSON.stringify(params)}`;
        const cached = await this.getFromCache<any>(cacheKey);
        if (cached) return cached;

        let variantIds: number[] | undefined;

        if (params.searchQuery) {
            try {
                const embedding = await generateEmbedding(params.searchQuery);
                const similar = await this.repo.searchByVector(embedding, params.pageSize || 20);
                if (similar && similar.length > 0) {
                    variantIds = similar.map((v: any) => v.id);
                }
            } catch (e) {
                console.error("Vector search failed, falling back to keyword search", e);
            }
        }

        const result = await this.repo.findProducts({ ...params, variantIds });

        await this.setCache(cacheKey, result, 300); // 5 minutes
        return result;
    }

    async getSimilarVariants(variantId: number) {
        const cacheKey = `similar:${variantId}`;
        const cached = await this.getFromCache<any[]>(cacheKey);
        if (cached) return cached;

        try {
            const embedding = await this.repo.getVariantEmbedding(variantId);
            if (!embedding) return [];

            const similar = await this.repo.searchByVector(embedding, 5);
            if (!similar) return [];

            const ids = similar.map((v: any) => v.id).filter((id: number) => id !== variantId);
            if (ids.length === 0) return [];

            const variants = await this.repo.getVariantsByIds(ids);

            await this.setCache(cacheKey, variants, 3600);
            return variants;
        } catch (error) {
            console.error("Error in getSimilarVariants", error);
            return [];
        }
    }

    async getFilterFacets() {
        const cacheKey = "filter:facets";
        const cached = await this.getFromCache<any>(cacheKey);
        if (cached) return cached;

        const facets = await this.repo.getFilterFacets();
        await this.setCache(cacheKey, facets, 3600); // Cache for 1 hour
        return facets;
    }
}

export const productService = new ProductService();
