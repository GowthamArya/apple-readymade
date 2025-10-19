"use client";
import { useLoading } from '@/app/context/LoadingContext';
import { Carousel, Table, Image, Layout, Menu, Button, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { EntityMapping } from "@/utils/supabase/entitymapping";
import Loading from '@/app/loading';
import Link from 'next/link';
import Sider from 'antd/es/layout/Sider';

const { Content } = Layout;
const HEADER_HEIGHT = 64;

const items = Object.entries(EntityMapping).map(([name]) => ({
  key: name,
  label: <Link href={`/list/${name}`}>{name.toUpperCase()}</Link>,
}));

export default function Listing(props: PageProps<"/list/[entity]">) {
  const [entityName, setEntityName] = useState("");
  const [entities, setEntities] = useState<any[]>([]);
  const pageLoading = useLoading();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    (async function setParams(){
      const { entity } = await props.params;
      setEntityName(entity);
    })();
  }, [props.params]);

  useEffect(() => {
    pageLoading.setLoading(true);
    if (!entityName) return;
    async function fetchData() {
      try {
        const data = await fetch(`/api/generic/${entityName}`);
        const response = await data.json();
        setEntities(response ? response.data : []);
      } catch (err) {
        console.error('Failed to fetch entity data:', err);
      } finally {
        pageLoading.setLoading(false);
      }
    }
    fetchData();
  }, [entityName]);

  if (!entityName) return <Loading />;

  return (
    <Layout style={{ minHeight: '100vh', background: "#f7f7f7" }} className='flex !flex-row'>

      <Drawer
        title="Tables"
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        className='pb-10'
      >
        <Menu
          mode="inline"
          selectedKeys={[entityName]}
          items={items}
          onClick={() => setDrawerOpen(false)}
          style={{ height: '100vh', borderRight: 0 }}
        />
      </Drawer>

      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={0}
        className="hidden lg:block"
        width={220}
        style={{
          top: HEADER_HEIGHT,
          position: "fixed",
          left: 0,
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          overflowY: "auto",
          background: "#001529",
          zIndex: 10,
        }}
      >
        <div className="bg-green-500 text-white font-extrabold py-3 text-xl text-center sticky top-0 z-10">
          Tables
        </div>
        <Menu theme="dark" mode="inline" selectedKeys={[entityName]} items={items} />
      </Sider>

      <Layout
        style={{
          marginLeft: "0px",
          marginTop: HEADER_HEIGHT,
          paddingLeft: "0px",
        }}
        className={`pt-6 lg:pt-0`}
      >
        <Content
          style={{
            margin: '24px 16px 0',
            overflow: 'auto',
            marginLeft: collapsed ? 0 : 250,
            transition: 'margin-left 1s',
          }}
        >
          <div className='flex md:!justify-center'>
            <Button
              type="text"
              icon={<MenuOutlined className='!text-green-700 p-3' style={{ fontSize: 20}} />}
              className='bg-green-600 md:!hidden'
              onClick={() => setDrawerOpen(true)}
            />
            <h1 className="text-center m-4 text-2xl font-bold">
              {entityName.toUpperCase()} LISTING
            </h1>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <Table
              columns={generateColumns(entityName)}
              dataSource={entities}
              rowKey="id"
              loading={pageLoading.loading}
              pagination={{ pageSize: 10 }}
              scroll={{ x: true }}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
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
