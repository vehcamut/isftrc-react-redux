/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Typography, Table, Row, Col, Button, Input, Tooltip } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import { useNavigate } from 'react-router-dom';
import { FilterFilled } from '@ant-design/icons';
import classes from './style.module.scss';
import { patientsAPI, representativesAPI } from '../app/services';
import { IPatient, IRepresentative } from '../models';
import { addClass } from '../app/common';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { patientTableSlice } from '../app/reducers';

const { Search } = Input;

function CustomCell(props: any) {
  console.log(props);
  // eslint-disable-next-line react/destructuring-assignment
  if (Array.isArray(props?.children)) {
    // eslint-disable-next-line react/destructuring-assignment
    console.log(props?.children[1]);
    // eslint-disable-next-line react/destructuring-assignment
    let title = props?.children[1];
    if (typeof title?.props?.children === 'string') title = title?.props?.children;
    if (typeof title === 'string')
      return (
        <Tooltip title={title} mouseLeaveDelay={0} mouseEnterDelay={0.5}>
          <td {...props} />
        </Tooltip>
      );
  }
  return <td {...props} />;
}

const Representatives = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { limit, page, filter, isActive } = useAppSelector((state) => state.patientTableReducer);
  const { data, isLoading } = representativesAPI.useGetRepresentativesQuery({ limit, page, filter, isActive });

  const columns: ColumnsType<IRepresentative> = [
    {
      title: 'Логин',
      dataIndex: 'login',
      key: 'login',
      width: '10%',
    },
    {
      title: 'ФИО',
      dataIndex: 'name',
      key: 'name',
      width: '22%',
      render: (x, record) => {
        return `${record.surname} ${record.name} ${record.patronymic}`;
      },
    },
    {
      title: 'Телефоны',
      dataIndex: 'phoneNumbers',
      key: 'phoneNumbers',
      width: '12%',
      render: (number: string[]) => {
        return number.reduce((p, c) => {
          const pn = `+7 ${c.slice(0, 3)} ${c.slice(3, 6)}-${c.slice(6, 8)}-${c.slice(8)}`;
          return `${p} ${pn}`;
        }, '');
        // return new Date(date).toLocaleString('ru', { year: 'numeric', month: 'numeric', day: 'numeric' });
      },
    },
    {
      title: 'Emails',
      dataIndex: 'emails',
      key: 'emails',
      width: '16%',
      render: (emails: string[]) => {
        return emails.reduce((p, c) => {
          return `${p} ${c}`;
        }, '');
        // return new Date(date).toLocaleString('ru', { year: 'numeric', month: 'numeric', day: 'numeric' });
      },
    },
    {
      title: 'Дата рождения',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      width: '12%',
      render: (date: Date) => {
        return new Date(date).toLocaleString('ru', { year: 'numeric', month: 'numeric', day: 'numeric' });
      },
    },
    {
      title: 'Пол',
      dataIndex: 'gender',
      key: 'gender',
      width: '8%',
    },
    {
      title: 'Адрес',
      dataIndex: 'address',
      key: 'address',
      width: '20%',
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
  const { setPage, setLimit, setFilter, setIsActive } = patientTableSlice.actions;

  const handleTableChange = (
    pagination: TablePaginationConfig,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    filters: Record<string, FilterValue | null>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sorter: SorterResult<IRepresentative> | SorterResult<IRepresentative>[],
  ) => {
    if (filters?.isActive) {
      if (filters?.isActive.length > 1) dispatch(setIsActive(undefined));
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      else filters.isActive[0] ? dispatch(setIsActive(true)) : dispatch(setIsActive(false));
    } else dispatch(setIsActive(undefined));
    // console.log(pagination, filters, sorter);
    dispatch(setPage(pagination.current ? pagination.current - 1 : 0));
    dispatch(setLimit(pagination.pageSize ? pagination.pageSize : -1));
  };
  const onSearch = (value: string) => {
    dispatch(setPage(0));
    dispatch(setFilter(value));
  };
  const onAddClick = () => {
    navigate('/representatives/add', { replace: true });
  };

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Col>
          <Typography.Title level={1} style={{ margin: 0 }}>
            Представители
          </Typography.Title>
        </Col>
        <Col>
          <Button type="link" onClick={onAddClick}>
            Добавить представителя
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
        components={{
          body: {
            cell: CustomCell,
          },
        }}
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
              navigate(`/representatives/${record._id}/info`);
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

export default Representatives;
