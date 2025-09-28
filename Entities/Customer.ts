import { BaseEntity } from "./BaseEntity";

export interface Customer extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  address?: string;
}