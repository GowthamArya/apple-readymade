import { BaseEntity } from "./BaseEntity";

export interface Invoice extends BaseEntity {
    invoice_no: string;
    status_id: number;
}
