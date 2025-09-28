import { BaseEntity } from "./BaseEntity";

export interface ImageCollection extends BaseEntity {
  name: string;
  image_urls: string[]; // Array of URLs
  status_id?: number;
}