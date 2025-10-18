import {BaseEntity} from "./BaseEntity";

export class Category extends BaseEntity {
    static propertyKeys = [
        "id",
        "order_id",
        "invoice_date",
        "total_amount",
        "payment_status",
    ];
    name!: string;
    description?: string;
    img_url?: string;
    status_id?: number;
}