import { BaseEntity } from "./BaseEntity";

export class Invoice extends BaseEntity {
    static propertyKeys = [
        "id",
        "order_id",
        "invoice_date",
        "total_amount",
        "payment_status",
    ];
    invoice_no!: string;
    status_id?: number;
}
