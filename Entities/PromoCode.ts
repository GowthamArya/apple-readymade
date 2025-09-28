import { BaseEntity } from "./BaseEntity";

export interface PromoCode extends BaseEntity {
    name: string;
    code: string;
    discount: number;
    status_id: number;
}