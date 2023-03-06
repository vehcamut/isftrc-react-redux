/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/indent */
import { Button, Modal, Typography, Descriptions, message } from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { addClass, mutationErrorHandler } from '../../app/common';
import classes from './AdminInfo.module.scss';
import { IAdminWithId } from '../../models';
import UserForm from '../UserForm/UserForm';
import { adminsAPI } from '../../app/services/admins.service';

interface AdminInfoProps extends PropsWithChildren {
  admin?: IAdminWithId;
}

const AdminInfo: FunctionComponent<AdminInfoProps> = ({ admin }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [update] = adminsAPI.useUpdateAdminMutation();
  const [changeStatus] = adminsAPI.useChangeAdminStatusMutation();
  const [open, setOpen] = useState(false);

  const onFinish = async (values: any) => {
    try {
      await update({ ...admin, ...values }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Данные администратора успешно обновлены',
      });
      setOpen(false);
    } catch (e: any) {
      mutationErrorHandler(messageApi, e);
    }
  };
  const onReset = () => {
    setOpen(false);
  };
  const onEdit = () => {
    setOpen(true);
  };
  const onActivate = async () => {
    try {
      await changeStatus({ _id: admin?._id ? admin?._id : '', isActive: true }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Администратор успешно активирован',
      });
    } catch (e: any) {
      mutationErrorHandler(messageApi, e);
    }
  };
  const onDeactivate = async () => {
    try {
      await changeStatus({ _id: admin?._id ? admin?._id : '', isActive: false }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Администратор успешно деактивирован',
      });
    } catch (e: any) {
      mutationErrorHandler(messageApi, e);
    }
  };
  return (
    <>
      {contextHolder}
      <Modal
        destroyOnClose
        open={open}
        footer={null}
        title={
          <Typography.Title level={2} style={{ margin: 0, marginBottom: '20px' }}>
            Обновление данных администратора
          </Typography.Title>
        }
        width="100%"
        onCancel={onReset}
      >
        <UserForm onFinish={onFinish} onReset={onReset} initValue={admin} userType="admin" />
      </Modal>
      <Descriptions
        bordered
        size="middle"
        contentStyle={{ backgroundColor: '#ffffff' }}
        labelStyle={{
          color: '#ffffff',
          borderRight: '5px solid #e6f4ff',
          width: '150px',
        }}
        title="Личные данные админимтратора"
        column={1}
        extra={
          admin ? (
            <>
              {admin.isActive ? (
                <Button
                  type="primary"
                  onClick={onDeactivate}
                  style={{ marginRight: '10px', backgroundColor: '#e60000' }}
                >
                  Деактивировать
                </Button>
              ) : (
                <Button type="primary" onClick={onActivate} style={{ marginRight: '10px', backgroundColor: '#0c9500' }}>
                  Активировать
                </Button>
              )}

              <Button type="primary" onClick={onEdit} disabled={!admin.isActive}>
                Редактировать
              </Button>
            </>
          ) : null
        }
      >
        <Descriptions.Item label="Фамилия" className={addClass(classes, 'des-item')}>
          {admin ? admin.surname : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Имя" className={addClass(classes, 'des-item')}>
          {admin ? admin.name : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Отчество" className={addClass(classes, 'des-item')}>
          {admin ? admin.patronymic : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Пол" className={addClass(classes, 'des-item')}>
          {admin ? admin.gender : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Дата рождения" className={addClass(classes, 'des-item')}>
          {admin
            ? new Date(admin.dateOfBirth || '').toLocaleString('ru', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              })
            : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Адрес" className={addClass(classes, 'des-item')}>
          {admin ? admin.address : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Номера телефонов" className={addClass(classes, 'des-item')}>
          {admin
            ? admin.phoneNumbers
                .map((c) => `+7 (${c.slice(0, 3)}) ${c.slice(3, 6)}-${c.slice(6, 8)}-${c.slice(8)}`)
                .join(', ')
            : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Электронные почты" className={addClass(classes, 'des-item')}>
          {admin ? admin.emails.join(', ') : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Логин" className={addClass(classes, 'des-item')}>
          {admin ? admin.login : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Статус">{admin ? (admin.isActive ? 'активен' : 'неактивен') : ''}</Descriptions.Item>
      </Descriptions>
    </>
  );
};

AdminInfo.defaultProps = {
  admin: undefined,
};

export default AdminInfo;
