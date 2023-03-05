/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button, Col, Divider, Form, Input, Result, Row, Typography, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../app/hooks';
// import LoginForm from '../components/LoginForm';
import { authSlice } from '../app/reducers';
import { authAPI, representativesAPI } from '../app/services';
import getTokenPayload from '../app/tokenHendler';
import UserForm from '../components/UserForm/UserForm';

const { Title } = Typography;
const SignUp: FunctionComponent<PropsWithChildren> = () => {
  const [isAdded, setIsAdded] = useState(false);
  const [addRepresentative] = representativesAPI.useAddRepresentativeMutation();
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuth, isMobile /* roles */ } = useAppSelector((state) => state.authReducer);
  const { setIsAuth, setRoles, setName } = authSlice.actions;
  const [signin] = authAPI.useSigninMutation();
  // const onFinish = async (values: any) => {
  //   const { login, password } = values;
  //   // const password = values.password;
  //   try {
  //     // await signIN({ login, password }).unwrap();
  //     await signin({ login, password }).unwrap();
  //     dispatch(setIsAuth(true));
  //     dispatch(setRoles(getTokenPayload()?.roles || []));
  //     dispatch(setName(getTokenPayload()?.name || ''));
  //     // const payload = getTokenPayload()?.roles;
  //     navigate('/');
  //   } catch (e) {
  //     messageApi.open({
  //       type: 'error',
  //       content: 'Неправильный логин или пароль',
  //     });
  //     // console.log('ERROR!');
  //     // dispatch(setLoginHelper('Неправильный логин или пароль'));
  //   }
  //   // console.log(values);
  // };

  const onFinish = async (values: any) => {
    try {
      await addRepresentative(values).unwrap();
      setIsAdded(true);
    } catch (e: any) {
      console.log(e?.data?.message);
      if (e?.data?.message) {
        messageApi.open({
          type: 'error',
          content: e?.data?.message,
        });
      } else {
        messageApi.open({
          type: 'error',
          content: 'Ошибка связи с сервером',
        });
      }
    }
  };

  const onReset = () => {
    navigate('/auth/signin', { replace: true });
  };

  // console.log(isAuth, isAuth);
  // eslint-disable-next-line no-constant-condition, no-self-compare, @typescript-eslint/no-unused-expressions
  // isAuth ? console.log('/authd') : console.log('/');
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
          // subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
          extra={[
            <Button type="primary" key="back" onClick={onReset} style={{ width: '200px' }}>
              ОК
            </Button>,
          ]}
        />
      ) : (
        <UserForm onFinish={onFinish} onReset={onReset} userType="representative" reg />
        // <AddRepresentativeForm onFinish={onFinish} onReset={onReset} type="add" />
      )}
      {/* <div style={{ height: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
            Или <a href="./">зарегистрируйтесь!</a>
          </Form.Item>
        </Form>
      </div> */}
    </>

    // <Form labelWrap labelCol={{ span: 5 }} wrapperCol={{ span: 17 }} colon={false} /* onFinish={onBeforeFinish} */>
    //   <Form.Item wrapperCol={{ offset: 0, span: 22 }} style={{ marginBottom: 0 }}>
    //     <Row>
    //       <Col span={24} style={{ textAlign: 'right' }}>
    //         <Button
    //           type="primary"
    //           htmlType="submit"
    //           style={{ marginRight: '10px' }}
    //           // className={addClass(classes, 'form-button')}
    //         >
    //           Сохранить
    //         </Button>
    //         <Button htmlType="button" /* onClick={onReset} className={addClass(classes, 'form-button')} */>
    //           Отменить
    //         </Button>
    //       </Col>
    //     </Row>
    //   </Form.Item>
    // </Form>
    // <Grid
    //   container
    //   spacing={0}
    //   direction="column"
    //   alignItems="center"
    //   justifyContent="center"
    //   style={{ minHeight: '100vh' }}
    // >
    //   <Container maxWidth="xs">
    //     <Grid item>
    //       <LoginForm />
    //       {/* <PostContainer /> */}
    //     </Grid>
    //   </Container>
    // </Grid>
  );
};

export default SignUp;
