/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/no-unstable-nested-components */
import {
  Button,
  Modal,
  Typography,
  Descriptions,
  message,
  Collapse,
  Table,
  Spin,
  Empty,
  Form,
  Row,
  Col,
  Select,
  Switch,
  InputNumber,
  Input,
  AutoComplete,
  DatePicker,
} from 'antd';
import dayjs from 'dayjs';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { ExclamationCircleFilled, RightOutlined } from '@ant-design/icons';
import { addClass, mutationErrorHandler } from '../../app/common';
import { patientsAPI, servicesAPI } from '../../app/services';
import classes from './PatinentCourse.module.scss';
import { IAddService, IPatient, IServiceInCourse } from '../../models';
import './antd.rewrite.scss';
import { paymentAPI } from '../../app/services/payments.service';
import ModalServiceInfo from '../ModalServiceInfo/ModalServiceInfo';
import { useAppSelector } from '../../app/hooks';
import ErrorResult from '../ErrorResult/ErrorResult';

const { Panel } = Collapse;
const { Title } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

interface PatinentCourseProps extends PropsWithChildren {
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
    title: 'Тип оплаты / услуга',
    dataIndex: 'name',
    key: 'name',
    width: '25%',
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    key: 'status',
    width: '10%',
    render: (flag: boolean, r: any) => {
      if (r.kind === 'payment') return '';
      return flag ? (
        <div className={addClass(classes, 'active-table-item__active')}>Оказана</div>
      ) : (
        <div className={addClass(classes, 'active-table-item__not-active')}>Не оказана</div>
      );
    },
  },
  {
    title: 'Приход',
    dataIndex: 'cost',
    key: 'cost',
    width: '8%',
  },
  {
    title: 'Расход',
    dataIndex: 'price',
    key: 'price',

    width: '8%',
  },
  {
    title: 'Специалист / Плательщик',
    dataIndex: 'specialist',
    key: 'specialist',
    width: '21%',
    render: (field: any, record: any) => {
      return record.specialist || record.payer;
    },
  },
];

