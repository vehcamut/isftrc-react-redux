import React, { useState } from 'react';
import { Typography, /* ConfigProvider, theme, */ Row, Col, Button, message, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { patientsAPI } from '../../app/services';
import { mutationErrorHandler } from '../../app/common';
import AddPatientForm from '../../components/AddPatientForm/AddPatientForm';

const MAddPatient = () => {
  const [isAdded, setIsAdded] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [addPatient] = patientsAPI.useAddPatientMutation();
  const navigate = useNavigate();

  const onAddAgain = () => {
    setIsAdded(false);
  };

  const onBack = () => {
    navigate('/patients');
  };

  const onFinish = async (values: any) => {
    try {
      await addPatient(values).unwrap();
      setIsAdded(true);
    } catch (e) {
      mutationErrorHandler(messageApi, e);
    }
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
      </Row>
      {isAdded ? (
        <Result
          status="success"
          title="Пациент был успешно добавлен"
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
