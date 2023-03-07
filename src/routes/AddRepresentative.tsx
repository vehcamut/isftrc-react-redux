import React, { useState } from 'react';
import { Typography, /* ConfigProvider, theme, */ Row, Col, Button, message, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { representativesAPI } from '../app/services';
import UserForm from '../components/UserForm/UserForm';
import { mutationErrorHandler } from '../app/common';

const AddRepresentative = () => {
  const [isAdded, setIsAdded] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [addRepresentative] = representativesAPI.useAddRepresentativeMutation();
  const navigate = useNavigate();

  const onAddAgain = () => {
    setIsAdded(false);
  };

  const onBack = () => {
    navigate('/representatives');
  };

  const onFinish = async (values: any) => {
    try {
      await addRepresentative(values).unwrap();
      setIsAdded(true);
    } catch (e: any) {
      mutationErrorHandler(messageApi, e);
    }
  };

  const onReset = () => {
    navigate('/representatives', { replace: true });
  };

  return (
    <>
      {contextHolder}
      <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '20px' }}>
        <Col>
          <Typography.Title level={1} style={{ margin: 0 }}>
            Добавление нового представителя
          </Typography.Title>
        </Col>
      </Row>
      {isAdded ? (
        <Result
          status="success"
          title="Представитель был успешно добавлен"
          extra={[
            <Button type="primary" key="back" onClick={onBack} style={{ width: '200px' }}>
              К списку представителей
            </Button>,
            <Button key="addagain" onClick={onAddAgain} style={{ width: '200px' }}>
              Добавить еще
            </Button>,
          ]}
        />
      ) : (
        <UserForm onFinish={onFinish} onReset={onReset} userType="representative" />
      )}
    </>
  );
};

export default AddRepresentative;
