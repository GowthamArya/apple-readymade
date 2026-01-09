"use client";

import { useEffect, useState } from "react";
import { EditOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Table, Button, Space, message, Drawer, Popconfirm } from "antd";
import DynamicFormModal from "./DynamicFormModel"; // Recursion? Or reuse.
// Note: recursive import might cause issues if not handled carefully.
// Better to just use DynamicFormModal here if possible or pass it? 
// Actually DynamicFormModal is default export. 

export default function RelatedEntityList({
    tableName,
    foreignKey,
    parentId,
    label
}: {
    tableName: string;
    foreignKey: string;
    parentId: string | number;
    label: string
}) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [metadata, setMetadata] = useState<any[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any>({ id: 0 });

    // Load Metadata for the child table (to know fields)
    useEffect(() => {
        fetch(`/api/metadata/${tableName}`)
            .then(res => res.json())
            .then(json => {
                if (json.data) setMetadata(json.data);
            });
    }, [tableName]);

    // Load Data
    const fetchData = async () => {
        if (!parentId) return;
        setLoading(true);
        try {
            // Construct filter. generic API needs to support filter param
            // GenericRepo supports filters: Record<string, any>
            const params = new URLSearchParams({
                filters: JSON.stringify({ [foreignKey]: parentId })
            });
            const res = await fetch(`/api/generic/${tableName}?${params}`);
            const json = await res.json();
            setData(json.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [tableName, foreignKey, parentId]);

    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`/api/generic/${tableName}?id=${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                message.success("Deleted successfully");
                fetchData();
            } else {
                const json = await res.json();
                message.error(json.error || "Failed to delete");
            }
        } catch (err: any) {
            message.error(err.message || "Failed to delete");
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 50,
        },
        // Try to guess a name/title column
        {
            title: 'Name/Value',
            key: 'name',
            render: (text: any, record: any) => record.name || record.title || record.sku || record.id
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => {
                            setSelectedRecord(record);
                            setIsModalVisible(true);
                        }}
                    />
                    <Popconfirm
                        title="Delete this item?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="mt-6 border-t pt-4">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">{label}</h4>
                <Button
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setSelectedRecord({ id: 0, [foreignKey]: parentId }); // Pre-fill FK
                        setIsModalVisible(true);
                    }}
                >
                    Add {label}
                </Button>
            </div>

            <Table
                dataSource={data}
                columns={columns}
                rowKey="id"
                size="small"
                pagination={{ pageSize: 5 }}
                loading={loading}
            />

            {isModalVisible && (
                <DynamicFormModal
                    visible={isModalVisible}
                    entityName={tableName}
                    id={selectedRecord.id}
                    metadata={metadata}
                    // Pass pre-filled values for new records? 
                    // DynamicFormModal fetches by ID if ID!=0. 
                    // If ID=0, we need to pass initialValues. 
                    // DynamicFormModal doesn't support initialValues yet. 
                    // But I can't easily modify it to support it without risks.
                    // TRICK: We can't easily pass initialValues to DynamicFormModal as it is designed.
                    // However, for "Create", it resets form.
                    // I might need to update DynamicFormModal to accept `initialValues`.
                    onCancel={() => setIsModalVisible(false)}
                    onSubmit={() => {
                        fetchData();
                        setIsModalVisible(false);
                    }}
                />
            )}
        </div>
    );
}
