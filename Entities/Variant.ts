import { BaseEntity } from "./BaseEntity";
import { Product } from "./Product";

export class Variant extends BaseEntity {
    product_id!: number;
    sku?: string;
    size?: string;
    color?: string;
    price!: number;
    mrp!: number;
    is_default: boolean = false;
    stock: number = 1;
    gst?: number;
    status_id?: number;
    image_urls?: string[];

    constructor(init?: Partial<Variant>) {
        super(init);
        Object.assign(this, init);
    }
}

export interface VariantCartItem {
    id: number;
    quantity: number;
    product_id: number;
    sku: string;
    size: string;
    color: string;
    price: number;
    mrp: number;
    is_default: boolean;
    stock: number;
    gst_id: number; 
    status_id?: number;
    product?: Product;
    image_urls?: string[];
    createdOn?: Date;
    updatedOn?: Date;
    createdBy?: number;
    updatedBy?: number;
}