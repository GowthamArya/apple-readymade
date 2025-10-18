import { BaseEntity } from "./BaseEntity";

export class Order extends BaseEntity {
    static propertyKeys = [
        "id",
        "customer_id",
        "order_date",
        "status_id",
        "total_amount",
    ];
    customer_id!: number;
    payment_id?: number;
    shipment_id?: number;
    invoice_id?: number;
    status_id?: number;
}