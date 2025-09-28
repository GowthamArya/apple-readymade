import { BaseEntity } from "./BaseEntity";

export interface Shipment extends BaseEntity {
    address_id: number;
    status_id: number;
}