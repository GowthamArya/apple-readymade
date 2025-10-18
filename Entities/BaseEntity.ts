export class BaseEntity {
  static propertyKeys = [
    "id",
  ];
  id!: number;
  created_on?: string;
  updated_on?: string;
  created_by?: number;
  updated_by?: number;

  constructor(init?: Partial<BaseEntity>) {
    Object.assign(this, init);
  }
}
