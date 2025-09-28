import { BaseEntity } from "./BaseEntity";
import { Variant } from "./Variant";

export interface Product extends BaseEntity {
  name: string;
  description?: string;
  category_id?: number;
  image_collection_id?: number;
  status_id?: number;
  variants?: Variant[];
}