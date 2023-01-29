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
} from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarMode } from 'antd/es/calendar/generateCalendar';
import { ColumnsType } from 'antd/es/table';
import { DeleteRowOutlined, ExclamationCircleFilled, LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { DatePickerProps } from 'antd';
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
  const [messageApi, contextHolder] = message.useMessage();
  const [update] = specialistAPI.useUpdateSpecialistMutation();

  let today = dayjs();
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
  const [currentAppointment, setCurrentAppointment] = useState<IAppointment | undefined>(undefined);

  const onFinish = async (values: any) => {
    try {
      await update({ ...specialist, ...values }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Данные специалиста успешно обновлены',
      });
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

  const onAddUpdateReset = () => {
    setCurrentAppointment(undefined);
    setIsAddUpdateModalOpen(false);
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
    }
  };
  const onNextWeek = () => {
    setBegDate(dayjs(begDate).add(7, 'day').format('YYYY-MM-DD'));
    setEndDate(dayjs(endDate).add(7, 'day').format('YYYY-MM-DD'));
    setDatePickerValue(null);
  };
  const onPrevWeek = () => {
    setEndDate(dayjs(endDate).subtract(7, 'day').format('YYYY-MM-DD'));
    setBegDate(dayjs(begDate).subtract(7, 'day').format('YYYY-MM-DD'));
    setDatePickerValue(null);
  };
  const columns: ColumnsType<IAppointment> = [
    {
      title: 'Время',
      dataIndex: 'time',
      key: 'time',
      width: '15%',
      render: (x, record) => {
        return `${dayjs(record.begDate).format('HH:mm')}-${dayjs(record.endDate).format('HH:mm')}`;
      },
    },
    {
      title: 'Пациент',
      dataIndex: 'patient',
      key: 'patient',
      width: '35%',
      render: (patient, record) => {
        return record?.service
          ? `${record.service?.patient?.number} ${record?.service.patient?.surname} ${record?.service.patient?.name[0]}.${record?.service.patient?.patronymic[0]}.`
          : '';
      },
    },
    {
      title: 'Название услуги',
      dataIndex: 'type',
      key: 'type',
      width: '35%',
      render: (x, record) => {
        return record?.service ? `${record?.service.type.name}` : '';
      },
    },
    {
      key: 'remove',
      render: (v, record) => {
        return (
          <Button
            style={{ color: 'red', backgroundColor: 'white' }}
            size="small"
            type="primary"
            // shape="circle"
            icon={<DeleteRowOutlined />}
            onClick={(e) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              e.stopPropagation();
              // onRemove(record);
            }}
          />
        );
      },
      width: '5%',
    },
  ];
  const onAppointmentRowClick = (appointment: IAppointment) => {
    console.log(appointment);
    const showConfirm = () => {
      confirm({
        title: 'На данное время уже записан пациент. Вы точно хотите изменить запись?',
        icon: <ExclamationCircleFilled />,
        onOk() {
          setCurrentAppointment(appointment);
          setIsAddUpdateModalOpen(true);
          // removePatientFromRepresentative({ patientId, representativeId: representative?._id || '' });
          // messageApi.open({
          //   type: 'success',
          //   content: 'Пациент успешно отвязан.',
          // });
        },
        okText: 'Да',
        cancelText: 'Нет',
      });
    };
    if (appointment?.service) {
      showConfirm();
    } else {
      setCurrentAppointment(appointment);
      setIsAddUpdateModalOpen(true);
    }
  };

  //
  // const onDateClick = (e: any) => {

  // }
  return (
    <>
      <Modal
        destroyOnClose
        open={isAddUpdateModalOpen}
        footer={null}
        title={
          <Typography.Title level={2} style={{ margin: 0, marginBottom: '20px' }}>
            {currentAppointment ? 'Обновление записи' : 'Добавление записи'}
          </Typography.Title>
        }
        width="100%"
        onCancel={onAddUpdateReset}
      >
        <Form labelWrap labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false} onFinish={onFinish}>
          <Form.Item
            // initialValue={initValue?.name ? initValue.name : ''}
            rules={[{ required: true, message: 'Поле "Название" не должно быть пустым' }]}
            label={<div className={addClass(classes, 'form-item')}>Название</div>}
            name="name"
          >
            <Input id="name" />
          </Form.Item>
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
        {/* <AddSpecialistForm onFinish={onFinish} onReset={onReset} type="add" initValue={specialist} /> */}
        {/* <AddPatientForm onFinish={onFinish} onReset={onReset} /> */}
      </Modal>

      <Modal
        destroyOnClose
        open={open}
        footer={null}
        title={
          <Typography.Title level={2} style={{ margin: 0, marginBottom: '20px' }}>
            {`Расписание на ${dayjs(selectedDate).format('DD.MM.YYYY')}`}
          </Typography.Title>
        }
        width="100%"
        onCancel={onReset}
      >
        <Table
          columns={columns}
          dataSource={currentData}
          style={{ width: '100%' }}
          tableLayout="fixed"
          bordered
          size="small"
          loading={isLoading}
          pagination={false}
          rowKey={(record) => record._id}
          onRow={(record) => {
            return {
              onClick: () => {
                onAppointmentRowClick(record);
              },
            };
          }}
          rowClassName="my-table-row"
          className={addClass(classes, 'patients-table')}
        />
        {/* <AddSpecialistForm onFinish={onFinish} onReset={onReset} type="add" initValue={specialist} /> */}
        {/* <AddPatientForm onFinish={onFinish} onReset={onReset} /> */}
      </Modal>
      <Descriptions
        size="middle"
        title="Расписание специалиста"
        extra={
          <>
            <DatePicker
              style={{ marginRight: '10px' }}
              format="DD.MM.YYYY"
              onChange={onDPChange}
              value={datePickerValue}
            />
            <Button type="default" style={{ marginRight: '10px' }} icon={<LeftOutlined />} onClick={onPrevWeek} />
            <Button type="default" style={{ marginRight: '10px' }} icon={<RightOutlined />} onClick={onNextWeek} />
          </>
        }
      >
        <Descriptions.Item className={addClass(classes, 'des-item')} contentStyle={{ flexDirection: 'column' }}>
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
                  style={{ cursor: 'pointer', minHeight: '250px' }}
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
                                className={addClass(classes, item.service ? 'appointment-has-service' : 'appointment')}
                                onClick={(e) => console.log(item)}
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
                                      нет записи
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
