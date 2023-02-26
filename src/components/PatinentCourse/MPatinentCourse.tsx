/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
  Card,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { ExclamationCircleFilled, RightOutlined, SelectOutlined, UserOutlined } from '@ant-design/icons';
import { addClass } from '../../app/common';
import { patientsAPI, servicesAPI } from '../../app/services';
import classes from './PatinentCourse.module.scss';
import { IAddService, IPatient, IServiceGroupToSelect, IServiceInCourse } from '../../models';
import AddPatientForm from '../AddPatientForm/AddPatientForm';
import './antd.rewrite.scss';
import ModalAddAppToServ from '../ModalAddAppToServ/ModalAddAppToServ';
import { paymentAPI } from '../../app/services/payments.service';
import ModalServiceInfo from '../ModalServiceInfo/ModalServiceInfo';
import { useAppSelector } from '../../app/hooks';
import MModalServiceInfo from '../ModalServiceInfo/MModalServiceInfo';

const { Panel } = Collapse;
const { Title } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

interface MPatinentCourseProps extends PropsWithChildren {
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
  // {
  //   title: 'Сеанс',
  //   dataIndex: 'number',
  //   key: 'number',
  //   width: '7%',
  // },
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
    render: (flag: boolean, r: any) => {
      if (r.kind === 'payment') return '';
      return flag ? (
        <div className={addClass(classes, 'active-table-item__active')}>Оказана</div>
      ) : (
        <div className={addClass(classes, 'active-table-item__not-active')}>Неоказана</div>
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
      // return IServiceInCourse. ? (
      //   <div className={addClass(classes, 'active-table-item__active')}>Оказана</div>
      // ) : (
      //   <div className={addClass(classes, 'active-table-item__not-active')}>Неоказана</div>
      // );
    },
  },
];

