// app/variants/VariantCrud.tsx (Client Component)
"use client";
import GenericCrud, { Column } from './crud';
import { Variant } from '@/Entities/Variant';

const variantColumns: Column<Variant>[] = [
  { key: 'product_id', label: 'Product ID', editable: true, inputType: 'number' },
  { key: 'sku', label: 'SKU', editable: true, inputType: 'text' },
  { key: 'size', label: 'Size', editable: true, inputType: 'text' },
  { key: 'color', label: 'Color', editable: true, inputType: 'text' },
  { key: 'price', label: 'Price', editable: true, inputType: 'number' },
  { key: 'mrp', label: 'MRP', editable: true, inputType: 'number' },
  { key: 'is_default', label: 'Default?', editable: true, inputType: 'checkbox' },
  { key: 'stock', label: 'Stock', editable: true, inputType: 'number' },
  { key: 'gst', label: 'GST ID', editable: true, inputType: 'number' },
  { key: 'status_id', label: 'Status ID', editable: true, inputType: 'number' },
  { key: 'created_on', label: 'created_on', editable: true, inputType: 'datetime' },
];

const variantCRUDPage = () => (
  <GenericCrud<Variant>
    modelClass={Variant}
    columns={variantColumns}
    relations={[]}
  />
);

export default variantCRUDPage;