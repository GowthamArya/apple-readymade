import { BaseEntity } from "./BaseEntity";

export class Payment extends BaseEntity {
    method!: string;
    amount!: number;
    status_id!: number;
}