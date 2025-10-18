import { BaseEntity } from "./BaseEntity";

export class OrderItem extends BaseEntity {
    static propertyKeys = [
        "id",
        "order_id",
        "product_id",
        "quantity",
        "price",
        "status_id",
    ];
    order_id!: number;
    variant_id!: number;
    quantity!: number;
    status_id?: number;
}