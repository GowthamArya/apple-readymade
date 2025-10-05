import supabase from '@/lib/supabase';
import { DateTime } from 'next-auth/providers/kakao';

export interface ICrudEntity {
  id: any;
  create: () => Promise<void>;
  update: (partial: any) => Promise<void>;
  delete: () => Promise<void>;
}
export class BaseEntity<T, EntityIdType> implements ICrudEntity {
  id!: EntityIdType;
  created_on?: DateTime;
  updated_on?: DateTime;
  updated_by?: number;
  created_by?: number;
  protected tableName: string = '';

  constructor(data?: Partial<T>) {
    console.log("Data before assign:", data);
    if (data) Object.assign(this, data);
    console.log("Instance after assign:", this);
  }


  async create(): Promise<void> {
    const { id, tableName, ...data } = this as any;
    const { data: created, error } = await supabase
      .from(this.tableName)
      .insert([data])
      .single();
    if (error) throw error;
    return created;
  }

  async update(partial: Partial<T>): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .update(partial)
      .eq('id', this.id);
    if (error) throw error;
    Object.assign(this, partial);
  }

  async delete(): Promise<void> {
    const { error } = await supabase.from(this.tableName).delete().eq('id', this.id);
    if (error) throw error;
  }

  static async fetchAll<T extends BaseEntity<any, any>>(this: new (data?: any) => T): Promise<T[]> {
    const tableName = (new this()).tableName;
    const { data, error } = await supabase.from(tableName).select('*');
    if (error) throw error;
    return (data ?? []).map(item => new this(item));
  }
}