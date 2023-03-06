/* eslint-disable @typescript-eslint/indent */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { Button, Descriptions, Row, Col, DatePicker, Empty, Spin } from 'antd';
import React, { FunctionComponent, PropsWithChildren, ReactNode, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { DatePickerProps } from 'antd';
import { useParams } from 'react-router-dom';
import { addClass } from '../../app/common';
import classes from './Shedule.module.scss';
import { IAppointment } from '../../models';
import './antd.rewrite.scss';
import ErrorResult from '../ErrorResult/ErrorResult';

interface MSheduleProps extends PropsWithChildren {
  extraOptions?: any;
  title?: string;
  extra?: ReactNode;
  onAppointmentClick: (appointment: IAppointment) => void;
  onDateChange?: (firstDate: string, secondDate: string) => void;
  dataAPI: any;
  type: 'Specialist' | 'Patient';
}

const MShedule: FunctionComponent<MSheduleProps> = ({
  // person,
  title,
  extra,
  onAppointmentClick,
  dataAPI,
  type,
  extraOptions,
  onDateChange,
}) => {
  const params = useParams();
  const today = Date.parse(params.date || '') ? dayjs(Date.parse(params.date || '')) : dayjs();
  const todayDate = new Date();

  const [begDate, setBegDate] = useState(today.format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(today.add(1, 'day').format('YYYY-MM-DD'));
  const [datePickerValue, setDatePickerValue] = useState<Dayjs | null>(null);

  const {
    data: appointments,
    isLoading,
    isError,
  } = dataAPI(
    {
      begDate,
      endDate,
      ...extraOptions,
    },
    {
      skip:
        ('patientId' in extraOptions ? !extraOptions.patientId : false) ||
        ('specialistId' in extraOptions ? !extraOptions.specialistId : false),
    },
  );

  const onDPChange: DatePickerProps['onChange'] = (date) => {
    setDatePickerValue(date);
    if (date) {
      const firstDate = date.format('YYYY-MM-DD');
      const secondDate = date.add(1, 'day').format('YYYY-MM-DD');
      setBegDate(firstDate);
      setEndDate(secondDate);
      if (onDateChange) onDateChange(firstDate, secondDate);
    }
  };
  const onNextDay = () => {
    const firstDate = dayjs(begDate).add(1, 'day').format('YYYY-MM-DD');
    const secondDate = dayjs(endDate).add(1, 'day').format('YYYY-MM-DD');
    setDatePickerValue(dayjs(begDate).add(1, 'day'));
    setBegDate(firstDate);
    setEndDate(secondDate);
    if (onDateChange) onDateChange(firstDate, secondDate);
  };
  const onPrevDay = () => {
    const firstDate = dayjs(begDate).subtract(1, 'day').format('YYYY-MM-DD');
    const secondDate = dayjs(endDate).subtract(1, 'day').format('YYYY-MM-DD');
    setDatePickerValue(dayjs(begDate).subtract(1, 'day'));
    setBegDate(firstDate);
    setEndDate(secondDate);
    if (onDateChange) onDateChange(firstDate, secondDate);
  };
  const day = dayjs(begDate).format('DD MMM');
  const dayOfWeek = new Date(new Date(begDate).setDate(new Date(begDate).getDate())).toLocaleDateString('ru-RU', {
    weekday: 'short',
  });
  if (isError) return <ErrorResult />;
  return (
    <Descriptions size="middle" title={title} extra={extra} column={1}>
      <Descriptions.Item>
        <DatePicker
          style={{ marginRight: '10px' }}
          format="DD.MM.YYYY"
          onChange={onDPChange}
          value={datePickerValue}
          inputReadOnly
        />

        <Button type="default" style={{ marginRight: '10px' }} icon={<LeftOutlined />} onClick={onPrevDay} />
        <Button type="default" style={{ marginRight: '0px' }} icon={<RightOutlined />} onClick={onNextDay} />
      </Descriptions.Item>
      <Descriptions.Item className={addClass(classes, 'des-item')} contentStyle={{ flexDirection: 'column' }}>
        {isLoading ? (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
            <Spin tip="Загрузка..." />
          </div>
        ) : (
          <Row style={{ display: 'flex', width: '100%', gap: '5px' }}>
            <Col key={day} style={{ minHeight: '250px', backgroundColor: 'white', width: '100%' }}>
              <div className={addClass(classes, 'shedule-cell')}>
                <div
                  className={addClass(classes, 'shedule-cell-title')}
                  style={{ textAlign: 'center', fontWeight: 'bold', padding: '5px 0' }}
                >{`${dayOfWeek}. ${day}`}</div>
                <ul className={addClass(classes, 'shedule-cell-list')} style={{ textAlign: 'center' }}>
                  {appointments?.length ? (
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
                        <li
                          key={item._id}
                          style={{ fontSize: '14px' }}
                          className={addClass(
                            classes,
                            'appointment',
                            item.service ? 'appointment-has-service' : '',
                            !item.service?.status && item.service && new Date(item.begDate) < todayDate
                              ? 'appointment-bad-service'
                              : '',
                            item.service?.status ? 'appointment-good-service' : '',
                          )}
                          onClick={() => onAppointmentClick(item)}
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
                      );
                    })
                  ) : (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="Нет данных"
                      style={{ paddingTop: '30px' }}
                    />
                  )}
                </ul>
              </div>
            </Col>
          </Row>
        )}
      </Descriptions.Item>
    </Descriptions>
  );
};

MShedule.defaultProps = {
  extra: undefined,
  extraOptions: undefined,
  onDateChange: undefined,
  title: undefined,
};

export default MShedule;
