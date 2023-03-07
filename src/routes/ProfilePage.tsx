import React, { useState } from 'react';
import { Typography, Row, Col, Button, message, Spin, Descriptions, Modal } from 'antd';
import './antd.rewrite.scss';
import { authAPI, representativesAPI, userAPI } from '../app/services';
import UserForm from '../components/UserForm/UserForm';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { adminsAPI } from '../app/services/admins.service';
import { specialistAPI } from '../app/services/specialists.service';
import { authSlice } from '../app/reducers';
import getTokenPayload from '../app/tokenHendler';
import { mutationErrorHandler } from '../app/common';
import ErrorResult from '../components/ErrorResult/ErrorResult';

const getUpdate = (roles: string[]) => {
  if (roles.find((r) => r === 'admin')) return adminsAPI.useUpdateAdminMutation();
  if (roles.find((r) => r === 'specialist')) return specialistAPI.useUpdateSpecialistMutation();
  return representativesAPI.useUpdateRepresentativeMutation();
};
const getUsetType = (roles: string[]) => {
  if (roles.find((r) => r === 'admin')) return 'admin';
  if (roles.find((r) => r === 'specialist')) return 'specialist';
  return 'representative';
};

const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { roles } = useAppSelector((state) => state.authReducer);
  const isRepres = roles.find((r) => r === 'representative');
  const isSpec = roles.find((r) => r === 'specialist');
  const [messageApi, contextHolder] = message.useMessage();

  const [open, setOpen] = useState(false);
  const { data: user, isLoading, isError } = userAPI.useGetProfileQuery({});
  const [update] = getUpdate(roles);
  const [refreshTokens] = authAPI.useRefreshTokenMutation();
  const userType = getUsetType(roles);

  const onFinish = async (values: any) => {
    try {
      await update({ ...user, ...values }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Данные пользователя успешно обновлены',
      });
      await refreshTokens({});
      dispatch(authSlice.actions.setName(getTokenPayload()?.name || ''));
      setOpen(false);
    } catch (e) {
      mutationErrorHandler(messageApi, e);
    }
  };
  const onReset = () => {
    setOpen(false);
  };
  const onEdit = () => {
    setOpen(true);
  };

  if (isError) return <ErrorResult />;

  return (
    <>
      {contextHolder}
      <Modal
        destroyOnClose
        open={open}
        footer={null}
        title={
          <Typography.Title level={2} style={{ margin: 0, marginBottom: '20px' }}>
            Обновление личных данных
          </Typography.Title>
        }
        width="100%"
        onCancel={onReset}
      >
        <UserForm onReset={onReset} onFinish={onFinish} initValue={user} userType={userType} />
      </Modal>
      <Spin tip={<div style={{ marginTop: '10px', width: '100%' }}>Загрузка...</div>} size="large" spinning={isLoading}>
        <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '10px' }}>
          <Col>
            <Typography.Title level={1} style={{ margin: 0 }}>
              Личные данные
            </Typography.Title>
          </Col>
          <Col>
            <Button type="link" onClick={onEdit}>
              Редактировать
            </Button>
          </Col>
        </Row>
        <Descriptions
          bordered
          size="middle"
          contentStyle={{ backgroundColor: '#ffffff' }}
          labelStyle={{
            color: '#ffffff',
            borderRight: '5px solid #e6f4ff',
            width: '150px',
          }}
          column={1}
        >
          <Descriptions.Item label="Логин" style={{ borderBottom: '5px #e6f4ff solid' }}>
            {user?.login}
          </Descriptions.Item>
          <Descriptions.Item label="Фамилия" style={{ borderBottom: '5px #e6f4ff solid' }}>
            {user?.surname}
          </Descriptions.Item>
          <Descriptions.Item label="Имя" style={{ borderBottom: '5px #e6f4ff solid' }}>
            {user?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Отчество" style={{ borderBottom: '5px #e6f4ff solid' }}>
            {user?.patronymic}
          </Descriptions.Item>
          <Descriptions.Item label="Пол" style={{ borderBottom: '5px #e6f4ff solid' }}>
            {user?.gender}
          </Descriptions.Item>
          <Descriptions.Item label="Дата рождения" style={{ borderBottom: '5px #e6f4ff solid' }}>
            {new Date(user?.dateOfBirth || '').toLocaleString('ru', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
            })}
          </Descriptions.Item>
          <Descriptions.Item label="Адрес" style={{ borderBottom: '5px #e6f4ff solid' }}>
            {user?.address}
          </Descriptions.Item>
          <Descriptions.Item label="Номера телефонов" style={{ borderBottom: '5px #e6f4ff solid' }}>
            {user?.phoneNumbers
              .map((c) => `+7 (${c.slice(0, 3)}) ${c.slice(3, 6)}-${c.slice(6, 8)}-${c.slice(8)}`)
              .join(', ')}
          </Descriptions.Item>
          <Descriptions.Item label="Электронные почты" style={{ borderBottom: '5px #e6f4ff solid' }}>
            {user?.emails.join(', ')}
          </Descriptions.Item>
          {user?.advertisingSources && isRepres ? (
            <Descriptions.Item label="Источники рекламы" style={{ borderBottom: '5px #e6f4ff solid' }}>
              {user?.advertisingSources.map((v) => v.name).join(', ')}
            </Descriptions.Item>
          ) : null}
          {user?.types && isSpec ? (
            <Descriptions.Item label="Специальности" style={{ borderBottom: '5px #e6f4ff solid' }}>
              {user?.types.map((v) => v.name).join(', ')}
            </Descriptions.Item>
          ) : null}
        </Descriptions>
      </Spin>
    </>
  );
};

export default ProfilePage;
