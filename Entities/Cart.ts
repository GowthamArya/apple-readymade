import { BaseEntity } from "./BaseEntity";

export class Cart extends BaseEntity {
    static propertyKeys = [
        "id",
        "order_id",
        "invoice_date",
        "total_amount",
        "payment_status",
    ];
    variant_id?: number;
    user_id?: string;
    status_id?: number;
}