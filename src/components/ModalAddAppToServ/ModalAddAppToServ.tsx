import { Button, Modal, Typography, message, Empty, Select, Result } from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import dayjs from 'dayjs';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { IAppointment } from '../../models';
import { specialistAPI } from '../../app/services/specialists.service';
import { appointmentsAPI } from '../../app/services/appointments.service';
import Shedule from '../Shedule/Shedule';
import { servicesAPI } from '../../app/services';
import { useAppSelector } from '../../app/hooks';
import { mutationErrorHandler } from '../../app/common';
import ErrorResult from '../ErrorResult/ErrorResult';

const { confirm } = Modal;

interface ModalAddAppToServProps extends PropsWithChildren {
  serviceId: string | undefined;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAppId?: React.Dispatch<React.SetStateAction<string>>;
  setOnCancel?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalAddAppToServ: FunctionComponent<ModalAddAppToServProps> = ({
  serviceId,
  isOpen,
  setIsOpen,
  setAppId,
  setOnCancel,
}) => {
  const { roles } = useAppSelector((state) => state.authReducer);
  const isSpec = roles.find((r) => r === 'specialist');
  const [isSuccess, setIsSuccess] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();

  const [setAppointments] = servicesAPI.useSetAppointmentToServiceMutation();

  const [currentSpecialist, setCurrentSpecialist] = useState<string | undefined>(undefined);
  const {
    data: currentService,
    isLoading: isLoadingCurrentServise,
    isError: isErrorCS,
  } = servicesAPI.useGetAllInfoServiceQuery(
    {
      id: serviceId || '',
    },
    {
      skip: !serviceId || !!isSpec || !!isSuccess,
    },
  );
  const {
    data,
    isLoading,
    isError: isErrorSS,
  } = specialistAPI.useGetSpecificSpecialistsQuery(
    {
      type: currentService?.type._id || '',
    },
    {
      skip: !currentService?.type._id || !!isSpec || !!isSuccess,
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
            mutationErrorHandler(messageApi, e);
          }
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
        content: 'Вы точно хотите отменить запись?',
        async onOk() {
          try {
            const result = await setAppointments({
              serviceId: currentService?._id || '',
            }).unwrap();
            setIsSuccess(-1);
            if (setAppId) setAppId(result);
            if (setOnCancel) setOnCancel(false);
          } catch (e) {
            mutationErrorHandler(messageApi, e);
          }
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

  if (isErrorCS || isErrorSS) return <ErrorResult />;

  return (
    <>
      {contextHolder}
      <Modal
        destroyOnClose
        open={isOpen}
        footer={
          !isSuccess ? (
            <>
              {currentService?.appointment ? (
                <Button
                  type="primary"
                  style={{ marginRight: '0px', backgroundColor: '#e60000' }}
                  onClick={onAppointmentReset}
                >
                  Отменить
                </Button>
              ) : null}

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
              disabled={isLoadingCurrentServise}
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

ModalAddAppToServ.defaultProps = {
  setAppId: undefined,
  setOnCancel: undefined,
};

export default ModalAddAppToServ;
