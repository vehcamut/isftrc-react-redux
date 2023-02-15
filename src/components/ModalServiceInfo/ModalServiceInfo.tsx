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
  Input,
} from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { EditOutlined, ExclamationCircleFilled, LeftOutlined, RightOutlined } from '@ant-design/icons';
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
import ModalTextEnter from '../ModalTextEnter/ModalTextEnter';

const { confirm } = Modal;
const { TextArea } = Input;

interface ModalServiceInfoProps extends PropsWithChildren {
  // serviceId: string | undefined;
  title: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  serviceId: string;
  patient: IPatient | undefined;
  // setAppointmentId: React.Dispatch<React.SetStateAction<string>>;
}

const ModalServiceInfo: FunctionComponent<ModalServiceInfoProps> = ({
  isOpen,
  setIsOpen,
  serviceId,
  patient,
  // setAppointmentId,
  title,
}) => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // const [appointmentId, setAppointmentId] = useState<string>('');
  const [isChangeServiceTimeOpen, setIsChangeServiceTimeOpen] = useState(false);
  // const [currentService, setCurrentService] = useState<IService | undefined>(undefined);

  // API
  const { data: currentService } = servicesAPI.useGetAllInfoServiceQuery(
    {
      id: serviceId || '',
    },
    { skip: serviceId === '' },
  );
  const [closeService] = servicesAPI.useCloseServiceMutation();
  const [openService] = servicesAPI.useOpenServiceMutation();
  const [changeServNote] = servicesAPI.useChangeServNoteMutation();

  const onAppointmentRewrite = () => {
    // setCurrentService(currentAppointment?.service);
    setIsChangeServiceTimeOpen(true);
  };

  const onOpenService = async () => {
    try {
      await openService({ id: currentService?._id || '' }).unwrap();
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

  const onReset = () => {
    // setAppointmentId('');
    setIsOpen(false);
  };
  const [isChangeNoteOpen, setIsChangeNoteOpen] = useState(false);
  const onChangeNote = async (note: string) => {
    try {
      await changeServNote({ id: currentService?._id || '', note }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Комментарий успешно изменен',
      });
      setIsChangeNoteOpen(false);
    } catch (e) {
      messageApi.open({
        type: 'error',
        content: 'Ошибка связи с сервером',
      });
    }
  };

  const [isAddResultOpen, setIsAddResultOpen] = useState(false);
  // const onAddResult = async (note: string) => {
  //   try {
  //     await changeServNote({ id: currentAppointment?.service?._id || '', note }).unwrap();
  //     messageApi.open({
  //       type: 'success',
  //       content: 'Комментарий успешно изменен',
  //     });
  //     setIsChangeNoteOpen(false);
  //   } catch (e) {
  //     messageApi.open({
  //       type: 'error',
  //       content: 'Ошибка связи с сервером',
  //     });
  //   }
  // };
  const onCloseService = async (result: string) => {
    try {
      await closeService({ id: currentService?._id || '', result }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Запись успешно закрыта',
      });
      setIsAddResultOpen(false);
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
      <ModalAddAppToServ
        serviceId={currentService?._id}
        isOpen={isChangeServiceTimeOpen}
        setIsOpen={setIsChangeServiceTimeOpen}
        // setAppId={setAppointmentId}
      />
      <ModalTextEnter
        isOpen={isChangeNoteOpen}
        setIsOpen={setIsChangeNoteOpen}
        title="Изменение комментария записи"
        onFinish={onChangeNote}
        initText={currentService?.note}
      />
      <ModalTextEnter
        isOpen={isAddResultOpen}
        setIsOpen={setIsAddResultOpen}
        placeholder="Результат оказания услуги"
        title="Закрытие услуги"
        required
        onFinish={onCloseService}
        initText={currentService?.result}
      />
      <Modal
        destroyOnClose
        open={isOpen}
        footer={
          <>
            {!currentService?.canBeRemoved && !currentService?.appointment ? (
              <Button
                type="primary"
                style={{ marginRight: '10px' }}
                onClick={onAppointmentRewrite}
                disabled={!patient?.isActive}
              >
                Записать
              </Button>
            ) : null}
            {currentService?.canBeRemoved ? (
              <>
                {!currentService.status ? (
                  <Button
                    type="primary"
                    style={{ marginRight: '10px' }}
                    onClick={onAppointmentRewrite}
                    disabled={!patient?.isActive}
                  >
                    Перенести
                  </Button>
                ) : (
                  ''
                )}

                {!currentService.status &&
                currentService.appointment &&
                new Date(currentService.appointment.begDate) <= new Date() ? (
                  <Button
                    type="primary"
                    style={{ marginRight: '10px' }}
                    onClick={() => setIsAddResultOpen(true)}
                    disabled={!patient?.isActive}
                  >
                    Закрыть
                  </Button>
                ) : null}

                {currentService.status ? (
                  <Button
                    type="primary"
                    style={{ marginRight: '10px' }}
                    onClick={onOpenService}
                    disabled={!patient?.isActive}
                  >
                    Открыть
                  </Button>
                ) : null}
              </>
            ) : null}

            <Button type="default" style={{ marginRight: '0px' }} onClick={onReset}>
              Назад
            </Button>
          </>
        }
        title={
          <Typography.Title level={2} style={{ margin: 0, marginBottom: '20px' }}>
            {title}
          </Typography.Title>
        }
        width="600px"
        onCancel={onReset}
      >
        <Descriptions column={3}>
          <Descriptions.Item label="Дата" contentStyle={{ fontWeight: 'bold' }} span={3}>
            {currentService?.appointment?.begDate
              ? new Date(currentService?.appointment?.begDate).toLocaleString('ru-RU', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })
              : 'не указаны'}
          </Descriptions.Item>
          <Descriptions.Item label="Время" contentStyle={{ fontWeight: 'bold' }} span={3}>
            {currentService?.appointment?.endDate
              ? `${new Date(currentService?.appointment?.begDate).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                })} - ${new Date(currentService?.appointment?.endDate).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}`
              : 'не указаны'}
          </Descriptions.Item>
          <Descriptions.Item label="Статус" span={3} contentStyle={{ color: currentService?.status ? 'green' : 'red' }}>
            {currentService?.status ? 'Оказана' : 'Неоказана'}
          </Descriptions.Item>
          <Descriptions.Item label="Пациент" span={3}>
            {`${currentService?.patient?.number} ${currentService?.patient?.surname} ${currentService?.patient?.name[0]}.${currentService?.patient?.patronymic[0]}.`}
          </Descriptions.Item>
          <Descriptions.Item label="Специалист" span={3}>
            {currentService?.appointment ? (
              <Button
                type="link"
                size="small"
                onClick={(e) => navigate(`/specialists/${currentService?.appointment?.specialist._id}/info`)}
              >{`${currentService?.appointment?.specialist.surname} ${currentService?.patient?.name[0]}.${currentService?.patient?.patronymic[0]}.`}</Button>
            ) : (
              ' - '
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Курс" span={3}>
            {currentService?.course?.number === 0
              ? 'вне курса'
              : `№${currentService?.course?.number}${currentService?.course?.status ? '' : ' (ЗАКРЫТ)'}`}
          </Descriptions.Item>
          <Descriptions.Item label="Услуга" span={3}>
            {currentService?.type.name}
          </Descriptions.Item>

          <Descriptions.Item
            label={
              <>
                Комментарий
                {!currentService?.status && currentService?.canBeRemoved ? (
                  <Button type="link" icon={<EditOutlined />} size="small" onClick={() => setIsChangeNoteOpen(true)} />
                ) : null}
              </>
            }
            span={3}
          >
            {currentService?.note ? `${currentService.note}` : ' - '}
          </Descriptions.Item>
          {currentService?.status ? (
            <Descriptions.Item label="Результат" span={3}>
              {currentService?.result ? `${currentService.result}` : ' - '}
            </Descriptions.Item>
          ) : null}
        </Descriptions>
      </Modal>
    </>
  );
};

// ModalAppInfo.defaultProps = {
//   title
// }

export default ModalServiceInfo;
