import supabase from "@/lib/supabase";

export interface IRead<T> {
    getAll(relations?: string[]): Promise<T[]>;
    getById(id: string | number): Promise<T | null>;
}

export interface IWrite<T> {
    create(item: Partial<T>): Promise<T>;
    update(id: string | number, item: Partial<T>): Promise<T>;
    delete(id: string | number): Promise<boolean>;
}

export abstract class BaseRepository<T> implements IRead<T>, IWrite<T> {
    constructor(protected readonly tableName: string) { }

    async getAll(relations: string[] = []): Promise<T[]> {
        let query = supabase.from(this.tableName).select("*");

        // Note: Supabase JS client handles relations differently (embedding).
        // For simple cases, we can use select('*, relation(*)')
        if (relations.length > 0) {
            const relationString = relations.map(r => `${r}(*)`).join(',');
            query = supabase.from(this.tableName).select(`*, ${relationString}`);
        }

        const { data, error } = await query;
        if (error) throw error;
        return (data as T[]) || [];
    }

    async getById(id: string | number): Promise<T | null> {
        const { data, error } = await supabase
            .from(this.tableName)
            .select("*")
            .eq("id", id)
            .single();

        if (error) return null;
        return data as T;
    }

    async create(item: Partial<T>): Promise<T> {
        const { data, error } = await supabase
            .from(this.tableName)
            .insert(item)
            .select()
            .single();

        if (error) throw error;
        return data as T;
    }

    async update(id: string | number, item: Partial<T>): Promise<T> {
        const { data, error } = await supabase
            .from(this.tableName)
            .update(item)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data as T;
    }

    async delete(id: string | number): Promise<boolean> {
        const { error } = await supabase
            .from(this.tableName)
            .delete()
            .eq("id", id);

        if (error) throw error;
        return true;
    }
}
