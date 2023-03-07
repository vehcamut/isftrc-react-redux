import React, { useState } from 'react';
import { Typography, Row, Col, Button, message, Result } from 'antd';

import { useNavigate } from 'react-router-dom';
import UserForm from '../components/UserForm/UserForm';
import { adminsAPI } from '../app/services/admins.service';
import { mutationErrorHandler } from '../app/common';

const AddAdmins = () => {
  const [isAdded, setIsAdded] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [addAdmin] = adminsAPI.useAddAdminMutation();
  const navigate = useNavigate();

  const onAddAgain = () => {
    setIsAdded(false);
  };

  const onBack = () => {
    navigate('/admins');
  };

  const onFinish = async (values: any) => {
    try {
      await addAdmin(values).unwrap();
      setIsAdded(true);
    } catch (e: any) {
      mutationErrorHandler(messageApi, e);
    }
  };

  const onReset = () => {
    navigate('/admins', { replace: true });
  };

  return (
    <>
      {contextHolder}
      <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '20px' }}>
        <Col>
          <Typography.Title level={1} style={{ margin: 0 }}>
            Добавление нового администратора
          </Typography.Title>
        </Col>
      </Row>
      {isAdded ? (
        <Result
          status="success"
          title="Специалист был успешно добавлен"
          extra={[
            <Button type="primary" key="back" onClick={onBack} style={{ width: '200px' }}>
              К списку администраторов
            </Button>,
            <Button key="addagain" onClick={onAddAgain} style={{ width: '200px' }}>
              Добавить еще
            </Button>,
          ]}
        />
      ) : (
        <UserForm onFinish={onFinish} onReset={onReset} userType="admin" />
      )}
    </>
  );
};

export default AddAdmins;
