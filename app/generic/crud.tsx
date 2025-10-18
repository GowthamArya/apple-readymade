// "use client";
// import moment, { isDate } from 'moment';
// import { ICrudEntity } from '@/Entities/BaseEntity';
// import React, { useEffect, useState } from 'react';
// import { Table, Button, Form, Input, InputNumber, Modal, Space, Checkbox, DatePicker } from 'antd';
// import { ColumnsType } from 'antd/lib/table';
// import { useLoading } from '../context/LoadingContext';


// export interface Column<T> {
//   key: keyof T;
//   label: string;
//   editable?: boolean;
//   inputType?: 'text' | 'number' | 'textarea' | "checkbox" | "datetime";
// }

// interface GenericCrudProps<T extends ICrudEntity> {
//   modelClass: { 
//     new (data?: Partial<T>): T;
//     fetchAll: () => Promise<T[]>;
//   };
//   columns: Column<T>[];
//   relations?: {
//     key: keyof T; 
//     modelClass: { new(data: any): any }; 
//     columns: Column<any>[];
//   }[];
// }

// function GenericCrud<T extends ICrudEntity>({
//   modelClass,
//   columns,
//   relations = [],
// }: GenericCrudProps<T>) {
//   const [items, setItems] = useState<T[]>([]);
//   const pageLoading =  useLoading();
//   const [editingItem, setEditingItem] = useState<T | null>(null);
//   const [form] = Form.useForm();

//   const loadItems = async () => {
//     pageLoading.setLoading(true);
//     try {
//       const fetched = await modelClass.fetchAll();
//       setItems(fetched);
//       console.log("Fetched variants:", fetched);
//     } catch (e) {
//       console.error(e);
//     }
//     pageLoading.setLoading(false);
//   };

//   useEffect(() => {
//     loadItems();
//   }, []);

//   useEffect(() => {
//     if (editingItem) {
//       const normalized = { ...editingItem };

//       columns.forEach(col => {
//         if (col.inputType === 'datetime' && editingItem[col.key]) {
//           //normalized[col.key] = moment(col.inputType)
//         }
//       });

//       form.setFieldsValue(normalized);
//     } else {
//       form.resetFields();
//     }
//   }, [editingItem, form, columns]);


//   const columnsAntd: ColumnsType<T> = columns.map(({ key, label, editable, inputType}) => ({
//     title: label,
//     dataIndex: key as string,
//     key: key as string,
//     render: (value)=>{
//       if (inputType === 'checkbox') return value ? 'Yes' : 'No';
//       return value ? String(value) : '';
//     },
//   }));

//   columnsAntd.push({
//     title: 'Actions',
//     key: 'actions',
//     render: (_, record) => (
//       <Space size="middle">
//         <Button type="primary" onClick={() => setEditingItem(record)}>Edit</Button>
//         <Button danger onClick={() => handleDelete(record)}>Delete</Button>
//       </Space>
//     ),
//   });

//   const handleSave = async () => {
//     try {
//       let values = await form.validateFields();

//       columns.forEach(col => {
//         if (col.inputType === 'datetime' && values[col.key]) {
//           values[col.key] = (values[col.key] as moment.Moment).toISOString();
//         }
//       });

//       if (editingItem) {
//         Object.assign(editingItem, values);
//         if (editingItem.id) {
//           await editingItem.update(values);
//         } else {
//           await editingItem.create();
//         }
//         await loadItems();
//         setEditingItem(null);
//       }
//     } catch (errInfo) {
//       console.log('Validate Failed:', errInfo);
//     }
//   };

//   const handleDelete = async (item: T) => {
//     try {
//       if (item.id) {
//         await item.delete();
//         await loadItems();
//       }
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const formItems = columns
//     .filter(c => c.editable)
//     .map(({ key, label, inputType }) => {
//       if (inputType === 'textarea') {
//         return (
//           <Form.Item key={key as string} name={key as string} label={label}>
//             <Input.TextArea />
//           </Form.Item>
//         );
//       } else if (inputType === 'number') {
//         return (
//           <Form.Item key={key as string} name={key as string} label={label}>
//             <InputNumber style={{ width: '100%' }} />
//           </Form.Item>
//         );
//       } else if (inputType === 'checkbox') {
//         return (
//           <Form.Item key={key as string} name={key as string} label={label} valuePropName="checked">
//             <Checkbox />
//           </Form.Item>
//         );
//       } else if (inputType === 'datetime') {
//         return (
//           <Form.Item key={key as string} name={key as string} label={label}>
//             <DatePicker format="YYYY-MM-DD" />
//           </Form.Item>
//         );
//       } else {
//         return (
//           <Form.Item key={key as string} name={key as string} label={label}>
//             <Input />
//           </Form.Item>
//         );
//       }
//     });

//   return (
//     <div className="w-screen min-h-screen justify-center flex flex-col bg-green-50 p-10">
//       <div className='flex justify-between'>
//         <h2 style={{ marginBottom: 16 }}>{modelClass.name}</h2>
//         <Button type="primary" className='!mb-5' onClick={() => setEditingItem(new modelClass({}))}>
//           Add New {modelClass.name}
//         </Button>
//       </div>
//       <Table<T>
//         columns={columnsAntd}
//         dataSource={items}
//         rowKey="id"
//         loading={pageLoading.loading}
//         pagination={{ pageSize: 10 }}
//       />

//       <Modal
//         title={editingItem?.id ? `Edit ${modelClass.name}` : `Create ${modelClass.name}`}
//         open={!!editingItem}
//         onOk={handleSave}
//         onCancel={() => setEditingItem(null)}
//         okText="Save"
//       >
//         <Form form={form}>
//           {formItems}
//         </Form>
//       </Modal>
//     </div>
//   );
// }

// export default GenericCrud;