/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/indent */
import { Button, Modal, Typography, Descriptions, message, Spin, Divider, Card } from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { EditOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { equalThenNowDate, greaterThenNowDate, mutationErrorHandler } from '../../app/common';
import { IPatient } from '../../models';
import { patientsAPI, servicesAPI } from '../../app/services';
import { useAppSelector } from '../../app/hooks';
import MModalAddAppToServ from '../ModalAddAppToServ/MModalAddAppToServ';
import MModalTextEnter from '../ModalTextEnter/MModalTextEnter';

const { confirm } = Modal;
const { Paragraph } = Typography;

interface MModalServiceInfoProps extends PropsWithChildren {
  title: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  serviceId: string;
  patient: IPatient | undefined;
}

const MModalServiceInfo: FunctionComponent<MModalServiceInfoProps> = ({
  isOpen,
  setIsOpen,
  serviceId,
  patient,
  title,
}) => {
  const { roles, id } = useAppSelector((state) => state.authReducer);
  const isAdmin = roles.find((r) => r === 'admin');
  const isRepres = roles.find((r) => r === 'representative');
  const isSpec = roles.find((r) => r === 'specialist');
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [isChangeServiceTimeOpen, setIsChangeServiceTimeOpen] = useState(false);

  const { data: currentService, isFetching } = servicesAPI.useGetAllInfoServiceQuery(
    {
      id: serviceId || '',
    },
    { skip: serviceId === '' || !serviceId },
  );
  const [closeService] = servicesAPI.useCloseServiceMutation();
  const [openService] = servicesAPI.useOpenServiceMutation();
  const [removeService] = patientsAPI.useRemoveServiceMutation();
  const [changeServNote] = servicesAPI.useChangeServNoteMutation();

  const onAppointmentRewrite = () => {
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
      mutationErrorHandler(messageApi, e);
    }
  };

  const onReset = () => {
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
      mutationErrorHandler(messageApi, e);
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
      mutationErrorHandler(messageApi, e);
    }
  };

  const onRemoveService = () => {
    const showConfirm = () => {
      confirm({
        title: 'Подтвердите удаление услуги.',
        icon: <ExclamationCircleFilled />,
        content: 'Вы точно хотите удалить услугу?',
        async onOk() {
          try {
            await removeService({ id: currentService?._id || '' }).unwrap();
            messageApi.open({
              type: 'success',
              content: 'Услуга успешно удалена',
            });
            onReset();
          } catch (e) {
            mutationErrorHandler(messageApi, e);
          }
        },
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
                  <Paragraph strong>Отменить или перенести запись в данный момент невозможно.</Paragraph>
                  <Paragraph strong>Свяжитесь с администратором.</Paragraph>
                </Card>
              ) : null}
              {!currentService?.status &&
              isSpec &&
              currentService?.appointment?.specialist._id === id &&
              !equalThenNowDate(new Date(currentService.appointment.begDate)) ? (
                <Card style={{ width: '100%', textAlign: 'center', marginBottom: '10px', backgroundColor: '#e6f4ff' }}>
                  <Paragraph strong>Закрыть запись в данный момент невозможно.</Paragraph>
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
                        onClick={() => navigate(`/specialists/${currentService?.appointment?.specialist._id}/info`)}
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
        </Spin>
      </Modal>
    </>
  );
};

export default MModalServiceInfo;
