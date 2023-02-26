/* eslint-disable no-nested-ternary */
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
  Spin,
  Divider,
  Card,
} from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { EditOutlined, ExclamationCircleFilled, LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { DatePickerProps } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { addClass, equalThenNowDate, greaterThenNowDate } from '../../app/common';
import classes from './ModalAppInfo.module.scss';
import { IAppointment, IPatient, IService, ISpecialist } from '../../models';
import { specialistAPI } from '../../app/services/specialists.service';
import { appointmentsAPI } from '../../app/services/appointments.service';
import './antd.rewrite.scss';
import Shedule from '../Shedule/Shedule';
import { patientsAPI, servicesAPI } from '../../app/services';
import ModalAddAppToServ from '../ModalAddAppToServ/ModalAddAppToServ';
import ModalTextEnter from '../ModalTextEnter/ModalTextEnter';
import { useAppSelector } from '../../app/hooks';
import MModalAddAppToServ from '../ModalAddAppToServ/MModalAddAppToServ';
import MModalTextEnter from '../ModalTextEnter/MModalTextEnter';

const { confirm } = Modal;
const { TextArea } = Input;
const { Text, Paragraph } = Typography;

interface MModalServiceInfoProps extends PropsWithChildren {
  // serviceId: string | undefined;
  title: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  serviceId: string;
  patient: IPatient | undefined;
  // setAppointmentId: React.Dispatch<React.SetStateAction<string>>;
}

const MModalServiceInfo: FunctionComponent<MModalServiceInfoProps> = ({
  isOpen,
  setIsOpen,
  serviceId,
  patient,
  // setAppointmentId,
  title,
}) => {
  const { isAuth, roles, name, id } = useAppSelector((state) => state.authReducer);
  const isAdmin = roles.find((r) => r === 'admin');
  const isRepres = roles.find((r) => r === 'representative');
  const isSpec = roles.find((r) => r === 'specialist');
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // const [appointmentId, setAppointmentId] = useState<string>('');
  const [isChangeServiceTimeOpen, setIsChangeServiceTimeOpen] = useState(false);
  // const [currentService, setCurrentService] = useState<IService | undefined>(undefined);

  // API
  const { data: currentService, isFetching } = servicesAPI.useGetAllInfoServiceQuery(
    {
      id: serviceId || '',
    },
    { skip: serviceId === '' },
  );
  const [closeService] = servicesAPI.useCloseServiceMutation();
  const [openService] = servicesAPI.useOpenServiceMutation();
  const [removeService] = patientsAPI.useRemoveServiceMutation();
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

  const onRemoveService = () => {
    const showConfirm = () => {
      confirm({
        title: 'Подтвердите удаление улсуги.',
        icon: <ExclamationCircleFilled />,
        content: 'Вы точно хотите удалить услугу?',
        async onOk() {
          try {
            const result = await removeService({ id: currentService?._id || '' }).unwrap();
            messageApi.open({
              type: 'success',
              content: 'Услуга успешно удалена',
            });
            onReset();
          } catch (e) {
            messageApi.open({
              type: 'error',
              content: 'Ошибка связи с сервером',
            });
          }
        },
        // onCancel() {
        //   console.log('Cancel');
        // },
      });
    };
    showConfirm();
  };

  return (
    <>
      {contextHolder}
      <MModalAddAppToServ
        serviceId={currentService?._id}
        isOpen={isChangeServiceTimeOpen}
        setIsOpen={setIsChangeServiceTimeOpen}
        // setAppId={setAppointmentId}
      />
      <MModalTextEnter
        isOpen={isChangeNoteOpen}
        setIsOpen={setIsChangeNoteOpen}
        title="Изменение комментария записи"
        onFinish={onChangeNote}
        initText={currentService?.note}
      />
      <MModalTextEnter
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
            {!currentService?.canBeRemoved && !currentService?.appointment && isAdmin && !isFetching ? (
              <Button
                type="primary"
                style={{ marginRight: '10px', backgroundColor: '#e60000' }}
                onClick={onRemoveService}
                disabled={!patient?.isActive}
                // disabled={!currentAppointment.service.patient?.isActive}
              >
                Удалить
              </Button>
            ) : null}
            {!currentService?.canBeRemoved && !currentService?.appointment && !isFetching ? (
              <Button
                type="primary"
                style={{ marginRight: '10px' }}
                onClick={onAppointmentRewrite}
                disabled={!patient?.isActive}
              >
                Записать
              </Button>
            ) : null}
            {currentService?.canBeRemoved && !isFetching ? (
              <>
                {!currentService.status &&
                (isAdmin ||
                  (isRepres &&
                    currentService?.appointment?.begDate &&
                    greaterThenNowDate(new Date(currentService.appointment.begDate)))) ? (
                  <Button
                    type="primary"
                    style={{ marginRight: '10px' }}
                    onClick={onAppointmentRewrite}
                    disabled={!patient?.isActive}
                  >
                    Перенести
                  </Button>
                ) : null}
                {!currentService.status &&
                currentService.appointment &&
                new Date(currentService.appointment.begDate) <= new Date() &&
                (isAdmin ||
                  (isSpec &&
                    currentService.appointment.specialist._id === id &&
                    equalThenNowDate(new Date(currentService.appointment.begDate)))) ? (
                  <Button
                    type="primary"
                    style={{ marginRight: '10px' }}
                    onClick={() => setIsAddResultOpen(true)}
                    disabled={!patient?.isActive}
                  >
                    Закрыть
                  </Button>
                ) : null}

                {currentService.status &&
                (isAdmin ||
                  (isSpec &&
                    currentService?.appointment?.specialist._id === id &&
                    equalThenNowDate(new Date(currentService.appointment.begDate)))) ? (
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
          <Typography.Title level={4} style={{ margin: 0, marginBottom: '20px' }}>
            {title}
          </Typography.Title>
        }
        width="600px"
        onCancel={onReset}
      >
        <Spin
          tip={<div style={{ marginTop: '10px', width: '100%' }}>Загрузка...</div>}
          size="large"
          spinning={isFetching}
        >
          {isFetching ? (
            <Descriptions column={3} layout="horizontal" size="small">
              <Descriptions.Item label="Дата" contentStyle={{ fontWeight: 'bold' }} span={3}>
                -
              </Descriptions.Item>
              <Descriptions.Item label="Время" contentStyle={{ fontWeight: 'bold' }} span={3}>
                -
              </Descriptions.Item>
              <Descriptions.Item label="Статус" span={3}>
                -
              </Descriptions.Item>
              <Descriptions.Item label="Пациент" span={3}>
                -
              </Descriptions.Item>
              <Descriptions.Item label="Специалист" span={3}>
                -
              </Descriptions.Item>
              <Descriptions.Item label="Курс" span={3}>
                -
              </Descriptions.Item>
              <Descriptions.Item label="Услуга" span={3}>
                -
              </Descriptions.Item>
              {!isRepres ? (
                <Descriptions.Item label="Комментарий" span={3}>
                  -
                </Descriptions.Item>
              ) : null}

              {currentService?.status ? (
                <Descriptions.Item label="Результат" span={3}>
                  -
                </Descriptions.Item>
              ) : null}
            </Descriptions>
          ) : (
            <>
              {!currentService?.status &&
              isRepres &&
              currentService?.appointment?.begDate &&
              !greaterThenNowDate(new Date(currentService.appointment.begDate)) ? (
                <Card style={{ width: '100%', textAlign: 'center', marginBottom: '10px', backgroundColor: '#e6f4ff' }}>
                  <Paragraph strong>
                    {/* В день оказания или позже услугу можно отменить или перенести только связавшись с администратором. */}
                    Отменить или перенести запись в данный момент невозможно.
                  </Paragraph>
                  <Paragraph strong>Свяжитесь с администратором.</Paragraph>
                </Card>
              ) : null}
              {!currentService?.status &&
              isSpec &&
              currentService?.appointment?.specialist._id === id &&
              !equalThenNowDate(new Date(currentService.appointment.begDate)) ? (
                // isRepres &&
                // currentService?.appointment?.begDate &&
                // !greaterThenNowDate(new Date(currentService.appointment.begDate))
                <Card style={{ width: '100%', textAlign: 'center', marginBottom: '10px', backgroundColor: '#e6f4ff' }}>
                  <Paragraph strong>
                    {/* В день оказания или позже услугу можно отменить или перенести только связавшись с администратором. */}
                    Закрыть запись в данный момент невозможно.
                  </Paragraph>
                  <Paragraph strong>Свяжитесь с администратором.</Paragraph>
                </Card>
              ) : null}
              <Descriptions column={3} layout="horizontal" size="small">
                <Descriptions.Item label="Дата" contentStyle={{ fontWeight: 'bold' }} span={3}>
                  {currentService?.appointment?.begDate
                    ? new Date(currentService?.appointment?.begDate).toLocaleString('ru-RU', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })
                    : 'не указана'}
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
                    : 'не указано'}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Статус"
                  span={3}
                  contentStyle={{ color: currentService?.status ? 'green' : 'red' }}
                >
                  {currentService?.status ? 'Оказана' : 'Не оказана'}
                </Descriptions.Item>
                <Descriptions.Item label="Пациент" span={3}>
                  {`${currentService?.patient?.number} ${currentService?.patient?.surname} ${currentService?.patient?.name[0]}.${currentService?.patient?.patronymic[0]}.`}
                </Descriptions.Item>
                <Descriptions.Item label="Специалист" span={3}>
                  {currentService?.appointment && currentService?.appointment?.specialist?.patronymic ? (
                    isAdmin ? (
                      <Button
                        type="link"
                        size="small"
                        onClick={(e) => navigate(`/specialists/${currentService?.appointment?.specialist._id}/info`)}
                      >{`${currentService?.appointment?.specialist.surname} ${currentService?.appointment?.specialist?.name[0]}.${currentService?.appointment?.specialist?.patronymic[0]}.`}</Button>
                    ) : (
                      `${currentService?.appointment?.specialist?.surname} ${currentService?.appointment?.specialist?.name[0]}.${currentService?.appointment?.specialist?.patronymic[0]}.`
                    )
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
              </Descriptions>
              {!isRepres || currentService?.status ? (
                <Divider style={{ margin: '5px 0', borderColor: '#e6f4ff' }} />
              ) : null}

              <Descriptions column={3} layout="vertical" size="small">
                {!isRepres ? (
                  <Descriptions.Item
                    label={
                      <>
                        Комментарий
                        {!currentService?.status &&
                        currentService?.canBeRemoved &&
                        (isAdmin || (isSpec && currentService?.appointment?.specialist._id === id)) ? (
                          <Button
                            type="link"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => setIsChangeNoteOpen(true)}
                          />
                        ) : null}
                      </>
                    }
                    span={3}
                  >
                    {currentService?.note ? `${currentService.note}` : ' - '}
                  </Descriptions.Item>
                ) : null}
                {currentService?.status ? (
                  <Descriptions.Item label="Результат" span={3}>
                    {currentService?.result ? `${currentService.result}` : ' - '}
                  </Descriptions.Item>
                ) : null}
              </Descriptions>
            </>
          )}
          {/* <Descriptions column={3}>
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
            <Descriptions.Item
              label="Статус"
              span={3}
              contentStyle={{ color: currentService?.status ? 'green' : 'red' }}
            >
              {currentService?.status ? 'Оказана' : 'Не оказана'}
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
                    <Button
                      type="link"
                      icon={<EditOutlined />}
                      size="small"
                      onClick={() => setIsChangeNoteOpen(true)}
                    />
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
          </Descriptions> */}
        </Spin>
      </Modal>
    </>
  );
};

// ModalAppInfo.defaultProps = {
//   title
// }

export default MModalServiceInfo;
