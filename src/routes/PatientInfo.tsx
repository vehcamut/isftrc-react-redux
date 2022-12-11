/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import { Box, Container } from '@mui/material';
// import Layout, { Content /* , Header */, Header } from 'antd/lib/layout/layout';
import React, { useLayoutEffect, useState, useEffect, useMemo /* useState */ } from 'react';
import {
  Typography,
  Table,
  /* ConfigProvider, theme, */ Row,
  Col,
  Button,
  Input,
  Tabs,
  Menu,
  Layout,
  message,
  Space,
  Spin,
  Skeleton,
  Form,
  Descriptions,
  Modal,
} from 'antd';
// import RolesAuthRoute from '../components/RolesAuthRoute';
// import ResponsiveAppBar from '../components/AppBar/AppBar';
// import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { Sticky, StickyContainer } from 'react-sticky';

// import 'antd/dist/reset.css';
// import qs from 'qs';
import debounce from 'lodash.debounce';

import type { ColumnsType, TablePaginationConfig /* , TablePaginationConfig */ } from 'antd/es/table';
// import ruRU from 'antd/es/locale/ru_RU';
// import { useNavigate } from 'react-router-dom';
// import { current } from '@reduxjs/toolkit';
import { FilterValue, SorterResult } from 'antd/es/table/interface';
import { useNavigate, useParams } from 'react-router-dom';
// import AppBar from '../components/Header/Header';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { TabsProps, MenuProps } from 'antd';
import dayjs from 'dayjs';
import classes from './style.module.scss';
import './antd.rewrite.scss';
import { patientsAPI } from '../app/services';
import { IPatient } from '../models';
import { addClass } from '../app/common';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { patientTableSlice } from '../app/reducers';
import AddPatientForm from '../components/AddPatientForm/AddPatientForm';
// import { FALSE } from 'sass';
// const { Title } = Typography;
const { Search } = Input;
const { Header, Sider, Content } = Layout;
// type MenuItem = Required<MenuProps>['items'][number];

// function getItem(
//   label: React.ReactNode,
//   key: React.Key,
//   icon?: React.ReactNode,
//   children?: MenuItem[],
//   type?: 'group',
// ): MenuItem {
//   return {
//     key,
//     icon,
//     children,
//     label,
//     type,
//   } as MenuItem;
// }

// const items: MenuProps['items'] = [
//   getItem('Navigation One', 'sub1', <MailOutlined />, [
//     getItem('Item 1', 'g1', null, [getItem('Option 1', '1'), getItem('Option 2', '2')], 'group'),
//     getItem('Item 2', 'g2', null, [getItem('Option 3', '3'), getItem('Option 4', '4')], 'group'),
//   ]),

//   getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
//     getItem('Option 5', '5'),
//     getItem('Option 6', '6'),
//     getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
//   ]),

//   getItem('Navigation Three', 'sub4', <SettingOutlined />, [
//     getItem('Option 9', '9'),
//     getItem('Option 10', '10'),
//     getItem('Option 11', '11'),
//     getItem('Option 12', '12'),
//   ]),

//   getItem('Group', 'grp', null, [getItem('Option 13', '13'), getItem('Option 14', '14')], 'group'),
// ];
const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar) => (
  <Sticky bottomOffset={80}>
    {({ style }) => (
      <DefaultTabBar {...props} className={addClass(classes, 'site-custom-tab-bar')} style={{ ...style }} />
    )}
  </Sticky>
);

