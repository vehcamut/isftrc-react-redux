/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-nested-ternary */
import { Button, Modal, Typography, Descriptions, message } from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { addClass, mutationErrorHandler } from '../../app/common';
import { patientsAPI } from '../../app/services';
import classes from './PatinentInfo.module.scss';
import { IPatient } from '../../models';
import AddPatientForm from '../AddPatientForm/AddPatientForm';
import { useAppSelector } from '../../app/hooks';

interface PatinentInfoProps extends PropsWithChildren {
  patient?: IPatient;
}

const PatinentInfo: FunctionComponent<PatinentInfoProps> = ({ patient }) => {
  const { roles } = useAppSelector((state) => state.authReducer);
  const isAdmin = roles.find((r) => r === 'admin');
  const isRepres = roles.find((r) => r === 'representative');
  const [messageApi, contextHolder] = message.useMessage();
  const [updatePatient] = patientsAPI.useUpdatePatientMutation();
  const [changeStatus] = patientsAPI.useChangePatientStatusMutation();
  const [open, setOpen] = useState(false);

  const onFinish = async (values: any) => {
    try {
      await updatePatient({ ...patient, ...values }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Данные пациента успешно обновлены',
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
      await changeStatus({ _id: patient?._id ? patient?._id : '', isActive: true }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Пациент успешно активирован',
      });
    } catch (e) {
      mutationErrorHandler(messageApi, e);
    }
  };
  const onDeactivate = async () => {
    try {
      await changeStatus({ _id: patient?._id ? patient?._id : '', isActive: false }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Пациент успешно деактивирован',
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
            Обновление данных пациента
          </Typography.Title>
        }
        width="100%"
        onCancel={onReset}
      >
        <AddPatientForm onFinish={onFinish} onReset={onReset} initValue={patient} />
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
        title="Личные данные пациента"
        column={1}
        extra={
          <>
            {isAdmin ? (
              patient?.isActive ? (
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
              )
            ) : null}
            {isAdmin || isRepres ? (
              <Button type="primary" onClick={onEdit} disabled={!patient?.isActive}>
                Редактировать
              </Button>
            ) : null}
          </>
        }
      >
        <Descriptions.Item label="Фамилия" className={addClass(classes, 'des-item')}>
          {patient ? patient.surname : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Имя" className={addClass(classes, 'des-item')}>
          {patient ? patient.name : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Отчество" className={addClass(classes, 'des-item')}>
          {patient ? patient.patronymic : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Пол" className={addClass(classes, 'des-item')}>
          {patient ? patient.gender : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Дата рождения" className={addClass(classes, 'des-item')}>
          {patient
            ? new Date(patient?.dateOfBirth || '').toLocaleString('ru', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
              })
            : ''}
        </Descriptions.Item>
        <Descriptions.Item label="Адрес" className={addClass(classes, 'des-item')}>
          {patient ? patient?.address : ''}
        </Descriptions.Item>
        {!isRepres ? (
          <Descriptions.Item label="Примечание" className={addClass(classes, 'des-item')}>
            {patient ? patient?.note : ''}
          </Descriptions.Item>
        ) : null}

        <Descriptions.Item label="Статус">
          {patient ? (patient.isActive ? 'активен' : 'неактивен') : ''}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

PatinentInfo.defaultProps = {
  patient: undefined,
};

export default PatinentInfo;
