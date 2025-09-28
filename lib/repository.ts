import supabase from "./supabase";
import { Database } from './database.types';

type TableName = keyof Database['public']['Tables'];

export default class Repository<T extends TableName> {
  constructor(private tableName: string) {}

  async getAll(relations: string[] = []): Promise<any> {
    let selectString = "*";
    if (relations.length > 0) {
      const relationsSelect = relations.map(r => `${r}(*)`).join(",");
      selectString = `*,${relationsSelect}`;
    }

    const { data, error } = await supabase
      .from(this.tableName)
      .select(selectString);

    if (error) {
      throw error;
    }
    return data ?? [];
  }

  async getById(id: string | number): Promise<T | null> {
    const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).single();
    if (error) throw error;
    return data!;
  }

  async create(payload: Partial<T>): Promise<T> {
    const { data, error } = await supabase.from(this.tableName).insert([payload]).select().single();
    if (error) throw error;
    return data!;
  }

  async update(id: string | number, payload: Partial<T>): Promise<T> {
    const { data, error } = await supabase.from(this.tableName).update(payload).eq("id", id).select().single();
    if (error) throw error;
    return data!;
  }

  async delete(id: string | number): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().eq("id", id);
    if (error) throw error;
  }
}
