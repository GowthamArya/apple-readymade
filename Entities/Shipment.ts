import { BaseEntity } from "./BaseEntity";

export class Shipment extends BaseEntity {
    address_id!: number;
    status_id!: number;
}