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
} from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarMode } from 'antd/es/calendar/generateCalendar';
import { ColumnsType } from 'antd/es/table';
import { DeleteRowOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
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
      width: '95%',
      render: (x, record) => {
        return `${dayjs(record.begDate).format('HH:mm')}-${dayjs(record.endDate).format('HH:mm')}`;
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
  // const onDateClick = (e: any) => {

  // }
  return (
    <>
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
                console.log(record._id);
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
          <Row style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', width: '100%', gap: '5px' }}>
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
                  onClick={(e) => {
                    setSelectedDate(thisDate);
                    setOpen(true);
                  }}
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
                          return (
                            <Tooltip title={time} key={item._id} mouseLeaveDelay={0} mouseEnterDelay={0.5}>
                              <li>
                                <div>{time}</div>
                                {item.service ? <div>{item.service._id}</div> : <div>cвободно</div>}
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
