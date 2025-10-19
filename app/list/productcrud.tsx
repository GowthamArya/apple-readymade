// "use client";
// import GenericCrud, { Column } from './crud';
// import { Product } from '@/Entities/Product';

// const productColumns: Column<Product>[] = [
//     { key: 'name', label: 'Name', editable: true, inputType: 'text' },
//     { key: 'description', label: 'Description', editable: true, inputType: 'text' },
//     { key: 'category_id', label: 'Category Id', editable: true, inputType: 'text' }
// ];

// const variantCRUDPage = () => (
//     <GenericCrud<Product> modelClass={Product} columns={productColumns} relations={[]} />
// );

// export default variantCRUDPage;