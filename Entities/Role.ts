import { BaseEntity } from "./BaseEntity";

export class Role extends BaseEntity {
  static propertyKeys = ["id", "name"];

  name!: string;
  description!: string;
}