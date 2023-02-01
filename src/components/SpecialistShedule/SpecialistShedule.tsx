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
  Calendar,
  Badge,
  BadgeProps,
  Tooltip,
  Table,
  Row,
  Col,
  DatePicker,
  Empty,
  Form,
  Input,
  TimePicker,
  InputNumber,
} from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarMode } from 'antd/es/calendar/generateCalendar';
import { ColumnsType } from 'antd/es/table';
import { DeleteRowOutlined, ExclamationCircleFilled, LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { DatePickerProps } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { addClass } from '../../app/common';
import { patientsAPI, representativesAPI } from '../../app/services';
import classes from './SpecialistShedule.module.scss';
import { IAppointment, IAppointmentWeek, IPatient, IRepresentative, ISpecialist } from '../../models';
import AddPatientForm from '../AddPatientForm/AddPatientForm';
import AddRepresentativeForm from '../AddRepresentativeForm/AddRepresentativeForm';
import { specialistAPI } from '../../app/services/specialists.service';
import AddSpecialistForm from '../AddSpecialistForm/AddSpecialistForm';
import { appointmentsAPI } from '../../app/services/appointments.service';
import './antd.rewrite.scss';

const { confirm } = Modal;
interface SpecialistSheduleProps extends PropsWithChildren {
  // eslint-disable-next-line react/require-default-props
  specialist?: ISpecialist;
}

const SpecialistShedule: FunctionComponent<SpecialistSheduleProps> = ({ specialist }) => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [update] = specialistAPI.useUpdateSpecialistMutation();
  const params = useParams();
  const nowDate = new Date();
  let today = Date.parse(params.date || '') ? dayjs(Date.parse(params.date || '')) : dayjs();
  if (today.day() === 0) today = today.subtract(6, 'day');
  else today = today.subtract(today.day() - 1, 'day');
  const [begDate, setBegDate] = useState(today.format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(today.add(7, 'day').format('YYYY-MM-DD'));
  const [datePickerValue, setDatePickerValue] = useState<Dayjs | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const { data, isLoading } = appointmentsAPI.useGetAppointmentsQuery({
    specialistId: specialist?._id || '',
    begDate,
    endDate,
  });
  const { data: currentData, isLoading: isCurrentDataLoading } = appointmentsAPI.useGetAppointmentsOnCurrentDateQuery({
    specialistId: specialist?._id || '',
    begDate: selectedDate || '',
    endDate: selectedDate ? dayjs(selectedDate).add(1, 'day').format('YYYY-MM-DD') : '',
  });
  const [open, setOpen] = useState(false);
  const [isAddUpdateModalOpen, setIsAddUpdateModalOpen] = useState(false);
  const [isAppInfoOpen, setIsAppInfoOpen] = useState(false);
  const [isRemoveConfirmOpen, setIsRemoveConfirmOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<IAppointment | undefined>(undefined);
  const [addAppointments] = appointmentsAPI.useAddAppointmentsMutation();
  const [removeAppointments] = appointmentsAPI.useRemoveAppointmentsMutation();

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
  const onReset = () => {
    setOpen(false);
  };
  const onEdit = () => {
    setOpen(true);
  };

  const onAppInfoReset = () => {
    setCurrentAppointment(undefined);
    setIsAppInfoOpen(false);
  };

  const onDPChange: DatePickerProps['onChange'] = (date, dateString) => {
    setDatePickerValue(date);
    let newDate: Dayjs;
    if (date) {
      if (date.day() === 0) newDate = date.subtract(6, 'day');
      else newDate = date.subtract(date.day() - 1, 'day');
      // console.log(newDate.format('YYYY-MM-DD'));
      setBegDate(newDate.format('YYYY-MM-DD'));
      setEndDate(newDate.add(7, 'day').format('YYYY-MM-DD'));
      if (Date.parse(params.date || '')) navigate(`./../${newDate.format('YYYY-MM-DD')}`, { replace: true });
      else navigate(`./${newDate.format('YYYY-MM-DD')}`, { replace: true });
    }
  };
  const onNextWeek = () => {
    setBegDate(dayjs(begDate).add(7, 'day').format('YYYY-MM-DD'));
    setEndDate(dayjs(endDate).add(7, 'day').format('YYYY-MM-DD'));
    setDatePickerValue(null);
    if (Date.parse(params.date || ''))
      navigate(`./../${dayjs(begDate).add(7, 'day').format('YYYY-MM-DD')}`, { replace: true });
    else navigate(`./${dayjs(begDate).add(7, 'day').format('YYYY-MM-DD')}`, { replace: true });
  };
  const onPrevWeek = () => {
    setEndDate(dayjs(endDate).subtract(7, 'day').format('YYYY-MM-DD'));
    setBegDate(dayjs(begDate).subtract(7, 'day').format('YYYY-MM-DD'));
    setDatePickerValue(null);
    if (Date.parse(params.date || ''))
      navigate(`./../${dayjs(begDate).subtract(7, 'day').format('YYYY-MM-DD')}`, { replace: true });
    else navigate(`./${dayjs(begDate).subtract(7, 'day').format('YYYY-MM-DD')}`, { replace: true });
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
    setIsRemoveConfirmOpen(false);
    onAppInfoReset();
  };
  const onBeforeAppRemove = () => {
    if (currentAppointment?.service) setIsRemoveConfirmOpen(true);
    else onAppointmentRemove();
  };
  const onAppClose = () => {
    console.log('CLOSE');
  };

  // const onAppointmentRemove = () => {
  //   const showConfirm = () => {
  //     confirm({
  //       title:
  //         'На данное время уже записан пациент. Вы точно хотите удалить запись? Вы можете также презаписать пациента на другое время',
  //       icon: <ExclamationCircleFilled />,
  //       onOk() {
  //         console.log();
  //         // removePatientFromRepresentative({ patientId, representativeId: representative?._id || '' });
  //         // messageApi.open({
  //         //   type: 'success',
  //         //   content: 'Пациент успешно отвязан.',
  //         // });
  //       },
  //       okText: 'Да',
  //       cancelText: 'Нет',
  //     });
  //   };
  //   if (appointment?.service) {
  //     showConfirm();
  //   } else {
  //     setCurrentAppointment(appointment);
  //     setIsAddUpdateModalOpen(true);
  //   }
  // };

  //
  // const onDateClick = (e: any) => {

  // }
  return (
    <>
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

      <Descriptions
        size="middle"
        title="Расписание специалиста"
        extra={
          <>
            <Button type="primary" style={{ marginRight: '10px' }} onClick={() => setIsAddUpdateModalOpen(true)}>
              Добавить запись
            </Button>
            <DatePicker
              style={{ marginRight: '10px' }}
              format="DD.MM.YYYY"
              onChange={onDPChange}
              value={datePickerValue}
            />

            <Button type="default" style={{ marginRight: '10px' }} icon={<LeftOutlined />} onClick={onPrevWeek} />
            <Button type="default" style={{ marginRight: '0px' }} icon={<RightOutlined />} onClick={onNextWeek} />
          </>
        }
      >
        <Descriptions.Item className={addClass(classes, 'des-item')} contentStyle={{ flexDirection: 'column' }}>
          {/* <div style={{ display: 'flex', paddingBottom: '10px', justifyContent: 'flex-end', width: '100%' }}>
            <DatePicker
              style={{ marginRight: '10px' }}
              format="DD.MM.YYYY"
              onChange={onDPChange}
              value={datePickerValue}
            />

            <Button type="default" style={{ marginRight: '10px' }} icon={<LeftOutlined />} onClick={onPrevWeek} />
            <Button type="default" style={{ marginRight: '10px' }} icon={<RightOutlined />} onClick={onNextWeek} />
          </div> */}

          {/* <Row style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', width: '100%', gap: '5px' }}> */}
          <Row style={{ display: 'flex', width: '100%', gap: '5px' }}>
            {data?.map((appointemnts, index) => {
              const day = dayjs(begDate).add(index, 'day').format('DD MMM');
              const thisDate = dayjs(begDate).add(index, 'day').format('YYYY-MM-DD');
              const dayOfWeek = new Date(
                new Date(begDate).setDate(new Date(begDate).getDate() + index),
              ).toLocaleDateString('ru-RU', { weekday: 'short' });
              return (
                <Col
                  key={day}
                  style={{ minHeight: '250px' }}
                  // onClick={(e) => {
                  //   setSelectedDate(thisDate);
                  //   setOpen(true);
                  // }}
                  className={addClass(classes, 'shedule-col')}
                >
                  <div className={addClass(classes, 'shedule-cell')}>
                    <div className={addClass(classes, 'shedule-cell-title')}>{`${dayOfWeek}. ${day}`}</div>
                    <ul className={addClass(classes, 'shedule-cell-list')}>
                      {appointemnts.length ? (
                        appointemnts.map((item: IAppointment) => {
                          // if (value.toDate().toDateString() === new Date(item.begDate).toDateString()) {
                          // console.log(value.toDate().toDateString());
                          // console.log(new Date(item.begDate).toDateString());
                          const beg = new Date(item.begDate).toLocaleString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit',
                          });
                          const end = new Date(item.endDate).toLocaleString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit',
                          });
                          const time = `${beg}-${end}`;
                          const patient = `${item.service?.patient?.number} ${item.service?.patient?.surname} ${item.service?.patient?.name[0]}.${item.service?.patient?.patronymic[0]}.`;
                          const serviceName = item.service?.type.name;
                          return (
                            <Tooltip
                              title={item.service ? `${time} ${patient} ${serviceName}` : time}
                              key={item._id}
                              mouseLeaveDelay={0}
                              mouseEnterDelay={0.5}
                            >
                              <li
                                className={addClass(
                                  classes,
                                  'appointment',
                                  item.service ? 'appointment-has-service' : '',
                                  item.service && new Date(item.endDate) < nowDate ? 'appointment-bad-service' : '',
                                )}
                                onClick={(e) => onAppointmentClick(item)}
                              >
                                <div>{time}</div>
                                {item.service ? (
                                  <div>
                                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{patient}</div>
                                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{serviceName}</div>
                                  </div>
                                ) : (
                                  <div>
                                    <div
                                      style={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        marginTop: '10px',
                                        marginBottom: '10px',
                                      }}
                                    >
                                      ------
                                    </div>
                                  </div>
                                )}
                                {/* <Badge
                              status={item.type as BadgeProps['status']}
                              text={item.content}
                              style={{
                                width: '100%',
                                overflow: 'hidden',
                                fontSize: '12px',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                              }}
                            /> */}
                              </li>
                            </Tooltip>
                          );
                          // }
                          // return null;
                        })
                      ) : (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Нет данных" />
                      )}
                    </ul>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Descriptions.Item>
      </Descriptions>
      {contextHolder}
    </>
  );
};

export default SpecialistShedule;
