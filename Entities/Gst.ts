import { BaseEntity } from "./BaseEntity";

export class Gst extends BaseEntity {
    static propertyKeys = ["id", "name", "percentage"];
    name!: string;
    percentage!: number;
}