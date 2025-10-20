import { supabase } from "@/lib/supabaseServer";

export default class GenericRepo<T extends { id?: number | string }> {
  tableName: string;
  id?: number | string;

  constructor(tableName: string, id?: number | string) {
    this.tableName = tableName;
    this.id = id;
  }

  async create(entity: T): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert([entity])
      .single();

    if (error) throw error;
    return data!;
  }

  async update(partial: Partial<T>): Promise<void> {
    if (!this.id) throw new Error("id is required for update");

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

  static async fetchAll(tableName: string,id?:any,requestData?:{
    filters?: Record<string, any>;
    search?: { column: string; query: string };
    pagination?: { page: number; limit: number };
    orderBy?: { column: string; ascending?: boolean };
  }) {
    let query = supabase.from(tableName).select("*", { count: "exact" });

    if(id){
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
      query = query.order("created_on", {ascending:false});
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

    const { data, error, count  } = await query;
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
}
