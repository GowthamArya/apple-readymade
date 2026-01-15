import React, { useEffect, useMemo, useState } from "react";
import { Modal, Form, Input, InputNumber, Button, Checkbox, Upload, UploadFile, message, App, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import DynamicDropdown from "./DynamicDropdown";
import RelatedEntityList from "./RelatedEntityList";

interface MetaField {
  name?: string;
  value: string;
  type: "number" | "entity" | "boolean" | "string" | "images" | "color" | "size";
  required?: boolean;
  display_order?: number;
  entityname?: string;
  id?: number;
  created_on?: string;
  entity_id?: number;
  filterable?: boolean;
  sortable?: boolean;
  column_width?: string;
}

interface DynamicFormModalProps {
  visible: boolean;
  metadata: MetaField[];
  onCancel: () => void;
  onSubmit: (result?: any) => void;
  id?: number | string | null;
  entityName: string;
  references?: any[];
}

const normalizeUpload = (e: any): UploadFile[] => {
  if (Array.isArray(e)) return e;
  return e?.fileList ?? [];
};

export default function DynamicFormModal({ visible, metadata, onCancel, onSubmit, id, entityName, references = [] }: DynamicFormModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isEditing = useMemo(() => id !== undefined && id !== null && id != 0, [id]);
  const safeReferences = useMemo(() => {
    if (Array.isArray(references)) return references;
    if (typeof references === "string") {
      try {
        const parsed = JSON.parse(references);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  }, [references]);
  const { message } = App.useApp();

  const [colorOptions, setColorOptions] = useState<{ label: React.ReactNode; value: string }[]>([]);

  useEffect(() => {
    fetch("https://www.csscolorsapi.com/api/colors")
      .then((res) => res.json())
      .then((data) => {
        if (data.colors && Array.isArray(data.colors)) {
          const opts = data.colors.map((c: any) => ({
            label: (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 16, height: 16, backgroundColor: `#${c.hex}`, border: "1px solid #ccc" }} />
                {c.name}
              </div>
            ),
            value: c.name,
          }));
          setColorOptions(opts);
        }
      })
      .catch((err) => console.error("Failed to fetch colors:", err));
  }, []);

  // Fetch existing entity when opening in edit mode
  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    const run = async () => {
      if (!visible) return; // only fetch when modal opens
      form.resetFields();

      if (!isEditing) {
        // create mode
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(`/api/generic/${entityName}?id=${id}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const payload = await res.json();
        const record = payload?.data?.[0] ?? {};
        if (ignore) return;

        // If images exist, shape them to UploadFile[] for the form field
        const imageUrls: string[] = record?.image_urls ?? [];
        const files: UploadFile[] = imageUrls.map((url: string, idx: number) => ({
          uid: `init-${idx}`,
          name: url.split("/").pop() || `image-${idx}`,
          status: "done",
          url,
        }));

        form.setFieldsValue({ ...record, images: files });
      } catch (err: any) {
        if (!ignore) message.error(err?.message || "Failed to load data");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    run();

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [visible, isEditing, id, entityName, form]);

  // Build dynamic form items
  const formItems = metadata.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)).map((field) => {
    const label = field.name || field.value.charAt(0).toUpperCase() + field.value.slice(1).replace(/_/g, " ");
    const name = field.value;

    if (field.type === "number") {
      return (
        <Form.Item key={name} label={label} name={name} rules={[{ required: !!field.required }]}>
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
      );
    }

    if (field.type === "entity") {
      // Convert *_id to the entity endpoint name
      const entity = field.value.replace(/_id$/, "").replace(/_/g, " ").replace(/^./, (c) => c.toLowerCase());
      return <DynamicDropdown key={name} name={name} label={label} apiUrl={`/api/generic/${entity}`} />;
    }

    if (field.type === "boolean") {
      return (
        <Form.Item key={name} label={label} name={name} valuePropName="checked" rules={[{ required: !!field.required }]}>
          <Checkbox />
        </Form.Item>
      );
    }

    if (field.type === "color") {
      return (
        <Form.Item key={name} label={label} name={name} rules={[{ required: !!field.required }]}>
          <Select showSearch options={colorOptions} placeholder="Select a color" />
        </Form.Item>
      );
    }

    if(field.value === "type"){
      const typeOptions = [
        { label: "Number", value: "number" },
        { label: "Entity", value: "entity" },
        { label: "Boolean", value: "boolean" },
        { label: "String", value: "string" },
        { label: "Images", value: "images" },
        { label: "Color", value: "color" },
        { label: "Size", value: "size" },
      ];
      return (
        <Form.Item key={name} label={label} name={name} rules={[{ required: !!field.required }]}>
          <Select showSearch options={typeOptions} placeholder="Select a Data Type" />
        </Form.Item>
      );
    }

    if (field.type === "size") {
      const sizeOptions = [
        { label: "XS", value: "XS" },
        { label: "S", value: "S" },
        { label: "M", value: "M" },
        { label: "L", value: "L" },
        { label: "XL", value: "XL" },
        { label: "XXL", value: "XXL" },
        { label: "28", value: "28" },
        { label: "30", value: "30" },
        { label: "32", value: "32" },
        { label: "34", value: "34" },
        { label: "36", value: "36" },
        { label: "38", value: "38" },
        { label: "40", value: "40" },
        { label: "42", value: "42" },
      ];
      return (
        <Form.Item key={name} label={label} name={name} rules={[{ required: !!field.required }]}>
          <Select showSearch options={sizeOptions} placeholder="Select a size" />
        </Form.Item>
      );
    }

    if (field.type === "string" && name === "description") {
      return (
        <Form.Item key={name} label={label} name={name} rules={[{ required: !!field.required }]}>
          <Input.TextArea rows={4} />
        </Form.Item>
      );
    }

    if (field.type === "images") {
      return (
        <Form.Item className="p-5!" key={name} label={label} name="images" valuePropName="fileList" getValueFromEvent={normalizeUpload} rules={[{ required: !!field.required }]}>
          <Upload.Dragger
            name="file"
            action="/api/upload"
            method="POST"
            listType="picture-card"
            multiple
            accept="image/*"
            beforeUpload={(file) => {
              const isImage = file.type.startsWith("image/");
              if (!isImage) {
                message.error("Only image files are allowed!");
              }
              return isImage || Upload.LIST_IGNORE;
            }}
          >
            <p>
              <PlusOutlined />
            </p>
            <div style={{ marginTop: 8 }}>Upload</div>
          </Upload.Dragger>
        </Form.Item>
      );
    }

    return (
      <Form.Item key={name} label={label} name={name} rules={[{ required: !!field.required }]}>
        <Input />
      </Form.Item>
    );
  });

  const handleFinish = async (values: any) => {
    // Convert UploadFile[] back to string[] for API if needed
    const files: UploadFile[] = values.images || [];
    const image_urls = files
      .map((f) => (f.url || (f.response && (f.response.url || f.response.location))))
      .filter(Boolean);

    const payload = { ...values, image_urls };
    delete (payload as any).images;
    if (image_urls.length === 0) {
      delete (payload as any).image_urls;
    }

    setLoading(true);
    try {
      const url = `/api/generic/${entityName}${isEditing ? `?id=${id}` : ""}`;
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json().catch(() => undefined);

      if (!res.ok) {
        const msg = result?.message || `Save failed (${res.status})`;
        throw new Error(msg);
      }

      message.success("Saved successfully");
      onSubmit?.(result);
    } catch (err: any) {
      message.error(err?.message || "Something went wrong");
      onSubmit?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEditing ? "Edit Record" : "Add Record"}
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={null}
      afterClose={() => form.resetFields()}
      destroyOnHidden={true}
      className="p-5!"
    >
      <Form
        form={form}
        onFinish={handleFinish}
        autoComplete="off"
      >
        {formItems}
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Save
          </Button>
        </Form.Item>
      </Form>

      {isEditing && safeReferences.map((ref, idx) => (
        <RelatedEntityList
          key={idx}
          tableName={ref.table}
          foreignKey={ref.fk}
          parentId={id!}
          label={ref.label || ref.table}
        />
      ))}
    </Modal>
  );
}
