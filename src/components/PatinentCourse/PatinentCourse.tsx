/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Modal, Typography, Descriptions, message, Collapse, Table, Spin, Empty } from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { RightOutlined } from '@ant-design/icons';
import { addClass } from '../../app/common';
import { patientsAPI, servicesAPI } from '../../app/services';
import classes from './PatinentCourse.module.scss';
import { IPatient } from '../../models';
import AddPatientForm from '../AddPatientForm/AddPatientForm';
import './antd.rewrite.scss';

const { Panel } = Collapse;
const { Title } = Typography;

interface PatinentCourseProps extends PropsWithChildren {
  // eslint-disable-next-line react/require-default-props
  patient?: IPatient;
}

const columns = [
  {
    title: 'Дата',
    dataIndex: 'date',
    key: 'date',
    width: '8%',
    render: (date: string) => {
      return date
        ? new Date(date).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
          })
        : '';
    },
  },
  {
    title: 'Время',
    dataIndex: 'date',
    key: 'time',
    width: '7%',
    render: (date: string) => {
      return date ? new Date(date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : '';
    },
  },
  {
    title: 'Сеанс',
    dataIndex: 'number',
    key: 'number',
    width: '7%',
  },
  {
    title: 'Тип оплаты / услуга',
    dataIndex: 'name',
    key: 'name',
    width: '25%',
    // render: (x: any) => {
    //   return x.name ? x.name : x;
    // },
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    key: 'status',
    width: '10%',
    render: (flag: boolean) => {
      return flag ? (
        <div className={addClass(classes, 'active-table-item__active')}>Оказана</div>
      ) : (
        <div className={addClass(classes, 'active-table-item__not-active')}>Неоказана</div>
      );
    },
  },
  {
    title: 'Приход',
    dataIndex: 'price',
    key: 'price',
    width: '8%',
  },
  {
    title: 'Расход',
    dataIndex: 'cost',
    key: 'cost',
    width: '8%',
  },
  {
    title: 'Специалист / Плательщик',
    dataIndex: 'specialist',
    key: 'specialist',
    width: '21%',
    render: (field: any, record: any) => {
      return record.specialist || record.payer;
      // return IServiceInCourse. ? (
      //   <div className={addClass(classes, 'active-table-item__active')}>Оказана</div>
      // ) : (
      //   <div className={addClass(classes, 'active-table-item__not-active')}>Неоказана</div>
      // );
    },
  },
];

