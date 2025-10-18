import { BaseEntity } from "./BaseEntity";

export class Cart extends BaseEntity  {
    variant_id?: number;
    customer_id?: number;
    status_id?: number;
}