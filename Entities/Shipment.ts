import { BaseEntity } from "./BaseEntity";

export class Shipment extends BaseEntity<Shipment,number> {
    address_id!: number;
    status_id!: number;
}