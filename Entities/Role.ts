import { BaseEntity } from "./BaseEntity";

export class Role extends BaseEntity<Role,number> {
  name!: string;
  description!: string;
}