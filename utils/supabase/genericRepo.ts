import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.APPLE_DB_SUPABASE_URL!,
  process.env.APPLE_DB_SUPABASE_SERVICE_ROLE_KEY!
);

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

  static async fetchAll<T>(tableName: string): Promise<T[]> {
    const { data, error } = await supabase.from(tableName).select("*");
    if (error) throw error;
    return data ?? [];
  }
}
