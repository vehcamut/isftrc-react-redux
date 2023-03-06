import React, { FunctionComponent, PropsWithChildren } from 'react';
import { Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteRowOutlined, FilterFilled } from '@ant-design/icons';
import classes from './PatientsTable.module.scss';
import { IPatient } from '../../models';
import { addClass } from '../../app/common';
import MyTable from '../MyTable/MyTable';

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
            icon={<DeleteRowOutlined />}
            disabled={!record.isActive || !onRemove}
            onClick={(e) => {
              e.stopPropagation();
              if (onRemove) onRemove(record);
            }}
          />
        );
      },
      width: '5%',
    });
  }

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
