import { BaseEntity } from "./BaseEntity";

export interface Favourite extends BaseEntity {
  variant_id: number;
  customer_id: number;
  status_id: number;
}