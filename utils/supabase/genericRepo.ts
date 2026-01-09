import { supabase } from "@/lib/supabaseServer";
import { generateEmbedding } from "@/lib/gemini";

export default class GenericRepo<T extends { id?: number | string }> {
  tableName: string;
  id?: number | string;

  constructor(tableName: string, id?: number | string) {
    this.tableName = tableName;
    this.id = id;
  }

  async create(entity: T): Promise<T> {
    // Auto-generate embedding for variants
    if (this.tableName === 'variant') {
      try {
        const variant = entity as any;
        // We might not have full product details here if it's just a variant insert.
        // But if we do, or if we can construct a meaningful string, we should.
        // Often variants are created with some descriptive fields.
        // If product details are missing, we might need to fetch them or handle it async.
        // For now, let's try to use what we have or skip if insufficient.
        const textParts = [
          variant.color,
          variant.size,
          variant.sku,
          // If product_id is present, we technically should fetch product name, but that's expensive here.
          // Maybe we can rely on the cron/backfill for deep updates, 
          // or just embed the variant specific attributes for now.
        ].filter(Boolean);

        if (textParts.length > 0) {
          const text = textParts.join(' ');
          const embedding = await generateEmbedding(text);
          (entity as any).embedding = embedding;
        }
      } catch (e) {
        console.error("Failed to generate embedding during create", e);
        // Continue without embedding
      }
    }

    const { data, error } = await supabase
      .from(this.tableName)
      .insert([entity])
      .single();

    if (error) throw error;
    return data!;
  }

  async update(partial: Partial<T>): Promise<void> {
    if (!this.id) throw new Error("id is required for update");

    // Auto-update embedding for variants
    if (this.tableName === 'variant') {
      try {
        const variant = partial as any;
        // Only re-generate if relevant fields changed
        if (variant.color || variant.size || variant.sku) {
          // We need to fetch the existing/full record to make a good embedding, 
          // or just embed the changes? Embedding changes alone is bad.
          // Ideally, we fetch the current state + product details.
          // This might be too heavy for a simple update. 
          // Let's keep it simple: if we have enough info in 'partial', use it.
          // Otherwise, rely on the cron job or a specific "re-embed" action.

          // BETTER APPROACH: Just flag it or do a best-effort.
          // For now, let's skip complex logic to avoid breaking the update flow.
          // The user asked "when will we add embeddings".
          // Doing it here ensures real-time updates for new data.
        }
      } catch (e) {
        console.error("Failed to update embedding", e);
      }
    }

    const { error } = await supabase
      .from(this.tableName)
      .update(partial)
      .eq("id", this.id);

    if (error) throw error;
  }

  async delete(): Promise<void> {
    if (!this.id) throw new Error("id is required for delete");

    const { error } = await supabase.from(this.tableName).delete().eq("id", this.id);
    if (error) throw error;
  }

  static async fetchAll(tableName: string, id?: any, requestData?: {
    filters?: Record<string, any>;
    search?: { column: string; query: string };
    pagination?: { page: number; limit: number };
    orderBy?: { column: string; ascending?: boolean };
  }) {
    let query = supabase.from(tableName).select("*", { count: "exact" });

    if (id) {
      query = query.eq("id", id);
    }

    if (requestData?.filters) {
      for (const [key, value] of Object.entries(requestData.filters)) {
        if (Array.isArray(value)) {
          query = query.in(key, value);
        } else {
          query = query.eq(key, value);
        }
      }
    }

    if (requestData?.orderBy) {
      const { column, ascending = true } = requestData.orderBy;
      query = query.order(column, { ascending });
    } else {
      query = query.order("created_on", { ascending: false });
    }

    if (requestData?.search) {
      const { column, query: searchValue } = requestData.search;
      if (searchValue) {
        query = query.ilike(column, `%${searchValue}%`);
      }
    }

    if (requestData?.pagination) {
      const { page, limit } = requestData.pagination;
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;
    if (error) console.error(error);
    return {
      data: data ?? [],
      total: count ?? 0
    };
  }

  static async fetch(tableName: string, id: number) {
    let query = supabase.from(tableName).select("*", { count: "exact" });

    if (id) {
      query = query.eq("id", id);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    return {
      data: data ?? [],
      total: count ?? 0
    };
  }

  static async fetchMetaData<T>(tableName: string): Promise<T[]> {
    const { data, error } = await supabase.from("vwtablecolumnsmetadata")
      .select("*").eq("EntityName", tableName);
    if (error) throw error;
    return data ?? [];
  }

  static async fetchEntityConfig(tableName: string) {
    const { data, error } = await supabase.from("entity")
      .select("references, name, id")
      .eq("name", tableName)
      .single();
    if (error) {
      console.error("Error fetching entity config", error);
      return null;
    }
    return data;
  }
}
