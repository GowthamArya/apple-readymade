"use client";
import { App, Button, Form, Input, Card, Avatar, Typography, theme, InputNumber, Statistic, Table, Tag, Divider } from 'antd';
import { signOut } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { UserOutlined, HomeOutlined, LogoutOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function Account({ user, sessionUser }: { user: any, sessionUser: any }) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const { token } = theme.useToken();

  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingPoints, setLoadingPoints] = useState(false);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user.name || "",
        phone: user.phone || "",
        age: user.age || null,
      });
    }

    setLoadingPoints(true);
    fetch('/api/user/points?history=true')
      .then(res => res.json())
      .then(data => {
        setPoints(data.points || 0);
        setHistory(data.history || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingPoints(false));
  }, [user, form]);

  const handleLogOut = async () => {
    signOut();
  };

  const handleUpdate = async (values: any) => {
    try {
      const res = await fetch("/api/account", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (res.ok) {
        message.success({
          content: "Profile updated successfully",
          duration: 2,
          style: { marginTop: 80 },
        });
      } else {
        message.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong");
    }
  };

  const historyColumns = [
    {
      title: 'Date',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Activity',
      dataIndex: 'transaction_type',
      key: 'transaction_type',
      render: (type: string) => {
        let color = 'default';
        if (type === 'earn') color = 'green';
        if (type === 'redeem') color = 'blue';
        if (type === 'refund') color = 'orange';
        return <Tag color={color}>{type.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Apples',
      dataIndex: 'points',
      key: 'points',
      render: (val: number) => (
        <Text strong type={val > 0 ? 'success' : val < 0 ? 'danger' : 'secondary'}>
          {val > 0 ? `+${val}` : val}
        </Text>
      )
    },
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
      render: (id: string) => id ? <Link href={`/orders/${id}`}>#{id}</Link> : '-'
    }
  ];

  return (
    <Card style={{ width: "100%", maxWidth: 800, boxShadow: token.boxShadowSecondary }}>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column: Profile */}
        <div className="flex-1">
          <div className="flex flex-col items-center mb-6">
            <Avatar
              size={80}
              src={sessionUser?.image}
              icon={<UserOutlined />}
              className="mb-4"
              style={{ backgroundColor: token.colorPrimary }}
            />
            <Title level={4} style={{ margin: 0 }}>
              {sessionUser?.name}
            </Title>
            <Text type="secondary">{sessionUser?.email}</Text>
          </div>

          <Form form={form} onFinish={handleUpdate} layout="vertical">
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input size="large" prefix={<UserOutlined className="text-gray-400" />} />
            </Form.Item>

            <Form.Item
              label="Phone"
              name="phone"
              rules={[
                { required: true, message: "Please enter your phone number" },
                {
                  pattern: /^[6-9]\d{9}$/,
                  message: "Enter a valid 10-digit Indian mobile number",
                },
              ]}
            >
              <Input size="large" maxLength={10} />
            </Form.Item>

            <Form.Item
              label="Age"
              name="age"
              rules={[
                { required: true, message: "Please enter your age" },
                { type: "number", min: 1, max: 120, message: "Invalid age" },
              ]}
            >
              <InputNumber size="large" style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" block>
                Update Profile
              </Button>
            </Form.Item>

            <div className="flex gap-3">
              <Link href="/" className="flex-1">
                <Button block icon={<HomeOutlined />}>
                  Home
                </Button>
              </Link>
              <Button danger block icon={<LogoutOutlined />} onClick={handleLogOut} className="flex-1">
                Logout
              </Button>
            </div>
          </Form>
        </div>

        {/* Right Column: Apples (Loyalty Points) */}
        <div className="flex-1 md:border-l md:pl-8 border-gray-100 flex flex-col">
          <Typography.Title level={4}>My Apples</Typography.Title>
          <div className="p-6 rounded-xl flex flex-col items-center mb-6 border border-green-100" style={{ backgroundColor: token.colorFillContent }}>
            <Text type="secondary" className="mb-1" style={{ color: token.colorTextSecondary }}>Current Balance</Text>
            <div className="text-4xl font-bold flex items-center gap-2">
              🍏{points}
            </div>
            <Text className="mt-2 text-sm">₹{points} available to use at checkout</Text>
          </div>

          <Typography.Text strong className="mb-2 block">History</Typography.Text>
          <Table
            dataSource={history}
            columns={historyColumns}
            rowKey="id"
            size="small"
            pagination={{ pageSize: 5, size: 'small' }}
            loading={loadingPoints}
            scroll={{ x: true }}
          />

        </div>
      </div>
    </Card>
  );
}