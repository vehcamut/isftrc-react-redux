/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';
import { Typography, Table, Row, Col, Button, Input } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import { useNavigate } from 'react-router-dom';
import { FilterFilled } from '@ant-design/icons';
import classes from './MyTable.module.scss';
import { patientsAPI, representativesAPI } from '../../app/services';
import { IPatient, IRepresentative } from '../../models';
import { addClass } from '../../app/common';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { patientTableSlice } from '../../app/reducers';
import CustomCell from '../CustomCell/CustomCell';

const { Search } = Input;

interface MyTableProps extends PropsWithChildren {
  onRowClick?: (record: any) => void;
  dataSourseQuery: any;
  extraOptions?: any;
  tableState?: any;
  hasSearch?: boolean;
  hasPagination?: boolean;
  slice?: any;
  reduser?: any;
  columns: any;
}

const MyTable: FunctionComponent<MyTableProps> = ({
  onRowClick,
  extraOptions,
  dataSourseQuery,
  hasSearch,
  hasPagination,
  tableState,
  slice,
  reduser,
  columns,
}) => {
  const dispatch = useAppDispatch();

  const [limit, setLimit] =
    slice && reduser ? [reduser.limit, (v: number) => dispatch(slice.actions.setLimit(v))] : useState(tableState.limit);
  const [page, setPage] =
    slice && reduser ? [reduser.page, (v: number) => dispatch(slice.actions.setPage(v))] : useState(tableState.page);
  const [filter, setFilter] =
    slice && reduser
      ? [reduser.filter, (v: string) => dispatch(slice.actions.setFilter(v))]
      : useState(tableState.filter);
  const [isActive, setIsActive] =
    slice && reduser
      ? [reduser.isActive, (v: boolean | undefined) => dispatch(slice.actions.setIsActive(v))]
      : useState<boolean | undefined>(tableState.isActive);
  const { data, isLoading } = dataSourseQuery({ limit, page, filter, isActive, ...extraOptions });

  // const columns: ColumnsType<IRepresentative> = [
  //   {
  //     title: 'Логин',
  //     dataIndex: 'login',
  //     key: 'login',
  //     width: '10%',
  //   },
  //   {
  //     title: 'ФИО',
  //     dataIndex: 'name',
  //     key: 'name',
  //     width: '22%',
  //     render: (x, record) => {
  //       return `${record.surname} ${record.name} ${record.patronymic}`;
  //     },
  //   },
  //   {
  //     title: 'Телефоны',
  //     dataIndex: 'phoneNumbers',
  //     key: 'phoneNumbers',
  //     width: '12%',
  //     render: (number: string[]) => {
  //       return number.reduce((p, c) => {
  //         const pn = `+7 ${c.slice(0, 3)} ${c.slice(3, 6)}-${c.slice(6, 8)}-${c.slice(8)}`;
  //         return `${p} ${pn}`;
  //       }, '');
  //       // return new Date(date).toLocaleString('ru', { year: 'numeric', month: 'numeric', day: 'numeric' });
  //     },
  //   },
  //   {
  //     title: 'Emails',
  //     dataIndex: 'emails',
  //     key: 'emails',
  //     width: '16%',
  //     render: (emails: string[]) => {
  //       return emails.reduce((p, c) => {
  //         return `${p} ${c}`;
  //       }, '');
  //       // return new Date(date).toLocaleString('ru', { year: 'numeric', month: 'numeric', day: 'numeric' });
  //     },
  //   },
  //   {
  //     title: 'Дата рождения',
  //     dataIndex: 'dateOfBirth',
  //     key: 'dateOfBirth',
  //     width: '12%',
  //     render: (date: Date) => {
  //       return new Date(date).toLocaleString('ru', { year: 'numeric', month: 'numeric', day: 'numeric' });
  //     },
  //   },
  //   {
  //     title: 'Пол',
  //     dataIndex: 'gender',
  //     key: 'gender',
  //     width: '8%',
  //   },
  //   {
  //     title: 'Адрес',
  //     dataIndex: 'address',
  //     key: 'address',
  //     width: '20%',
  //   },
  //   {
  //     title: 'Статус',
  //     dataIndex: 'isActive',
  //     key: 'isActive',
  //     width: '10%',
  //     render: (flag: boolean) => {
  //       return flag ? (
  //         <div className={addClass(classes, 'active-table-item__active')}>активен</div>
  //       ) : (
  //         <div className={addClass(classes, 'active-table-item__not-active')}>неактивен</div>
  //       );
  //     },
  //     defaultFilteredValue: [isActive],
  //     // eslint-disable-next-line react/no-unstable-nested-components
  //     filterIcon: (filtered) => <FilterFilled style={{ color: filtered ? '#e6f4ff' : '#ffffff' }} />,
  //     filters: [
  //       {
  //         text: 'активен',
  //         value: 1,
  //       },
  //       {
  //         text: 'неактивен',
  //         value: 0,
  //       },
  //     ],
  //   },
  // ];

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // sorter: SorterResult<IRepresentative> | SorterResult<IRepresentative>[],
  ) => {
    if (filters?.isActive) {
      if (filters?.isActive.length > 1) setIsActive(undefined);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      else filters.isActive[0] ? setIsActive(true) : setIsActive(false);
    } else setIsActive(undefined);
    // console.log(pagination, filters, sorter);
    setPage(pagination.current ? pagination.current - 1 : 0);
    setLimit(pagination.pageSize ? pagination.pageSize : 0);
  };

  const onSearch = (value: string) => {
    setPage(0);
    setFilter(value);
  };

  return (
    <>
      {hasSearch ? (
        <Search
          allowClear
          placeholder="Введите текст поиска"
          onSearch={onSearch}
          enterButton
          style={{ marginBottom: '15px' }}
          defaultValue={filter}
        />
      ) : null}

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
        pagination={
          hasPagination
            ? {
                position: ['bottomCenter'],
                current: page + 1,
                pageSize: limit,
                total: data?.count,
                pageSizeOptions: [10, 20, 50, 100],
                showSizeChanger: true,
              }
            : false
        }
        loading={isLoading}
        onRow={
          onRowClick
            ? (record) => {
                return {
                  onClick: () => {
                    onRowClick(record);
                  },
                };
              }
            : undefined
        }
        rowClassName={(record) =>
          record.isActive === true ? 'my-table-row my-table-row__active' : 'my-table-row my-table-row__deactive'
        }
        className={addClass(classes, 'my-table')}
        onChange={handleTableChange}
      />
    </>
  );
};

MyTable.defaultProps = {
  hasSearch: true,
  extraOptions: {},
  hasPagination: false,
  tableState: {
    limit: 10,
    page: 0,
    filter: '',
    isActive: undefined,
  },
  slice: undefined,
  reduser: undefined,
  onRowClick: undefined,
};

export default MyTable;
