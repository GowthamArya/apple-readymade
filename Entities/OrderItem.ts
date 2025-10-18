import { BaseEntity } from "./BaseEntity";

export class OrderItem extends BaseEntity {
    order_id!: number;
    variant_id!: number;
    quantity!: number;
    status_id?: number;
}