const PatinentCourse: FunctionComponent<PatinentCourseProps> = ({ patient }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [serv, setServ] = useState<string>('');
  const { data: servData, isLoading: isServDataLoading } = servicesAPI.useGetServiseByIdQuery({ id: serv });
  const [openCourse] = patientsAPI.useOpenCourseMutation();
  const [changeStatus] = patientsAPI.useChangePatientStatusMutation();
  const { data: coursesData, isLoading } = patientsAPI.useGetPatientCoursesQuery({ patient: patient?._id || '' });
  const [isServInfoOpen, setIsServInfoOpen] = useState(false);

  // const onFinish = async (values: any) => {
  //   try {
  //     await updatePatient({ ...patient, ...values }).unwrap();
  //     messageApi.open({
  //       type: 'success',
  //       content: 'Данные пациента успешно обновлены',
  //     });
  //   } catch (e) {
  //     messageApi.open({
  //       type: 'error',
  //       content: 'Ошибка связи с сервером',
  //     });
  //   }
  // };
  const onReset = () => {
    setIsServInfoOpen(false);
  };
  const onRowClick = (record: string) => {
    setServ(record);
    setIsServInfoOpen(true);
  };
  const onOpenCourse = () => {
    openCourse({ patientId: patient?._id || '' });
  };
  // const onEdit = () => {
  //   setOpen(true);
  // };
  // const onActivate = async () => {
  //   try {
  //     await changeStatus({ _id: patient?._id ? patient?._id : '', isActive: true }).unwrap();
  //     messageApi.open({
  //       type: 'success',
  //       content: 'Пациент успешно активирован',
  //     });
  //   } catch (e) {
  //     messageApi.open({
  //       type: 'error',
  //       content: 'Ошибка связи с сервером',
  //     });
  //   }
  // };
  // const onDeactivate = async () => {
  //   try {
  //     await changeStatus({ _id: patient?._id ? patient?._id : '', isActive: false }).unwrap();
  //     messageApi.open({
  //       type: 'success',
  //       content: 'Пациент успешно деактивирован',
  //     });
  //   } catch (e) {
  //     messageApi.open({
  //       type: 'error',
  //       content: 'Ошибка связи с сервером',
  //     });
  //   }
  // };
  return (
    <>
      {contextHolder}
      <Modal
        destroyOnClose
        open={isServInfoOpen}
        footer={null}
        title={
          <Typography.Title level={2} style={{ margin: 0, marginBottom: '20px' }}>
            Информация об услуге
          </Typography.Title>
        }
        width="500px"
        onCancel={onReset}
      >
        {isServDataLoading ? (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingTop: '50px' }}>
            <Spin tip="Загрузка..." />
          </div>
        ) : (
          <Descriptions>
            <Descriptions.Item label="Дата" contentStyle={{ fontWeight: 'bold' }}>
              {servData?.date
                ? new Date(servData?.date).toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                  })
                : 'не указана'}
            </Descriptions.Item>
            <Descriptions.Item label="Время" span={2} contentStyle={{ fontWeight: 'bold' }}>
              {servData?.date
                ? new Date(servData?.date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
                : 'не указано'}
            </Descriptions.Item>
            <Descriptions.Item label="Сеанс" span={3}>
              {servData?.number ? servData?.number : 'не указан'}
            </Descriptions.Item>
            <Descriptions.Item label="Статус" span={3}>
              {
                // eslint-disable-next-line no-nested-ternary
                servData?.status ? 'оказана' : servData?.date ? 'неоказана' : 'отсутствует запись'
              }
            </Descriptions.Item>
            <Descriptions.Item label="Пациент" span={3}>
              {servData?.patient}
            </Descriptions.Item>
            <Descriptions.Item label="Услуга" span={3}>
              {servData?.type}
            </Descriptions.Item>
            <Descriptions.Item label="Специалист" span={3}>
              {servData?.specialist ? servData?.specialist : 'не назначен'}
            </Descriptions.Item>
            <Descriptions.Item label="Комментарий" span={3}>
              {servData?.note ? servData?.note : 'отсутствует'}
            </Descriptions.Item>
          </Descriptions>
        )}
        {/* <AddPatientForm onFinish={onFinish} onReset={onReset} initValue={patient} /> */}
      </Modal>
      {isLoading ? (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
          <Spin tip="Загрузка..." />
        </div>
      ) : coursesData ? (
        <Descriptions
          size="middle"
          title="Курсы пациента. Общий баланс: "
          extra={
            <>
              {coursesData[coursesData.length - 1].number === 0 ||
              coursesData[coursesData.length - 1].status === false ? (
                <Button type="link" onClick={onOpenCourse}>
                  Открыть курс
                </Button>
              ) : (
                <Button type="link" style={{ marginRight: '0px' }}>
                  Закрыть курс
                </Button>
              )}
              <Button type="link">Добавить услугу</Button>
              <Button type="link">Добавить оплату</Button>
            </>
          }
        >
          <Descriptions.Item>
            <Collapse
              defaultActiveKey={coursesData?.map((c) => c._id)}
              style={{ width: '100%' }}
              bordered={false}
              expandIconPosition="start"
              // eslint-disable-next-line react/no-unstable-nested-components
              expandIcon={({ isActive }) => (
                <RightOutlined
                  style={{ paddingTop: '7px', color: 'white', fontSize: '16px' }}
                  rotate={isActive ? 90 : 0}
                />
              )}
            >
              {coursesData?.map((course) => {
                return (
                  <Panel
                    header={
                      <Title style={{ margin: 0, color: 'white' }} level={4}>
                        {course.number ? `Курс лечения №${course.number}` : 'Услуги и оплаты вне курсов'}
                      </Title>
                    }
                    key={course._id}
                    style={{ verticalAlign: 'center' }}
                    // #1677FF
                  >
                    {course.serviceGroups.length ? (
                      <Collapse
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
                                <Title style={{ margin: 0, fontVariant: 'small-caps' }} level={5}>
                                  {group.name}
                                </Title>
                              }
                              key={group._id}
                              style={{ backgroundColor: '#f0f0f0' }}
                              className="inner-panel"
                            >
                              <Table
                                columns={columns}
                                dataSource={group.services}
                                pagination={false}
                                size="small"
                                rowKey={(record) => record._id}
                                style={{ backgroundColor: '#e6f4ff' }}
                                loading={isLoading}
                                onRow={(record) => {
                                  return {
                                    onClick: () => {
                                      // console.log(servData);
                                      onRowClick(record._id);
                                    },
                                  };
                                }}
                                rowClassName={(record) =>
                                  record.status === true
                                    ? 'my-table-row course-group-table-row_yellow'
                                    : 'my-table-row course-group-table-row_yellow'
                                }
                                className={addClass(classes, 'patients-table')}
                                summary={() => (
                                  <Table.Summary fixed={true ? 'top' : 'bottom'}>
                                    <Table.Summary.Row>
                                      <Table.Summary.Cell index={0} colSpan={2}>
                                        Итого
                                      </Table.Summary.Cell>
                                      <Table.Summary.Cell index={2} colSpan={3}>
                                        5
                                      </Table.Summary.Cell>
                                      <Table.Summary.Cell index={6}>2000</Table.Summary.Cell>
                                      <Table.Summary.Cell index={6}>2000</Table.Summary.Cell>
                                    </Table.Summary.Row>
                                  </Table.Summary>
                                )}
                              />
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
        // <div style={{ height: '150px' }}>d</div>
      )}
    </>
  );
};

export default PatinentCourse;
