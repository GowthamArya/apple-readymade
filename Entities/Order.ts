import { BaseEntity } from "./BaseEntity";

export interface Order extends BaseEntity {
    customer_id: number;
    payment_id: number;
    shipment_id: number;
    invoice_id: number;
    status_id: number;
}