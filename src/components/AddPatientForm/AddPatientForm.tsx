/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/require-default-props */
import { AutoComplete, Button, DatePicker, Form, Input, Radio, Spin } from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import debounce from 'lodash.debounce';
import dayjs from 'dayjs';
import { addClass } from '../../app/common';
import { dadataAPI } from '../../app/services';
import classes from './AddPatientForm.module.scss';
import { IPatient } from '../../models';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { addPatientSlice } from '../../app/reducers';

const { TextArea } = Input;

interface FormDialogProps extends PropsWithChildren {
  onFinish: (values: any) => void;
  onReset: () => void;
  defaultValue?: IPatient;
  disabled?: boolean;
  form?: any;
}

const AddPatientForm: FunctionComponent<FormDialogProps> = ({ form, onFinish, onReset, defaultValue, disabled }) => {
  const { data, query } = useAppSelector((state) => state.addPatientReducer);
  const { setData, setQuery } = addPatientSlice.actions;
  const dispatch = useAppDispatch();
  // const [query, setQuery] = useState('');
  const { data: options, isLoading: addressIsLoading } = dadataAPI.useGetAddressQuery(query);
  // dispatch()
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
  const onChange = (e: any) => {
    console.log(e);
    dispatch(
      setData({
        _id: '11',
        name: '11',
        surname: '11',
        patronymic: '11',
        address: '11',
        dateOfBirth: '22-03-23',
        gender: 'мужской',
        isActive: true,
        number: 121,
      }),
    );
  };
  return (
    <Form
      form={form}
      labelWrap
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 17 }}
      colon={false}
      onFieldsChange={onChange}
      onChange={onChange}
      onFinish={onFinish}
      disabled={disabled}
      initialValues={defaultValue}
    >
      <Form.Item
        rules={[{ required: true, message: 'Поле "Фамилия" не должно быть пустым' }]}
        label={<div className={addClass(classes, 'form-item')}>Фамилия</div>}
        name="surname"
        initialValue={data?.surname}
      >
        <Input
          id="surname"
          // defaultValue={defaultValue?.surname ? defaultValue.surname : ''}
          value={data?.surname}
          onChange={onChange}
        />
      </Form.Item>
      <Form.Item
        rules={[{ required: true, message: 'Поле "Имя" не должно быть пустым' }]}
        label={<div className={addClass(classes, 'form-item')}>Имя</div>}
        name="name"
      >
        <Input id="name" defaultValue={defaultValue?.name ? defaultValue.name : ''} />
      </Form.Item>
      <Form.Item
        rules={[{ required: true, message: 'Поле "Отчество" не должно быть пустым' }]}
        label={<div className={addClass(classes, 'form-item')}>Отчество</div>}
        name="patronymic"
      >
        <Input id="patronymic" defaultValue={defaultValue?.patronymic ? defaultValue.patronymic : ''} />
      </Form.Item>
      <Form.Item
        rules={[{ required: true, message: 'Поле "Пол" не должно быть пустым' }]}
        label={<div className={addClass(classes, 'form-item')}>Пол</div>}
        name="gender"
      >
        <Radio.Group name="radiogroup" id="gender" defaultValue={defaultValue?.gender ? defaultValue.gender : ''}>
          <Radio value="мужской">Мужской</Radio>
          <Radio value="женский">Женский</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        rules={[{ required: true, message: 'Поле "Дата рождения" не должно быть пустым' }]}
        label={<div className={addClass(classes, 'form-item')}>Дата рождения</div>}
        name="dateOfBirth"
      >
        <DatePicker
          id="dateOfBirth"
          // defaultValue
          defaultValue={defaultValue?.dateOfBirth ? dayjs(defaultValue.dateOfBirth) : undefined}
        />
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
          defaultValue={defaultValue?.address ? defaultValue.address : ''}
        />
      </Form.Item>
      <Form.Item label={<div className={addClass(classes, 'form-item')}>Примечание</div>} name="note">
        <TextArea rows={4} id="note" defaultValue={defaultValue?.note ? defaultValue.note : ''} />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 16, span: 8 }}>
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
      </Form.Item>
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