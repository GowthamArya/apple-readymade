import { BaseEntity } from "./BaseEntity";

export class Payment extends BaseEntity {
    static propertyKeys = ["id", "order_id", "amount", "payment_method"];

    method!: string;
    amount!: number;
    status_id!: number;
}