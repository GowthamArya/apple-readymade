import { BaseEntity } from "./BaseEntity";

export class Address extends BaseEntity {
  static propertyKeys = [
    "id",
    "order_id",
    "invoice_date",
    "total_amount",
    "payment_status",
  ];
  customer_id!: number;
  line1?: string;
  line2?: string;
  street?: string;
  city?: string;
  pincode?: string;
  status_id?: number;
}