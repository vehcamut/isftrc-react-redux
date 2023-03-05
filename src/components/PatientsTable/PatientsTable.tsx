/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { Typography, Table, Row, Col, Button, Input } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import { useNavigate } from 'react-router-dom';
import { DeleteRowOutlined, FilterFilled } from '@ant-design/icons';
import classes from './PatientsTable.module.scss';
import { patientsAPI } from '../../app/services';
import { IPatient, IRepresentative } from '../../models';
import { addClass } from '../../app/common';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { patientTableSlice } from '../../app/reducers';
import MyTable from '../MyTable/MyTable';

const { Search } = Input;

interface PatientsTableProps extends PropsWithChildren {
  onRowClick?: (record: any) => void;
  dataSourseQuery: any;
  extraOptions?: any;
  tableState?: any;
  hasSearch?: boolean;
  hasPagination?: boolean;
  slice?: any;
  reduser?: any;
  onRemove?: any;
}

const PatientsTable: FunctionComponent<PatientsTableProps> = ({
  onRowClick,
  extraOptions,
  dataSourseQuery,
  hasSearch,
  hasPagination,
  tableState,
  slice,
  reduser,
  onRemove,
  // columns,
}) => {
  const isActive = slice && reduser ? reduser.isActive : tableState.isActive;

  const columns: ColumnsType<IPatient> = [
    {
      title: '№',
      dataIndex: 'number',
      key: 'number',
      width: '5%',
    },
    {
      title: 'ФИО',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
      render: (x, record) => {
        return `${record.surname} ${record.name} ${record.patronymic}`;
      },
    },
    {
      title: 'Дата рождения',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      width: '11%',
      render: (date: Date) => {
        return new Date(date).toLocaleString('ru', { year: 'numeric', month: 'numeric', day: 'numeric' });
      },
    },
    {
      title: 'Пол',
      dataIndex: 'gender',
      key: 'gender',
      width: '10%',
    },
    {
      title: 'Адрес',
      dataIndex: 'address',
      key: 'address',
      width: '40%',
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
      defaultFilteredValue: isActive !== undefined ? [(+isActive).toString()] : undefined,
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
  if (onRemove !== undefined) {
    columns.push({
      key: 'remove',
      render: (v, record) => {
        return (
          <Button
            style={{ color: 'red', backgroundColor: 'white' }}
            size="small"
            type="link"
            // shape="circle"
            icon={<DeleteRowOutlined />}
            disabled={!record.isActive || !onRemove}
            onClick={(e) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              e.stopPropagation();
              if (onRemove) onRemove(record);
            }}
          />
        );
      },
      width: '5%',
    });
  }

  // const handleTableChange = (
  //   pagination: TablePaginationConfig,
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   filters: Record<string, FilterValue | null>,
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   sorter: SorterResult<IPatient> | SorterResult<IPatient>[],
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
  // const onSearch = (value: string) => {
  //   setPage(0);
  //   setFilter(value);
  // };
  // const onAddClick = () => {
  //   navigate('/patients/add', { replace: true });
  // };
  return (
    <MyTable
      columns={columns}
      dataSourseQuery={dataSourseQuery}
      onRowClick={onRowClick}
      extraOptions={extraOptions}
      hasPagination={hasPagination}
      hasSearch={hasSearch}
      reduser={reduser}
      slice={slice}
    />
  );
};

PatientsTable.defaultProps = {
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
  onRemove: undefined,
  onRowClick: undefined,
};

export default PatientsTable;
