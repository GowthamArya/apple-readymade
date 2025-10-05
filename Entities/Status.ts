import { BaseEntity } from "./BaseEntity";

export class Status extends BaseEntity<Status,number> {
  name!: string;
  description!: string;
}