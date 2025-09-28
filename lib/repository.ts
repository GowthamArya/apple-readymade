import supabase from "./supabase";


export default class Repository<T> {
  constructor(private tableName: string) {}

  async getAll(relations: string[] = []): Promise<any> {
    let selectString = "*";

    const { data, error } = await supabase
      .from(this.tableName)
      .select(selectString);
    console.log(data, error);
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