const PatinentCourse: FunctionComponent<PatinentCourseProps> = ({ patient }) => {
  // roles
  const { roles } = useAppSelector((state) => state.authReducer);
  const isAdmin = roles.find((r) => r === 'admin');
  const isSpec = roles.find((r) => r === 'specialist');

  // local state
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [payment, setPayment] = useState<string>('');
  const [serv, setServ] = useState<string>('');
  const [isServInfoOpen, setIsServInfoOpen] = useState(false);
  const [isPayInfoOpen, setIsPayInfoOpen] = useState(false);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<string | undefined>(undefined);
  const [adv, setAdv] = useState<boolean>(false);
  // API mutations
  const [openCourse] = patientsAPI.useOpenCourseMutation();
  const [newCourse] = patientsAPI.useNewCourseMutation();
  const [closeCourse] = patientsAPI.useCloseCourseMutation();
  const [addService] = patientsAPI.useAddServiceMutation();
  const [addPayment] = paymentAPI.useAddPaymentMutation();
  const [removePayment] = paymentAPI.useRemovePaymentMutation();
  // API queries
  const {
    data: paymentData,
    isLoading: isPaymentDataLoading,
    isError: paymentError,
  } = paymentAPI.useGetPaymentByIdQuery({ id: payment }, { skip: !payment, pollingInterval: 15000 });
  const {
    data: coursesData,
    isLoading,
    isError: corsesError,
  } = patientsAPI.useGetPatientCoursesQuery(
    { patient: patient?._id || '' },
    { skip: !patient?._id, pollingInterval: 15000 },
  );
  const {
    data: advSum,
    // isLoading: isAdvSumLoading,
    isError: advSumError,
  } = paymentAPI.useGetAdvanceQuery(
    { patient: patient?._id || '' },
    { skip: !isAdmin || !patient?._id, pollingInterval: 15000 },
  );
  const {
    data: represToSelect,
    isLoading: isrepresToSelectLoading,
    isError: repToSelectError,
  } = patientsAPI.useGetPatientRepresentativesQuery(
    {
      id: patient?._id || '',
      isActive: true,
    },
    { skip: !patient?._id || !isAddPaymentOpen, pollingInterval: 15000 },
  );
  const {
    data: groupToSelect,
    isLoading: isLoadingGroupToSelect,
    isError: groupError,
  } = servicesAPI.useGetGroupsQuery(
    {},
    { skip: !isAdmin || (!isAddServiceOpen && !isAddPaymentOpen), pollingInterval: 30000 },
  );
  const {
    data: typeToSelect,
    isLoading: isLoadingTypeToSelect,
    isError: typeError,
  } = servicesAPI.useGetTypesQuery(
    {
      group: currentGroup || '',
    },
    { skip: !isAdmin || !currentGroup || !isAddServiceOpen, pollingInterval: 30000 },
  );

  const onRowClick = (record: IServiceInCourse) => {
    if (record.kind === 'service') {
      setServ(record._id);
      setIsServInfoOpen(true);
    } else {
      setPayment(record._id);
      setIsPayInfoOpen(true);
    }
  };

  const onAddServiceCancel = () => {
    form.resetFields();
    setCurrentGroup(undefined);
    setIsAddServiceOpen(false);
  };
  const onGroupChange = (value: any) => {
    setCurrentGroup(value);
    form.resetFields(['type']);
  };
  const onFinish = async (values: any) => {
    const addServiceDto: IAddService = {
      type: values.type,
      patient: patient?._id || '',
      inCourse: !values.inCourse,
      amount: values.amount,
      note: values.note,
    };
    try {
      await addService(addServiceDto).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Услуги успешно добавлены',
      });
      onAddServiceCancel();
    } catch (e) {
      mutationErrorHandler(messageApi, e);
    }
  };
  const onAddPaymentCancel = () => {
    setIsAddPaymentOpen(false);
    setAdv(false);
  };
  const onAddPaymentFinish = async (values: any) => {
    values.date = values.date.second(0);
    values.date = values.date.millisecond(0);
    values.date = values.date.format('YYYY-MM-DDTHH:mm:ssZ');
    values.patient = patient?._id || '';
    values.inCourse = !values.inCourse;
    try {
      await addPayment(values).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Оплата успешно добавлена',
      });
      onAddPaymentCancel();
    } catch (e) {
      mutationErrorHandler(messageApi, e);
    }
  };

  const onPayInfoClose = () => {
    setPayment('');
    setIsPayInfoOpen(false);
  };
  const onRemovePayment = () => {
    const showConfirm = () => {
      confirm({
        title: 'Подтвердите удаление оплаты.',
        icon: <ExclamationCircleFilled />,
        content: 'Вы точно хотите удалить оплату?',
        async onOk() {
          try {
            await removePayment({ id: payment }).unwrap();
            messageApi.open({
              type: 'success',
              content: 'Оплата успешно удалена',
            });
            onPayInfoClose();
          } catch (e) {
            mutationErrorHandler(messageApi, e);
          }
        },
      });
    };
    showConfirm();
  };

  const onNewCourse = () => {
    newCourse({ patientId: patient?._id || '' });
  };
  const onOpenCourse = () => {
    openCourse({ patientId: patient?._id || '' });
  };
  const onCloseCourse = () => {
    closeCourse({ patientId: patient?._id || '' });
  };

  if (paymentError || corsesError || advSumError || groupError || typeError || repToSelectError) return <ErrorResult />;

  return (
    <>
      {contextHolder}
      <ModalServiceInfo
        patient={patient}
        isOpen={isServInfoOpen}
        setIsOpen={setIsServInfoOpen}
        serviceId={serv || ''}
        title="Информация об услуге"
      />

      <Modal
        destroyOnClose
        open={isAddServiceOpen}
        footer={null}
        title={
          <Typography.Title level={2} style={{ margin: 0, marginBottom: '20px' }}>
            Добавление услуги
          </Typography.Title>
        }
        width="750px"
        onCancel={onAddServiceCancel}
      >
        <Form labelWrap labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} onFinish={onFinish} form={form}>
          <Form.Item
            rules={[{ required: true, message: 'Поле "Группа услуг" не должно быть пустым' }]}
            label="Группа услуг"
            name="group"
          >
            <Select
              id="group"
              allowClear
              style={{ width: '100%' }}
              options={groupToSelect}
              loading={isLoadingGroupToSelect}
              onChange={onGroupChange}
            />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: 'Поле "Тип услуги" не должно быть пустым' }]}
            label="Тип услуги"
            name="type"
          >
            <Select
              id="type"
              allowClear
              style={{ width: '100%' }}
              options={typeToSelect}
              loading={isLoadingTypeToSelect}
              disabled={!currentGroup}
            />
          </Form.Item>
          <Form.Item
            valuePropName="checked"
            initialValue={coursesData?.canBeNew ? true : undefined}
            label={<div className={addClass(classes, 'form-item')}>Вне курса</div>}
            name="inCourse"
            help={coursesData?.canBeNew ? 'Нет ни одного открытого курса' : undefined}
          >
            <Switch id="inCourse" disabled={!!coursesData?.canBeNew} />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: 'Поле "Количество" не должно быть пустым' }]}
            label="Количество"
            name="amount"
          >
            <InputNumber min={1} max={15} id="amount" />
          </Form.Item>
          <Form.Item label="Комментарий" name="note">
            <TextArea id="note" rows={4} placeholder="Комментарий к услуге" />
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
                <Button htmlType="button" onClick={onAddServiceCancel} className={addClass(classes, 'form-button')}>
                  Отменить
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        destroyOnClose
        open={isAddPaymentOpen}
        footer={null}
        title={
          <Typography.Title level={2} style={{ margin: 0, marginBottom: '20px' }}>
            Добавление оплаты
          </Typography.Title>
        }
        width="750px"
        onCancel={onAddPaymentCancel}
      >
        <Form labelWrap labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} onFinish={onAddPaymentFinish}>
          <Form.Item
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 15 }}
            valuePropName="checked"
            label={<div className={addClass(classes, 'form-item')}>Оплата из авансовых платежей</div>}
            name="fromTheAdvance"
            help={advSum !== undefined && advSum <= 0 ? 'Нет излишних средств' : undefined}
          >
            <Switch
              id="fromTheAdvance"
              onChange={(checked) => setAdv(checked)}
              disabled={advSum === undefined || advSum <= 0}
            />
          </Form.Item>
          {adv ? null : (
            <Form.Item
              rules={[{ required: true, message: 'Поле "Тип оплаты" не должно быть пустым' }]}
              label="Тип оплаты"
              name="name"
            >
              <AutoComplete options={[{ value: 'Наличный расчет' }, { value: 'Безналичный расчет' }]} />
            </Form.Item>
          )}

          <Form.Item label="Группа услуг" name="groupId">
            <Select
              id="groupId"
              allowClear
              style={{ width: '100%' }}
              options={groupToSelect}
              loading={isLoadingGroupToSelect}
              onChange={onGroupChange}
            />
          </Form.Item>
          {adv ? null : (
            <Form.Item
              valuePropName="checked"
              initialValue={coursesData?.canBeNew ? true : undefined}
              label={<div className={addClass(classes, 'form-item')}>Вне курса</div>}
              name="inCourse"
              help={coursesData?.canBeNew ? 'Нет ни одного открытого курса' : undefined}
            >
              <Switch id="inCourse" disabled={!!coursesData?.canBeNew} />
            </Form.Item>
          )}
          <Form.Item
            rules={[{ required: true, message: 'Поле "Сумма" не должно быть пустым' }]}
            label="Сумма"
            name="amount"
            help={adv ? `Максимальная сумма: ${advSum}` : undefined}
          >
            <InputNumber min={1} max={adv ? advSum : 1000000} id="amount" />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: 'Поле "Дата" не должно быть пустым' }]}
            label="Дата"
            name="date"
            initialValue={dayjs()}
          >
            <DatePicker
              id="begDate"
              style={{ marginRight: '10px' }}
              format="DD.MM.YYYY | HH:mm"
              showTime={{ format: 'HH:mm' }}
            />
          </Form.Item>
          {adv ? null : (
            <Form.Item label="Плательщик" name="payer">
              <Select
                id="payer"
                allowClear
                style={{ width: '100%' }}
                options={represToSelect?.data.map((r) => {
                  return { value: r._id, label: `${r.surname} ${r.name[0]}.${r.patronymic[0]}.` };
                })}
                loading={isrepresToSelectLoading}
                onChange={onGroupChange}
              />
            </Form.Item>
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
                <Button htmlType="button" onClick={onAddPaymentCancel} className={addClass(classes, 'form-button')}>
                  Отменить
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        destroyOnClose
        open={isPayInfoOpen}
        footer={
          <>
            {paymentData?.canRemove && isAdmin ? (
              <Button
                type="primary"
                style={{ marginRight: '0px', backgroundColor: '#e60000' }}
                onClick={onRemovePayment}
                disabled={!patient?.isActive}
              >
                Удалить оплату
              </Button>
            ) : null}

            <Button type="default" style={{ marginRight: '0px' }} onClick={onPayInfoClose}>
              Назад
            </Button>
          </>
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
          extra={
            isAdmin ? (
              <>
                {coursesData.canBeNew ? (
                  <Button type="link" onClick={onNewCourse} disabled={!patient?.isActive}>
                    Создать курс
                  </Button>
                ) : null}
                {coursesData.canBeOpen ? (
                  <Button type="link" onClick={onOpenCourse} disabled={!patient?.isActive}>
                    Открыть курс
                  </Button>
                ) : null}
                {coursesData.canBeClose ? (
                  <Button type="link" onClick={onCloseCourse} disabled={!patient?.isActive}>
                    Закрыть курс
                  </Button>
                ) : null}
                <Button type="link" onClick={() => setIsAddServiceOpen(true)} disabled={!patient?.isActive}>
                  Добавить услугу
                </Button>
                <Button type="link" onClick={() => setIsAddPaymentOpen(true)} disabled={!patient?.isActive}>
                  Добавить оплату
                </Button>
              </>
            ) : null
          }
        >
          <Descriptions.Item>
            <Collapse
              defaultActiveKey={coursesData?.courses.map((c) => c._id)}
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
              {coursesData?.courses.map((course) => {
                return (
                  <Panel
                    header={
                      <Title style={{ margin: 0, color: 'white' }} level={4}>
                        {`${
                          course.number
                            ? `Курс лечения №${course.number}${!course.status ? ' | ЗАКРЫТ' : ''}`
                            : 'Услуги и оплаты вне курсов'
                        }${isSpec ? '' : ` | Баланс: ${course.total}`}`}
                      </Title>
                    }
                    key={course._id}
                    style={{ verticalAlign: 'center' }}
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
                              header={
                                <Title style={{ margin: 0, fontVariant: 'small-caps' }} level={5}>
                                  {`${group.name}.${isSpec ? '' : ` Баланс: ${group.total}`}`}
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
                                      onRowClick(record);
                                    },
                                  };
                                }}
                                rowClassName={(record) =>
                                  record.kind === 'service'
                                    ? record.status === true
                                      ? 'my-table-row course-group-table-row_green'
                                      : !record.date || new Date(record.date) > new Date()
                                      ? 'my-table-row course-group-table-row_yellow'
                                      : 'my-table-row course-group-table-row_red'
                                    : 'my-table-row course-group-table-row_blue'
                                }
                                className={addClass(classes, 'patients-table')}
                                summary={() => (
                                  <Table.Summary fixed={true ? 'top' : 'bottom'}>
                                    <Table.Summary.Row>
                                      <Table.Summary.Cell index={0} colSpan={2}>
                                        Итого
                                      </Table.Summary.Cell>
                                      <Table.Summary.Cell index={2} colSpan={2}>
                                        {group.services.filter((s) => s.status).length}
                                      </Table.Summary.Cell>
                                      <Table.Summary.Cell index={6}>{group.income}</Table.Summary.Cell>
                                      <Table.Summary.Cell index={6}>{group.outcome}</Table.Summary.Cell>
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
      )}
    </>
  );
};

PatinentCourse.defaultProps = {
  patient: undefined,
};

export default PatinentCourse;
