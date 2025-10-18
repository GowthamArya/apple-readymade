import { BaseEntity } from "./BaseEntity";

export class PromoCode extends BaseEntity {
    static propertyKeys = ["id", "code", "discount"];

    name!: string;
    code!: string;
    discount!: number;
    status_id!: number;
}