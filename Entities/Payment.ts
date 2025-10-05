import { BaseEntity } from "./BaseEntity";

export class Payment extends BaseEntity<Payment,number> {
    method!: string;
    amount!: number;
    status_id!: number;
}