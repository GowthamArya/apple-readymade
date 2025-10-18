import { BaseEntity } from "./BaseEntity";

export class Invoice extends BaseEntity {
    invoice_no!: string;
    status_id?: number;
}
