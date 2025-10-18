import { BaseEntity } from "./BaseEntity";

export class Shipment extends BaseEntity {
    static propertyKeys = ["id", "shipment_type", "shipment_provider"];
    address_id!: number;
    status_id!: number;
}