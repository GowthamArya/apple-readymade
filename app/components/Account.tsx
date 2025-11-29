"use client";
import { App, Button, Form, Input, Card, Avatar, Typography, theme } from 'antd';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { UserOutlined, HomeOutlined, LogoutOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function Account({ user, sessionUser }: { user: any, sessionUser: any }) {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const { token } = theme.useToken();

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                name: user.name || '',
                phone: user.phone || '',
            });
        }
    }, [user, form]);

    const handleLogOut = async () => {
        signOut();
    }

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
        <Card
            style={{ width: '100%', maxWidth: 500, boxShadow: token.boxShadowSecondary }}
        >
            <div className="flex flex-col items-center mb-8">
                <Avatar
                    size={80}
                    src={sessionUser?.image}
                    icon={<UserOutlined />}
                    className="mb-4"
                    style={{ backgroundColor: token.colorPrimary }}
                />
                <Title level={4} style={{ margin: 0 }}>Welcome, {sessionUser?.name}!</Title>
                <Text type="secondary">{sessionUser?.email}</Text>
            </div>

            <Form
                form={form}
                onFinish={handleUpdate}
                layout="vertical"
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ message: 'Please enter your name' }]}
                    initialValue={user?.name || ''}
                >
                    <Input size="large" placeholder="Name" prefix={<UserOutlined className="text-gray-400" />} />
                </Form.Item>

                <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[{ message: 'Please enter your phone number' }]}
                    initialValue={user?.phone || ''}
                >
                    <Input size="large" placeholder="Phone" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" size="large" block>
                        Update Profile
                    </Button>
                </Form.Item>

                <div className="flex gap-3 mt-6">
                    <Link href="/" className="flex-1">
                        <Button block icon={<HomeOutlined />}>Home</Button>
                    </Link>
                    <Button danger block icon={<LogoutOutlined />} onClick={handleLogOut} className="flex-1">
                        Logout
                    </Button>
                </div>
            </Form>
        </Card>
    );
}
