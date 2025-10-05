import { BaseEntity } from "./BaseEntity";

export class Cart extends BaseEntity<Cart,number>  {
    variant_id?: number;
    customer_id?: number;
    status_id?: number;
}