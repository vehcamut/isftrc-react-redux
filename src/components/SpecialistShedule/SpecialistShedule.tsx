/* eslint-disable @typescript-eslint/indent */
import { Button, Modal, Typography, message, Row, Col, DatePicker, Form, TimePicker, InputNumber } from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import utc from 'dayjs/plugin/utc';
import { mutationErrorHandler } from '../../app/common';
import { IAppointment, ISpecialist } from '../../models';
import { appointmentsAPI } from '../../app/services/appointments.service';
import Shedule from '../Shedule/Shedule';
import ModalAppInfo from '../ModalAppInfo/ModalAppInfo';
import { useAppSelector } from '../../app/hooks';

dayjs.extend(utc);
interface SpecialistSheduleProps extends PropsWithChildren {
  specialist?: ISpecialist;
}

const SpecialistShedule: FunctionComponent<SpecialistSheduleProps> = ({ specialist }) => {
  const { roles } = useAppSelector((state) => state.authReducer);
  const isAdmin = roles.find((r) => r === 'admin');
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  // modals
  const [isAddUpdateModalOpen, setIsAddUpdateModalOpen] = useState(false);
  const [isAppInfoOpen, setIsAppInfoOpen] = useState(false);
  // current
  const [currentAppointment, setCurrentAppointment] = useState<IAppointment | undefined>(undefined);
  // API
  const [addAppointments] = appointmentsAPI.useAddAppointmentsMutation();
  // form state
  const [form] = Form.useForm();
  const begDateField = Form.useWatch('begDate', form);
  const timeField = Form.useWatch('time', form);
  const amountField = Form.useWatch('amount', form);
  const params = useParams();

  const onAddUpdateReset = () => {
    form.resetFields();
    setIsAddUpdateModalOpen(false);
  };

  const onFinish = async (values: any) => {
    values.time = values.time.second(0);
    values.time = values.time.millisecond(0);
    values.time.utcOffset(0, true);
    values.begDate = values.begDate.second(0);
    values.begDate = values.begDate.millisecond(0);
    values.time = values.time.format('YYYY-MM-DDTHH:mm:ssZ');
    values.begDate = values.begDate.format('YYYY-MM-DDTHH:mm:ssZ');

    try {
      const result = await addAppointments({ ...values, specialist: specialist?._id }).unwrap();
      messageApi.open({
        type: 'info',
        content: (
          <div>
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
      mutationErrorHandler(messageApi, e);
    }
  };

  const onAppointmentClick = (appointment: IAppointment) => {
    setCurrentAppointment(appointment);
    setIsAppInfoOpen(true);
  };

  return (
    <>
      {contextHolder}
      <Modal
        destroyOnClose
        open={isAddUpdateModalOpen}
        footer={null}
        title={
          <Typography.Title level={2} style={{ margin: 0, marginBottom: '20px' }}>
            Добавление записей
          </Typography.Title>
        }
        width="500px"
        onCancel={onAddUpdateReset}
      >
        <Form form={form} labelWrap labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} onFinish={onFinish}>
          <Form.Item
            rules={[{ required: true, message: 'Поле "Дата и время" не должно быть пустым' }]}
            label="Дата и время"
            name="begDate"
          >
            <DatePicker
              id="begDate"
              style={{ marginRight: '10px' }}
              format="DD.MM.YYYY | HH:mm"
              showTime={{ format: 'HH:mm' }}
            />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: 'Поле "Продолжительность" не должно быть пустым' }]}
            label="Продолжительность"
            name="time"
          >
            <TimePicker format="HH:mm" id="time" showNow={false} />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: 'Поле "Количество" не должно быть пустым' }]}
            label="Количество"
            name="amount"
          >
            <InputNumber min={1} max={100} id="amount" />
          </Form.Item>
          {begDateField && timeField && amountField ? (
            <div>
              <p style={{ margin: 0, color: 'gray' }}>Будет добавлено записей: {amountField}</p>
              <p style={{ margin: 0, color: 'gray' }}>Дата и время начала: {begDateField.format('DD.MM.YY HH:mm')}</p>
              <p style={{ marginTop: 0, marginBottom: '20px', color: 'gray' }}>
                Дата и время окончания:{' '}
                {dayjs(begDateField)
                  .add(amountField * timeField.hour(), 'h')
                  .add(amountField * timeField.minute(), 'm')
                  .format('DD.MM.YY HH:mm')}
              </p>
            </div>
          ) : (
            ''
          )}
          <Form.Item wrapperCol={{ offset: 0, span: 24 }} style={{ marginBottom: 0 }}>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
                  Сохранить
                </Button>
                <Button htmlType="button" onClick={onAddUpdateReset}>
                  Отменить
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>

      <ModalAppInfo
        title="Информация о записи"
        isOpen={isAppInfoOpen}
        setIsOpen={setIsAppInfoOpen}
        appointmentId={currentAppointment?._id || ''}
        isPatientLink={!!isAdmin}
      />

      <Shedule
        dataAPI={appointmentsAPI.useGetAppointmentsQuery}
        title="Расписание специалиста"
        extraOptions={{ specialistId: specialist?._id }}
        onAppointmentClick={onAppointmentClick}
        type="Specialist"
        onDateChange={(f) => {
          const path = `${Date.parse(params.date || '') ? './.' : ''}./${f}`;
          navigate(path, { replace: true });
        }}
        extra={
          <Button
            type="primary"
            style={{ marginRight: '10px' }}
            onClick={() => setIsAddUpdateModalOpen(true)}
            disabled={!specialist?.isActive}
          >
            Добавить запись
          </Button>
        }
      />
    </>
  );
};

SpecialistShedule.defaultProps = {
  specialist: undefined,
};

export default SpecialistShedule;
