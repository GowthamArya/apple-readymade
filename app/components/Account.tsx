"use client";
import { App, Button, Form, Input } from 'antd';
import Link from 'next/link';
import React, { useEffect } from 'react';

export default function Account({ user }: { user: any }) {
    const { message } = App.useApp(); 
    const [form] = Form.useForm();
    useEffect(() => {
        if (user) {
        form.setFieldsValue({
            name: user.name || '',
            phone: user.phone || '',
        });
        }
    }, [user, form]);

    const handleUpdate = async (values: any) => {
        try {
        const res = await fetch('/api/account', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });

        const data = await res.json();
        if (res.ok) {
            message.success({
                content: 'Profile updated successfully',
                duration: 2,
                style: { marginTop: 80 },
            });
        } else {
            message.error(data.message || 'Failed to update profile');
        }
        } catch (error) {
            console.error(error);
            message.error('Something went wrong');
        }
    };

    return (
        <Form
            form={form}
            onFinish={handleUpdate}
            layout="vertical"
            className="my-4 flex flex-col items-center !p-4 bg-white rounded-lg shadow-xl w-full max-w-md mx-auto"
        >
        <Form.Item
            label="Name"
            name="name"
            rules={[{ message: 'Please enter your name' }]}
            className="w-full"
            initialValue={user?.name || ''}
        >
            <Input placeholder="Name" />
        </Form.Item>

        <Form.Item
            label="Phone"
            name="phone"
            rules={[{ message: 'Please enter your phone number' }]}
            className="w-full"
            initialValue={user?.phone || ''}
        >
            <Input placeholder="Phone" />
        </Form.Item>

        <Button type="primary" htmlType="submit" className="w-full">
            Update Profile
        </Button>

        <div className="mt-4 space-x-2">
            <Link href="/"><Button>Go to Home</Button></Link>
            <Link href="/auth"><Button danger className="ml-2">Logout</Button></Link>
        </div>
        </Form>
    );
}
