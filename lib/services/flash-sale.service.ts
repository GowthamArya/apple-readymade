import { FlashSaleRepository } from "@/lib/repositories/flash-sale.repository";
import redis from "@/lib/infrastructure/redis";

export class FlashSaleService {
    private repo: FlashSaleRepository;

    constructor() {
        this.repo = new FlashSaleRepository();
    }

    async getActiveSales() {
        const cacheKey = "flash_sales:active";
        try {
            const cached = await redis.get(cacheKey);
            if (cached) return JSON.parse(cached);
        } catch (e) {
            console.warn("Redis error", e);
        }

        const sales = await this.repo.getActiveSales();

        try {
            await redis.set(cacheKey, JSON.stringify(sales), "EX", 60); // Cache for 1 minute
        } catch (e) {
            console.warn("Redis set error", e);
        }

        return sales;
    }

    async getSaleByCode(code: string) {
        return this.repo.getByCode(code);
    }
}

export const flashSaleService = new FlashSaleService();
