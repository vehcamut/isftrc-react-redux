/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, PropsWithChildren, FunctionComponent } from 'react';
import { Typography, Table, Row, Col, Button, Input, Modal, message, TableColumnsType } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import { useNavigate } from 'react-router-dom';
import { FilterFilled } from '@ant-design/icons';
import classes from './style.module.scss';
import { advertisingSourceAPI } from '../app/services';
import {
  IAdvertisingSource,
  IServiceGroupWithId,
  IServiceGroupWithIdAndTypes,
  IServiceType,
  IServiceTypeWithId,
} from '../models';
import { addClass } from '../app/common';
import AdvertisingSourceForm from '../components/AdvertisingSourceForm/AdvertisingSourceForm';
import { servicesAPI } from '../app/services/services.service';

const { Search } = Input;

// interface IExpandedRowRenderProps extends PropsWithChildren {
//   data: IServiceType[];
// }

// const expandedRowRender: FunctionComponent<IExpandedRowRenderProps> = ({ data: expandedData }) => {
//   const columns1: TableColumnsType<IServiceType> = [
//     { title: 'Название', dataIndex: 'name', key: 'name' },
//     { title: 'Специалисты', dataIndex: 'specialistTypes', key: 'specialistTypes' },
//     { title: 'Стутус', dataIndex: 'isActive', key: 'isActive' },
//   ];
//   return <Table columns={columns1} dataSource={expandedData} pagination={false} />;
// };

