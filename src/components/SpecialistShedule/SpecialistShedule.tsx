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
} from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarMode } from 'antd/es/calendar/generateCalendar';
import { ColumnsType } from 'antd/es/table';
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
  const [changeStatus] = specialistAPI.useChangeSpecialistStatusMutation();
  // const today = new Date();
  // today.setHours(0, 0, 0, 0);
  // if (today.getDay() === 0) today.setDate(today.getDate() - 6);
  // else today.setDate(today.getDate() - today.getDay() + 1);
  let today = dayjs();
  // .set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0);
  console.log(today.day);
  if (today.day() === 0) today = today.subtract(6, 'day');
  else today = today.subtract(today.day() - 1, 'day');
  const [begDate, setBegDate] = useState(today.format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(today.add(7, 'day').format('YYYY-MM-DD'));
  // const [begDate, setBegDate] = useState(today);
  // today.setDate(begDate.getDate() + 7);
  // const [endDate, setEndDate] = useState(today);
  const { data, isLoading } = appointmentsAPI.useGetAppointmentsQuery({
    specialistId: specialist?._id || '',
    begDate,
    endDate,
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
  const onActivate = async () => {
    try {
      await changeStatus({ _id: specialist?._id ? specialist?._id : '', isActive: true }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Специалист успешно активирован',
      });
    } catch (e) {
      messageApi.open({
        type: 'error',
        content: 'Ошибка связи с сервером',
      });
    }
  };
  const onDeactivate = async () => {
    try {
      await changeStatus({ _id: specialist?._id ? specialist?._id : '', isActive: false }).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Специалист успешно деактивирован',
      });
    } catch (e) {
      messageApi.open({
        type: 'error',
        content: 'Ошибка связи с сервером',
      });
    }
  };
  const onPanelChange = (value: Dayjs, mode: CalendarMode) => {
    // if (mode === 'month') setDate(value.format('YYYY-MM-DD'));
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  // const data = [
  //   {
  //     _id: '63c90cbf53062b54543e8249',
  //     begDate: '2023-01-19T09:24:37.765Z',
  //     endDate: '2023-01-19T09:24:37.770Z',
  //     specialist: '63c8f0f2f2f198c0951d33bd',
  //   },
  //   {
  //     _id: '63c90d03a30f315cdba91d45',
  //     begDate: '2023-01-19T09:24:37.780Z',
  //     endDate: '2023-01-19T09:24:37.790Z',
  //     specialist: '63c8f0f2f2f198c0951d33bd',
  //   },
  //   {
  //     _id: '63c90d03a30f315cdba91d47',
  //     begDate: '2023-01-19T09:24:37.780Z',
  //     endDate: '2023-01-19T09:24:37.790Z',
  //     specialist: '63c8f0f2f2f198c0951d33bd',
  //   },
  //   {
  //     _id: '63c90d03a30f315cdb791d45',
  //     begDate: '2023-01-19T09:24:37.780Z',
  //     endDate: '2023-01-19T09:24:37.790Z',
  //     specialist: '63c8f0f2f2f198c0951d33bd',
  //   },
  //   {
  //     _id: '63c90d03a30f375cdba91d45',
  //     begDate: '2023-01-19T09:24:37.780Z',
  //     endDate: '2023-01-19T09:24:37.790Z',
  //     specialist: '63c8f0f2f2f198c0951d33bd',
  //   },
  // ];
  const getListData = (value: Dayjs) => {
    let listData;
    switch (value.date()) {
      case 8:
        listData = [
          { type: 'warning', content: 'This is warning event.' },
          { type: 'success', content: 'This is usual event.' },
        ];
        break;
      case 10:
        listData = [
          { type: 'warning', content: 'This is warning event.' },
          { type: 'success', content: 'This is usual event.' },
          { type: 'error', content: 'This is error event.' },
        ];
        break;
      case 15:
        listData = [
          { type: 'warning', content: '12:15-12:30 Игнатовааааааааав Б.Б 124' },
          { type: 'success', content: '12:30-12:45' },
          { type: 'error', content: '12:45-13:00' },
          { type: 'error', content: '14:00-14:15' },
          { type: 'error', content: '14:15-14:30' },
          { type: 'error', content: '14:30-14:45' },
        ];
        break;
      default:
    }
    return listData || [];
  };

  // const dateCellRender = (value: Dayjs) => {
  //   const listData = getListData(value);
  //   return (
  //     // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
  //     <div
  //       // type="button"
  //       // role="button"
  //       className={addClass(classes, 'shedule-cell')}
  //       onClick={(e) => {
  //         console.log(value.format('YYYY-MM-DD'));
  //       }}
  //     >
  //       <div className={addClass(classes, 'shedule-cell-title')}>{value.format('DD MMM')}</div>
  //       <ul
  //         className={addClass(classes, 'shedule-cell-list')}
  //         // onClick={(e: any) => {
  //         //   e.stopProppagation();
  //         // }}
  //       >
  //         {data?.map((item: IAppointment) => {
  //           if (value.toDate().toDateString() === new Date(item.begDate).toDateString()) {
  //             // console.log(value.toDate().toDateString());
  //             // console.log(new Date(item.begDate).toDateString());
  //             const beg = new Date(item.begDate).toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  //             const end = new Date(item.endDate).toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  //             const time = `${beg}-${end}`;
  //             return (
  //               <Tooltip title={time} key={item._id} mouseLeaveDelay={0} mouseEnterDelay={0.5}>
  //                 <li>
  //                   {time}
  //                   {/* <Badge
  //                 status={item.type as BadgeProps['status']}
  //                 text={item.content}
  //                 style={{
  //                   width: '100%',
  //                   overflow: 'hidden',
  //                   fontSize: '12px',
  //                   whiteSpace: 'nowrap',
  //                   textOverflow: 'ellipsis',
  //                 }}
  //               /> */}
  //                 </li>
  //               </Tooltip>
  //             );
  //           }
  //           return null;
  //         })}
  //       </ul>
  //     </div>
  //   );
  //   // listData.map((item) => <React.Fragment key={item.content}>{item.content}</React.Fragment>);
  // };

  const onChange = (value: any) => {
    console.log(value);
  };

  // const onSelect = (value: Dayjs) => {
  //   setOpen(true);
  // };
  const columns: ColumnsType<IAppointmentWeek> = [
    {
      title: 'Понедельник',
      dataIndex: 'monday',
      key: 'monday',
      width: '12.5%',
      render: (x, record) => {
        return record.monday.map((appointment) => {
          return `${appointment.begDate}-${appointment.endDate}`;
        });
        // `${record.monday.length}`;
      },
    },
    {
      title: 'Вторник',
      dataIndex: 'tuesday',
      key: 'tuesday',
      width: '12.5%',
      render: (x, record) => {
        return `${record.tuesday.length}`;
      },
    },
    {
      title: 'Среда',
      dataIndex: 'wensday',
      key: 'wensday',
      width: '12.5%',
      render: (x, record) => {
        return `${record.wensday.length}`;
      },
    },
    {
      title: 'Четверг',
      dataIndex: 'thursday',
      key: 'thursday',
      width: '12.5%',
      render: (x, record) => {
        return `${record.thursday.length}`;
      },
    },
    {
      title: 'Пятница',
      dataIndex: 'friday',
      key: 'friday',
      width: '12.5%',
      render: (x, record) => {
        return (
          <div
            className={addClass(classes, 'shedule-cell')}
            // onClick={(e) => {
            //   console.log(value.format('YYYY-MM-DD'));
            // }}
          >
            <div className={addClass(classes, 'shedule-cell-title')}>
              {`Пт. ${dayjs(begDate).add(4, 'day').format('DD MMM')}`}
            </div>
            <ul className={addClass(classes, 'shedule-cell-list')}>
              {record.friday.map((item: IAppointment) => {
                // if (value.toDate().toDateString() === new Date(item.begDate).toDateString()) {
                // console.log(value.toDate().toDateString());
                // console.log(new Date(item.begDate).toDateString());
                const beg = new Date(item.begDate).toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit' });
                const end = new Date(item.endDate).toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit' });
                const time = `${beg}-${end}`;
                return (
                  <Tooltip title={time} key={item._id} mouseLeaveDelay={0} mouseEnterDelay={0.5}>
                    <li>
                      {time}
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
              })}
            </ul>
          </div>
        );
        // return record.friday.map((appointment) => {
        //   return `${dayjs(appointment.begDate).format('HH:mm')}-${dayjs(appointment.endDate).format('HH:mm')}`;
        // });
        // `${record.monday.length}`;
      },
    },
    {
      title: 'Суббота',
      dataIndex: 'saturday',
      key: 'saturday',
      width: '12.5%',
      render: (x, record) => {
        return `${record.saturday.length}`;
      },
    },
    {
      title: 'Воскресение',
      dataIndex: 'sunday',
      key: 'sunday',
      width: '12.5%',
      render: (x, record) => {
        return `${record.sunday.length}`;
      },
    },
  ];

  return (
    <>
      <Descriptions
        size="middle"
        // column={1}
        title="Расписание специалиста"
        extra={
          <>
            {/* {representative?.isActive ? (
              <Button type="primary" onClick={onDeactivate} style={{ marginRight: '10px', backgroundColor: '#e60000' }}>
                Добавить нового
              </Button>
            ) : (
              <Button type="primary" onClick={onActivate} style={{ marginRight: '10px', backgroundColor: '#0c9500' }}>
                Активировать
              </Button>
            )} */}
            <Button type="primary" style={{ marginRight: '10px' }}>
              Добавить нового
            </Button>
            <Button type="primary">Добавить существующего</Button>
          </>
        }
      >
        <Descriptions.Item className={addClass(classes, 'des-item')} contentStyle={{ flexDirection: 'column' }}>
          <Row style={{ display: 'flex', width: '100%', gap: '5px' }}>
            {Object.k}
            <Col style={{ flexGrow: 1, backgroundColor: 'white' }} onClick={(e) => console.log(e)}>
              <div
                className={addClass(classes, 'shedule-cell')}
                // onClick={(e) => {
                //   console.log(value.format('YYYY-MM-DD'));
                // }}
              >
                <div className={addClass(classes, 'shedule-cell-title')}>
                  {`Пт. ${dayjs(begDate).add(4, 'day').format('DD MMM')}`}
                </div>
                <ul className={addClass(classes, 'shedule-cell-list')}>
                  {data &&
                    data[0].friday.map((item: IAppointment) => {
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
                            {time}
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
                    })}
                </ul>
              </div>
            </Col>
            <Col style={{ flexGrow: 1, backgroundColor: 'white' }}>
              <div
                className={addClass(classes, 'shedule-cell')}
                // onClick={(e) => {
                //   console.log(value.format('YYYY-MM-DD'));
                // }}
              >
                <div className={addClass(classes, 'shedule-cell-title')}>
                  {`Пт. ${dayjs(begDate).add(4, 'day').format('DD MMM')}`}
                </div>
                <ul className={addClass(classes, 'shedule-cell-list')}>
                  {data &&
                    data[0].friday.map((item: IAppointment) => {
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
                            {time}
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
                    })}
                </ul>
              </div>
            </Col>
            <Col style={{ flexGrow: 1, backgroundColor: 'white' }}>
              <div
                className={addClass(classes, 'shedule-cell')}
                // onClick={(e) => {
                //   console.log(value.format('YYYY-MM-DD'));
                // }}
              >
                <div className={addClass(classes, 'shedule-cell-title')}>
                  {`Пт. ${dayjs(begDate).add(4, 'day').format('DD MMM')}`}
                </div>
                <ul className={addClass(classes, 'shedule-cell-list')}>
                  {data &&
                    data[0].friday.map((item: IAppointment) => {
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
                            {time}
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
                    })}
                </ul>
              </div>
            </Col>
            <Col style={{ flexGrow: 1, backgroundColor: 'white' }}>
              <div
                className={addClass(classes, 'shedule-cell')}
                // onClick={(e) => {
                //   console.log(value.format('YYYY-MM-DD'));
                // }}
              >
                <div className={addClass(classes, 'shedule-cell-title')}>
                  {`Пт. ${dayjs(begDate).add(4, 'day').format('DD MMM')}`}
                </div>
                <ul className={addClass(classes, 'shedule-cell-list')}>
                  {data &&
                    data[0].friday.map((item: IAppointment) => {
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
                            {time}
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
                    })}
                </ul>
              </div>
            </Col>
            <Col style={{ flexGrow: 1, backgroundColor: 'white' }}>
              <div
                className={addClass(classes, 'shedule-cell')}
                // onClick={(e) => {
                //   console.log(value.format('YYYY-MM-DD'));
                // }}
              >
                <div className={addClass(classes, 'shedule-cell-title')}>
                  {`Пт. ${dayjs(begDate).add(4, 'day').format('DD MMM')}`}
                </div>
                <ul className={addClass(classes, 'shedule-cell-list')}>
                  {data &&
                    data[0].friday.map((item: IAppointment) => {
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
                            {time}
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
                    })}
                </ul>
              </div>
            </Col>
            <Col style={{ flexGrow: 1, backgroundColor: 'white' }}>
              <div
                className={addClass(classes, 'shedule-cell')}
                // onClick={(e) => {
                //   console.log(value.format('YYYY-MM-DD'));
                // }}
              >
                <div className={addClass(classes, 'shedule-cell-title')}>
                  {`Пт. ${dayjs(begDate).add(4, 'day').format('DD MMM')}`}
                </div>
                <ul className={addClass(classes, 'shedule-cell-list')}>
                  {data &&
                    data[0].friday.map((item: IAppointment) => {
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
                            {time}
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
                    })}
                </ul>
              </div>
            </Col>
            <Col style={{ flexGrow: 1, backgroundColor: 'white' }}>
              <div
                className={addClass(classes, 'shedule-cell')}
                // onClick={(e) => {
                //   console.log(value.format('YYYY-MM-DD'));
                // }}
              >
                <div className={addClass(classes, 'shedule-cell-title')}>
                  {`Пт. ${dayjs(begDate).add(4, 'day').format('DD MMM')}`}
                </div>
                <ul className={addClass(classes, 'shedule-cell-list')}>
                  {data &&
                    data[0].friday.map((item: IAppointment) => {
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
                            {time}
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
                    })}
                </ul>
              </div>
            </Col>
          </Row>
        </Descriptions.Item>
      </Descriptions>

      {/* <Table
        components={{
          body: {
            // eslint-disable-next-line react/no-unstable-nested-components
            cell: (props: any) => {
              // eslint-disable-next-line react/jsx-props-no-spreading
              return <td {...props} style={{ padding: '0px', cursor: 'pointer' }} />;
            },
          },
        }}
        columns={columns}
        dataSource={data}
        rowClassName="shedule-table-row"
      /> */}
      {contextHolder}
      {/* <Calendar
        onPanelChange={onPanelChange}
        onChange={onChange}
        dateFullCellRender={dateCellRender}
        // onSelect={onSelect}
      /> */}
      <Modal
        destroyOnClose
        open={open}
        footer={null}
        title={
          <Typography.Title level={2} style={{ margin: 0, marginBottom: '20px' }}>
            Обновление данных специалиста
          </Typography.Title>
        }
        width="100%"
        onCancel={onReset}
      >
        <AddSpecialistForm onFinish={onFinish} onReset={onReset} type="add" initValue={specialist} />
        {/* <AddPatientForm onFinish={onFinish} onReset={onReset} /> */}
      </Modal>
    </>
  );
};

export default SpecialistShedule;
