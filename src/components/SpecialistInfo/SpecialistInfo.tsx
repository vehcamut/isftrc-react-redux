/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/indent */
import { Button, Modal, Typography, Descriptions, message } from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { addClass, mutationErrorHandler } from '../../app/common';
import classes from './SpecialistInfo.module.scss';
import { ISpecialist } from '../../models';
import { specialistAPI } from '../../app/services/specialists.service';
import UserForm from '../UserForm/UserForm';

interface SpecialistInfoProps extends PropsWithChildren {
  specialist?: ISpecialist;
}

const SpecialistInfo: FunctionComponent<SpecialistInfoProps> = ({ specialist }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [update] = specialistAPI.useUpdateSpecialistMutation();
  const [changeStatus] = specialistAPI.useChangeSpecialistStatusMutation();
  const [open, setOpen] = useState(false);

  const onFinish = async (values: any) => {
    try {
      await update({ ...specialist, ...values }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Данные специалиста успешно обновлены',
      });
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
  const onActivate = async () => {
    try {
      await changeStatus({ _id: specialist?._id ? specialist?._id : '', isActive: true }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Специалист успешно активирован',
      });
    } catch (e) {
      mutationErrorHandler(messageApi, e);
    }
  };
  const onDeactivate = async () => {
    try {
      await changeStatus({ _id: specialist?._id ? specialist?._id : '', isActive: false }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Специалист успешно деактивирован',
      });
    } catch (e) {
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
            Обновление данных специалиста
          </Typography.Title>
        }
        width="100%"
        onCancel={onReset}
      >
        <UserForm onFinish={onFinish} onReset={onReset} initValue={specialist} userType="specialist" />
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
        title="Личные данные представителя"
        column={1}
        extra={
          <>
            {specialist?.isActive ? (
              <Button type="primary" onClick={onDeactivate} style={{ marginRight: '10px', backgroundColor: '#e60000' }}>
                Деактивировать
              </Button>
            ) : (
              <Button type="primary" onClick={onActivate} style={{ marginRight: '10px', backgroundColor: '#0c9500' }}>
                Активировать
              </Button>
            )}

            <Button type="primary" onClick={onEdit} disabled={!specialist?.isActive}>
              Редактировать
            </Button>
          </>
        }
      >
        <Descriptions.Item label="Фамилия" className={addClass(classes, 'des-item')}>
          {specialist ? specialist.surname : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Имя" className={addClass(classes, 'des-item')}>
          {specialist ? specialist.name : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Отчество" className={addClass(classes, 'des-item')}>
          {specialist ? specialist.patronymic : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Пол" className={addClass(classes, 'des-item')}>
          {specialist ? specialist.gender : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Дата рождения" className={addClass(classes, 'des-item')}>
          {specialist
            ? new Date(specialist?.dateOfBirth || '').toLocaleString('ru', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              })
            : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Адрес" className={addClass(classes, 'des-item')}>
          {specialist ? specialist.address : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Номера телефонов" className={addClass(classes, 'des-item')}>
          {specialist
            ? specialist.phoneNumbers
                .map((c) => `+7 (${c.slice(0, 3)}) ${c.slice(3, 6)}-${c.slice(6, 8)}-${c.slice(8)}`)
                .join(', ')
            : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Электронные почты" className={addClass(classes, 'des-item')}>
          {specialist ? specialist.emails.join(', ') : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Специальности" className={addClass(classes, 'des-item')}>
          {specialist ? specialist.types.map((v) => v.name).join(', ') : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Логин" className={addClass(classes, 'des-item')}>
          {specialist ? specialist.login : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Статус">
          {specialist ? (specialist.isActive ? 'активен' : 'неактивен') : ''}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

SpecialistInfo.defaultProps = {
  specialist: undefined,
};

export default SpecialistInfo;
