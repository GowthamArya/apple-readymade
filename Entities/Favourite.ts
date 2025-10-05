import { BaseEntity } from "./BaseEntity";

export class Favourite extends BaseEntity<Favourite,number> {
  variant_id!: number;
  customer_id!: number;
  status_id?: number;
}