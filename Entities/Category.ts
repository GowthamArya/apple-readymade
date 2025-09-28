import {BaseEntity} from "./BaseEntity";

export interface Category extends BaseEntity {
    name: string;
    description?: string;
    img_url?: string;
    status_id?: number;
}