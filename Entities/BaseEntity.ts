export interface BaseEntity {
  id: number; 
  createdOn?: Date;
  updatedOn?: Date;
  createdBy?: number;
  updatedBy?: number;
}