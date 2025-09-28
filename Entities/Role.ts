import { BaseEntity } from "./BaseEntity";

export interface Role extends BaseEntity {
  name: string;
  description: string;
}