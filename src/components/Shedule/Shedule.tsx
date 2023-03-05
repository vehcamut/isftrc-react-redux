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
  Spin,
} from 'antd';
import React, { FunctionComponent, PropsWithChildren, ReactNode, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { DatePickerProps } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { addClass } from '../../app/common';
import classes from './Shedule.module.scss';
import { IAppointment, ISpecialist } from '../../models';
import { specialistAPI } from '../../app/services/specialists.service';
import { appointmentsAPI } from '../../app/services/appointments.service';
import './antd.rewrite.scss';

interface SheduleProps extends PropsWithChildren {
  extraOptions?: any;
  // person?: ISpecialist;
  title: string;
  extra?: ReactNode;
  onAppointmentClick: (appointment: IAppointment) => void;
  onDateChange?: (firstDate: string, secondDate: string) => void;
  dataAPI: any;
  type: 'Specialist' | 'Patient';
}

const Shedule: FunctionComponent<SheduleProps> = ({
  // person,
  title,
  extra,
  onAppointmentClick,
  dataAPI,
  type,
  extraOptions,
  onDateChange,
}) => {
  const navigate = useNavigate();
  const params = useParams();

  const nowDate = new Date();
  let today = Date.parse(params.date || '') ? dayjs(Date.parse(params.date || '')) : dayjs();

  if (today.day() === 0) today = today.subtract(6, 'day');
  else today = today.subtract(today.day() - 1, 'day');

  const [begDate, setBegDate] = useState(today.format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(today.add(7, 'day').format('YYYY-MM-DD'));
  const [datePickerValue, setDatePickerValue] = useState<Dayjs | null>(null);

  const { data, isLoading } = dataAPI(
    {
      begDate,
      endDate,
      ...extraOptions,
    },
    {
      skip:
        ('patientId' in extraOptions ? !extraOptions.patientId : false) ||
        ('specialistId' in extraOptions ? !extraOptions.specialistId : false),
      pollingInterval: 3000,
    },
  );

  // const onDateChange = (firstDate: string, secondDate: string) => {
  //   setBegDate(firstDate);
  //   setEndDate(secondDate);
  //   const path = `${Date.parse(params.date || '') ? './.' : ''}./${firstDate}`;
  //   navigate(path, { replace: true });
  // };
  const onDPChange: DatePickerProps['onChange'] = (date, dateString) => {
    setDatePickerValue(date);
    let newDate: Dayjs;
    if (date) {
      if (date.day() === 0) newDate = date.subtract(6, 'day');
      else newDate = date.subtract(date.day() - 1, 'day');
      const firstDate = newDate.format('YYYY-MM-DD');
      const secondDate = newDate.add(7, 'day').format('YYYY-MM-DD');
      setBegDate(firstDate);
      setEndDate(secondDate);
      if (onDateChange) onDateChange(firstDate, secondDate);
    }
  };
  const onNextWeek = () => {
    const firstDate = dayjs(begDate).add(7, 'day').format('YYYY-MM-DD');
    const secondDate = dayjs(endDate).add(7, 'day').format('YYYY-MM-DD');
    setDatePickerValue(null);
    setBegDate(firstDate);
    setEndDate(secondDate);
    if (onDateChange) onDateChange(firstDate, secondDate);
  };
  const onPrevWeek = () => {
    const firstDate = dayjs(begDate).subtract(7, 'day').format('YYYY-MM-DD');
    const secondDate = dayjs(endDate).subtract(7, 'day').format('YYYY-MM-DD');
    setDatePickerValue(null);
    setBegDate(firstDate);
    setEndDate(secondDate);
    if (onDateChange) onDateChange(firstDate, secondDate);
  };
  return (
    <Descriptions
      size="middle"
      title={title}
      extra={
        <>
          {extra}
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
        {isLoading ? (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
            <Spin tip="Загрузка..." />
          </div>
        ) : (
          <Row style={{ display: 'flex', width: '100%', gap: '5px' }}>
            {data?.map((appointments: any, index: any) => {
              const day = dayjs(begDate).add(index, 'day').format('DD MMM');
              const dayOfWeek = new Date(
                new Date(begDate).setDate(new Date(begDate).getDate() + index),
              ).toLocaleDateString('ru-RU', { weekday: 'short' });
              return (
                <Col key={day} style={{ minHeight: '250px' }} className={addClass(classes, 'shedule-col')}>
                  <div className={addClass(classes, 'shedule-cell')}>
                    <div className={addClass(classes, 'shedule-cell-title')}>{`${dayOfWeek}. ${day}`}</div>
                    <ul className={addClass(classes, 'shedule-cell-list')}>
                      {appointments.length ? (
                        appointments.map((item: IAppointment) => {
                          const beg = new Date(item.begDate).toLocaleString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit',
                          });
                          const end = new Date(item.endDate).toLocaleString('ru-RU', {
                            hour: '2-digit',
                            minute: '2-digit',
                          });
                          const time = `${beg}-${end}`;
                          let personStr;
                          if (type === 'Specialist')
                            personStr = `${item.service?.patient?.number} ${item.service?.patient?.surname} ${item.service?.patient?.name[0]}.${item.service?.patient?.patronymic[0]}.`;
                          else personStr = `${item.specialist.name}`;
                          const serviceName = item.service?.type.name;
                          return (
                            <Tooltip
                              title={item.service ? `${time} ${personStr} ${serviceName}` : time}
                              key={item._id}
                              mouseLeaveDelay={0}
                              mouseEnterDelay={0.5}
                            >
                              <li
                                className={addClass(
                                  classes,
                                  'appointment',
                                  item.service ? 'appointment-has-service' : '',
                                  !item.service?.status && item.service && new Date(item.begDate) < nowDate
                                    ? 'appointment-bad-service'
                                    : '',
                                  item.service?.status ? 'appointment-good-service' : '',
                                )}
                                onClick={(e) => onAppointmentClick(item)}
                              >
                                <div>{time}</div>
                                {item.service ? (
                                  <div>
                                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{personStr}</div>
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
                              </li>
                            </Tooltip>
                          );
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
        )}
      </Descriptions.Item>
    </Descriptions>
  );
};

Shedule.defaultProps = {
  // person: undefined,
  extra: undefined,
  extraOptions: undefined,
  onDateChange: undefined,
};

export default Shedule;
