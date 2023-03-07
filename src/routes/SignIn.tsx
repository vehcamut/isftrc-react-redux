/* eslint-disable @typescript-eslint/indent */
import React, { FunctionComponent, PropsWithChildren } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button, Divider, Form, Input, Typography, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useAppSelector } from '../app/hooks';
import { authAPI } from '../app/services';
import getTokenPayload from '../app/tokenHendler';
import { mutationErrorHandler } from '../app/common';

const { Title } = Typography;
const SignIn: FunctionComponent<PropsWithChildren> = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const { isAuth, isMobile } = useAppSelector((state) => state.authReducer);
  const [signin] = authAPI.useSigninMutation();
  const onFinish = async (values: any) => {
    const { login, password } = values;
    try {
      await signin({ login, password }).unwrap();
      if (getTokenPayload()) {
        localStorage.isAuth = true;
        localStorage.name = getTokenPayload()?.name;
        localStorage.roles = getTokenPayload()?.roles;
        localStorage.id = getTokenPayload()?.sub;
        navigate(0);
      }
    } catch (e) {
      mutationErrorHandler(messageApi, e);
    }
  };

  return isAuth ? (
    <Navigate to="/" />
  ) : (
    <>
      {contextHolder}
      <div
        style={{
          height: isMobile ? '500px' : '600px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Form
          // title="dfd"
          name="normal_login"
          // className="login-form"
          initialValues={{ remember: true }}
          style={{ width: '300px' }}
          onFinish={onFinish}
        >
          <Title level={2} style={{ textAlign: 'center' }}>
            Вход в систему
          </Title>
          <Divider />
          <Form.Item name="login" rules={[{ required: true, message: 'Введите логин!' }]}>
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Логин" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Введите пароль!' }]}>
            <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Пароль" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Войти
            </Button>
            Или{' '}
            <Button
              type="link"
              style={{ margin: 0, padding: 0 }}
              onClick={() => navigate('/auth/signup', { replace: true })}
            >
              зарегистрируйтесь
            </Button>
            !
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default SignIn;
