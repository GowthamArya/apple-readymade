import { BaseEntity } from "./BaseEntity";

export class Invoice extends BaseEntity<Invoice,number> {
    invoice_no!: string;
    status_id?: number;
}
