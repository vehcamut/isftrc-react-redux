import React, { useState } from 'react';
import { Typography, Row, Col, Button, message, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { specialistAPI } from '../app/services/specialists.service';
import UserForm from '../components/UserForm/UserForm';
import { mutationErrorHandler } from '../app/common';

const AddSpecialist = () => {
  const [isAdded, setIsAdded] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [addSpecialist] = specialistAPI.useAddSpecialistMutation();
  const navigate = useNavigate();

  const onAddAgain = () => {
    setIsAdded(false);
  };

  const onBack = () => {
    navigate('/specialists');
  };

  const onFinish = async (values: any) => {
    try {
      await addSpecialist(values).unwrap();
      setIsAdded(true);
    } catch (e: any) {
      mutationErrorHandler(messageApi, e);
    }
  };

  const onReset = () => {
    navigate('/specialists', { replace: true });
  };

  return (
    <>
      {contextHolder}
      <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '20px' }}>
        <Col>
          <Typography.Title level={1} style={{ margin: 0 }}>
            Добавление нового специалиста
          </Typography.Title>
        </Col>
      </Row>
      {isAdded ? (
        <Result
          status="success"
          title="Специалист был успешно добавлен"
          extra={[
            <Button type="primary" key="back" onClick={onBack} style={{ width: '200px' }}>
              К списку специалистов
            </Button>,
            <Button key="addagain" onClick={onAddAgain} style={{ width: '200px' }}>
              Добавить еще
            </Button>,
          ]}
        />
      ) : (
        <UserForm onFinish={onFinish} onReset={onReset} userType="specialist" />
      )}
    </>
  );
};

export default AddSpecialist;
