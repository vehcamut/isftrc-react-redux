/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Modal, Typography, Descriptions, message } from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { addClass, mutationErrorHandler } from '../../app/common';
import { representativesAPI } from '../../app/services';
import classes from './RepresentativeInfo.module.scss';
import { IRepresentative } from '../../models';
import UserForm from '../UserForm/UserForm';

interface RepresentativeInfoProps extends PropsWithChildren {
  representative?: IRepresentative;
}

const RepresentativeInfo: FunctionComponent<RepresentativeInfoProps> = ({ representative }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [updateRepresentative] = representativesAPI.useUpdateRepresentativeMutation();
  const [changeStatus] = representativesAPI.useChangeRepresentativeStatusMutation();
  const [open, setOpen] = useState(false);

  const onFinish = async (values: any) => {
    try {
      await updateRepresentative({ ...representative, ...values }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Данные представителя успешно обновлены',
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
      await changeStatus({ _id: representative?._id ? representative?._id : '', isActive: true }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Представитель успешно активирован',
      });
    } catch (e) {
      mutationErrorHandler(messageApi, e);
    }
  };
  const onDeactivate = async () => {
    try {
      await changeStatus({ _id: representative?._id ? representative?._id : '', isActive: false }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Представитель успешно деактивирован',
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
            Обновление данных представителя
          </Typography.Title>
        }
        width="100%"
        onCancel={onReset}
      >
        <UserForm onReset={onReset} onFinish={onFinish} initValue={representative} userType="representative" />
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
            {representative?.isActive ? (
              <Button type="primary" onClick={onDeactivate} style={{ marginRight: '10px', backgroundColor: '#e60000' }}>
                Деактивировать
              </Button>
            ) : (
              <Button type="primary" onClick={onActivate} style={{ marginRight: '10px', backgroundColor: '#0c9500' }}>
                Активировать
              </Button>
            )}

            <Button type="primary" onClick={onEdit} disabled={!representative?.isActive}>
              Редактировать
            </Button>
          </>
        }
      >
        <Descriptions.Item label="Фамилия" className={addClass(classes, 'des-item')}>
          {representative ? representative.surname : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Имя" className={addClass(classes, 'des-item')}>
          {representative ? representative.name : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Отчество" className={addClass(classes, 'des-item')}>
          {representative ? representative.patronymic : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Пол" className={addClass(classes, 'des-item')}>
          {representative ? representative.gender : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Дата рождения" className={addClass(classes, 'des-item')}>
          {representative
            ? new Date(representative.dateOfBirth || '').toLocaleString('ru', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              })
            : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Адрес" className={addClass(classes, 'des-item')}>
          {representative ? representative.address : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Номера телефонов" className={addClass(classes, 'des-item')}>
          {representative
            ? representative.phoneNumbers
                .map((c) => `+7 (${c.slice(0, 3)}) ${c.slice(3, 6)}-${c.slice(6, 8)}-${c.slice(8)}`)
                .join(', ')
            : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Электронные почты" className={addClass(classes, 'des-item')}>
          {representative ? representative.emails.join(', ') : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Источники рекламы" className={addClass(classes, 'des-item')}>
          {representative ? representative.advertisingSources.map((v) => v.name).join(', ') : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Логин" className={addClass(classes, 'des-item')}>
          {representative ? representative.login : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Статус">
          {representative ? (representative?.isActive ? 'активен' : 'неактивен') : ''}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

RepresentativeInfo.defaultProps = {
  representative: undefined,
};

export default RepresentativeInfo;
