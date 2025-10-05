import { BaseEntity } from "./BaseEntity";

export class PromoCode extends BaseEntity<PromoCode,number> {
    name!: string;
    code!: string;
    discount!: number;
    status_id!: number;
}