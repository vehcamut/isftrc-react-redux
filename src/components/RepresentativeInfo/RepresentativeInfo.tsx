/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Modal, Typography, Descriptions, message } from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { addClass } from '../../app/common';
import { patientsAPI } from '../../app/services';
import classes from './RepresentativeInfo.module.scss';
import { IPatient, IRepresentative } from '../../models';
import AddPatientForm from '../AddPatientForm/AddPatientForm';

interface RepresentativeInfoProps extends PropsWithChildren {
  // eslint-disable-next-line react/require-default-props
  representative?: IRepresentative;
}

const RepresentativeInfo: FunctionComponent<RepresentativeInfoProps> = ({ representative }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [updatePatient] = patientsAPI.useUpdateMutation();
  const [changeStatus] = patientsAPI.useChangeStatusMutation();
  const [open, setOpen] = useState(false);

  const onFinish = async (values: any) => {
    try {
      await updatePatient({ ...representative, ...values }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Данные пациента успешно обновлены',
      });
    } catch (e) {
      messageApi.open({
        type: 'error',
        content: 'Ошибка связи с сервером',
      });
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
      messageApi.open({
        type: 'error',
        content: 'Ошибка связи с сервером',
      });
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
      messageApi.open({
        type: 'error',
        content: 'Ошибка связи с сервером',
      });
    }
  };
  return (
    <>
      {contextHolder}
      {/* <Modal
        destroyOnClose
        open={open}
        footer={null}
        title={
          <Typography.Title level={2} style={{ margin: 0, marginBottom: '20px' }}>
            Обновление данных пациента
          </Typography.Title>
        }
        width="100%"
        onCancel={onReset}
      >
        <AddPatientForm onFinish={onFinish} onReset={onReset} initValue={patient} />
      </Modal> */}
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

            <Button type="primary" onClick={onEdit}>
              Редактировать
            </Button>
          </>
        }
      >
        <Descriptions.Item label="Фамилия" className={addClass(classes, 'des-item')}>
          {representative?.surname}
        </Descriptions.Item>
        <Descriptions.Item label="Имя" className={addClass(classes, 'des-item')}>
          {representative?.name}
        </Descriptions.Item>
        <Descriptions.Item label="Отчество" className={addClass(classes, 'des-item')}>
          {representative?.patronymic}
        </Descriptions.Item>
        <Descriptions.Item label="Пол" className={addClass(classes, 'des-item')}>
          {representative?.gender}
        </Descriptions.Item>
        <Descriptions.Item label="Дата рождения" className={addClass(classes, 'des-item')}>
          {new Date(representative?.dateOfBirth || '').toLocaleString('ru', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          })}
        </Descriptions.Item>
        <Descriptions.Item label="Адрес" className={addClass(classes, 'des-item')}>
          {representative?.address}
        </Descriptions.Item>
        <Descriptions.Item label="Номера телефонов" className={addClass(classes, 'des-item')}>
          {representative?.phoneNumbers
            .map((c) => `+7 (${c.slice(0, 3)}) ${c.slice(3, 6)}-${c.slice(6, 8)}-${c.slice(8)}`)
            .join(', ')}
        </Descriptions.Item>
        <Descriptions.Item label="Адреса электронных почт" className={addClass(classes, 'des-item')}>
          {representative?.emails.join(', ')}
        </Descriptions.Item>
        <Descriptions.Item label="Источники рекламы" className={addClass(classes, 'des-item')}>
          {representative?.advertisingSources.map((v) => v.name).join(', ')}
        </Descriptions.Item>
        <Descriptions.Item label="Логин" className={addClass(classes, 'des-item')}>
          {representative?.login}
        </Descriptions.Item>
        {/* <Descriptions.Item label="Примечание" className={addClass(classes, 'des-item')}>
          {patient?.note}
        </Descriptions.Item> */}
        <Descriptions.Item label="Статус">{representative?.isActive ? 'активен' : 'неактивен'}</Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default RepresentativeInfo;
