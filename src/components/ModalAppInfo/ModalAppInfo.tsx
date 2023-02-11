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
import classes from './ModalAppInfo.module.scss';
import { IAppointment, IPatient, IService, ISpecialist } from '../../models';
import { specialistAPI } from '../../app/services/specialists.service';
import { appointmentsAPI } from '../../app/services/appointments.service';
import './antd.rewrite.scss';
import Shedule from '../Shedule/Shedule';
import { servicesAPI } from '../../app/services';
import ModalAddAppToServ from '../ModalAddAppToServ/ModalAddAppToServ';

const { confirm } = Modal;

interface ModalAppInfoProps extends PropsWithChildren {
  // serviceId: string | undefined;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  appointmentId: string;
  setAppointmentId: React.Dispatch<React.SetStateAction<string>>;
}

const ModalAppInfo: FunctionComponent<ModalAppInfoProps> = ({ isOpen, setIsOpen, appointmentId, setAppointmentId }) => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // const [appointmentId, setAppointmentId] = useState<string>('');
  const [isChangeServiceTimeOpen, setIsChangeServiceTimeOpen] = useState(false);
  const [currentService, setCurrentService] = useState<IService | undefined>(undefined);

  // API
  const { data: currentAppointment } = appointmentsAPI.useGetAppointmentByIdQuery(
    {
      id: appointmentId || '',
    },
    { skip: appointmentId === '' },
  );
  const [closeService] = servicesAPI.useCloseServiceMutation();
  const [openService] = servicesAPI.useOpenServiceMutation();

  const onAppointmentRewrite = () => {
    setCurrentService(currentAppointment?.service);
    setIsChangeServiceTimeOpen(true);
  };

  const onOpenService = async () => {
    try {
      await openService({ id: currentAppointment?.service?._id || '' }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Запись успешно открыта',
      });
    } catch (e) {
      messageApi.open({
        type: 'error',
        content: 'Ошибка связи с сервером',
      });
    }
  };
  const onCloseService = async () => {
    try {
      await closeService({ id: currentAppointment?.service?._id || '', result: 'dfd' }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Запись успешно закрыта',
      });
    } catch (e) {
      messageApi.open({
        type: 'error',
        content: 'Ошибка связи с сервером',
      });
    }
  };
  const onReset = () => {
    setAppointmentId('');
    setIsOpen(false);
  };

  return (
    <>
      {contextHolder}
      <ModalAddAppToServ
        serviceId={currentService?._id}
        isOpen={isChangeServiceTimeOpen}
        setIsOpen={setIsChangeServiceTimeOpen}
        setAppId={setAppointmentId}
      />
      <Modal
        destroyOnClose
        open={isOpen}
        footer={
          <>
            {/* {currentAppointment?.service && !currentAppointment.service.status ? (
              <Button
                type="primary"
                style={{ marginRight: '10px', backgroundColor: '#e60000' }}
                onClick={onBeforeAppRemove}
              >
                Удалить
              </Button>
            ) : (
              ''
            )} */}
            {currentAppointment?.service?.canBeRemoved ? (
              <>
                {currentAppointment?.service && !currentAppointment.service.status ? (
                  <Button type="primary" style={{ marginRight: '10px' }} onClick={onAppointmentRewrite}>
                    Перенести
                  </Button>
                ) : (
                  ''
                )}

                {currentAppointment?.service &&
                !currentAppointment.service.status &&
                currentAppointment?.begDate &&
                new Date(currentAppointment?.begDate) <= new Date() ? (
                  <Button type="primary" style={{ marginRight: '10px' }} onClick={onCloseService}>
                    Закрыть
                  </Button>
                ) : null}

                {currentAppointment?.service && currentAppointment.service.status ? (
                  <Button type="primary" style={{ marginRight: '10px' }} onClick={onOpenService}>
                    Открыть
                  </Button>
                ) : null}
                {/* {currentAppointment?.service && !currentAppointment.service.status ? (
                  currentAppointment?.service?.date && new Date(currentAppointment?.service.date) <= new Date() ? (
                    <Button type="primary" style={{ marginRight: '10px' }} onClick={onCloseService}>
                      Закрыть
                    </Button>
                  ) : null
                ) : (
                  <Button type="primary" style={{ marginRight: '10px' }} onClick={onOpenService}>
                    Открыть
                  </Button>
                )} */}
              </>
            ) : null}

            <Button type="primary" style={{ marginRight: '0px' }} onClick={onReset}>
              Назад
            </Button>
          </>
        }
        title={
          <Typography.Title level={2} style={{ margin: 0, marginBottom: '20px' }}>
            Информация о записи
          </Typography.Title>
        }
        width="600px"
        onCancel={onReset}
      >
        <Descriptions
          column={3}
          // extra={
          //   <>
          //
          //     <DatePicker
          //       style={{ marginRight: '10px' }}
          //       format="DD.MM.YYYY"
          //       onChange={onDPChange}
          //       value={datePickerValue}
          //     />

          //     <Button type="default" style={{ marginRight: '10px' }} icon={<LeftOutlined />} onClick={onPrevWeek} />
          //     <Button type="default" style={{ marginRight: '0px' }} icon={<RightOutlined />} onClick={onNextWeek} />
          //   </>
          // }
        >
          <Descriptions.Item label="Дата" contentStyle={{ fontWeight: 'bold' }} span={3}>
            {currentAppointment?.begDate
              ? new Date(currentAppointment.begDate).toLocaleString('ru-RU', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })
              : 'не указаны'}
          </Descriptions.Item>
          <Descriptions.Item label="Время" contentStyle={{ fontWeight: 'bold' }} span={3}>
            {currentAppointment?.endDate
              ? `${new Date(currentAppointment.begDate).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                })} - ${new Date(currentAppointment.endDate).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}`
              : 'не указаны'}
          </Descriptions.Item>
          <Descriptions.Item
            label="Статус"
            span={3}
            contentStyle={{ color: currentAppointment?.service?.status ? 'green' : 'red' }}
          >
            {currentAppointment?.service?.status ? 'Оказана' : 'Неоказана'}
          </Descriptions.Item>
          <Descriptions.Item label="Пациент" span={3}>
            {currentAppointment?.service
              ? `${currentAppointment.service.patient?.number} ${currentAppointment.service.patient?.surname} ${currentAppointment.service.patient?.name[0]}.${currentAppointment.service.patient?.patronymic[0]}.`
              : ' - '}
          </Descriptions.Item>
          <Descriptions.Item label="Специалист" span={3}>
            {currentAppointment?.service ? (
              <Button
                type="link"
                size="small"
                onClick={(e) => navigate(`/specialists/${currentAppointment.specialist._id}/info`)}
              >{`${currentAppointment?.specialist?.name}`}</Button>
            ) : (
              ' - '
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Курс" span={3}>
            {currentAppointment?.service?.course?.number === 0
              ? 'вне курса'
              : `№${currentAppointment?.service?.course?.number}${
                  currentAppointment?.service?.course?.status ? '' : ' (ЗАКРЫТ)'
                }`}
          </Descriptions.Item>
          <Descriptions.Item label="Услуга" span={3}>
            {currentAppointment?.service ? `${currentAppointment?.service?.type?.name}` : ' - '}
          </Descriptions.Item>
          <Descriptions.Item label="Комментарий" span={3}>
            {currentAppointment?.service?.note ? `${currentAppointment?.service.note}` : ' - '}
          </Descriptions.Item>
          <Descriptions.Item label="Результат" span={3}>
            {currentAppointment?.service?.result ? `${currentAppointment?.service.result}` : ' - '}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default ModalAppInfo;
