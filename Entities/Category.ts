import {BaseEntity} from "./BaseEntity";

export class Category extends BaseEntity {
    name!: string;
    description?: string;
    img_url?: string;
    status_id?: number;
}