/* eslint-disable react/no-unused-prop-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AutoComplete,
  Button,
  Form,
  Input,
  Radio,
  Row,
  Spin,
  Col,
  DatePicker,
  Modal,
  Typography,
  Descriptions,
  message,
} from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import debounce from 'lodash.debounce';
import dayjs from 'dayjs';
import { addClass } from '../../app/common';
import { dadataAPI, patientsAPI } from '../../app/services';
import classes from './PatinentInfo.module.scss';
import { IPatient } from '../../models';
import AddPatientForm from '../AddPatientForm/AddPatientForm';

const { TextArea } = Input;
interface FormDialogProps extends PropsWithChildren {
  // eslint-disable-next-line react/require-default-props
  patient?: IPatient;
}

const PatinentDescription: FunctionComponent<FormDialogProps> = ({ patient }) => {
  const [messageApi, contextHolder] = message.useMessage();
  // const [query, setQuery] = useState('');
  const [updatePatient] = patientsAPI.useUpdateMutation();
  const [open, setOpen] = useState(false);
  // const { data: options, isLoading: addressIsLoading } = dadataAPI.useGetAddressQuery(query);

  // const onSearchAC: any = debounce((searchText) => {
  //   setQuery(searchText);
  // }, 800);
  const onFinish = async (values: any) => {
    try {
      await updatePatient({ ...patient, ...values }).unwrap();
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
          <Button type="primary" onClick={onEdit}>
            Редактировать
          </Button>
        }
      >
        <Descriptions.Item label="Фамилия" className={addClass(classes, 'des-item')}>
          {patient?.surname}
        </Descriptions.Item>
        <Descriptions.Item label="Имя" className={addClass(classes, 'des-item')}>
          {patient?.name}
        </Descriptions.Item>
        <Descriptions.Item label="Отчество" className={addClass(classes, 'des-item')}>
          {patient?.patronymic}
        </Descriptions.Item>
        <Descriptions.Item label="Пол" className={addClass(classes, 'des-item')}>
          {patient?.gender}
        </Descriptions.Item>
        <Descriptions.Item label="Дата рождения" className={addClass(classes, 'des-item')}>
          {new Date(patient?.dateOfBirth || '').toLocaleString('ru', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          })}
        </Descriptions.Item>
        <Descriptions.Item label="Адрес" className={addClass(classes, 'des-item')}>
          {patient?.address}
        </Descriptions.Item>
        <Descriptions.Item label="Примечание">{patient?.note}</Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default PatinentDescription;
