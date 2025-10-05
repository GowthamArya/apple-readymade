import { BaseEntity } from "./BaseEntity";

export class Order extends BaseEntity<Order,number> {
    customer_id!: number;
    payment_id?: number;
    shipment_id?: number;
    invoice_id?: number;
    status_id?: number;
}