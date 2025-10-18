import { BaseEntity } from "./BaseEntity";

export class PromoCode extends BaseEntity {
    name!: string;
    code!: string;
    discount!: number;
    status_id!: number;
}