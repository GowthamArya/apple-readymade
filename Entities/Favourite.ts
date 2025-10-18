import { BaseEntity } from "./BaseEntity";

export class Favourite extends BaseEntity {
  variant_id!: number;
  customer_id!: number;
  status_id?: number;
}