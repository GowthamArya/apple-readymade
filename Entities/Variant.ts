import { BaseEntity } from "./BaseEntity";
import { Product } from "./Product";

export interface Variant extends BaseEntity {
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
}

export interface VariantCartItem extends Variant{
    quantity: number;
}