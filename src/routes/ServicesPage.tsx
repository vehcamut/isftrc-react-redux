/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, PropsWithChildren, FunctionComponent } from 'react';
import { Typography, Table, Row, Col, Button, Input, Modal, message, TableColumnsType, Spin } from 'antd';
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
  IServiceTypeWithId,
  ISpecialistType,
} from '../models';
import { addClass } from '../app/common';
import AdvertisingSourceForm from '../components/AdvertisingSourceForm/AdvertisingSourceForm';
import { servicesAPI } from '../app/services/services.service';
import ServiceGroupForm from '../components/ServiceGroupForm/ServiceGroupForm';
import ServiceTypeForm from '../components/ServiceTypeForm/ServiceTypeForm';

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

  const [addGroup] = servicesAPI.useAddServiceGroupMutation();
  const [updateGroup] = servicesAPI.useUpdateServiceGroupMutation();

  const [addType] = servicesAPI.useAddServiceTypeMutation();
  const [updateType] = servicesAPI.useUpdateServiceTypeMutation();

  const [messageApi, contextHolder] = message.useMessage();

  const [isModalGroupVisible, setIsModalGroupVisible] = useState(false);
  const [isModalTypeVisible, setIsModalTypeVisible] = useState(false);
  const [group, setGroup] = useState<IServiceGroupWithId | undefined>(undefined);
  const [type, setType] = useState<IServiceTypeWithId | undefined>(undefined);
  const [filter, setFilter] = useState('');

  // const { data, isLoading } = advertisingSourceAPI.useGetAdvSourcesQuery({ limit, page, filter, isActive });
  const { data, isLoading } = servicesAPI.useGetGroupsWithTypesQuery({ filter });
  console.log(data);
  const columns: TableColumnsType<IServiceGroupWithIdAndTypes> = [
    {
      title: 'Название группы',
      dataIndex: 'name',
      key: 'name',
      width: '85%',
    },
    {
      title: 'Статус',
      dataIndex: 'isActive',
      key: 'isActive',
      width: '15%',
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
  const onBack = () => {
    navigate('./../');
  };
  const onAddGroupClick = () => {
    setIsModalGroupVisible(true);
  };
  const onGroupReset = () => {
    setGroup(undefined);
    setIsModalGroupVisible(false);
  };
  const onGroupRowClick = (record: IServiceGroupWithId) => {
    setGroup(record);
    setIsModalGroupVisible(true);
  };
  const onGroupFinish = async (values: any) => {
    if (group?._id) {
      try {
        await updateGroup({ ...values, _id: group._id }).unwrap();
        messageApi.open({
          type: 'success',
          content: 'Данные успешно обновлены',
        });
        onGroupReset();
      } catch (e: any) {
        const content = e.status === 400 ? 'Название должно быть уникальным' : 'Ошибка связи с сервером';
        messageApi.open({
          type: 'error',
          content,
        });
      }
    } else {
      try {
        await addGroup(values).unwrap();
        messageApi.open({
          type: 'success',
          content: 'Данные успешно добавлены',
        });
        onGroupReset();
      } catch (e: any) {
        const content = e.status === 400 ? 'Название должно быть уникальным' : 'Ошибка связи с сервером';
        messageApi.open({
          type: 'error',
          content,
        });
      }
    }
  };
  const onAddTypeClick = () => {
    setIsModalTypeVisible(true);
  };
  const onTypeReset = () => {
    setType(undefined);
    setIsModalTypeVisible(false);
  };
  const onTypeRowClick = (record: IServiceTypeWithId) => {
    setType(record);
    setIsModalTypeVisible(true);
  };
  const onTypeFinish = async (values: any) => {
    if (type?._id) {
      try {
        await updateType({ ...values, _id: type._id }).unwrap();
        messageApi.open({
          type: 'success',
          content: 'Данные успешно обновлены',
        });
        onTypeReset();
      } catch (e: any) {
        const content = e.status === 400 ? 'Название должно быть уникальным' : 'Ошибка связи с сервером';
        messageApi.open({
          type: 'error',
          content,
        });
      }
    } else {
      try {
        await addType(values).unwrap();
        messageApi.open({
          type: 'success',
          content: 'Данные успешно добавлены',
        });
        onTypeReset();
      } catch (e: any) {
        const content = e.status === 400 ? 'Название должно быть уникальным' : 'Ошибка связи с сервером';
        messageApi.open({
          type: 'error',
          content,
        });
      }
    }
  };

  const expandedRowRender = (record: IServiceGroupWithIdAndTypes) => {
    const columns1: TableColumnsType<IServiceTypeWithId> = [
      {
        title: 'Название услуги',
        dataIndex: 'name',
        key: 'name',
        width: '30%',
        render: (x, r) => {
          return `${r.name}${r.defaultAmountPatient ? '*' : ''}`;
        },
      },
      {
        title: 'Специальности',
        dataIndex: 'specialistTypes',
        key: 'specialistTypes',
        width: '30%',
        render: (v: ISpecialistType[]) => {
          return v.map((r) => r.name).join(', ');
        },
      },
      {
        title: 'Цена',
        dataIndex: 'price',
        key: 'price',
        width: '20%',
      },
      {
        title: 'Время',
        dataIndex: 'time',
        key: 'time',
        width: '10%',
        render: (time: string) => {
          return new Date(time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          // const date = new Date(time);
          // date.setHours(date.getHours() + date.getTimezoneOffset() / 60);
          // return new Date(date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        },
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
      },
    ];
    return (
      <Table
        columns={columns1}
        bordered
        rowKey={(r) => r._id}
        dataSource={record.types}
        pagination={false}
        loading={isLoading}
        rowClassName={(r) =>
          r.isActive === true ? 'my-table-row my-table-row__active' : 'my-table-row my-table-row__deactive'
        }
        className="internal-table"
        onRow={(r) => {
          return {
            onClick: () => {
              onTypeRowClick(r);
            },
          };
        }}
      />
    );
  };

  return (
    <>
      {contextHolder}
      <Modal
        destroyOnClose
        open={isModalGroupVisible}
        footer={null}
        title={
          <Typography.Title level={2} style={{ margin: 0, marginBottom: '20px' }}>
            {group?._id ? 'Обновление группы услуг' : 'Добавление группы услуг'}
          </Typography.Title>
        }
        width="800px"
        onCancel={onGroupReset}
      >
        <ServiceGroupForm onFinish={onGroupFinish} onReset={onGroupReset} initValue={group} />
      </Modal>
      <Modal
        destroyOnClose
        open={isModalTypeVisible}
        footer={null}
        title={
          <Typography.Title level={2} style={{ margin: 0, marginBottom: '20px' }}>
            {type?._id ? 'Обновление услуги' : 'Добавление услуги'}
          </Typography.Title>
        }
        width="1000px"
        onCancel={onTypeReset}
      >
        <ServiceTypeForm onFinish={onTypeFinish} onReset={onTypeReset} initValue={type} />
      </Modal>
      <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Col>
          <Typography.Title level={1} style={{ margin: 0 }}>
            Типы услуг
          </Typography.Title>
        </Col>
        <Col>
          <Button type="link" onClick={onAddGroupClick}>
            Добавить группу услуг
          </Button>
          <Button type="link" onClick={onAddTypeClick}>
            Добавить услугу
          </Button>
          <Button type="link" key="back" onClick={onBack}>
            К списку справочников
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
      {isLoading ? (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
          <Spin tip="Загрузка..." />
        </div>
      ) : (
        <Table
          rowKey={(record) => record._id}
          columns={columns}
          bordered
          expandable={{
            expandedRowRender,
            // expandedRowKeys: isLoading ? data?.map((r) => r._id) : undefined,
            defaultExpandedRowKeys: data?.map((r) => r._id),
            rowExpandable: (r) => !!r.types.length,
          }}
          loading={isLoading}
          dataSource={data}
          size="small"
          pagination={false}
          rowClassName="my-table-expanded-row"
          className={addClass(classes, 'patients-table')}
          onRow={(record) => {
            return {
              onClick: () => {
                onGroupRowClick(record);
              },
            };
          }}
        />
      )}
    </>
  );
};

export default ServicesPage;
