import { BaseEntity } from "./BaseEntity";

export class Customer extends BaseEntity<Customer,number> {
  name!: string;
  email!: string;
  phone?: string;
  address?: string;
}