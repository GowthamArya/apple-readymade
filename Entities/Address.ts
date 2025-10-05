import { BaseEntity } from "./BaseEntity";

export class Address extends BaseEntity<Address,number> {
  customer_id!: number;
  line1?: string;
  line2?: string;
  street?: string;
  city?: string;
  pincode?: string;
  status_id?: number;
}