const PatientInfo = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  // const userName = Form.useWatch('addPatient', form);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const params = useParams();
  // const [isDisabled, setIsDisabled] = useState(true);
  const isDisabled = true;
  const setIsDisabled = (value: any) => {
    console.log('dfdsfdsfds');
  };
  // const [patientId, setPatientId] = useState({ id: params?.id || '' });
  // console.log(isActive);
  // console.log(params);
  const {
    data: patient,
    isLoading,
    currentData,
    requestId: temp,
  } = patientsAPI.useGetByIdQuery({ id: params?.id || '' });
  // const { data: patient, isLoading } = patientsAPI.useGetByIdQuery(patientId);
  const [updatePatient] = patientsAPI.useUpdateMutation();
  // console.log(userName);
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

  const onFinish = async (values: any) => {
    console.log('FINISH');
    try {
      await updatePatient({ ...patient, ...values }).unwrap();
      // setIsAdded(true);
      // navigate('/patients', { replace: true });
      messageApi.open({
        type: 'success',
        content: 'Данные пациента успешно обновлены',
        // onClose: () => navigate('/patients', { replace: true, state: { add: true } }),
        // 'Ошибка связи с сервером',
      });
      setIsDisabled(true);
      // navigate('/patients', { replace: true });
    } catch (e) {
      messageApi.open({
        type: 'error',
        content: 'Ошибка связи с сервером',
        // 'Ошибка связи с сервером',
      });
      // console.log('ERROR!');
    }
    // const resp = await addPatient(values);
    // console.log(x);
    // // console.log('Success:', values);
    // // console.log(JSON.stringify(values));
    // navigate('/patients', { replace: true });
  };
  const onActivate = () => {
    // setPatientId

    setIsDisabled(false);
    console.log('ACTIVE');
  };
  const onReset = () => {
    setOpen(false);
    // console.log(dayjs('Mon, 21 Jan 2008 00:00:00 GMT'));
    // form.setFieldsValue({
    //   ...patient,
    //   // dateOfBirth: patient?.dateOfBirth ? dayjs(patient.dateOfBirth) : undefined,
    // });
    // setPatientId(patientId);
    // setIsDisabled(true);
    // navigate('./', { replace: true });
    // dispatch(patientsAPI.util.invalidateTags(['patients']));

    // navigate('/patients', { replace: true });
  };
  const onEdit = () => {
    setOpen(true);
    console.log('value');
  };
  const onSearch = (value: string) => {
    dispatch(setFilter(value));
    console.log(value);
  };
  const onAddClick = () => {
    // form.setFieldsValue({ surname: 'sds' });
    navigate('/patients', { replace: true });
  };

  const onChange = (key: string) => {
    console.log(key);
    navigate(`./../${key}`, { replace: true });
  };
  // form.setFieldsValue({
  //   ...patient,
  //   dateOfBirth: patient?.dateOfBirth ? dayjs(patient.dateOfBirth) : undefined,
  // });

  // useEffect(() => {
  //   // console.log('EFFECT');
  //   form.setFieldsValue({
  //     ...patient,
  //     dateOfBirth: patient?.dateOfBirth ? dayjs(patient.dateOfBirth) : undefined,
  //   });
  // }, [patient, form]);

  // useMemo(() => {
  //   form.setFieldsValue({
  //     ...patient,
  //     dateOfBirth: patient?.dateOfBirth ? dayjs(patient.dateOfBirth) : undefined,
  //   });
  // }, [patient, form]);
  return (
    <>
      {contextHolder}
      <Spin
        delay={10}
        tip={<div style={{ marginTop: '10px', width: '100%' }}>Загрузка...</div>}
        size="large"
        // style={{ left: '49.5%' }}
        spinning={isLoading}
      >
        <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '10px' }}>
          <Col>
            <Typography.Title level={2} style={{ margin: 0 }}>
              {!isLoading && patient
                ? `Пациент №${patient?.number}. ` +
                  `${patient?.surname} ${patient?.name.slice(0, 1)}.` +
                  `${patient?.patronymic.slice(0, 1)}.` +
                  ` ${new Date(patient?.dateOfBirth || '').toLocaleString('ru', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                  })}`
                : // ` ${patient?.dateOfBirth?.format('DD.MM.YYYY')}` :
                  'Пациент'}
            </Typography.Title>
          </Col>
          <Col>
            <Button type="link" onClick={onAddClick}>
              К списку
            </Button>
          </Col>
        </Row>
        <Tabs
          size="small"
          onChange={onChange}
          type="line"
          tabPosition="left"
          // className={addClass(classes, 'site-custom-tab-bar')}
          items={[
            {
              label: 'Данные',
              key: 'info',
              children: (
                <>
                  <Modal
                    destroyOnClose
                    open={open}
                    footer={null}
                    title={
                      <Typography.Title level={2} style={{ margin: 0, marginBottom: '20px' }}>
                        Обновление данных пациента
                      </Typography.Title>
                    }
                    // transitionName=""
                    // "Обновление данных пациента"
                    // okText="Create"
                    width="100%"
                    // cancelText="Cancel"
                    onCancel={onReset}
                    // onOk={() => {
                    //   form
                    //     .validateFields()
                    //     .then((values) => {
                    //       form.resetFields();
                    //       // onCreate(values);
                    //     })
                    //     .catch((info) => {
                    //       console.log('Validate Failed:', info);
                    //     });
                    // }}
                  >
                    <AddPatientForm
                      form={form}
                      disabled={isDisabled}
                      onFinish={onFinish}
                      onReset={onReset}
                      onActivate={onActivate}
                      defaultValue={patient}
                      temp={temp}
                    />
                  </Modal>
                  <Descriptions
                    bordered
                    // layout="vertical"
                    size="middle"
                    contentStyle={{ backgroundColor: '#ffffff' }}
                    labelStyle={{
                      color: '#ffffff',
                      // borderRadius: '20px',
                      // marginRight: '10px',
                      borderRight: '5px solid #e6f4ff',
                      /* backgroundColor: 'red', */ width: '150px',
                    }}
                    title="Личные данные пациента"
                    column={1}
                    extra={
                      <Button type="primary" onClick={onEdit}>
                        Редактировать
                      </Button>
                    }
                  >
                    <Descriptions.Item label="Фамилия" className={addClass(classes, 'des-item')}>
                      {patient?.surname}
                    </Descriptions.Item>
                    <Descriptions.Item label="Имя" className={addClass(classes, 'des-item')}>
                      {patient?.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Отчество" className={addClass(classes, 'des-item')}>
                      {patient?.patronymic}
                    </Descriptions.Item>
                    <Descriptions.Item label="Пол" className={addClass(classes, 'des-item')}>
                      {patient?.gender}
                    </Descriptions.Item>
                    <Descriptions.Item label="Дата рождения" className={addClass(classes, 'des-item')}>
                      {new Date(patient?.dateOfBirth || '').toLocaleString('ru', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                      })}
                    </Descriptions.Item>
                    <Descriptions.Item label="Адрес" className={addClass(classes, 'des-item')}>
                      {patient?.address}
                    </Descriptions.Item>
                    <Descriptions.Item label="Примечание">{patient?.note}</Descriptions.Item>
                  </Descriptions>
                </>

                // <AddPatientForm
                //   form={form}
                //   disabled={isDisabled}
                //   onFinish={onFinish}
                //   onReset={onReset}
                //   onActivate={onActivate}
                //   defaultValue={currentData}
                //   temp={temp}
                // />
              ),
            },
            { label: 'Курсы', key: 'shedules' },
            { label: 'Расписание', key: 'patients' },
            { label: 'Документы', key: 'representatives' },
          ]}
        />
      </Spin>

      {/* <Menu
        onClick={onClick}
        style={{ width: 256 }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        items={items}
      /> */}
      {/* <StickyContainer>
        <Tabs
          tabBarStyle={{ marginTop: '10px' }}
          size="small"
          onChange={onChange}
          // type="card"
          tabPosition="left"
          renderTabBar={renderTabBar}
          items={new Array(3).fill(null).map((_, i) => {
            const id = String(i + 1);
            return {
              label: <div style={{ backgroundColor: '#ffffff', height: '100%' }}>Tab {id}</div>,
              key: id,
              children: `Content of Tab Pane ${id}`,
            };
          })}
        />
      </StickyContainer> */}
      {/* {contextHolder} */}
      {/* <Search
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
              alert(record.number);
            },
          };
        }}
        className={addClass(classes, 'patients-table')}
        onChange={handleTableChange}
        // onChange={handleTableChange}
      /> */}
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

export default PatientInfo;
