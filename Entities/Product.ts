import { BaseEntity } from "./BaseEntity";

export interface Product extends BaseEntity {
  name: string;
  description?: string;
  category_id?: number;
  status_id?: number;
}

export interface ProductCartItem extends Product {
  quantity: number;
}