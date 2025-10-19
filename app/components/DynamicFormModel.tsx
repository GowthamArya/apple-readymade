import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Button, Checkbox } from 'antd';

export default function DynamicFormModal({ visible, metadata, onCancel, onSubmit, id ,entityName}: any) {
    const [initialData,setInitialData] = useState<any>({});
    const [loading,setloading] = useState(false);
    useEffect(()=>{
      setloading(true);
      setInitialData({});
        (async function getEntityData() {
            const data = await fetch("/api/generic/"+entityName+"?id="+id);
            const response = await data.json();
            setInitialData(response.data[0]);
            setloading(false);
        })();
    },[entityName,id,visible])

    const [form] = Form.useForm();

    useEffect(() => {
      form.setFieldsValue(initialData);
    }, [initialData, form]);
    
    const formItems = metadata.map((field:any) => {
    const label = field.value.charAt(0).toUpperCase() + field.value.slice(1).replace(/_/g, ' ');
    const name = field.value;

    if (field.type === 'number') {
      return (
        <Form.Item key={name} label={label} name={name} rules={[{ required: field.required }]}>
          <InputNumber min={1} />
        </Form.Item>
      );
    }

    if (field.type === 'boolean') {
      return (
        <Form.Item key={name} label={label} name={name} valuePropName="checked" rules={[{ required: field.required }]}>
          <Checkbox />
        </Form.Item>
      );
    }


    if (field.type === 'string' && name === 'description') {
      return (
        <Form.Item key={name} label={label} name={name} rules={[{ required: field.required }]}>
          <Input.TextArea rows={4} />
        </Form.Item>
      );
    }

    return (
      <Form.Item key={name} label={label} name={name} rules={[{ required: field.required }]}>
        <Input />
      </Form.Item>
    );
  });

  const handleFinish = (values: any) => {
    setloading(true);
    (async function updateEntity() {
      const url = `/api/generic/${entityName}?id=${id}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      setloading(false);
      return response.json();
    })();
    onSubmit();
  };

  return (
    <Modal
      title="Edit Record"
      open={visible}
      onCancel={onCancel}
      footer={null}
      loading={loading}
      afterClose={() => form.resetFields()}
    >
      <Form form={form} onFinish={handleFinish} initialValues={initialData}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 60 }}
        autoComplete="off"
        className='!pt-5'
      >
        {formItems}
        <Form.Item>
          <Button type="primary" htmlType="submit" className='text-end' block>
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
