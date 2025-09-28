import { BaseEntity } from "./BaseEntity";

export interface Address extends BaseEntity {
  customer_id: number;
  line1: string;
  line2?: string;
  street?: string;
  city?: string;
  pincode?: string;
  status_id?: number;
}