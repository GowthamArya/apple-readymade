"use client";
import { useLoading } from '@/app/context/LoadingContext';
import { Carousel, Table, Image, Layout, Menu } from 'antd';
import React, { useState, useEffect } from 'react';
import { EntityMapping } from "@/utils/supabase/entitymapping";
import Loading from '@/app/loading';
import Sider from 'antd/es/layout/Sider';
import { Content , Footer as AntFooter} from 'antd/es/layout/layout';
import Link from 'next/link';

const items = Object.entries(EntityMapping).map(([name, EntityClass], index) => ({
  key: name,
  label: <Link href={`/generic/${name}`}>{name.toUpperCase()}</Link>,
}));


export default function Listing(props: PageProps<"/generic/[entity]">) {
  const [entityName, setEntityName] = useState("");
  const [entities, setEntities] = useState<any[]>([]);
  const pageLoading = useLoading();
  
  async function getEntityData(entity: any) {
    const data = await fetch(`/api/generic/${entity}`);
    const response = await data.json();
    return response;
  }
  async function getParams(){
    const { entity } = await props.params;
    setEntityName(entity);
  }
  
  useEffect(() => {
    getParams();
  }, []);

  useEffect(()=>{
    pageLoading.setLoading(true);
    if (!entityName) return;
    async function fetchData() {
      try {
        const response = await getEntityData(entityName);
        setEntities(response ? response.data : []);
        pageLoading.setLoading(false);
      } catch (err) {
        console.error('Failed to fetch entity data:', err);
      } finally {
        pageLoading.setLoading(false);
      }
    }
    fetchData();
  },[entityName])

  if(!entityName){
    return <Loading />
  }
  return <>
    <Layout className='pt-15'>
      <Sider
        breakpoint="md"
        collapsedWidth="0"
        className='max-h-5/6'
        style={{
          height: 'calc(100vh - 64px)',
          overflowY: 'auto',
        }}
      >
        <div className="demo-logo-vertical" />
        <h1 className='text-white text-center bg-green-500 py-3 text-xl font-extrabold'>Tables</h1>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']} items={items} />
      </Sider>
      <Layout>
        <Content style={{ margin: '24px 16px 0' }}>
          <h1 className='text-center mt-3 text-2xl font-bold'>{entityName.toUpperCase()} LISTING</h1>
          <Table
            columns={generateColumns(entityName)}
            dataSource={entities}
            rowKey="id"
            loading={pageLoading.loading}
            pagination={{ pageSize: 10 }}
          />
        </Content>
      </Layout>
    </Layout>
    {/* <Footer /> */}
  </>
}

type EntityName = keyof typeof EntityMapping;

function isEntityName(key: string): key is EntityName {
  return key in EntityMapping;
}


function generateColumns(entityname: string) {
  if (!isEntityName(entityname)) {
    throw new Error("Invalid entity name");
  }
  const EntityClass = EntityMapping[entityname];
  const instance = new EntityClass();
  const keys = Object.keys(instance);
  console.log("ckeys----",keys);

  const columns = keys
    .filter((key) => !["status_id","created_by","updated_by"].includes(key))
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
      render: (value: any) => {
        if (key === "image_urls" && Array.isArray(value) && value.length > 0) {
          return (
            <Carousel dots={false} autoplay slidesToShow={1} slidesToScroll={1} style={{ width: 60, height: 50, overflow:"hidden" }}>
              {value.map((src: string, idx: number) => (
                <Image
                  key={idx}
                  src={src}
                  alt={key}
                  preview={false} // You can set to true if you want click to enlarge preview
                  style={{ maxWidth: 60, maxHeight: 60, objectFit: 'contain' }}
                  loading="lazy"
                />
              ))}
            </Carousel>
          );
        }

        if (typeof value === "boolean") {
          return value ? "Yes" : "No";
        }
        return value?.toString() ?? "";
      },
    }));
  console.log("columns----",columns);
  return columns;
}
