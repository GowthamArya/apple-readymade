import { BaseEntity } from "./BaseEntity";

export class Order extends BaseEntity {
    static propertyKeys = [
        "id",
        "user_id",
        "order_date",
        "status_id",
        "total_amount",
    ];
    user_id!: string;
    payment_id?: number;
    shipment_id?: number;
    invoice_id?: number;
    status_id?: number;
}