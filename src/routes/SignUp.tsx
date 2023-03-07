/* eslint-disable @typescript-eslint/indent */
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button, Col, Result, Row, Typography, message } from 'antd';
import { useAppSelector } from '../app/hooks';
import { representativesAPI } from '../app/services';
import UserForm from '../components/UserForm/UserForm';
import { mutationErrorHandler } from '../app/common';

const SignUp: FunctionComponent<PropsWithChildren> = () => {
  const [isAdded, setIsAdded] = useState(false);
  const [addRepresentative] = representativesAPI.useAddRepresentativeMutation();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { isAuth, isMobile } = useAppSelector((state) => state.authReducer);

  const onFinish = async (values: any) => {
    try {
      await addRepresentative(values).unwrap();
      setIsAdded(true);
    } catch (e: any) {
      mutationErrorHandler(messageApi, e);
    }
  };

  const onReset = () => {
    navigate('/auth/signin', { replace: true });
  };

  return isAuth ? (
    <Navigate to="/" />
  ) : (
    <>
      {contextHolder}
      <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '20px' }}>
        <Col style={isMobile ? { textAlign: 'center', width: '100%' } : undefined}>
          <Typography.Title level={isMobile ? 2 : 1} style={{ margin: 0 }}>
            Регистрация
          </Typography.Title>
        </Col>
      </Row>
      {isAdded ? (
        <Result
          status="success"
          title="Вы успешно зарегистрировались!"
          subTitle="Для входа используйте введеные логин и пароль"
          extra={[
            <Button type="primary" key="back" onClick={onReset} style={{ width: '200px' }}>
              ОК
            </Button>,
          ]}
        />
      ) : (
        <UserForm onFinish={onFinish} onReset={onReset} userType="representative" reg />
      )}
    </>
  );
};

export default SignUp;
