/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createRef } from 'react';
import { Typography, Table, Row, Col, Button, Input, Card, Empty, Descriptions, InputRef, Pagination } from 'antd';
import type { PaginationProps } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import { useNavigate } from 'react-router-dom';
import { FilterFilled, SelectOutlined } from '@ant-design/icons';
import classes from '../style.module.scss';
import { patientsAPI } from '../../app/services';
import { IPatient } from '../../models';
import { addClass } from '../../app/common';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { patientTableSlice } from '../../app/reducers';

const { Search } = Input;

const MPatients = () => {
  const remoteInput = createRef<InputRef>();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { limit, page, filter, isActive } = useAppSelector((state) => state.patientTableReducer);
  const { data, isLoading } = patientsAPI.useGetPatientsQuery({ limit, page, filter, isActive });

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
  const { setPage, setLimit, setFilter, setIsActive } = patientTableSlice.actions;

  const onChange: PaginationProps['onChange'] = (page1: number, pageSize: number) => {
    dispatch(setPage(page1 ? page1 - 1 : 0));
    // eslint-disable-next-line no-restricted-globals
    scroll(0, 0);
  };

  const handleTableChange = (
    pagination: TablePaginationConfig,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    filters: Record<string, FilterValue | null>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sorter: SorterResult<IPatient> | SorterResult<IPatient>[],
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
    remoteInput.current?.blur();
    // const input = this?.input?.current;
    // input?.blur();

    // if ('virtualKeyboard' in navigator) {
    //   const x: any = navigator.virtualKeyboard;
    //   x.hide();
    // }
    // VirtualKeyboard.hide();
  };
  const onAddClick = () => {
    navigate('/patients/add', { replace: true });
  };

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Col span={24} style={{ alignItems: 'center', textAlign: 'center' }}>
          <Typography.Title level={2} style={{ margin: 0 }}>
            Пациенты
          </Typography.Title>
        </Col>
        <Col span={24} style={{ alignItems: 'center', textAlign: 'center' }}>
          <Button type="link" onClick={onAddClick}>
            Добавить пациента
          </Button>
        </Col>
      </Row>
      {/* <Input /> */}
      <Search
        onPressEnter={(e: any) => onSearch(e.target?.defaultValue)}
        ref={remoteInput}
        allowClear
        placeholder="Введите текст поиска"
        onSearch={onSearch}
        enterButton
        style={{ marginBottom: '15px' }}
      />
      {data?.count !== 0 ? (
        data?.data.map((patient) => (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <Card
            key={patient._id}
            size="small"
            title={`${patient.number} ${patient.surname} ${patient.name} ${patient.patronymic}`}
            // extra={
            //   <Button
            //     type="link"
            //     icon={<SelectOutlined />}
            //     onClick={() => {
            //       navigate(`/patients/${patient._id}/info`);
            //     }}
            //   />
            // }
            onClick={() => {
              navigate(`/patients/${patient._id}/info`);
            }}
            style={{ width: '100%', marginBottom: '5px' }}
            // headStyle={patient.isActive ? { backgroundColor: 'green' } : { backgroundColor: 'red' }}
          >
            <Descriptions column={3}>
              <Descriptions.Item label="Дата рождения" span={3}>
                {new Date(patient.dateOfBirth).toLocaleString('ru', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                })}
              </Descriptions.Item>
              <Descriptions.Item label="Пол" span={3}>
                {patient.gender}
              </Descriptions.Item>
              <Descriptions.Item label="Адрес" span={3}>
                {patient.address}
              </Descriptions.Item>
              <Descriptions.Item label="Статус" span={3}>
                {patient.isActive ? (
                  <div className={addClass(classes, 'active-table-item__active')}>активен</div>
                ) : (
                  <div className={addClass(classes, 'active-table-item__not-active')}>неактивен</div>
                )}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        ))
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Пациенты не найдены"
          style={{ backgroundColor: 'white', margin: 0, padding: '40px', borderRadius: '5px' }}
        />
      )}
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '10px' }}>
        <Pagination
          current={page + 1}
          pageSize={limit}
          total={data?.count}
          size="small"
          onChange={onChange}
          hideOnSinglePage
          showSizeChanger
        />
      </div>
      {/* <Pagination
        // pageSizeOptions={}
        defaultCurrent={1}
        current={page + 1}
        pageSize={limit}
        total={data?.count}
        size="small"
        pageSizeOptions={[10, 20, 50, 100]}
        showSizeChanger
        showQuickJumper
        hideOnSinglePage
        onShowSizeChange={(current, pageSize) => console.log(current)}
        onChange={(page1: any) => console.log(page1)}
      /> */}

      {/* <Table
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
        onRow={(record) => {
          return {
            onClick: () => {
              navigate(`/patients/${record._id}/info`);
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

export default MPatients;
