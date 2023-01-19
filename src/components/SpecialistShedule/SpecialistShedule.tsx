/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Modal, Typography, Descriptions, message, Calendar, Badge, BadgeProps, Tooltip } from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { CalendarMode } from 'antd/es/calendar/generateCalendar';
import { addClass } from '../../app/common';
import { patientsAPI, representativesAPI } from '../../app/services';
import classes from './SpecialistShedule.module.scss';
import { IAppointment, IPatient, IRepresentative, ISpecialist } from '../../models';
import AddPatientForm from '../AddPatientForm/AddPatientForm';
import AddRepresentativeForm from '../AddRepresentativeForm/AddRepresentativeForm';
import { specialistAPI } from '../../app/services/specialists.service';
import AddSpecialistForm from '../AddSpecialistForm/AddSpecialistForm';
import { appointmentsAPI } from '../../app/services/appointments.service';

interface SpecialistSheduleProps extends PropsWithChildren {
  // eslint-disable-next-line react/require-default-props
  specialist?: ISpecialist;
}

const SpecialistShedule: FunctionComponent<SpecialistSheduleProps> = ({ specialist }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [update] = specialistAPI.useUpdateSpecialistMutation();
  const [changeStatus] = specialistAPI.useChangeSpecialistStatusMutation();
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const { data, isLoading } = appointmentsAPI.useGetAppointmentsQuery({ specialistId: specialist?._id || '', date });
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
    if (mode === 'month') setDate(value.format('YYYY-MM-DD'));
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

  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);
    return (
      <ul
        className={addClass(classes, 'events')}
        // onClick={(e: any) => {
        //   e.stopProppagation();
        // }}
      >
        {data?.map((item: IAppointment) => {
          if (value.toDate().toDateString() === new Date(item.begDate).toDateString()) {
            // console.log(value.toDate().toDateString());
            // console.log(new Date(item.begDate).toDateString());
            const beg = new Date(item.begDate).toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit' });
            const end = new Date(item.endDate).toLocaleString('ru-RU', { hour: '2-digit', minute: '2-digit' });
            const time = `${beg}-${end}`;
            return (
              <Tooltip key={item._id} title={time} mouseLeaveDelay={0} mouseEnterDelay={0.5}>
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
          }
          return null;
        })}
      </ul>
    );
    // listData.map((item) => <React.Fragment key={item.content}>{item.content}</React.Fragment>);
  };

  const onChange = (value: any) => {
    console.log(value);
  };

  const onSelect = (value: Dayjs) => {
    setOpen(true);
  };

  return (
    <>
      {contextHolder}
      <Calendar onPanelChange={onPanelChange} onChange={onChange} dateCellRender={dateCellRender} onSelect={onSelect} />
      ;
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
      <Descriptions
        bordered
        size="middle"
        contentStyle={{ backgroundColor: '#ffffff' }}
        labelStyle={{
          color: '#ffffff',
          borderRight: '5px solid #e6f4ff',
          width: '150px',
        }}
        title="Личные данные представителя"
        column={1}
        extra={
          <>
            {specialist?.isActive ? (
              <Button type="primary" onClick={onDeactivate} style={{ marginRight: '10px', backgroundColor: '#e60000' }}>
                Деактивировать
              </Button>
            ) : (
              <Button type="primary" onClick={onActivate} style={{ marginRight: '10px', backgroundColor: '#0c9500' }}>
                Активировать
              </Button>
            )}

            <Button type="primary" onClick={onEdit}>
              Редактировать
            </Button>
          </>
        }
      >
        <Descriptions.Item label="Фамилия" className={addClass(classes, 'des-item')}>
          {specialist?.surname}
        </Descriptions.Item>
        <Descriptions.Item label="Имя" className={addClass(classes, 'des-item')}>
          {specialist?.name}
        </Descriptions.Item>
        <Descriptions.Item label="Отчество" className={addClass(classes, 'des-item')}>
          {specialist?.patronymic}
        </Descriptions.Item>
        <Descriptions.Item label="Пол" className={addClass(classes, 'des-item')}>
          {specialist?.gender}
        </Descriptions.Item>
        <Descriptions.Item label="Дата рождения" className={addClass(classes, 'des-item')}>
          {new Date(specialist?.dateOfBirth || '').toLocaleString('ru', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
          })}
        </Descriptions.Item>
        <Descriptions.Item label="Адрес" className={addClass(classes, 'des-item')}>
          {specialist?.address}
        </Descriptions.Item>
        <Descriptions.Item label="Номера телефонов" className={addClass(classes, 'des-item')}>
          {specialist?.phoneNumbers
            .map((c) => `+7 (${c.slice(0, 3)}) ${c.slice(3, 6)}-${c.slice(6, 8)}-${c.slice(8)}`)
            .join(', ')}
        </Descriptions.Item>
        <Descriptions.Item label="Электронные почты" className={addClass(classes, 'des-item')}>
          {specialist?.emails.join(', ')}
        </Descriptions.Item>
        <Descriptions.Item label="Специальности" className={addClass(classes, 'des-item')}>
          {specialist?.types.map((v) => v.name).join(', ')}
        </Descriptions.Item>
        <Descriptions.Item label="Логин" className={addClass(classes, 'des-item')}>
          {specialist?.login}
        </Descriptions.Item>
        {/* <Descriptions.Item label="Примечание" className={addClass(classes, 'des-item')}>
          {patient?.note}
        </Descriptions.Item> */}
        <Descriptions.Item label="Статус">{specialist?.isActive ? 'активен' : 'неактивен'}</Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default SpecialistShedule;
