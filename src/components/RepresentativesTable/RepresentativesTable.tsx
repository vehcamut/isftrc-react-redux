/* eslint-disable @typescript-eslint/indent */
import React, { FunctionComponent, PropsWithChildren } from 'react';
import { Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteRowOutlined, FilterFilled } from '@ant-design/icons';
import classes from './RepresentativesTable.module.scss';
import { IRepresentative } from '../../models';
import { addClass } from '../../app/common';
import { useAppSelector } from '../../app/hooks';
import MyTable from '../MyTable/MyTable';

interface RepresentativesTableProps extends PropsWithChildren {
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

const RepresentativesTable: FunctionComponent<RepresentativesTableProps> = ({
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
  const { roles } = useAppSelector((state) => state.authReducer);
  const isAdmin = roles.find((r) => r === 'admin');
  const isActive = slice && reduser ? reduser.isActive : tableState.isActive;
  const columns: ColumnsType<IRepresentative> = [
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
  if (isAdmin)
    columns.unshift({
      title: 'Логин',
      dataIndex: 'login',
      key: 'login',
      width: '10%',
    });
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

RepresentativesTable.defaultProps = {
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

export default RepresentativesTable;
