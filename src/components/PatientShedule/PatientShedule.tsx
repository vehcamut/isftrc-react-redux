/* eslint-disable no-lone-blocks */
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
} from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { ExclamationCircleFilled, LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { DatePickerProps } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import ModalAddAppToServ from '../ModalAddAppToServ/ModalAddAppToServ';
import { addClass } from '../../app/common';
import classes from './PatientShedule.module.scss';
import { IAppointment, IPatient, IService, ISpecialist } from '../../models';
import { specialistAPI } from '../../app/services/specialists.service';
import { appointmentsAPI } from '../../app/services/appointments.service';
import './antd.rewrite.scss';
import Shedule from '../Shedule/Shedule';
import { servicesAPI } from '../../app/services';
import ModalAppInfo from '../ModalAppInfo/ModalAppInfo';
import { useAppSelector } from '../../app/hooks';

const { confirm } = Modal;

interface PatientSheduleProps extends PropsWithChildren {
  // eslint-disable-next-line react/require-default-props
  patient?: IPatient;
}

const PatientShedule: FunctionComponent<PatientSheduleProps> = ({ patient }) => {
  const { isAuth, roles, name, id } = useAppSelector((state) => state.authReducer);
  const isAdmin = roles.find((r) => r === 'admin');
  const isRepres = roles.find((r) => r === 'representative');
  const isSpec = roles.find((r) => r === 'specialist');
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  // modals
  const [isAddUpdateModalOpen, setIsAddUpdateModalOpen] = useState(false);
  const [isAppInfoOpen, setIsAppInfoOpen] = useState(false);
  // current
  // const [currentAppointment, setCurrentAppointment] = useState<IAppointment | undefined>(undefined);
  // API
  const [addAppointments] = appointmentsAPI.useAddAppointmentsMutation();
  // form state
  const [form] = Form.useForm();
  // const begDateField = Form.useWatch('begDate', form);
  // const timeField = Form.useWatch('time', form);
  // const amountField = Form.useWatch('amount', form);

  const params = useParams();

  const [curAppId, setCurAppId] = useState<string>('');
  // const { data: currentAppointment } = appointmentsAPI.useGetAppointmentByIdQuery({
  //   id: curAppId || '',
  // });

  const onAddUpdateReset = () => {
    form.resetFields();
    setIsAddUpdateModalOpen(false);
  };

  const onFinish = async (values: any) => {
    console.log(values);
    values.time = values.time.second(0);
    values.time = values.time.millisecond(0);
    values.begDate = values.begDate.second(0);
    values.begDate = values.begDate.millisecond(0);
    values.time = values.time.format('YYYY-MM-DDTHH:mm:ssZ');
    values.begDate = values.begDate.format('YYYY-MM-DDTHH:mm:ssZ');

    try {
      const result = await addAppointments({ ...values, specialist: patient?._id }).unwrap();
      messageApi.open({
        type: 'info',
        content: (
          <div>
            {/* <p>Расписание специалиста успешно обновлено.</p> */}
            <p>Добавлено записей: {result.amount}</p>
            {result.notAdded.length ? <p>Из-за накладки времени, не добавлено: </p> : ''}
            {result.notAdded.map((appment) => (
              <p key={appment.begDate.toLocaleString()}>
                {dayjs(appment.begDate).format('DD.MM.YY HH:mm')} - {dayjs(appment.endDate).format('DD.MM.YY HH:mm')}
              </p>
            ))}
          </div>
        ),
      });
      onAddUpdateReset();
    } catch (e) {
      messageApi.open({
        type: 'error',
        content: 'Ошибка связи с сервером',
      });
    }
  };

  const onAppointmentClick = (appointment: IAppointment) => {
    setCurAppId(appointment._id);
    // appointment.begDate = new Date();
    // setCurrentAppointment(appointment);
    setIsAppInfoOpen(true);
  };

  return (
    <>
      {contextHolder}
      {/* <Modal
        destroyOnClose
        open={isRemoveConfirmOpen}
        footer={
          <>
            <Button
              type="primary"
              style={{ marginRight: '10px', backgroundColor: '#e60000' }}
              onClick={onAppointmentRemove}
            >
              Удалить
            </Button>
            <Button
              type="primary"
              style={{ marginRight: '10px', backgroundColor: '#e60000' }}
              onClick={onAppointmentRewrite}
            >
              Перезаписать
            </Button>
            <Button type="primary" style={{ marginRight: '0px' }} onClick={() => setIsRemoveConfirmOpen(false)}>
              Отмена
            </Button>
          </>
        }
        title={
          <Typography.Title level={2} style={{ margin: 0, marginBottom: '20px' }}>
            Удаление записи
          </Typography.Title>
        }
        width="450px"
        onCancel={() => setIsRemoveConfirmOpen(false)}
      >
        <div>На данное время уже записан пациент.</div>
        <div>Вы точно хотите удалить запись?</div>
        <div>Вы можете также презаписать пациента на другое время.</div>
      </Modal> */}

      <ModalAppInfo
        title="Информация о записи"
        isOpen={isAppInfoOpen}
        setIsOpen={setIsAppInfoOpen}
        appointmentId={curAppId}
        setAppointmentId={setCurAppId}
        isSpecialistLink={!!isAdmin}
      />

      <Shedule
        dataAPI={appointmentsAPI.useGetForPatientAppointmentsQuery}
        title="Расписание пациента"
        extraOptions={{ patientId: patient?._id }}
        onAppointmentClick={onAppointmentClick}
        type="Patient"
        onDateChange={(f, s) => {
          const path = `${Date.parse(params.date || '') ? './.' : ''}./${f}`;
          navigate(path, { replace: true });
        }}
      />
    </>
  );
};

export default PatientShedule;
