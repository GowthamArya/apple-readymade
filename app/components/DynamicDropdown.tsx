import React, { useEffect, useState } from "react";
import { Form, Select } from "antd";

export default function DynamicDropdown({ name, label, apiUrl }: { name: string; label: string; apiUrl: string }) {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        // Map data to { label, value } format expected by Select
        const mapped = data.map((item: any) => ({ label: item.name || item.label, value: item.id }));
        setOptions(mapped);
      } catch (error) {
        console.error("Failed to load dropdown options", error);
      }
    }
    fetchOptions();
  }, [apiUrl]);

  return (
    <Form.Item name={name} label={label} rules={[{ required: true }]}>
      <Select options={options} placeholder={`Select ${label}`} allowClear />
    </Form.Item>
  );
}
