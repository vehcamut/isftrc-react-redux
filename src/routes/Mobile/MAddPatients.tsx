/* eslint-disable @typescript-eslint/no-unused-vars */
// import { Box, Container } from '@mui/material';
// import Layout, { Content /* , Header */, Header } from 'antd/lib/layout/layout';
import React, {
  FunctionComponent,
  PropsWithChildren /* useEffect, useState, */ /* useMemo */,
  useEffect,
  useState,
} from 'react';
import debounce from 'lodash.debounce';
import {
  Typography,
  Table,
  /* ConfigProvider, theme, */ Row,
  Col,
  Button,
  Input,
  Radio,
  Form,
  DatePicker,
  AutoComplete,
  Spin,
  message,
  Alert,
  Result,
} from 'antd';
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
// import locale from 'antd/es/date-picker/locale/ru_RU';
// import { DefaultOptionType } from 'antd/es/select';
import classes from '../style.module.scss';
import { dadataAPI, patientsAPI } from '../../app/services';
import { IPatient } from '../../models';
import { addClass } from '../../app/common';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
// import { addPatientSlice, patientTableSlice } from '../../app/reducers';
import AddPatientForm from '../../components/AddPatientForm/AddPatientForm';

const MAddPatient = () => {
  const [isAdded, setIsAdded] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [addPatient] = patientsAPI.useAddPatientMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onAddClick = () => {
    navigate('/patients/add');
  };

  const onAddAgain = () => {
    setIsAdded(false);
    // navigate('/patients/add', { replace: true });
  };

  const onBack = () => {
    navigate('/patients');
  };

  const onFinish = async (values: any) => {
    try {
      await addPatient(values).unwrap();
      setIsAdded(true);
      // navigate('/patients', { replace: true });
      // messageApi.open({
      //   type: 'success',
      //   content: 'Пациент успешно добавлен',
      //   onClose: () => navigate('/patients', { replace: true, state: { add: true } }),
      //   // 'Ошибка связи с сервером',
      // });
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

  const onReset = () => {
    navigate('/patients', { replace: true });
  };

  return (
    <>
      {contextHolder}
      <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '20px' }}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Typography.Title level={2} style={{ margin: 0 }}>
            Добавление пациента
          </Typography.Title>
        </Col>
        {/* <Col>
          <Button type="link" onClick={onAddClick}>
            Добавить пациента
          </Button>
        </Col> */}
      </Row>
      {isAdded ? (
        <Result
          status="success"
          title="Пациент был успешно добавлен"
          // subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
          extra={[
            <Button type="primary" key="back" onClick={onBack} style={{ width: '130px' }}>
              К списку
            </Button>,
            <Button key="addagain" onClick={onAddAgain} style={{ width: '130px' }}>
              Добавить еще
            </Button>,
          ]}
        />
      ) : (
        <AddPatientForm onFinish={onFinish} onReset={onReset} />
      )}
    </>
  );
};

export default MAddPatient;
