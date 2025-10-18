import { BaseEntity } from "./BaseEntity";

export class Customer extends BaseEntity {
  static propertyKeys = [
    "id",
    "order_id",
    "invoice_date",
    "total_amount",
    "payment_status",
  ];
  name!: string;
  email!: string;
  phone?: string;
  address?: string;
}