import { BaseRepository } from "./base.repository";
import supabase from "@/lib/supabase";

export class FlashSaleRepository extends BaseRepository<any> {
    constructor() {
        super("flash_sales");
    }

    async getActiveSales() {
        const now = new Date().toISOString();
        const { data, error } = await supabase
            .from(this.tableName)
            .select('*')
            .eq('active', true)
            .lte('start_time', now)
            .gte('end_time', now);

        if (error) throw error;
        return data || [];
    }

    async getByCode(code: string) {
        const now = new Date().toISOString();
        const { data, error } = await supabase
            .from(this.tableName)
            .select('*')
            .eq('coupon_code', code)
            .eq('active', true)
            .lte('start_time', now)
            .gte('end_time', now)
            .single();

        if (error) return null;
        return data;
    }
}
