// import { Box, Container } from '@mui/material';
// import Layout, { Content /* , Header */, Header } from 'antd/lib/layout/layout';
import React /* useEffect, useState */ from 'react';
import { Typography, Table, /* ConfigProvider, theme, */ Row, Col, Button, Input } from 'antd';
// import RolesAuthRoute from '../components/RolesAuthRoute';
// import ResponsiveAppBar from '../components/AppBar/AppBar';
// import type { FilterValue, SorterResult } from 'antd/es/table/interface';

// import 'antd/dist/reset.css';
// import qs from 'qs';

import type { ColumnsType, TablePaginationConfig /* , TablePaginationConfig */ } from 'antd/es/table';
// import ruRU from 'antd/es/locale/ru_RU';
// import { useNavigate } from 'react-router-dom';
// import { current } from '@reduxjs/toolkit';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import { useNavigate } from 'react-router-dom';
// import AppBar from '../components/Header/Header';
import classes from './style.module.scss';
import { patientsAPI } from '../app/services';
import { IPatient } from '../models';
import { addClass } from '../app/common';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { patientTableSlice } from '../app/reducers';

// const { Title } = Typography;
const { Search } = Input;

const Patients = () => {
  // const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { limit, page, filter } = useAppSelector((state) => state.patientTableReducer);
  const { data, isLoading } = patientsAPI.useGetQuery({ limit, page, filter });

  const columns: ColumnsType<IPatient> = [
    {
      title: 'Номер карты',
      dataIndex: 'number',
      key: 'number',
      width: '10%',
    },
    {
      title: 'ФИО',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
      render: (x, record) => {
        return `${record.surname} ${record.name} ${record.patronymic}`;
      },
    },
    {
      title: 'Дата рождения',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      width: '15%',
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
      width: '35%',
    },
  ];
  const { setPage, setLimit, setFilter } = patientTableSlice.actions;

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<IPatient> | SorterResult<IPatient>[],
  ) => {
    console.log(pagination, filters, sorter);
    dispatch(setPage(pagination.current ? pagination.current - 1 : 0));
    dispatch(setLimit(pagination.pageSize ? pagination.pageSize : -1));

    // setTableParams({
    //   pagination,
    //   filters,
    //   ...sorter,
    // });
  };
  const onSearch = (value: string) => {
    dispatch(setFilter(value));
    console.log(value);
  };
  const onAddClick = () => {
    navigate('/patients/add', { replace: true });
  };
  // console.log(props);
  // // eslint-disable-next-line react/destructuring-assignment
  // if (props?.location?.state?.add === true) {
  //   messageApi.open({
  //     type: 'success',
  //     content: 'Пациент успешно добавлен',
  //     // onClose: () => navigate('/patients', { replace: true, state: { add: true } }),
  //     // 'Ошибка связи с сервером',
  //   });
  // }

  // const addClass = (...cs: string[]): string =>
  //   cs.reduce((res, current) => (res === '' ? classes[current] : `${res} ${classes[current]}`), '');
  // const navigate = useNavigate();
  return (
    <>
      {/* {contextHolder} */}
      <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '10px' }}>
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
      </Row>
      <Search
        allowClear
        placeholder="Введите текст поиска"
        onSearch={onSearch}
        enterButton
        style={{ marginBottom: '15px' }}
      />
      <Table
        bordered
        size="small"
        columns={columns}
        rowKey={(record) => record.number}
        dataSource={data?.data}
        pagination={{
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
              // alert(record._id);
              navigate(`/patients/${record._id}/info`);
              // alert(record.number);
            },
          };
        }}
        className={addClass(classes, 'patients-table')}
        onChange={handleTableChange}
        // onChange={handleTableChange}
      />
    </>
    // <ConfigProvider
    //   locale={ruRU}
    //   theme={{
    //     algorithm: [theme.defaultAlgorithm],
    //     token: {
    //       colorFillAlter: '#1677FF', // '#25ab25', // '#a5cdff',
    //       colorPrimary: '#1677FF',
    //       // colorTextHeading: '#FFFFFF',
    //     },
    //     components: {
    //       Table: {
    //         colorTextHeading: '#FFFFFF',
    //       },
    //     },
    //   }}
    // >
    //   <Layout className={addClass(classes, 'page-layout')}>
    //     {/* <AppBar defaultActiveKey="patients" /> */}
    //     {/* <Header style={{ backgroundColor: '#ffffff', lineHeight: '0px' }} className={addClass('site-layout-header')}>
    //     <AppBar defaultActiveKey="patients" />
    //     </Header> */}
    //     <Header className={addClass(classes, 'header')}>
    //       <AppBar defaultActiveKey="patients" />
    //     </Header>
    //     <Content className={addClass(classes, 'content')}>
    //       <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '10px' }}>
    //         <Col>
    //           <Typography.Title level={1} style={{ margin: 0 }}>
    //             Пациенты
    //           </Typography.Title>
    //         </Col>
    //         <Col>
    //           <Button type="link" onClick={onAddClick}>
    //             Добавить пациента
    //           </Button>
    //         </Col>
    //       </Row>
    //       <Search
    //         allowClear
    //         placeholder="Введите текст поиска"
    //         onSearch={onSearch}
    //         enterButton
    //         style={{ marginBottom: '15px' }}
    //       />
    //       <Table
    //         bordered
    //         size="small"
    //         columns={columns}
    //         rowKey={(record) => record.number}
    //         dataSource={data?.data}
    //         pagination={{
    //           current: page + 1,
    //           pageSize: limit,
    //           total: data?.count,
    //           pageSizeOptions: [10, 20, 50, 100],
    //           showSizeChanger: true,
    //         }}
    //         loading={isLoading}
    //         onRow={(record) => {
    //           return {
    //             onClick: () => {
    //               alert(record.number);
    //             },
    //           };
    //         }}
    //         className={addClass(classes, 'patients-table')}
    //         onChange={handleTableChange}
    //         // onChange={handleTableChange}
    //       />
    //     </Content>
    //   </Layout>
    // </ConfigProvider>
    // <RolesAuthRoute roles={['admin', 'user']}>
  );
};

export default Patients;
