/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/require-default-props */
import { AutoComplete, Button, Form, Input, Radio, Row, Spin, Col, DatePicker } from 'antd';
// import momentGenerateConfig from 'rc-picker/lib/generate/moment';
// import type { Moment } from 'moment';
// import generatePicker from 'antd/es/date-picker/generatePicker';

import React, { FunctionComponent, PropsWithChildren, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import dayjs from 'dayjs';
import { addClass } from '../../app/common';
import { dadataAPI } from '../../app/services';
import classes from './AddPatientForm.module.scss';
import { IPatient } from '../../models';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addPatientSlice } from '../../app/reducers';

// const DatePicker = generatePicker<Moment>(momentGenerateConfig);

const { TextArea } = Input;

interface FormDialogProps extends PropsWithChildren {
  onFinish: (values: any) => void;
  onReset: () => void;
  onActivate?: () => void;
  defaultValue?: IPatient;
  disabled?: boolean;
  form?: any;
  temp?: any;
}

const AddPatientForm: FunctionComponent<FormDialogProps> = ({
  form,
  onFinish,
  onReset,
  defaultValue,
  onActivate,
  disabled: sss,
  temp,
}) => {
  const [form1] = Form.useForm();
  const disabled = true;
  // const [query, setQuery] = useState('');
  // const { data: options, isLoading: addressIsLoading } = dadataAPI.useGetAddressQuery(query);
  const { data: options, isLoading: addressIsLoading } = dadataAPI.useGetAddressQuery('');

  // const onSearchAC: any = debounce((searchText) => {
  //   setQuery(searchText);
  //   console.log(searchText);
  // }, 800);

  // const onFinish = (values: any) => {
  //   console.log('Success:', values);
  //   console.log(JSON.stringify(values));
  // };

  // const onReset = () => {
  //   console.log('Success:', values);
  //   console.log(JSON.stringify(values));
  // };
  // const onActivate1 = (e: any) => {
  //   e.stopPropagation();
  //   console.log(e);
  //   if (onActivate) onActivate();
  // };
  const onFieldsChange = (values: any) => {
    console.log('CHAG:', values);
  };

  const onFinish1 = (values: any) => {
    console.log('CHAG:', values);
  };

  useMemo(() => {
    let x = defaultValue?.dateOfBirth;
    if (typeof defaultValue?.dateOfBirth === 'string') x = dayjs(defaultValue.dateOfBirth);
    console.log('EFFECT_FORM: ', defaultValue);
    setTimeout(() => {
      form1?.setFieldsValue({
        ...defaultValue,
        dateOfBirth: x || undefined,
      });
    }, 1000);
  }, [defaultValue, form1, temp]);

  console.log(defaultValue, form1);

  return (
    <Form
      name="addPatient"
      form={form1}
      labelWrap
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 18 }}
      colon={false}
      onFinish={onFinish}
      disabled={disabled}
      // validateTrigger={}
      initialValues={defaultValue}
      // onChange={onFieldsChange}
    >
      <Form.Item
        rules={[{ required: true, message: 'Поле "Фамилия" не должно быть пустым' }]}
        label={<div className={addClass(classes, 'form-item')}>Фамилия</div>}
        name="surname"
      >
        <Input id="surname" />
      </Form.Item>
      <Form.Item
        rules={[{ required: true, message: 'Поле "Имя" не должно быть пустым' }]}
        label={<div className={addClass(classes, 'form-item')}>Имя</div>}
        name="name"
      >
        {/* defaultValue={defaultValue?.name ? defaultValue.name : ''} */}
        <Input id="name" />
      </Form.Item>
      <Form.Item
        rules={[{ required: true, message: 'Поле "Отчество" не должно быть пустым' }]}
        label={<div className={addClass(classes, 'form-item')}>Отчество</div>}
        name="patronymic"
      >
        <Input id="patronymic" />
      </Form.Item>
      <Form.Item
        rules={[{ required: true, message: 'Поле "Пол" не должно быть пустым' }]}
        label={<div className={addClass(classes, 'form-item')}>Пол</div>}
        name="gender"
      >
        <Radio.Group name="radiogroup" id="gender">
          <Radio value="мужской">Мужской</Radio>
          <Radio value="женский">Женский</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        normalize={(e, x, y) => console.log(e, x, y)}
        rules={[
          {
            required: true,
            message: 'Поле "Дата рождения" не должно быть пустым',
            transform: (value) => {
              console.log(typeof value);
              return dayjs(value);
            },
          },
        ]}
        label={<div className={addClass(classes, 'form-item')}>Дата рождения</div>}
        name="dateOfBirth"
      >
        {/* patient?.dateOfBirth ? dayjs(patient.dateOfBirth) : undefined */}
        {/* defaultValue={defaultValue?.dateOfBirth ? dayjs(defaultValue.dateOfBirth) : undefined} */}
        <DatePicker
          defaultValue={undefined}
          format="DD.MM.YYYY"
          id="dateOfBirth"

          // defaultValue
        />
        {/* <Input id="dateOfBirth" /> */}
      </Form.Item>
      <Form.Item
        rules={[{ required: true, message: 'Поле "Адрес" не должно быть пустым' }]}
        label={<div className={addClass(classes, 'form-item')}>Адрес</div>}
        name="address"
      >
        <AutoComplete
          id="address"
          allowClear
          options={options}
          filterOption={false}
          notFoundContent={addressIsLoading ? <Spin size="small" /> : null}
          // onSearch={onSearchAC}
        />
      </Form.Item>
      <Form.Item label={<div className={addClass(classes, 'form-item')}>Прdddимечание</div>} name="note">
        <TextArea rows={4} id="note" />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 0, span: 22 }}>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            {/* <Button
              htmlType="button"
              disabled={!disabled}
              type="default"
              className={addClass(classes, 'form-button')}
              onClick={onActivate1}
            >
              Редактировать
            </Button> */}
            {disabled ? (
              <Button
                style={{ marginRight: '10px' }}
                htmlType="button"
                disabled={!disabled}
                type="primary"
                className={addClass(classes, 'form-button')}
                onClick={onActivate}
              >
                Редактировать
              </Button>
            ) : (
              // eslint-disable-next-line react/jsx-no-useless-fragment
              <></>
            )}
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
      `
      {/* <Form.Item wrapperCol={{ offset: 0, span: 22 }}>
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
      </Form.Item> */}
      {/* <Form.Item wrapperCol={{ offset: 0, span: 22 }}>
        {disabled ? (
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button
                htmlType="button"
                disabled={!disabled}
                type="default"
                className={addClass(classes, 'form-button')}
                onClick={onActivate1}
              >
                Редактировать
              </Button>
            </Col>
          </Row>
        ) : (
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
        )}
      </Form.Item> */}
      {/* {disabled ? (
        <Form.Item wrapperCol={{ offset: 0, span: 22 }}>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button
                htmlType="button"
                disabled={!disabled}
                type="default"
                className={addClass(classes, 'form-button')}
                onClick={onActivate1}
              >
                Редактировать
              </Button>
            </Col>
          </Row>
        </Form.Item>
      ) : (
        <Form.Item wrapperCol={{ offset: 0, span: 22 }}>
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
      )} */}
    </Form>
  );
};

export default AddPatientForm;

// const debounce = (callback: any, delay: number) => {
//   let timer: ReturnType<typeof setTimeout>;
//   return (...args: any[]) => {
//     clearTimeout(timer);
//     timer = setTimeout(() => callback(...args), delay);
//   };
// };
