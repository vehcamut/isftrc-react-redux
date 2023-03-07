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
import ErrorResult from '../ErrorResult/ErrorResult';

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
  const { data, isLoading, isError } = dataSourseQuery(
    { limit, page, filter, isActive, ...extraOptions },
    {
      skip: 'id' in extraOptions ? !extraOptions.id : false,
      pollingInterval: 15000,
    },
  );

  const handleTableChange = (pagination: TablePaginationConfig, filters: Record<string, FilterValue | null>) => {
    if (filters?.isActive) {
      if (filters?.isActive.length > 1) setIsActive(undefined);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      else filters.isActive[0] ? setIsActive(true) : setIsActive(false);
    } else setIsActive(undefined);
    setPage(pagination.current ? pagination.current - 1 : 0);
    setLimit(pagination.pageSize ? pagination.pageSize : 0);
    // eslint-disable-next-line no-restricted-globals
    scroll(0, 0);
  };

  const onSearch = (value: string) => {
    setPage(0);
    setFilter(value);
  };
  console.log(isError);
  if (isError) return <ErrorResult />;

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
