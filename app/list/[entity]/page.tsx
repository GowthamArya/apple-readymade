"use client";
import { Table, Layout, Menu, Button, Drawer } from 'antd';
import { MenuOutlined, PlusCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import Loading from '@/app/loading';
import Link from 'next/link';
import Sider from 'antd/es/layout/Sider';
import { generateMetadataColumns } from '@/helper/genericcolumns';
import DynamicFormModal from '@/app/components/DynamicFormModel';

const { Content } = Layout;
const HEADER_HEIGHT = 64;

export default function Listing(props: PageProps<"/list/[entity]">) {
  const [entityName, setEntityName] = useState("");
  const [entities, setEntities] = useState<any[]>([]);
  const [loading,setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [columnsMetadata,setColumnsMetadata] = useState<any[]>([]);
  const [allEntities,setAllEntities] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState<any>({id:0});

  const handleEditClick = (record:any) => {
    setEditRecord(record);
    setModalVisible(true);
  };

  async function deleteData({id}:any){
    (async function updateEntity() {
      const url = `/api/generic/${entityName}?id=${id}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      setLoading(false);
      return response.json();
    })();
  }

  async function fetchData(){
    const data = await fetch(`/api/generic/${entityName}`);
    const response = await data.json();
    setEntities(response ? response.data : []);
  }

  const items = allEntities.map(({EntityName} : any) => ({
    key: EntityName,
    label: <Link href={`/list/${EntityName}`}>{EntityName.toUpperCase()}</Link>,
  }));

  useEffect(() => {
    (async function setParams(){
      const { entity } = await props.params;
      setEntityName(entity);
    })();
  }, [props.params]);

  useEffect(() => {
    setLoading(true);
    if (!entityName) return;
    async function loadData() {
      try {
        const data = await fetch(`/api/generic/${entityName}`);
        const metaData = await fetch(`/api/metadata/${entityName}`);
        const entities = await fetch(`/api/generic/entity`);
        const metaDataResponse = await metaData.json();
        const entitiesResponse = await entities.json();
        fetchData()
        setColumnsMetadata(metaDataResponse.data ? metaDataResponse.data : []);
        setAllEntities(entitiesResponse.data? entitiesResponse.data : []);
      } catch (err) {
        console.error('Failed to fetch entity data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
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
          scrollBehavior: "smooth",
          zIndex: 10,
        }}
      >
        <div className="bg-green-500 text-white font-bold p-3 text-xl text-start sticky top-0 z-10">
          Master Tables
        </div>
        <Menu theme="dark" mode="inline" className='!pb-10' selectedKeys={[entityName]} items={items} />
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
          <div className='flex !justify-between'>
            <Button
              type="primary"
              icon={<MenuOutlined className='!text-white p-3' style={{ fontSize: 20}} />}
              className='md:!hidden'
              onClick={() => setDrawerOpen(true)}
            />
            <h1 className="text-center m-4 text-2xl font-bold">
              {entityName.toUpperCase()} DATA
            </h1>
            <Button
              icon={<PlusCircleOutlined style={{ fontSize: 20, verticalAlign: 'middle'}} />}
              type='primary' 
              onClick={() => {
                setEditRecord({id:0});
                setModalVisible(true);
              }}
            >Add</Button>
          </div>
            <Table
              bordered
              columns={generateMetadataColumns(columnsMetadata,handleEditClick,deleteData)}
              dataSource={entities}
              rowKey="id"
              loading={loading}
              sticky
              onRow={(record) => {
                return {
                  onDoubleClick: (event) => {
                    handleEditClick(record);
                  },
                };
              }}
              pagination={{ 
                defaultPageSize:10,
                hideOnSinglePage: true,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
              }}
              scroll={{ y: 100 * 5, x: true }}
            />
            <DynamicFormModal
              visible={modalVisible}
              metadata={columnsMetadata}
              onCancel={()=>setModalVisible(false)}
              onSubmit={()=>{
                fetchData();
                setModalVisible(false);
              }}
              id={editRecord?.id}
              entityName={entityName}
            />
        </Content>
      </Layout>
    </Layout>
  );
}