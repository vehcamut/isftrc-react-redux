import React, { useState } from 'react';
import { Typography, Row, Col, Button, message, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { patientsAPI } from '../app/services';
import AddPatientForm from '../components/AddPatientForm/AddPatientForm';
import { mutationErrorHandler } from '../app/common';

const AddPatient = () => {
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
        <Col>
          <Typography.Title level={1} style={{ margin: 0 }}>
            Добавление нового пациента
          </Typography.Title>
        </Col>
      </Row>
      {isAdded ? (
        <Result
          status="success"
          title="Пациент был успешно добавлен"
          extra={[
            <Button type="primary" key="back" onClick={onBack} style={{ width: '160px' }}>
              К списку пациентов
            </Button>,
            <Button key="addagain" onClick={onAddAgain} style={{ width: '160px' }}>
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

export default AddPatient;
