import { BaseEntity } from "./BaseEntity";

export interface Payment extends BaseEntity {
    method: string;
    amount: number;
    status_id: number;
}