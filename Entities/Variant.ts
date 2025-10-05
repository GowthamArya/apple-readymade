import { BaseEntity } from "./BaseEntity";
import { Product } from "./Product";

export class Variant extends BaseEntity<Variant, number> {
    protected tableName = 'variant';

    product_id: number | undefined = undefined;
    sku: string | null = null;
    size: string | null = null;
    color: string | null = null;
    price: number | undefined = undefined;
    mrp: number | undefined = undefined;
    is_default: boolean = false; // Default false rather than definite assignment
    stock: number | undefined = undefined;
    gst: number | undefined = undefined;
    status_id: number | undefined = undefined;
    image_urls: string[] | undefined = undefined;

    constructor(data?: { [key: string]: any }) {
        super();
        if (data) {
            for (const key in data) {
            (this as any)[key] = data[key];
            }
        }
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