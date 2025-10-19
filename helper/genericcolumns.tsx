import { EntityMapping } from "@/utils/supabase/entitymapping";
import { Carousel, Image } from 'antd';


type EntityName = keyof typeof EntityMapping;

function isEntityName(key: string): key is EntityName {
  return key in EntityMapping;
}

export default function generateColumns(entityname: string) {
  if (!isEntityName(entityname)) {
    throw new Error("Invalid entity name");
  }
  const EntityClass = EntityMapping[entityname];
  const keys = EntityClass.propertyKeys;
  return keys
    .filter((key) => !["status_id", "created_by", "updated_by"].includes(key))
    .map((key) => ({
      title: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " "),
      dataIndex: key,
      key: key,
      sorter: (a: any, b: any) => {
        if (typeof a[key] === "number" && typeof b[key] === "number") {
          return a[key] - b[key];
        }
        return String(a[key]).localeCompare(String(b[key]));
      },
      filters: [],
      filterSearch: true,
      filterMode: 'tree',
      render: (value: any) => {
        if (key === "image_urls" && Array.isArray(value) && value.length > 0) {
          return (
            <Carousel
              dots={false}
              autoplay
              slidesToShow={1}
              slidesToScroll={1}
              style={{ width: 60, height: 50, overflow: "hidden" }}
            >
              {value.map((src: string, idx: number) => (
                <Image
                  key={idx}
                  src={src}
                  alt={key}
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
}
