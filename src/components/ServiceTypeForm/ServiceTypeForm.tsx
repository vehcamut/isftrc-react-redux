/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Form, Input, Row, Col, Switch, Select, InputNumber, TimePicker } from 'antd';
import React, { FunctionComponent, PropsWithChildren } from 'react';
import dayjs from 'dayjs';
import { addClass } from '../../app/common';
import classes from './ServiceTypeForm.module.scss';
import { IServiceTypeWithId } from '../../models';
import { servicesAPI, specialistTypesAPI } from '../../app/services';
import ErrorResult from '../ErrorResult/ErrorResult';

interface ServiceTypeFormProps extends PropsWithChildren {
  onFinish: (values: any) => void;
  onReset: () => void;
  initValue?: IServiceTypeWithId;
}

const ServiceTypeForm: FunctionComponent<ServiceTypeFormProps> = ({ onFinish, onReset, initValue }) => {
  const {
    data: groupsData,
    isLoading: isGroupsDataLoading,
    isError: groupsError,
  } = servicesAPI.useGetGroupstoSelectQuery({}, { pollingInterval: 30000 });
  const {
    data: specTypeData,
    isLoading: isSpecTypeDataLoading,
    isError: specTypeError,
  } = specialistTypesAPI.useGetSpecialistTypesToSelectQuery(
    {
      isActive: true,
    },
    { pollingInterval: 30000 },
  );
  const onBeforeFinish = (v: any) => {
    v.time = v.time.format('YYYY-MM-DDTHH:mm:ssZ');
    onFinish(v);
  };
  if (groupsError || specTypeError) return <ErrorResult />;
  return (
    <Form labelWrap labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={onBeforeFinish}>
      <Form.Item
        initialValue={initValue?.name ? initValue.name : ''}
        rules={[{ required: true, message: 'Поле "Название" не должно быть пустым' }]}
        label={<div className={addClass(classes, 'form-item')}>Название</div>}
        name="name"
      >
        <Input id="name" />
      </Form.Item>
      <Form.Item
        rules={[{ required: true, message: 'Поле "Группа услуг" не должно быть пустым' }]}
        label="Группа услуг"
        name="group"
        initialValue={initValue?.group ? initValue.group : undefined}
      >
        <Select id="group" allowClear style={{ width: '100%' }} options={groupsData} loading={isGroupsDataLoading} />
      </Form.Item>

      <Form.Item
        rules={[{ required: true, message: 'Поле "Специальности" не должно быть пустым' }]}
        label="Специальности"
        name="specialistTypes"
        initialValue={initValue?.specialistTypes ? initValue.specialistTypes.map((v) => v._id) : undefined}
      >
        <Select
          id="specialistTypes"
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          options={specTypeData}
          loading={isSpecTypeDataLoading}
        />
      </Form.Item>

      <Form.Item
        rules={[{ required: true, message: 'Поле "Стоимость" не должно быть пустым' }]}
        label="Стоимость"
        name="price"
        initialValue={initValue?.price ? initValue.price : undefined}
      >
        <InputNumber min={1} id="price" />
      </Form.Item>

      <Form.Item
        rules={[{ required: true, message: 'Поле "Длительность" не должно быть пустым' }]}
        label="Длительность"
        name="time"
        initialValue={initValue?.time ? dayjs(initValue.time) : undefined}
      >
        <TimePicker format="HH:mm:ss" id="time" />
      </Form.Item>

      <Form.Item
        valuePropName="checked"
        initialValue={initValue?.isActive !== undefined ? initValue?.isActive : true}
        label="Статус"
        name="isActive"
      >
        <Switch id="isActive" />
      </Form.Item>

      <Form.Item
        label="Количество по умолчанию"
        name="defaultAmountPatient"
        initialValue={initValue?.defaultAmountPatient ? initValue.defaultAmountPatient : undefined}
        help="Заполните это поле, если хотите, чтобы данный тип услуги был добавлен в данном количестве сразу при создании пациента"
      >
        <InputNumber min={0} id="defaultAmountPatient" />
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
            <Button htmlType="button" onClick={onReset} className={addClass(classes, 'form-button')}>
              Отменить
            </Button>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
};

ServiceTypeForm.defaultProps = {
  initValue: undefined,
};

export default ServiceTypeForm;
