import { Button, Space, Popconfirm, Carousel, Image } from 'antd';
import { DeleteOutlined, EyeOutlined, EditTwoTone } from '@ant-design/icons';

export function generateMetadataColumns(entityMetadata: any, onEdit: (record: any) => void, onDelete: (record: any) => void, onView?: (record: any) => void) {
  entityMetadata = [{ value: "id", sortable: true, displayOrder: 0, width: 70 }, ...entityMetadata];
  entityMetadata.sort((a: any, b: any) => a.displayOrder - b.displayOrder);

  const columns = entityMetadata
    .filter((columnMetaData: any) => !["status_id", "created_by", "updated_by"].includes(columnMetaData.value))
    .map((columnMetaData: any) => ({
      hidden: ["status_id", "created_by", "updated_by"].includes(columnMetaData.value),
      title: columnMetaData.value.charAt(0).toUpperCase() + columnMetaData.value.slice(1).replace(/_/g, " "),
      dataIndex: columnMetaData.value,
      key: columnMetaData.id,
      width: columnMetaData.width,
      value: columnMetaData.value,
      sorter: columnMetaData.sortable
        ? (a: any, b: any) => {
          if (typeof a[columnMetaData.value] === "number" && typeof b[columnMetaData.value] === "number") {
            return a[columnMetaData.value] - b[columnMetaData.value];
          }
          return String(a[columnMetaData.value]).localeCompare(String(b[columnMetaData.value]));
        }
        : undefined,
      render: (value: any) => {
        if (columnMetaData.value === "image_urls" && Array.isArray(value) && value.length > 0) {
          return (
            <Carousel dots={false} autoplay slidesToShow={1} slidesToScroll={1} style={{ width: 60, height: 50, overflow: "hidden" }}>
              {value.map((src: string, idx: number) => (
                <Image
                  key={idx}
                  src={src}
                  alt={columnMetaData.value}
                  preview={false}
                  style={{ maxWidth: 60, maxHeight: 60, objectFit: "contain" }}
                  loading="lazy"
                />
              ))}
            </Carousel>
          );
        }
        if (typeof value === "boolean") return value ? "Yes" : "No";
        return value?.toString() ?? "";
      },
    }));

  columns.push({
    title: "Actions",
    key: "actions",
    fixed: "right",
    render: (_: any, record: any) => (
      <Space>
        {onView && (
          <Button icon={<EyeOutlined />} onClick={() => onView(record)} type="link" />
        )}
        <Button icon={<EditTwoTone />} onClick={() => onEdit(record)} type="link" />
        <Popconfirm title="Are you sure to delete?" onConfirm={() => onDelete(record)} okText="Yes" cancelText="No">
          <Button icon={<DeleteOutlined />} type="link" danger />
        </Popconfirm>
      </Space>
    ),
  });

  return columns;
}