const MPatinentCourse: FunctionComponent<MPatinentCourseProps> = ({ patient }) => {
  const { isAuth, roles, name } = useAppSelector((state) => state.authReducer);
  const isAdmin = roles.find((r) => r === 'admin');
  const isSpec = roles.find((r) => r === 'specialist');
  const [messageApi, contextHolder] = message.useMessage();
  const [payment, setPayment] = useState<string>('');
  const { data: paymentData, isLoading: isPaymentDataLoading } = paymentAPI.useGetPaymentByIdQuery(
    { id: payment },
    { skip: !payment },
  );
  const [serv, setServ] = useState<string>('');
  const [openCourse] = patientsAPI.useOpenCourseMutation();
  const [newCourse] = patientsAPI.useNewCourseMutation();
  const [closeCourse] = patientsAPI.useCloseCourseMutation();
  const [addService] = patientsAPI.useAddServiceMutation();
  const [addPayment] = paymentAPI.useAddPaymentMutation();
  const [removePayment] = paymentAPI.useRemovePaymentMutation();
  const { data: coursesData, isLoading } = patientsAPI.useGetPatientCoursesQuery(
    { patient: patient?._id || '' },
    { skip: !patient?._id },
  );
  const { data: advSum, isLoading: isAdvSumLoading } = paymentAPI.useGetAdvanceQuery(
    { patient: patient?._id || '' },
    { skip: !isAdmin || !patient?._id },
  );
  const { data: represToSelect, isLoading: isrepresToSelectLoading } = patientsAPI.useGetPatientRepresentativesQuery(
    {
      id: patient?._id || '',
      isActive: true,
    },
    { skip: !patient?._id },
  );
  // console.log(advSum);
  const [isServInfoOpen, setIsServInfoOpen] = useState(false);
  const [isPayInfoOpen, setIsPayInfoOpen] = useState(false);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);

  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);

  const [currentGroup, setCurrentGroup] = useState<string | undefined>(undefined);
  const { data: groupToSelect, isLoading: isLoadingGroupToSelect } = servicesAPI.useGetGroupsQuery(
    {},
    { skip: !isAdmin },
  );
  const { data: typeToSelect, isLoading: isLoadingTypeToSelect } = servicesAPI.useGetTypesQuery(
    {
      group: currentGroup || '',
    },
    { skip: !isAdmin || !currentGroup },
  );
  const [adv, setAdv] = useState<boolean>(false);

  const onRowClick = (record: IServiceInCourse) => {
    if (record.kind === 'service') {
      setServ(record._id);
      setIsServInfoOpen(true);
    } else {
      setPayment(record._id);
      setIsPayInfoOpen(true);
    }
  };
  const [form] = Form.useForm();
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
      const result = await addService(addServiceDto).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Услуги успешно добавлены',
      });
      onAddServiceCancel();
    } catch (e) {
      messageApi.open({
        type: 'error',
        content: 'Ошибка связи с сервером',
      });
    }
  };
  const onAddPaymentCancel = () => {
    // form.resetFields();
    // setCurrentGroup(undefined);
    // setIsAddServiceOpen(false);
    setIsAddPaymentOpen(false);
    setAdv(false);
  };
  const onAddPaymentFinish = async (values: any) => {
    console.log(values);
    values.date = values.date.second(0);
    values.date = values.date.millisecond(0);
    values.date = values.date.format('YYYY-MM-DDTHH:mm:ssZ');
    values.patient = patient?._id || '';
    values.inCourse = !values.inCourse;
    // const addServiceDto: IAddService = {
    //   type: values.type,
    //   patient: patient?._id || '',
    //   inCourse: !values.inCourse,
    //   amount: values.amount,
    //   note: values.note,
    // };
    try {
      const result = await addPayment(values).unwrap();
      messageApi.open({
        type: 'success',
        content: 'Оплата добавлена успешно',
      });
      onAddPaymentCancel();
    } catch (e) {
      messageApi.open({
        type: 'error',
        content: 'Ошибка связи с сервером',
      });
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
            const result = await removePayment({ id: payment }).unwrap();
            messageApi.open({
              type: 'success',
              content: 'Оплата успешно удалена',
            });
            onPayInfoClose();
          } catch (e) {
            messageApi.open({
              type: 'error',
              content: 'Ошибка связи с сервером',
            });
          }
        },
        onCancel() {
          console.log('Cancel');
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

  return (
    <>
      {contextHolder}
      <MModalServiceInfo
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
        <Form labelWrap labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} onFinish={onFinish} form={form}>
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
              // onChange={onGroupChange}
            />
          </Form.Item>
          <Form.Item
            valuePropName="checked"
            initialValue={coursesData?.canBeNew ? true : undefined}
            // initialValue={initValue?.isActive !== undefined ? initValue?.isActive : true}
            label={<div className={addClass(classes, 'form-item')}>Вне курса</div>}
            name="inCourse"
            // validateStatus={coursesData?.canBeNew ? 'warning' : undefined}
            // hasFeedback={coursesData?.canBeNew}
            help={coursesData?.canBeNew ? 'Нет ни одного открытого курса' : undefined}
          >
            <Switch id="inCourse" disabled={!!coursesData?.canBeNew} />
          </Form.Item>
          <Form.Item
            // initialValue={initValue?.name ? initValue.name : ''}
            rules={[{ required: true, message: 'Поле "Количество" не должно быть пустым' }]}
            label="Количество"
            name="amount"
          >
            <InputNumber min={1} max={15} id="amount" />
          </Form.Item>
          <Form.Item
            // initialValue={initValue?.name ? initValue.name : ''}
            // rules={[{ required: true, message: 'Поле "Комментарий" не должно быть пустым' }]}
            label="Комментарий"
            name="note"
          >
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
          {/* {advSum === undefined || advSum <= 0 ? (
            <div>
              <p style={{ margin: 0, marginBottom: '20px' }}>
                Оплата из авансовых платежей недоступна, так как отсутствует излишок средств.
              </p>
            </div>
          ) : (
            <div>
              <p style={{ margin: 0, marginBottom: '20px' }}>{`Сумма авнсовых платяжей ${advSum}`}</p>
            </div>
          )} */}
          <Form.Item
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            valuePropName="checked"
            label={<div className={addClass(classes, 'form-item')}>Опалата из авансовых платежей</div>}
            name="fromTheAdvance"
            help={advSum && advSum <= 0 ? 'Нет излишних средств' : undefined}
          >
            <Switch
              id="fromTheAdvance"
              onChange={(checked) => setAdv(checked)}
              disabled={advSum === undefined || advSum <= 0}
            />
          </Form.Item>
          {adv ? null : (
            <Form.Item
              // initialValue={initValue?.surname ? initValue.surname : ''}
              rules={[{ required: true, message: 'Поле "Тип оплаты" не должно быть пустым' }]}
              label="Тип оплаты"
              name="name"
            >
              <AutoComplete
                options={[{ value: 'Наличный расчет' }, { value: 'Безналичный расчет' }]}
                // style={{ width: 200 }}
                // onSelect={onSelect}
                // onSearch={onSearch}
                // placeholder="input here"
              />
              {/* <Input id="surname" /> */}
            </Form.Item>
          )}

          <Form.Item
            rules={[{ message: 'Поле "Группа услуг" не должно быть пустым' }]}
            label="Группа услуг"
            name="groupId"
          >
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
              // initialValue={initValue?.isActive !== undefined ? initValue?.isActive : true}
              label={<div className={addClass(classes, 'form-item')}>Вне курса</div>}
              name="inCourse"
              // validateStatus={coursesData?.canBeNew ? 'warning' : undefined}
              // hasFeedback={coursesData?.canBeNew}
              help={coursesData?.canBeNew ? 'Нет ни одного открытого курса' : undefined}
            >
              <Switch id="inCourse" disabled={!!coursesData?.canBeNew} />
            </Form.Item>
            // <Form.Item
            //   valuePropName="checked"
            //   // initialValue={initValue?.isActive !== undefined ? initValue?.isActive : true}
            //   label={<div className={addClass(classes, 'form-item')}>Вне курса</div>}
            //   name="inCourse"
            // >
            //   <Switch id="inCourse" />
            // </Form.Item>
          )}
          <Form.Item
            // initialValue={initValue?.name ? initValue.name : ''}
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
            {/* <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" disabled={[false, true]} /> */}
            <DatePicker
              // defaultValue={dayjs()}
              id="begDate"
              style={{ marginRight: '10px' }}
              format="DD.MM.YYYY | HH:mm"
              showTime={{ format: 'HH:mm' }}
            />
          </Form.Item>
          {adv ? null : (
            <Form.Item
              // rules={[{ message: 'Поле "Группа услуг" не должно быть пустым' }]}
              label="Плательщик"
              name="payer"
            >
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
        {/* <AddPatientForm onFinish={onFinish} onReset={onReset} initValue={patient} /> */}
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
                {/* coursesData.courses[coursesData.courses.length - 1].number === 0 ||
              coursesData.courses[coursesData.courses.length - 1].status === false  */}
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

                {/* : (
                <Button type="link" style={{ marginRight: '0px' }}>
                  Закрыть курс
                </Button>
              )} */}
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
                    // #1677FF
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
                                    onClick={(e) => onRowClick(service)}
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
                                    // extra={
                                    //   <Button
                                    //     type="link"
                                    //     icon={<SelectOutlined />}
                                    //     onClick={() => {
                                    //       onRowClick(service);
                                    //     }}
                                    //   />
                                    // }
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
                                    // bodyStyle={{ padding: '5px' }}
                                    style={{
                                      width: '100%',
                                      marginBottom: '0px',
                                      borderRadius: 0,
                                      border: 'none',
                                      borderBottom: '1px solid #9f9f9f',
                                    }}
                                    // headStyle={patient.isActive ? { backgroundColor: 'green' } : { backgroundColor: 'red' }}
                                  >
                                    <Descriptions
                                      size="small"
                                      column={4}
                                      // style={{ color: 'black' }}
                                      // layout="vertical"
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
                                                // hour: 'numeric',
                                                // minute: 'numeric',
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
                                              Неоказана
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
                              {/* <Table
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
                              /> */}
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

export default MPatinentCourse;
