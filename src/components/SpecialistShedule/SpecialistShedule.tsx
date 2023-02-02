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
} from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { DatePickerProps } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { addClass } from '../../app/common';
import classes from './SpecialistShedule.module.scss';
import { IAppointment, ISpecialist } from '../../models';
import { specialistAPI } from '../../app/services/specialists.service';
import { appointmentsAPI } from '../../app/services/appointments.service';
import './antd.rewrite.scss';
import Shedule from '../Shedule/Shedule';

interface SpecialistSheduleProps extends PropsWithChildren {
  // eslint-disable-next-line react/require-default-props
  specialist?: ISpecialist;
}

const SpecialistShedule: FunctionComponent<SpecialistSheduleProps> = ({ specialist }) => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  // modals
  const [isAddUpdateModalOpen, setIsAddUpdateModalOpen] = useState(false);
  const [isAppInfoOpen, setIsAppInfoOpen] = useState(false);
  const [isRemoveConfirmOpen, setIsRemoveConfirmOpen] = useState(false);
  const [isChangeServiceTimeOpen, setIsChangeServiceTimeOpen] = useState(false);
  // current
  const [currentAppointment, setCurrentAppointment] = useState<IAppointment | undefined>(undefined);
  // API
  const [addAppointments] = appointmentsAPI.useAddAppointmentsMutation();
  const [removeAppointments] = appointmentsAPI.useRemoveAppointmentsMutation();
  // form state
  const [form] = Form.useForm();
  const begDateField = Form.useWatch('begDate', form);
  const timeField = Form.useWatch('time', form);
  const amountField = Form.useWatch('amount', form);

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
      const result = await addAppointments({ ...values, specialist: specialist?._id }).unwrap();
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

  const onAppInfoReset = () => {
    setCurrentAppointment(undefined);
    setIsAppInfoOpen(false);
  };

  const onAppointmentClick = (appointment: IAppointment) => {
    setCurrentAppointment(appointment);
    setIsAppInfoOpen(true);
  };

  const onAppointmentRemove = () => {
    removeAppointments({ _id: currentAppointment?._id || '' });
    // console.log(currentAppointment?._id);
    setIsRemoveConfirmOpen(false);
    onAppInfoReset();
  };
  const onAppointmentRewrite = () => {
    console.log(currentAppointment?._id);
    console.log(currentAppointment?.service?._id);
    setIsChangeServiceTimeOpen(true);
    // setIsRemoveConfirmOpen(false);
    // onAppInfoReset();
  };
  const onBeforeAppRemove = () => {
    if (currentAppointment?.service) setIsRemoveConfirmOpen(true);
    else onAppointmentRemove();
  };
  const onAppClose = () => {
    console.log('CLOSE');
  };

  return (
    <>
      {contextHolder}
      <Modal
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
      </Modal>

      <Modal
        destroyOnClose
        open={isAppInfoOpen}
        footer={
          <>
            <Button
              type="primary"
              style={{ marginRight: '10px', backgroundColor: '#e60000' }}
              onClick={onBeforeAppRemove}
            >
              Удалить запись
            </Button>
            {currentAppointment?.service && !currentAppointment.service.status ? (
              <Button type="primary" style={{ marginRight: '10px' }} onClick={onAppClose}>
                Закрыть услугу
              </Button>
            ) : (
              ''
            )}

            <Button type="primary" style={{ marginRight: '0px' }} onClick={onAppInfoReset}>
              Отмена
            </Button>
          </>
        }
        title={
          <Typography.Title level={2} style={{ margin: 0, marginBottom: '20px' }}>
            Информация о записи
          </Typography.Title>
        }
        width="600px"
        onCancel={onAppInfoReset}
      >
        <Descriptions
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
          <Descriptions.Item label="Пациент" span={3}>
            {currentAppointment?.service ? (
              <Button
                type="link"
                size="small"
                onClick={(e) => navigate(`/patients/${currentAppointment.service?.patient?._id}/course`)}
              >{`${currentAppointment.service.patient?.number} ${currentAppointment.service.patient?.surname} ${currentAppointment.service.patient?.name[0]}.${currentAppointment.service.patient?.patronymic[0]}.`}</Button>
            ) : (
              ' - '
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Услуга" span={3}>
            {currentAppointment?.service ? `${currentAppointment?.service.type.name}` : ' - '}
          </Descriptions.Item>
          <Descriptions.Item label="Комментарий" span={3}>
            {currentAppointment?.service?.note ? `${currentAppointment?.service.note}` : ' - '}
          </Descriptions.Item>
          <Descriptions.Item label="Результат" span={3}>
            {currentAppointment?.service?.result ? `${currentAppointment?.service.result}` : ' - '}
          </Descriptions.Item>
          {/* <Descriptions.Item label="Сеанс" span={3}>
            {servData?.number ? servData?.number : 'не указан'}
          </Descriptions.Item>
          <Descriptions.Item label="Статус" span={3}>
            {
              // eslint-disable-next-line no-nested-ternary
              servData?.status ? 'оказана' : servData?.date ? 'неоказана' : 'отсутствует запись'
            }
          </Descriptions.Item>
          
          <Descriptions.Item label="Услуга" span={3}>
            {servData?.type}
          </Descriptions.Item>
          <Descriptions.Item label="Специалист" span={3}>
            {servData?.specialist ? servData?.specialist : 'не назначен'}
          </Descriptions.Item>
          <Descriptions.Item label="Комментарий" span={3}>
            {servData?.note ? servData?.note : 'отсутствует'}
          </Descriptions.Item> */}
        </Descriptions>
        {/* <AddSpecialistForm onFinish={onFinish} onReset={onReset} type="add" initValue={specialist} /> */}
        {/* <AddPatientForm onFinish={onFinish} onReset={onReset} /> */}
      </Modal>

      <Modal
        destroyOnClose
        open={isAddUpdateModalOpen}
        footer={null}
        title={
          <Typography.Title level={2} style={{ margin: 0, marginBottom: '20px' }}>
            {currentAppointment ? 'Обновление записи' : 'Добавление записей'}
          </Typography.Title>
        }
        width="500px"
        onCancel={onAddUpdateReset}
      >
        <Form form={form} labelWrap labelCol={{ span: 9 }} wrapperCol={{ span: 15 }} onFinish={onFinish}>
          <Form.Item
            // initialValue={initValue?.name ? initValue.name : ''}
            rules={[{ required: true, message: 'Поле "Дата и время" не должно быть пустым' }]}
            label="Дата и время"
            name="begDate"
          >
            {/* <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" disabled={[false, true]} /> */}
            <DatePicker
              id="begDate"
              style={{ marginRight: '10px' }}
              format="DD.MM.YYYY | HH:mm"
              showTime={{ format: 'HH:mm' }}
            />
          </Form.Item>
          <Form.Item
            // initialValue={initValue?.name ? initValue.name : ''}
            rules={[{ required: true, message: 'Поле "Продолжительность" не должно быть пустым' }]}
            label="Продолжительность"
            name="time"
          >
            {/* <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" disabled={[false, true]} /> */}
            <TimePicker format="HH:mm" id="time" />
          </Form.Item>
          <Form.Item
            // initialValue={initValue?.name ? initValue.name : ''}
            rules={[{ required: true, message: 'Поле "Количество" не должно быть пустым' }]}
            label="Количество"
            name="amount"
          >
            {/* <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" disabled={[false, true]} /> */}
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
          <Form.Item wrapperCol={{ offset: 0, span: 22 }} style={{ marginBottom: 0 }}>
            <Row>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: '10px' }}
                  className={addClass(classes, 'form-button')}
                >
                  Сохранить
                </Button>
                <Button htmlType="button" onClick={onAddUpdateReset} className={addClass(classes, 'form-button')}>
                  Отменить
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
      {/* ПЕРЕЗАПИСЬ!!! */}
      <Modal
        destroyOnClose
        open={isChangeServiceTimeOpen}
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
            Изменение записи пацциента
          </Typography.Title>
        }
        width="100%"
        onCancel={() => setIsChangeServiceTimeOpen(false)}
      >
        <Shedule
          dataAPI={appointmentsAPI.useGetAppointmentsQuery}
          title="Расписание специалиста"
          extraOptions={{ specialistId: specialist?._id, isFree: true }}
          onAppointmentClick={onAppointmentClick}
          type="Specialist"
        />
      </Modal>

      <Shedule
        dataAPI={appointmentsAPI.useGetAppointmentsQuery}
        title="Расписание специалиста"
        extraOptions={{ specialistId: specialist?._id }}
        onAppointmentClick={onAppointmentClick}
        type="Specialist"
        extra={
          <Button type="primary" style={{ marginRight: '10px' }} onClick={() => setIsAddUpdateModalOpen(true)}>
            Добавить запись
          </Button>
        }
      />
    </>
  );
};

export default SpecialistShedule;
