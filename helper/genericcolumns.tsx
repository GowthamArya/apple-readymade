import { Carousel, Image, TableColumnsType } from 'antd';

export function generateMetadataColumns(entityMetadata: any) {
  entityMetadata = entityMetadata?.data ? entityMetadata.data : [];
  entityMetadata = [{value:"id",sortable:true},...entityMetadata]
  entityMetadata.sort((a:any,b:any) => a.displayOrder-b.displayOrder);

  let filters: { text: string, value: any }[] = [];
  return entityMetadata
    .map((columnMetaData:any) => ({
      hidden:["status_id", "created_by", "updated_by"].includes(columnMetaData.value),
      title: columnMetaData.value.charAt(0).toUpperCase() + columnMetaData.value.slice(1).replace(/_/g, " "),
      dataIndex: columnMetaData.value,
      key: columnMetaData.id,
      value: columnMetaData.value,
      filters: filters.length > 0 ? filters : undefined,
      filterSearch: filters.length > 8,
      sorter: columnMetaData.sortable ? (a: any, b: any) => {
        if (typeof a[columnMetaData.value] === "number" && typeof b[columnMetaData.value] === "number") {
          return a[columnMetaData.value] - b[columnMetaData.value];
        }
        return String(a[columnMetaData.value]).localeCompare(String(b[columnMetaData.value]));
      } : undefined,
      render: (value: any) => {
        console.log(columnMetaData.value);
        if (columnMetaData.value === "image_urls" && Array.isArray(value) && value.length > 0) {
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
}