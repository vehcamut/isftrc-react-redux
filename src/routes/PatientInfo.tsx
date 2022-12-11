/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Typography, Row, Col, Button, Tabs, message, Spin, Descriptions, Modal } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import classes from './style.module.scss';
import './antd.rewrite.scss';
import { patientsAPI } from '../app/services';
import { addClass } from '../app/common';
import AddPatientForm from '../components/AddPatientForm/AddPatientForm';
import PatinentDescription from '../components/PatinentDescription/PatinentInfo';

const PatientInfo = () => {
  // const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const params = useParams();
  const { data: patient, isLoading } = patientsAPI.useGetByIdQuery({ id: params?.id || '' });
  // const [updatePatient] = patientsAPI.useUpdateMutation();

  // const onFinish = async (values: any) => {
  //   try {
  //     await updatePatient({ ...patient, ...values }).unwrap();
  //     messageApi.open({
  //       type: 'success',
  //       content: 'Данные пациента успешно обновлены',
  //     });
  //   } catch (e) {
  //     messageApi.open({
  //       type: 'error',
  //       content: 'Ошибка связи с сервером',
  //     });
  //   }
  // };
  // const onReset = () => {
  //   setOpen(false);
  // };
  // const onEdit = () => {
  //   setOpen(true);
  // };

  const onAddClick = () => {
    navigate('/patients', { replace: true });
  };

  const onChange = (key: string) => {
    navigate(`./../${key}`, { replace: true });
  };

  return (
    <>
      {contextHolder}
      <Spin tip={<div style={{ marginTop: '10px', width: '100%' }}>Загрузка...</div>} size="large" spinning={isLoading}>
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
                : 'Пациент'}
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
          items={[
            {
              label: 'Данные',
              key: 'info',
              children: <PatinentDescription patient={patient} />,
            },
            { label: 'Курсы', key: 'shedules' },
            { label: 'Расписание', key: 'patients' },
            { label: 'Документы', key: 'representatives' },
          ]}
        />
      </Spin>
    </>
  );
};

export default PatientInfo;
