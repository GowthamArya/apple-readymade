import { BaseEntity } from "./BaseEntity";

export class Role extends BaseEntity {
  name!: string;
  description!: string;
}