/* eslint-disable @typescript-eslint/indent */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  Modal,
  Typography,
  Descriptions,
  message,
  Tooltip,
  Row,
  Col,
  DatePicker,
  Empty,
  Form,
  TimePicker,
  InputNumber,
  Select,
  Result,
} from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { ExclamationCircleFilled, LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { DatePickerProps } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { addClass } from '../../app/common';
import classes from './ModalAddAppToServ.module.scss';
import { IAppointment, IPatient, IService, ISpecialist } from '../../models';
import { specialistAPI } from '../../app/services/specialists.service';
import { appointmentsAPI } from '../../app/services/appointments.service';
import './antd.rewrite.scss';
import Shedule from '../Shedule/Shedule';
import { servicesAPI } from '../../app/services';
import { useAppSelector } from '../../app/hooks';

const { confirm } = Modal;

interface ModalAddAppToServProps extends PropsWithChildren {
  serviceId: string | undefined;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  // eslint-disable-next-line react/require-default-props
  setAppId?: React.Dispatch<React.SetStateAction<string>>;
}

const ModalAddAppToServ: FunctionComponent<ModalAddAppToServProps> = ({ serviceId, isOpen, setIsOpen, setAppId }) => {
  const { isAuth, roles, name, id } = useAppSelector((state) => state.authReducer);
  const isAdmin = roles.find((r) => r === 'admin');
  const isRepres = roles.find((r) => r === 'representative');
  const isSpec = roles.find((r) => r === 'specialist');
  const [isSuccess, setIsSuccess] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  // API
  const [setAppointments] = servicesAPI.useSetAppointmentToServiceMutation();

  const [currentSpecialist, setCurrentSpecialist] = useState<string | undefined>(undefined);
  const { data: currentService, isLoading: isLoadingCurrentServise } = servicesAPI.useGetAllInfoServiceQuery(
    {
      id: serviceId || '',
    },
    {
      skip: !serviceId || !!isSpec,
    },
  );
  const { data, isLoading } = specialistAPI.useGetSpecificSpecialistsQuery(
    {
      type: currentService?.type._id || '',
    },
    {
      skip: !currentService?.type._id || !!isSpec,
    },
  );

  const onAppointmentRewriteClick = (appointment: IAppointment) => {
    const date = dayjs(appointment.begDate).format('DD.MM.YYYY');
    const time = new Date(appointment.begDate).toLocaleString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const patientName = `${currentService?.patient?.number} ${currentService?.patient?.surname} ${currentService?.patient?.name[0]}.${currentService?.patient?.patronymic[0]}.`;
    const servType = `${currentService?.type.name}`;
    const specName = `${appointment.specialist.name}`;
    const showConfirm = () => {
      confirm({
        title: 'Подтвердите запись пациента.',
        icon: <ExclamationCircleFilled />,
        content: (
          <div>
            <p>{`Дата: ${date}. Время: ${time}.`}</p>
            <p>{`Пациент: ${patientName}`}</p>
            <p>{`Услуга: ${servType}.`}</p>
            <p>{`Специалист: ${specName}`}</p>
          </div>
        ),
        async onOk() {
          try {
            const result = await setAppointments({
              appointmentId: appointment._id,
              serviceId: currentService?._id || '',
            }).unwrap();
            setIsSuccess(1);
            if (setAppId) setAppId(result);
          } catch (e) {
            messageApi.open({
              type: 'error',
              content: 'Ошибка связи с сервером',
            });
          }
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    };
    showConfirm();
  };

  const onAppointmentReset = () => {
    const showConfirm = () => {
      confirm({
        title: 'Подтвердите отмену записи пациента.',
        icon: <ExclamationCircleFilled />,
        content: 'Вы точно хотите отменть запись?',
        async onOk() {
          try {
            const result = await setAppointments({
              serviceId: currentService?._id || '',
            }).unwrap();
            setIsSuccess(-1);
            if (setAppId) setAppId(result);
          } catch (e) {
            messageApi.open({
              type: 'error',
              content: 'Ошибка связи с сервером',
            });
          }
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    };
    showConfirm();
  };

  const onReset = () => {
    setIsSuccess(0);
    setCurrentSpecialist(undefined);
    setIsOpen(false);
  };

  return (
    <>
      {contextHolder}
      <Modal
        destroyOnClose
        open={isOpen}
        footer={
          !isSuccess ? (
            <>
              <Button
                type="primary"
                style={{ marginRight: '0px', backgroundColor: '#e60000' }}
                onClick={onAppointmentReset}
              >
                Отменить
              </Button>
              <Button type="primary" style={{ marginRight: '0px' }} onClick={onReset}>
                Назад
              </Button>
            </>
          ) : null
        }
        title={
          <Typography.Title level={2} style={{ margin: 0, marginBottom: '20px' }}>
            Изменение записи пациента
          </Typography.Title>
        }
        width="100%"
        onCancel={onReset}
      >
        {isSuccess ? (
          <Result
            status="success"
            title={isSuccess > 0 ? 'Пациент успешно записан на прием к специалисту' : 'Запись пациента отменена'}
            // subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
            extra={[
              <Button type="primary" key="ok" onClick={onReset} style={{ width: '160px' }}>
                ОК
              </Button>,
            ]}
          />
        ) : (
          <>
            <Select
              id="advertisingSources"
              allowClear
              style={{ width: '100%', marginBottom: '20px' }}
              options={data}
              onChange={(v) => setCurrentSpecialist(v)}
              placeholder="Выберите специалиста"
              loading={isLoading}
            />
            {currentSpecialist ? (
              <Shedule
                dataAPI={appointmentsAPI.useGetForRecordQuery}
                title="Расписание специалиста"
                extraOptions={{
                  specialistId: currentSpecialist,
                  isFree: true,
                  serviceId: currentService?._id,
                  patientId: currentService?.patient?._id,
                }}
                onAppointmentClick={onAppointmentRewriteClick}
                type="Specialist"
              />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Выберите специалиста" />
            )}
          </>
        )}
      </Modal>
    </>
  );
};

export default ModalAddAppToServ;
