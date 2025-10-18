import { BaseEntity } from "./BaseEntity";

export class Product extends BaseEntity {
  name!: string;
  description?: string;
  category_id!: number;
  status_id?: number;
}

export interface ProductCartItem {
  id: number;
  quantity: number;
  name: string;
  description?: string;
  category_id?: number;
  status_id?: number;
  createdOn?: Date;
  updatedOn?: Date;
  createdBy?: number;
  updatedBy?: number;
}