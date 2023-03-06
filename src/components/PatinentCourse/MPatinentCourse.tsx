/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/no-unstable-nested-components */
import { Button, Modal, Typography, Descriptions, Collapse, Spin, Empty, Card } from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { RightOutlined, UserOutlined } from '@ant-design/icons';
import { addClass } from '../../app/common';
import { patientsAPI } from '../../app/services';
import classes from './PatinentCourse.module.scss';
import { IPatient, IServiceInCourse } from '../../models';
import './antd.rewrite.scss';
import { paymentAPI } from '../../app/services/payments.service';
import { useAppSelector } from '../../app/hooks';
import MModalServiceInfo from '../ModalServiceInfo/MModalServiceInfo';
import ErrorResult from '../ErrorResult/ErrorResult';

const { Panel } = Collapse;
const { Title } = Typography;

interface MPatinentCourseProps extends PropsWithChildren {
  // eslint-disable-next-line react/require-default-props
  patient?: IPatient;
}

const MPatinentCourse: FunctionComponent<MPatinentCourseProps> = ({ patient }) => {
  // roles
  const { roles } = useAppSelector((state) => state.authReducer);
  const isSpec = roles.find((r) => r === 'specialist');
  // local state
  const [serv, setServ] = useState<string>('');
  const [payment, setPayment] = useState<string>('');
  const [isServInfoOpen, setIsServInfoOpen] = useState(false);
  const [isPayInfoOpen, setIsPayInfoOpen] = useState(false);
  // API queries
  const {
    data: paymentData,
    isLoading: isPaymentDataLoading,
    isError: paymentError,
  } = paymentAPI.useGetPaymentByIdQuery({ id: payment }, { skip: !payment });
  const {
    data: coursesData,
    isLoading,
    isError: corsesError,
  } = patientsAPI.useGetPatientCoursesQuery({ patient: patient?._id || '' }, { skip: !patient?._id });

  const onRowClick = (record: IServiceInCourse) => {
    if (record.kind === 'service') {
      setServ(record._id);
      setIsServInfoOpen(true);
    } else {
      setPayment(record._id);
      setIsPayInfoOpen(true);
    }
  };
  const onPayInfoClose = () => {
    setPayment('');
    setIsPayInfoOpen(false);
  };

  if (corsesError || paymentError) return <ErrorResult />;

  return (
    <>
      <MModalServiceInfo
        patient={patient}
        isOpen={isServInfoOpen}
        setIsOpen={setIsServInfoOpen}
        serviceId={serv || ''}
        title="Информация об услуге"
      />

      <Modal
        destroyOnClose
        open={isPayInfoOpen}
        footer={
          <Button type="default" style={{ marginRight: '0px' }} onClick={onPayInfoClose}>
            Назад
          </Button>
        }
        title={
          <Typography.Title level={2} style={{ margin: 0, marginBottom: '20px' }}>
            Информация об оплате
          </Typography.Title>
        }
        width="550px"
        onCancel={onPayInfoClose}
      >
        {isPaymentDataLoading ? (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingTop: '50px' }}>
            <Spin tip="Загрузка..." />
          </div>
        ) : (
          <Descriptions column={3}>
            <Descriptions.Item label="Тип оплаты" span={3}>
              {paymentData?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Дата" contentStyle={{ fontWeight: 'bold' }}>
              {paymentData?.date
                ? new Date(paymentData?.date).toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                  })
                : 'не указана'}
            </Descriptions.Item>
            <Descriptions.Item label="Время" span={2} contentStyle={{ fontWeight: 'bold' }}>
              {paymentData?.date
                ? new Date(paymentData?.date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
                : 'не указано'}
            </Descriptions.Item>
            <Descriptions.Item label="Группа" span={3}>
              {paymentData?.group ? paymentData?.group : 'оплата вне групп'}
            </Descriptions.Item>
            <Descriptions.Item label="Сумма" span={3}>
              {paymentData?.amount}
            </Descriptions.Item>
            <Descriptions.Item label="Плательщик" span={3}>
              {paymentData?.payer ? paymentData?.payer : 'не назначен'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {isLoading ? (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
          <Spin tip="Загрузка..." />
        </div>
      ) : coursesData?.courses ? (
        <Descriptions
          size="middle"
          title={`Курсы пациента.${
            isSpec ? '' : ` Общий баланс: ${coursesData.courses.reduce((accum, current) => accum + current.total, 0)}`
          }`}
        >
          <Descriptions.Item>
            <Collapse
              size="small"
              defaultActiveKey={coursesData?.courses.map((c) => c._id)}
              style={{ width: '100%' }}
              bordered={false}
              expandIconPosition="start"
              // eslint-disable-next-line react/no-unstable-nested-components
              expandIcon={({ isActive }) => (
                <RightOutlined
                  style={{ paddingTop: '6px', color: 'white', fontSize: '16px' }}
                  rotate={isActive ? 90 : 0}
                />
              )}
            >
              {coursesData?.courses.map((course) => {
                return (
                  <Panel
                    header={
                      <Title style={{ margin: 0, color: 'white' }} level={4}>
                        {`${
                          course.number ? `Курс №${course.number}${!course.status ? ' | ЗАКРЫТ' : ''}` : 'Вне курсов'
                        }${isSpec ? '' : ` | ${course.total}`}`}
                      </Title>
                    }
                    key={course._id}
                    style={{ verticalAlign: 'center', padding: 0 }}
                  >
                    {course.serviceGroups.length ? (
                      <Collapse
                        style={{ borderRadius: 0 }}
                        size="small"
                        defaultActiveKey={course.serviceGroups.map((c) => c._id)}
                        expandIcon={({ isActive }) => (
                          <RightOutlined style={{ paddingTop: '4px', fontSize: '12px' }} rotate={isActive ? 90 : 0} />
                        )}
                      >
                        {course.serviceGroups.map((group) => {
                          return (
                            <Panel
                              // header={group.name}
                              header={
                                <Title style={{ margin: 0 }} level={5}>
                                  {`${group.name}${isSpec ? '' : ` | ${group.total}`}`}
                                </Title>
                              }
                              key={group._id}
                              style={{ backgroundColor: '#f0f0f0', borderRadius: 0 }}
                              className="inner-panel"
                            >
                              {group.services.length !== 0 ? (
                                group.services.map((service) => (
                                  // eslint-disable-next-line jsx-a11y/anchor-is-valid
                                  <Card
                                    onClick={() => onRowClick(service)}
                                    bodyStyle={{
                                      padding: '5px',
                                      borderRadius: 0,
                                      ...(service.kind === 'service'
                                        ? service.status === true
                                          ? { background: '#b4e7bb' }
                                          : !service.date || new Date(service.date) > new Date()
                                          ? { background: '#fdf291' }
                                          : { background: '#fdc591' }
                                        : { background: '#aad2ff' }),
                                    }}
                                    key={service._id}
                                    size="small"
                                    title={service.name}
                                    headStyle={{
                                      borderRadius: 0,
                                      ...(service.kind === 'service'
                                        ? service.status === true
                                          ? { background: '#b4e7bb' }
                                          : !service.date || new Date(service.date) > new Date()
                                          ? { background: '#fdf291' }
                                          : { background: '#fdc591' }
                                        : { background: '#aad2ff' }),
                                    }}
                                    style={{
                                      width: '100%',
                                      marginBottom: '0px',
                                      borderRadius: 0,
                                      border: 'none',
                                      borderBottom: '1px solid #9f9f9f',
                                    }}
                                  >
                                    <Descriptions
                                      size="small"
                                      column={4}
                                      contentStyle={{ color: 'black' }}
                                      labelStyle={{ fontWeight: 'bold', paddingBottom: '0px', color: 'black' }}
                                    >
                                      {service.date ? (
                                        <Descriptions.Item label="Дата" span={2} style={{ paddingBottom: '0px' }}>
                                          {service.date
                                            ? new Date(service.date).toLocaleString('ru-RU', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: '2-digit',
                                              })
                                            : ''}
                                        </Descriptions.Item>
                                      ) : null}
                                      {service.date ? (
                                        <Descriptions.Item label="Время" span={2} style={{ paddingBottom: '0px' }}>
                                          {service.date
                                            ? new Date(service.date).toLocaleTimeString('ru-RU', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                              })
                                            : ''}
                                        </Descriptions.Item>
                                      ) : null}

                                      {service.kind === 'service' ? (
                                        <Descriptions.Item label="Статус" style={{ paddingBottom: '0px' }} span={4}>
                                          {service.status ? (
                                            <div className={addClass(classes, 'active-table-item__active')}>
                                              Оказана
                                            </div>
                                          ) : (
                                            <div className={addClass(classes, 'active-table-item__not-active')}>
                                              Не оказана
                                            </div>
                                          )}
                                        </Descriptions.Item>
                                      ) : null}
                                      {service.specialist || service.payer ? (
                                        <Descriptions.Item
                                          style={{ paddingBottom: '0px' }}
                                          label={<UserOutlined />}
                                          span={4}
                                        >
                                          {service.specialist || service.payer}
                                        </Descriptions.Item>
                                      ) : null}
                                      {service.price ? (
                                        <Descriptions.Item style={{ paddingBottom: '0px' }} label="Расход" span={4}>
                                          {service.price}
                                        </Descriptions.Item>
                                      ) : null}
                                      {service.cost ? (
                                        <Descriptions.Item style={{ paddingBottom: '0px' }} label="Приход" span={4}>
                                          {service.cost}
                                        </Descriptions.Item>
                                      ) : null}
                                    </Descriptions>
                                  </Card>
                                ))
                              ) : (
                                <Empty
                                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                                  description="Пациенты не найдены"
                                  style={{ backgroundColor: 'white', margin: 0, padding: '40px', borderRadius: '5px' }}
                                />
                              )}
                            </Panel>
                          );
                        })}
                      </Collapse>
                    ) : (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Услуги отсутствуют"
                        style={{ backgroundColor: 'white', margin: 0, padding: '30px 0px' }}
                      />
                    )}
                  </Panel>
                );
              })}
            </Collapse>
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Курсы и услуги отсутствуют" />
      )}
    </>
  );
};

export default MPatinentCourse;
