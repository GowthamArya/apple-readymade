import { BaseEntity } from "./BaseEntity";

export interface Status extends BaseEntity {
  name: string;
  description: string;
}