const ServicesPage = () => {
  const navigate = useNavigate();

  const [addAdvertisingSource] = advertisingSourceAPI.useAddAdvSourcesMutation();
  const [updateAdvertisingSource] = advertisingSourceAPI.useUpdateAdvSourcesMutation();
  const [messageApi, contextHolder] = message.useMessage();

  const [open, setOpen] = useState(false);
  const [advSource, setAdvSource] = useState<IAdvertisingSource | undefined>(undefined);
  const [filter, setFilter] = useState('');

  // const { data, isLoading } = advertisingSourceAPI.useGetAdvSourcesQuery({ limit, page, filter, isActive });
  const { data, isLoading } = servicesAPI.useGetGroupsWithTypesQuery({ filter });

  const columns: TableColumnsType<IServiceGroupWithIdAndTypes> = [
    {
      title: 'Название группы',
      dataIndex: 'name',
      key: 'name',
      width: '90%',
    },
    {
      title: 'Статус',
      dataIndex: 'isActive',
      key: 'isActive',
      width: '10%',
      render: (flag: boolean) => {
        return flag ? (
          <div className={addClass(classes, 'active-table-item__active')}>активен</div>
        ) : (
          <div className={addClass(classes, 'active-table-item__not-active')}>неактивен</div>
        );
      },
      // eslint-disable-next-line react/no-unstable-nested-components
    },
  ];

  // const handleTableChange = (
  //   pagination: TablePaginationConfig,
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   filters: Record<string, FilterValue | null>,
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   sorter: SorterResult<IAdvertisingSource> | SorterResult<IAdvertisingSource>[],
  // ) => {
  //   if (filters?.isActive) {
  //     if (filters?.isActive.length > 1) setIsActive(undefined);
  //     // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  //     else filters.isActive[0] ? setIsActive(true) : setIsActive(false);
  //   } else setIsActive(undefined);
  //   // console.log(pagination, filters, sorter);
  //   setPage(pagination.current ? pagination.current - 1 : 0);
  //   setLimit(pagination.pageSize ? pagination.pageSize : -1);
  // };
  const onSearch = (value: string) => {
    // setPage(0);
    setFilter(value);
  };
  const onAddClick = () => {
    setOpen(true);
  };
  const onReset = () => {
    setAdvSource(undefined);
    setOpen(false);
  };
  const onClick = (record: IAdvertisingSource) => {
    setAdvSource(record);
    setOpen(true);
  };
  const onFinish = async (values: any) => {
    if (advSource?._id) {
      try {
        await updateAdvertisingSource({ ...values, _id: advSource._id }).unwrap();
        messageApi.open({
          type: 'success',
          content: 'Данные успешно обновлены',
        });
        onReset();
      } catch (e: any) {
        const content = e.status === 400 ? 'Название должно быть уникальным' : 'Ошибка связи с сервером';
        messageApi.open({
          type: 'error',
          content,
        });
      }
    } else {
      try {
        await addAdvertisingSource(values).unwrap();
        messageApi.open({
          type: 'success',
          content: 'Данные успешно добавлены',
        });
        onReset();
      } catch (e: any) {
        const content = e.status === 400 ? 'Название должно быть уникальным' : 'Ошибка связи с сервером';
        messageApi.open({
          type: 'error',
          content,
        });
      }
    }
  };

  const onBack = () => {
    navigate('./../');
  };

  const expandedRowRender = (record: IServiceGroupWithIdAndTypes) => {
    console.log(record.types);
    const columns1: TableColumnsType<IServiceTypeWithId> = [
      { title: 'Название', dataIndex: 'name', key: 'name' },
      { title: 'Специалисты', dataIndex: 'specialistTypes', key: 'specialistTypes' },
      {
        title: 'Статус',
        dataIndex: 'isActive',
        key: 'isActive',
        width: '10%',
        render: (flag: boolean) => {
          return flag ? (
            <div className={addClass(classes, 'active-table-item__active')}>активен</div>
          ) : (
            <div className={addClass(classes, 'active-table-item__not-active')}>неактивен</div>
          );
        },
      },
    ];
    return (
      <Table
        columns={columns1}
        bordered
        rowKey={(r) => r._id}
        dataSource={record.types}
        pagination={false}
        rowClassName={(r) =>
          r.isActive === true ? 'my-table-row my-table-row__active' : 'my-table-row my-table-row__deactive'
        }
        className="internal-table"
      />
    );
  };

  return (
    <>
      {contextHolder}
      <Modal
        destroyOnClose
        open={open}
        footer={null}
        title={
          <Typography.Title level={2} style={{ margin: 0, marginBottom: '20px' }}>
            {advSource?._id ? 'Обновление источника рекламы' : 'Добавление источника рекламы'}
          </Typography.Title>
        }
        width="800px"
        onCancel={onReset}
      >
        <AdvertisingSourceForm onFinish={onFinish} onReset={onReset} initValue={advSource} />
      </Modal>
      <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Col>
          <Typography.Title level={1} style={{ margin: 0 }}>
            Типы услуг
          </Typography.Title>
        </Col>
        <Col>
          <Button type="link" key="back" onClick={onBack}>
            К списку справочников
          </Button>
          <Button type="link" onClick={onAddClick}>
            Добавить источник
          </Button>
        </Col>
      </Row>
      <Search
        allowClear
        placeholder="Введите текст поиска"
        onSearch={onSearch}
        enterButton
        style={{ marginBottom: '15px' }}
      />
      <Table
        rowKey={(record) => record._id}
        columns={columns}
        bordered
        expandable={{
          expandedRowRender,
          defaultExpandedRowKeys: data?.map((r) => r._id),
          rowExpandable: (r) => !!r.types.length,
        }}
        loading={isLoading}
        // defaultExpandedRowKeys: ['0']
        dataSource={data}
        size="small"
        pagination={false}
        rowClassName="my-table-expanded-row"
        className={addClass(classes, 'patients-table')}
      />
      {/* <Table
        style={{ width: '100%' }}
        tableLayout="fixed"
        bordered
        size="small"
        columns={columns}
        rowKey={(record) => record._id}
        dataSource={data?.data}
        pagination={{
          position: ['bottomCenter'],
          current: page + 1,
          pageSize: limit,
          total: data?.count,
          pageSizeOptions: [10, 20, 50, 100],
          showSizeChanger: true,
        }}
        loading={isLoading}
        onRow={(record) => {
          return {
            onClick: () => {
              onClick(record);
            },
          };
        }}
        rowClassName={(record) =>
          record.isActive === true ? 'my-table-row my-table-row__active' : 'my-table-row my-table-row__deactive'
        }
        className={addClass(classes, 'patients-table')}
        onChange={handleTableChange}
      /> */}
    </>
  );
};

export default ServicesPage;
