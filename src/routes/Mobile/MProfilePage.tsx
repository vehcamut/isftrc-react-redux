/* eslint-disable @typescript-eslint/indent */
import React, { useState } from 'react';
import { Typography, Row, Col, Button, message, Spin, Descriptions, Divider, Modal, Card } from 'antd';
import '../antd.rewrite.scss';
import { authAPI, representativesAPI, userAPI } from '../../app/services';
import UserForm from '../../components/UserForm/UserForm';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { adminsAPI } from '../../app/services/admins.service';
import { specialistAPI } from '../../app/services/specialists.service';
import { authSlice } from '../../app/reducers';
import getTokenPayload from '../../app/tokenHendler';
import { mutationErrorHandler } from '../../app/common';
import ErrorResult from '../../components/ErrorResult/ErrorResult';

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

const MProfilePage = () => {
  const dispatch = useAppDispatch();
  const { roles } = useAppSelector((state) => state.authReducer);
  const isRepres = roles.find((r) => r === 'representative');
  const isSpec = roles.find((r) => r === 'specialist');
  const [messageApi, contextHolder] = message.useMessage();
  const [refreshTokens] = authAPI.useRefreshTokenMutation();

  const [open, setOpen] = useState(false);
  const { data: user, isLoading, isError } = userAPI.useGetProfileQuery({}, { pollingInterval: 30000 });
  const [update] = getUpdate(roles);
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
          <Typography.Title level={5} style={{ margin: 0, marginBottom: '20px' }}>
            Обновление личных данных
          </Typography.Title>
        }
        width="100%"
        onCancel={onReset}
      >
        <UserForm onReset={onReset} onFinish={onFinish} initValue={user} userType={userType} mobile />
      </Modal>
      <Spin tip={<div style={{ marginTop: '10px', width: '100%' }}>Загрузка...</div>} size="large" spinning={isLoading}>
        <Row justify="center" align="middle" style={{ marginTop: '10px', marginBottom: '10px' }}>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Typography.Title level={2} style={{ margin: 0 }}>
              Личные данные
            </Typography.Title>
          </Col>
          <Col span={24} style={{ alignItems: 'center', textAlign: 'center' }}>
            <Button type="link" onClick={onEdit}>
              Редактировать
            </Button>
          </Col>
        </Row>
        <Card>
          <Descriptions
            contentStyle={{ whiteSpace: 'pre-line' }}
            layout="horizontal"
            size="small"
            labelStyle={{ width: '150px', fontWeight: 'bold', color: 'black' }}
            column={1}
          >
            <Descriptions.Item label="Логин">{user?.login}</Descriptions.Item>
            <Descriptions.Item label="Фамилия">{user?.surname}</Descriptions.Item>
            <Descriptions.Item label="Имя">{user?.name}</Descriptions.Item>
            <Descriptions.Item label="Отчество">{user?.patronymic}</Descriptions.Item>
            <Descriptions.Item label="Пол">{user?.gender}</Descriptions.Item>
            <Descriptions.Item label="Дата рождения">
              {user
                ? new Date(user.dateOfBirth || '').toLocaleString('ru', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                  })
                : ''}
            </Descriptions.Item>
          </Descriptions>
          <Divider style={{ margin: '5px 0', borderColor: '#e6f4ff' }} />
          <Descriptions
            labelStyle={{ fontWeight: 'bold', color: 'black' }}
            contentStyle={{ whiteSpace: 'pre-line' }}
            layout="vertical"
            size="small"
            column={1}
          >
            <Descriptions.Item label="Адрес">{user?.address}</Descriptions.Item>
            <Descriptions.Item label="Номера телефонов">
              {user?.phoneNumbers.reduce((p, c) => {
                const pn = `+7 ${c.slice(0, 3)} ${c.slice(3, 6)}-${c.slice(6, 8)}-${c.slice(8)}`;
                return `${p}${p ? '\n' : ''}${pn}`;
              }, '')}
            </Descriptions.Item>
            <Descriptions.Item label="Электронные почты">
              {user?.emails.reduce((p, c) => {
                return `${p}${p ? '\n' : ''}${c}`;
              }, '')}
            </Descriptions.Item>
            {user?.advertisingSources && isRepres ? (
              <Descriptions.Item label="Источники рекламы">
                {user?.advertisingSources.reduce((p, c) => {
                  return `${p}${p ? '\n' : ''}${c.name}`;
                }, '')}
              </Descriptions.Item>
            ) : null}
            {user?.types && isSpec ? (
              <Descriptions.Item label="Специальности">
                {user?.types.reduce((p, c) => {
                  return `${p}${p ? '\n' : ''}${c.name}`;
                }, '')}
              </Descriptions.Item>
            ) : null}
          </Descriptions>
        </Card>
      </Spin>
    </>
  );
};

export default MProfilePage;
