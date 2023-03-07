/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-nested-ternary */
import { Button, Modal, Typography, Descriptions, message, Spin, Card } from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { EditOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { equalThenNowDate, greaterThenNowDate, mutationErrorHandler } from '../../app/common';
import { IService } from '../../models';
import { appointmentsAPI } from '../../app/services/appointments.service';
import { servicesAPI } from '../../app/services';
import ModalAddAppToServ from '../ModalAddAppToServ/ModalAddAppToServ';
import ModalTextEnter from '../ModalTextEnter/ModalTextEnter';
import { useAppSelector } from '../../app/hooks';
import ErrorResult from '../ErrorResult/ErrorResult';

const { confirm } = Modal;
const { Paragraph } = Typography;

interface ModalAppInfoProps extends PropsWithChildren {
  title: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  appointmentId: string;
  setAppointmentId?: React.Dispatch<React.SetStateAction<string>>;
  isPatientLink?: boolean;
  isSpecialistLink?: boolean;
}

const ModalAppInfo: FunctionComponent<ModalAppInfoProps> = ({
  isOpen,
  setIsOpen,
  appointmentId,
  setAppointmentId,
  title,
  isPatientLink,
  isSpecialistLink,
}) => {
  const { roles, id } = useAppSelector((state) => state.authReducer);
  const isAdmin = roles.find((r) => r === 'admin');
  const isRepres = roles.find((r) => r === 'representative');
  const isSpec = roles.find((r) => r === 'specialist');
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [isChangeServiceTimeOpen, setIsChangeServiceTimeOpen] = useState(false);
  const [currentService, setCurrentService] = useState<IService | undefined>(undefined);

  // API
  const {
    data: currentAppointment,
    isFetching,
    isError,
  } = appointmentsAPI.useGetAppointmentByIdQuery(
    {
      id: appointmentId || '',
    },
    { skip: appointmentId === '' || isChangeServiceTimeOpen || !appointmentId, pollingInterval: 15000 },
  );
  const [closeService] = servicesAPI.useCloseServiceMutation();
  const [openService] = servicesAPI.useOpenServiceMutation();
  const [changeServNote] = servicesAPI.useChangeServNoteMutation();
  const [removeAppointments] = appointmentsAPI.useRemoveAppointmentsMutation();

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
      mutationErrorHandler(messageApi, e);
    }
  };

  const onReset = () => {
    if (setAppointmentId) setAppointmentId('');
    setIsOpen(false);
  };
  const [isChangeNoteOpen, setIsChangeNoteOpen] = useState(false);
  const onChangeNote = async (note: string) => {
    try {
      await changeServNote({ id: currentAppointment?.service?._id || '', note }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Комментарий успешно изменен',
      });
      setIsChangeNoteOpen(false);
    } catch (e) {
      mutationErrorHandler(messageApi, e);
    }
  };

  const [isAddResultOpen, setIsAddResultOpen] = useState(false);

  const onCloseService = async (result: string) => {
    try {
      await closeService({ id: currentAppointment?.service?._id || '', result }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Запись успешно закрыта',
      });
      setIsAddResultOpen(false);
    } catch (e) {
      mutationErrorHandler(messageApi, e);
    }
  };

  const onAppointmentRemove = async () => {
    const showConfirm = () => {
      confirm({
        title: 'Подтвердите удаление записи.',
        icon: <ExclamationCircleFilled />,
        content: 'Вы точно хотите удалить запись?',
        async onOk() {
          try {
            await removeAppointments({ _id: currentAppointment?._id || '' }).unwrap();
            messageApi.open({
              type: 'success',
              content: 'Запись успешно удалена',
            });
            setIsOpen(false);
          } catch (e) {
            mutationErrorHandler(messageApi, e);
          }
        },
      });
    };
    showConfirm();
  };
  if (isError) return <ErrorResult />;
  return (
    <>
      {contextHolder}
      <ModalAddAppToServ
        serviceId={currentService?._id}
        isOpen={isChangeServiceTimeOpen}
        setIsOpen={setIsChangeServiceTimeOpen}
        setAppId={setAppointmentId}
        setOnCancel={setIsOpen}
      />
      <ModalTextEnter
        isOpen={isChangeNoteOpen}
        setIsOpen={setIsChangeNoteOpen}
        title="Изменение комментария к записи"
        onFinish={onChangeNote}
        initText={currentAppointment?.service?.note}
      />
      <ModalTextEnter
        isOpen={isAddResultOpen}
        setIsOpen={setIsAddResultOpen}
        placeholder="Результат оказания услуги"
        title="Закрытие услуги"
        required
        onFinish={onCloseService}
        initText={currentAppointment?.service?.result}
      />
      <Modal
        destroyOnClose
        open={isOpen}
        footer={
          <>
            {!currentAppointment?.service && isAdmin && !isFetching ? (
              <Button
                type="primary"
                style={{ marginRight: '10px', backgroundColor: '#e60000' }}
                onClick={onAppointmentRemove}
                disabled={!currentAppointment?.specialist.isActive}
              >
                Удалить
              </Button>
            ) : null}
            {currentAppointment?.service?.canBeRemoved && !isFetching ? (
              <>
                {currentAppointment?.service &&
                !currentAppointment.service.status &&
                (isAdmin ||
                  (isRepres &&
                    currentAppointment?.begDate &&
                    greaterThenNowDate(new Date(currentAppointment.begDate)))) ? (
                  <Button
                    type="primary"
                    style={{ marginRight: '10px' }}
                    onClick={onAppointmentRewrite}
                    disabled={!currentAppointment.service.patient?.isActive}
                  >
                    Перенести
                  </Button>
                ) : (
                  ''
                )}

                {currentAppointment?.service &&
                !currentAppointment.service.status &&
                currentAppointment?.begDate &&
                new Date(currentAppointment?.begDate) <= new Date() &&
                (isAdmin ||
                  (isSpec &&
                    currentAppointment?.specialist._id === id &&
                    equalThenNowDate(new Date(currentAppointment?.begDate)))) ? (
                  <Button
                    type="primary"
                    style={{ marginRight: '10px' }}
                    onClick={() => setIsAddResultOpen(true)}
                    disabled={!currentAppointment.service.patient?.isActive}
                  >
                    Закрыть
                  </Button>
                ) : null}

                {currentAppointment?.service &&
                currentAppointment.service.status &&
                (isAdmin ||
                  (isSpec &&
                    currentAppointment?.specialist._id === id &&
                    equalThenNowDate(new Date(currentAppointment?.begDate)))) ? (
                  <Button
                    type="primary"
                    style={{ marginRight: '10px' }}
                    onClick={onOpenService}
                    disabled={!currentAppointment.service.patient?.isActive}
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
        <Spin
          tip={<div style={{ marginTop: '10px', width: '100%' }}>Загрузка...</div>}
          size="large"
          spinning={isFetching}
        >
          {isFetching ? (
            <Descriptions column={3}>
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
              {!currentAppointment?.service?.status &&
              isRepres &&
              currentAppointment?.begDate &&
              !greaterThenNowDate(new Date(currentAppointment?.begDate)) ? (
                <Card style={{ width: '100%', textAlign: 'center', marginBottom: '10px', backgroundColor: '#e6f4ff' }}>
                  <Paragraph strong>Отменить или перенести запись в данный момент невозможно.</Paragraph>
                  <Paragraph strong>Свяжитесь с администратором.</Paragraph>
                </Card>
              ) : null}
              <Descriptions column={3}>
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
                  {currentAppointment?.service ? (currentAppointment?.service?.status ? 'Оказана' : 'Не оказана') : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Пациент" span={3}>
                  {currentAppointment?.service ? (
                    isPatientLink ? (
                      <Button
                        type="link"
                        size="small"
                        onClick={() => navigate(`/patients/${currentAppointment.service?.patient?._id}/info`)}
                      >{`${currentAppointment.service.patient?.number} ${currentAppointment.service.patient?.surname} ${currentAppointment.service.patient?.name[0]}.${currentAppointment.service.patient?.patronymic[0]}.`}</Button>
                    ) : (
                      `${currentAppointment.service.patient?.number} ${currentAppointment.service.patient?.surname} ${currentAppointment.service.patient?.name[0]}.${currentAppointment.service.patient?.patronymic[0]}.`
                    )
                  ) : (
                    ' - '
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Специалист" span={3}>
                  {currentAppointment?.service ? (
                    isSpecialistLink ? (
                      <Button
                        type="link"
                        size="small"
                        onClick={() => navigate(`/specialists/${currentAppointment.specialist._id}/info`)}
                      >{`${currentAppointment?.specialist?.name}`}</Button>
                    ) : (
                      currentAppointment?.specialist?.name
                    )
                  ) : (
                    ' - '
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Курс" span={3}>
                  {currentAppointment?.service
                    ? currentAppointment?.service?.course?.number === 0
                      ? 'вне курса'
                      : `№${currentAppointment?.service?.course?.number}${
                          currentAppointment?.service?.course?.status ? '' : ' (ЗАКРЫТ)'
                        }`
                    : '-'}
                </Descriptions.Item>
                <Descriptions.Item label="Услуга" span={3}>
                  {currentAppointment?.service ? `${currentAppointment?.service?.type?.name}` : ' - '}
                </Descriptions.Item>

                {!isRepres ? (
                  <Descriptions.Item
                    label={
                      <>
                        Комментарий
                        {!currentAppointment?.service?.status && currentAppointment?.service?.canBeRemoved ? (
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
                    {currentAppointment?.service?.note ? `${currentAppointment?.service.note}` : ' - '}
                  </Descriptions.Item>
                ) : null}
                {currentAppointment?.service?.status ? (
                  <Descriptions.Item label="Результат" span={3}>
                    {currentAppointment?.service?.result ? `${currentAppointment?.service.result}` : ' - '}
                  </Descriptions.Item>
                ) : null}
              </Descriptions>
            </>
          )}
        </Spin>
      </Modal>
    </>
  );
};

ModalAppInfo.defaultProps = {
  setAppointmentId: undefined,
  isPatientLink: false,
  isSpecialistLink: false,
};

export default ModalAppInfo;
