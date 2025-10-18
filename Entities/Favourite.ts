import { BaseEntity } from "./BaseEntity";

export class Favourite extends BaseEntity {
  static propertyKeys = [
    "id",
    "order_id",
    "invoice_date",
    "total_amount",
    "payment_status",
  ];
  variant_id!: number;
  customer_id!: number;
  status_id?: number;
}