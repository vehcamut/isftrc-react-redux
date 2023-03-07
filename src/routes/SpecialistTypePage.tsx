import React, { useState } from 'react';
import { Typography, Table, Row, Col, Button, Input, Modal, message } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { FilterValue } from 'antd/es/table/interface';
import { useNavigate } from 'react-router-dom';
import { FilterFilled } from '@ant-design/icons';
import classes from './style.module.scss';
import { IAdvertisingSource } from '../models';
import { addClass, mutationErrorHandler } from '../app/common';
import AdvertisingSourceForm from '../components/AdvertisingSourceForm/AdvertisingSourceForm';
import { specialistTypesAPI } from '../app/services/specialistTypes.service';

const { Search } = Input;

const SpecialistTypePage = () => {
  const navigate = useNavigate();

  const [addAdvertisingSource] = specialistTypesAPI.useAddSpecialistTypesMutation();
  const [updateAdvertisingSource] = specialistTypesAPI.useUpdateSpecialistTypesMutation();
  const [messageApi, contextHolder] = message.useMessage();

  const [open, setOpen] = useState(false);
  const [specType, setSpecTypeSource] = useState<IAdvertisingSource | undefined>(undefined);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState('');
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);

  const { data, isLoading } = specialistTypesAPI.useGetSpecialistTypesQuery({ limit, page, filter, isActive });

  const columns: ColumnsType<IAdvertisingSource> = [
    {
      title: 'Название',
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
      filterIcon: (filtered) => <FilterFilled style={{ color: filtered ? '#e6f4ff' : '#ffffff' }} />,
      filters: [
        {
          text: 'активен',
          value: 1,
        },
        {
          text: 'неактивен',
          value: 0,
        },
      ],
    },
  ];

  const handleTableChange = (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>) => {
    if (filters?.isActive) {
      if (filters?.isActive.length > 1) setIsActive(undefined);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      else filters.isActive[0] ? setIsActive(true) : setIsActive(false);
    } else setIsActive(undefined);
    setPage(pagination.current ? pagination.current - 1 : 0);
    setLimit(pagination.pageSize ? pagination.pageSize : -1);
    // eslint-disable-next-line no-restricted-globals
    scroll(0, 0);
  };
  const onSearch = (value: string) => {
    setPage(0);
    setFilter(value);
  };
  const onAddClick = () => {
    setOpen(true);
  };
  const onReset = () => {
    setSpecTypeSource(undefined);
    setOpen(false);
  };
  const onClick = (record: IAdvertisingSource) => {
    setSpecTypeSource(record);
    setOpen(true);
  };
  const onFinish = async (values: any) => {
    if (specType?._id) {
      try {
        await updateAdvertisingSource({ ...values, _id: specType._id }).unwrap();
        messageApi.open({
          type: 'success',
          content: 'Данные успешно обновлены',
        });
        onReset();
      } catch (e: any) {
        mutationErrorHandler(messageApi, e);
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
        mutationErrorHandler(messageApi, e);
      }
    }
  };

  const onBack = () => {
    navigate('./../');
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
            {specType?._id ? 'Обновление специальности' : 'Добавление специальности'}
          </Typography.Title>
        }
        width="800px"
        onCancel={onReset}
      >
        <AdvertisingSourceForm onFinish={onFinish} onReset={onReset} initValue={specType} />
      </Modal>
      <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Col>
          <Typography.Title level={1} style={{ margin: 0 }}>
            Специальности
          </Typography.Title>
        </Col>
        <Col>
          <Button type="link" onClick={onAddClick}>
            Добавить специальность
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
      <Table
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
      />
    </>
  );
};

export default SpecialistTypePage;
