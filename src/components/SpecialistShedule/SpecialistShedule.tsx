/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Modal, Typography, Descriptions, message, Calendar } from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { Dayjs } from 'dayjs';
import { CalendarMode } from 'antd/es/calendar/generateCalendar';
import { addClass } from '../../app/common';
import { patientsAPI, representativesAPI } from '../../app/services';
import classes from './SpecialistShedule.module.scss';
import { IPatient, IRepresentative, ISpecialist } from '../../models';
import AddPatientForm from '../AddPatientForm/AddPatientForm';
import AddRepresentativeForm from '../AddRepresentativeForm/AddRepresentativeForm';
import { specialistAPI } from '../../app/services/specialists.service';
import AddSpecialistForm from '../AddSpecialistForm/AddSpecialistForm';

interface SpecialistSheduleProps extends PropsWithChildren {
  // eslint-disable-next-line react/require-default-props
  specialist?: ISpecialist;
}

const SpecialistShedule: FunctionComponent<SpecialistSheduleProps> = ({ specialist }) => {
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
      await changeStatus({ _id: specialist?._id ? specialist?._id : '', isActive: true }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Специалист успешно активирован',
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
      await changeStatus({ _id: specialist?._id ? specialist?._id : '', isActive: false }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Специалист успешно деактивирован',
      });
    } catch (e) {
      messageApi.open({
        type: 'error',
        content: 'Ошибка связи с сервером',
      });
    }
  };
  const onPanelChange = (value: Dayjs, mode: CalendarMode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  return (
    <>
      {contextHolder}
      <Calendar onPanelChange={onPanelChange} />;
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
        <AddSpecialistForm onFinish={onFinish} onReset={onReset} type="add" initValue={specialist} />
        {/* <AddPatientForm onFinish={onFinish} onReset={onReset} /> */}
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

            <Button type="primary" onClick={onEdit}>
              Редактировать
            </Button>
          </>
        }
      >
        <Descriptions.Item label="Фамилия" className={addClass(classes, 'des-item')}>
          {specialist?.surname}
        </Descriptions.Item>
        <Descriptions.Item label="Имя" className={addClass(classes, 'des-item')}>
          {specialist?.name}
        </Descriptions.Item>
        <Descriptions.Item label="Отчество" className={addClass(classes, 'des-item')}>
          {specialist?.patronymic}
        </Descriptions.Item>
        <Descriptions.Item label="Пол" className={addClass(classes, 'des-item')}>
          {specialist?.gender}
        </Descriptions.Item>
        <Descriptions.Item label="Дата рождения" className={addClass(classes, 'des-item')}>
          {new Date(specialist?.dateOfBirth || '').toLocaleString('ru', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          })}
        </Descriptions.Item>
        <Descriptions.Item label="Адрес" className={addClass(classes, 'des-item')}>
          {specialist?.address}
        </Descriptions.Item>
        <Descriptions.Item label="Номера телефонов" className={addClass(classes, 'des-item')}>
          {specialist?.phoneNumbers
            .map((c) => `+7 (${c.slice(0, 3)}) ${c.slice(3, 6)}-${c.slice(6, 8)}-${c.slice(8)}`)
            .join(', ')}
        </Descriptions.Item>
        <Descriptions.Item label="Электронные почты" className={addClass(classes, 'des-item')}>
          {specialist?.emails.join(', ')}
        </Descriptions.Item>
        <Descriptions.Item label="Специальности" className={addClass(classes, 'des-item')}>
          {specialist?.types.map((v) => v.name).join(', ')}
        </Descriptions.Item>
        <Descriptions.Item label="Логин" className={addClass(classes, 'des-item')}>
          {specialist?.login}
        </Descriptions.Item>
        {/* <Descriptions.Item label="Примечание" className={addClass(classes, 'des-item')}>
          {patient?.note}
        </Descriptions.Item> */}
        <Descriptions.Item label="Статус">{specialist?.isActive ? 'активен' : 'неактивен'}</Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default SpecialistShedule;
