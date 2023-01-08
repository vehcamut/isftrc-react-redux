/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { Typography, Table, Row, Col, Button, Input } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import { useNavigate } from 'react-router-dom';
import { FilterFilled } from '@ant-design/icons';
import classes from './PatientsTable.module.scss';
import { patientsAPI } from '../../app/services';
import { IPatient, IRepresentative } from '../../models';
import { addClass } from '../../app/common';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { patientTableSlice } from '../../app/reducers';

const { Search } = Input;

interface PatientsTableProps extends PropsWithChildren {
  onRowClick: (record: any) => void;
  // eslint-disable-next-line react/require-default-props
  representative?: IRepresentative;
}

const PatientsTable: FunctionComponent<PatientsTableProps> = ({ onRowClick, representative }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState('');
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);

  const { data, isLoading } = patientsAPI.useGetQuery({
    limit,
    page,
    filter,
    isActive,
    representativeId: representative?._id,
  });

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

  const handleTableChange = (
    pagination: TablePaginationConfig,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    filters: Record<string, FilterValue | null>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sorter: SorterResult<IPatient> | SorterResult<IPatient>[],
  ) => {
    if (filters?.isActive) {
      if (filters?.isActive.length > 1) setIsActive(undefined);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      else filters.isActive[0] ? setIsActive(true) : setIsActive(false);
    } else setIsActive(undefined);
    // console.log(pagination, filters, sorter);
    setPage(pagination.current ? pagination.current - 1 : 0);
    setLimit(pagination.pageSize ? pagination.pageSize : -1);
  };
  const onSearch = (value: string) => {
    setPage(0);
    setFilter(value);
  };
  const onAddClick = () => {
    navigate('/patients/add', { replace: true });
  };

  return (
    <>
      {/* <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Col>
          <Typography.Title level={1} style={{ margin: 0 }}>
            Пациенты
          </Typography.Title>
        </Col>
        <Col>
          <Button type="link" onClick={onAddClick}>
            Добавить пациента
          </Button>
        </Col>
      </Row> */}
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
        rowKey={(record) => record.number}
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
        // onRow={(record) => {
        //   return {
        //     onClick: () => {
        //       navigate(`/patients/${record._id}/info`);
        //     },
        //   };
        // }}
        onRow={(record) => {
          return {
            onClick: () => {
              onRowClick(record);
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

export default PatientsTable;
