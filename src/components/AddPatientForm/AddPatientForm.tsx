/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/require-default-props */
import { AutoComplete, Button, Form, Input, Radio, Row, Spin, Col, DatePicker } from 'antd';
// import momentGenerateConfig from 'rc-picker/lib/generate/moment';
// import type { Moment } from 'moment';
// import generatePicker from 'antd/es/date-picker/generatePicker';

import React, { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';
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
}

const AddPatientForm: FunctionComponent<FormDialogProps> = ({
  form,
  onFinish,
  onReset,
  defaultValue,
  onActivate,
  disabled,
}) => {
  const [form] =
  // const [query, setQuery] = useState('');
  const dispatch = useAppDispatch();
  const { data, query } = useAppSelector((state) => state.addPatientReducer);
  const { setData, setQuery, setDataField } = addPatientSlice.actions;
  const { data: options, isLoading: addressIsLoading } = dadataAPI.useGetAddressQuery(query);

  const onSearchAC: any = debounce((searchText) => {
    dispatch(setQuery(searchText));
    console.log(searchText);
  }, 800);

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
    // values?.forEach((element))
    console.log('CHAG:', values);
    values?.forEach((field: any) => dispatch(setDataField({ [field?.name[0]]: field?.value })));
    console.log('data:', data);
  };

  const onFinish1 = (values: any) => {
    console.log('CHAG:', values);
  };

  useEffect(() => {
    dispatch(setDataField({ surname: 'sdsds' }));
    console.log(defaultValue);
    if (defaultValue) dispatch(setData(defaultValue));
    // defaultValue
    // // console.log('EFFECT');
    // form.setFieldsValue({
    //   ...patient,
    //   dateOfBirth: patient?.dateOfBirth ? dayjs(patient.dateOfBirth) : undefined,
    // });
  }, [defaultValue]);

  console.log(typeof defaultValue?.dateOfBirth);

  return (
    <Form
      name="addPatient"
      form={form}
      labelWrap
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 18 }}
      colon={false}
      onFinish={onFinish}
      disabled={disabled}
      // validateTrigger={}
      initialValues={data}
      onFieldsChange={onFieldsChange}
    >
      <div>{data?.surname}</div>
      <Form.Item
        rules={[{ required: true, message: 'Поле "Фамилия" не должно быть пустым' }]}
        label={<div className={addClass(classes, 'form-item')}>Фамилия</div>}
        name="surname"
      >
        <Input id="surname" value={data ? data.surname : ''} />
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
        // normalize={(e, x, y) => console.log(e, x, y)}
        rules={[{ required: true, message: 'Поле "Дата рождения" не должно быть пустым' }]}
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
          onSearch={onSearchAC}
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
