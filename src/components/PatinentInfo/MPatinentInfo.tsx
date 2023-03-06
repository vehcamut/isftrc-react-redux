/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-nested-ternary */
import { Button, Modal, Typography, Descriptions, message, Card } from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { patientsAPI } from '../../app/services';
import { IPatient } from '../../models';
import AddPatientForm from '../AddPatientForm/AddPatientForm';
import { useAppSelector } from '../../app/hooks';

interface MPatinentInfoProps extends PropsWithChildren {
  patient?: IPatient;
}

const MPatinentInfo: FunctionComponent<MPatinentInfoProps> = ({ patient }) => {
  const { roles } = useAppSelector((state) => state.authReducer);
  const isAdmin = roles.find((r) => r === 'admin');
  const isRepres = roles.find((r) => r === 'representative');
  const [messageApi, contextHolder] = message.useMessage();
  const [updatePatient] = patientsAPI.useUpdatePatientMutation();
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
      <Card
        size="default"
        title="Личные данные"
        extra={
          isAdmin || isRepres ? (
            <Button type="primary" onClick={onEdit} disabled={!patient?.isActive}>
              Редактировать
            </Button>
          ) : undefined
        }
      >
        <Descriptions
          labelStyle={{ fontWeight: 'bold', color: 'black' }}
          contentStyle={{ whiteSpace: 'pre-line' }}
          layout="horizontal"
          size="small"
          column={1}
        >
          <Descriptions.Item label="Фамилия">{patient ? patient.surname : ''}</Descriptions.Item>
          <Descriptions.Item label="Имя">{patient ? patient.name : ''}</Descriptions.Item>
          <Descriptions.Item label="Отчество">{patient ? patient.patronymic : ''}</Descriptions.Item>
          <Descriptions.Item label="Пол">{patient ? patient.gender : ''}</Descriptions.Item>
          <Descriptions.Item label="Дата рождения">
            {patient
              ? new Date(patient.dateOfBirth || '').toLocaleString('ru', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                })
              : ''}
          </Descriptions.Item>
          <Descriptions.Item label="Адрес">{patient?.address}</Descriptions.Item>
          {!isRepres ? <Descriptions.Item label="Примечание">{patient ? patient.note : ''}</Descriptions.Item> : null}

          <Descriptions.Item label="Статус">
            {patient ? (patient.isActive ? 'активен' : 'неактивен') : ''}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </>
  );
};

MPatinentInfo.defaultProps = {
  patient: undefined,
};

export default MPatinentInfo;
