"use client";
import { Table, Layout, Menu, Button, Drawer, Input, theme } from 'antd';
import { MenuOutlined, PlusCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import Loading from '@/app/loading';
import Link from 'next/link';
import Sider from 'antd/es/layout/Sider';
import { generateMetadataColumns } from '@/helper/genericcolumns';
import DynamicFormModal from '@/app/components/DynamicFormModel';
const { useToken } = theme;

const { Content } = Layout;
const HEADER_HEIGHT = 50;


const GenericListing = ({entityName, allEntities}:{entityName:string, allEntities: []}) => {
  const { token } = useToken();

    const [entities, setEntities] = useState<any[]>([]);
    const [loading,setLoading] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [columnsMetadata,setColumnsMetadata] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editRecord, setEditRecord] = useState<any>({id:0});
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [searchText, setSearchText] = useState('');

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
  async function fetchData(currentPage = page, currentPageSize = pageSize, searchText = '') {
    setLoading(true);
    const params = new URLSearchParams({
      pagination: JSON.stringify({ page: currentPage, limit: currentPageSize }),
      ...(searchText && { search: JSON.stringify({ query: searchText }) }),
    });
    const response = await fetch(`/api/generic/${entityName}?${params.toString()}`);
    const json = await response.json();
    setEntities(json.data || []);
    console.table(json.data || []);
    setTotal(json.total || 0);
    setLoading(false);
  }

  const items = allEntities.map(({name} : any) => ({
    key: name,
    label: <Link href={`/list/${name}`}>{name.toUpperCase()}</Link>,
  }));

  useEffect(() => {
    setLoading(true);
    if (!entityName) return;
    async function loadData() {
      try {
        const metaData = await fetch(`/api/metadata/${entityName}`);
        const metaDataResponse = await metaData.json();
        fetchData()
        setColumnsMetadata(metaDataResponse.data ? metaDataResponse.data : []);
        
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
    <Layout className='flex flex-row!'>
      <Drawer
        title="Tables"
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        className='pb-10!'
      >
        <Menu
          mode="inline"
          selectedKeys={[entityName]}
          items={items}
          onClick={() => setDrawerOpen(false)}
          style={{ borderRight: 0 }}
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
        width={250}
        style={{
          position: "fixed",
          left: 0,
          height: `calc(95vh)`,
          overflowY: "auto",
          background: "#001529",
          scrollBehavior: "smooth",
          zIndex: 10,
        }}
      >
        <div className="font-bold p-3 text-xl text-start sticky top-0 z-10" style={{ background: token.colorText, color: token.colorBgContainer   }}>
          Master Tables
        </div>
        <Menu theme="dark" mode="inline" className='pb-30!' selectedKeys={[entityName]} items={items} />
      </Sider>

      <Layout
        className={`p-5!  min-h-[95vh]!`}
        style={{
          background: token.colorBgContainer,
        }}
      >
        <Content
          style={{
            overflow: 'auto',
            marginLeft: collapsed ? 0 : 250, 
            transition: 'margin-left 1s',
          }}
        >
          <div className='flex justify-between! pb-5'>
            <Button
              type="primary"
              icon={<MenuOutlined className='text-white! p-3' style={{ fontSize: 20}} />}
              className='md:hidden!'
              onClick={() => setDrawerOpen(true)}
            />
            <h1 className="text-center text-2xl font-bold">
              {entityName.toUpperCase()} DATA
            </h1>
            <div className='flex items-center gap-2 md:flex-nowrap flex-wrap'>
              <Input.Search
                placeholder={`Search in ${entityName}`}
                value={searchText}
                allowClear
                onChange={e => setSearchText(e.target.value)}
                onSearch={value => {
                  setSearchText(value);
                  setPage(1);
                  fetchData(1, pageSize, value);
                }}
              />
              <Button
                icon={<PlusCircleOutlined />}
                type='primary' 
                onClick={() => {
                  setEditRecord({id:0});
                  setModalVisible(true);
                }}
              >Add</Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchData(page, pageSize, searchText)}
              >
                Reload
              </Button>
            </div>
          </div>
            <Table
              bordered
              columns={generateMetadataColumns(columnsMetadata,handleEditClick,deleteData)}
              dataSource={entities}
              rowKey="id"
              loading={loading}
              sticky
              size='small'
              onRow={(record) => {
                return {
                  onDoubleClick: (event) => {
                    handleEditClick(record);
                  },
                };
              }}
              pagination={{
                current: page,
                pageSize,
                total,
                showSizeChanger: true,
                onChange: (newPage, newSize) => {
                  setPage(newPage);
                  setPageSize(newSize);
                  fetchData(newPage, newSize, searchText);
                }
              }}
              scroll={{ y: `calc(100vh - ${HEADER_HEIGHT + 200}px)`, x: true }}
            />
            <DynamicFormModal
              visible={modalVisible}
              metadata={columnsMetadata}
              onCancel={()=>setModalVisible(false)}
              onSubmit={()=>{
                fetchData(page, pageSize, searchText);
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

export default GenericListing