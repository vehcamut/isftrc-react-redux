/* eslint-disable @typescript-eslint/no-unused-vars */
import { AutoComplete, Button, Form, Input, Radio, Row, Spin, Col, DatePicker, Typography } from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import debounce from 'lodash.debounce';
import dayjs from 'dayjs';
import MaskedInput from 'antd-mask-input';
import { DeleteOutlined } from '@ant-design/icons';
import { addClass } from '../../app/common';
import { dadataAPI } from '../../app/services';
import classes from './AddRepresentativeForm.module.scss';
import { IPatient } from '../../models';

const { TextArea } = Input;
const { Title, Paragraph, Text, Link } = Typography;
interface AddRepresentativeFormProps extends PropsWithChildren {
  onFinish: (values: any) => void;
  onReset: () => void;
  // eslint-disable-next-line react/require-default-props
  initValue?: IPatient;
}
// const onPNChange = (e: any) => {
//   // console.log(e);
//   // e.preventDefault();
// };

// const onPNKeyDown = (e: any) => {
//   console.log(e);
//   // if (!Number(e.key)) e.preventDefault();
// };

const AddRepresentativeForm: FunctionComponent<AddRepresentativeFormProps> = ({ onFinish, onReset, initValue }) => {
  const [query, setQuery] = useState('');
  const [amountPN, setaAountPN] = useState([
    <Form.Item
      rules={[
        {
          required: true,
          message: 'Поле "Номер телефона" не должно быть пустым',
        },
      ]}
      label="Номер телефона"
      name="phoneNumbers"
      key={0}
    >
      <MaskedInput
        id="phoneNumbers"
        mask={
          //  https://imask.js.org/guide.html#masked-pattern
          '+7 (000) 00-00-00'
        }
      />
    </Form.Item>,
  ]);
  const { data: options, isLoading: addressIsLoading } = dadataAPI.useGetAddressQuery(query);

  const onAddPN = () => {
    const newArray = amountPN.slice(0);
    newArray.push(
      // <Row justify="space-between">
      //   <Col span={20}>
      <Form.Item
        // labelCol={{ span: 5 }}
        // wrapperCol={{ span: 19 }}
        rules={[
          {
            required: true,
            message: 'Поле "Номер телефона" не должно быть пустым',
          },
        ]}
        label="Номер телефона"
        name={`phoneNumber${newArray.length}`}
        key={newArray.length}
      >
        <Input.Group compact>
          <MaskedInput
            style={{ width: 'calc(100% - 100px)' }}
            id="phoneNumbers"
            mask={
              //  https://imask.js.org/guide.html#masked-pattern
              '+7 (000) 00-00-00'
            }
          />
          <Button
            // type="link"
            style={{ color: 'red' }}
            // shape="circle"
            icon={<DeleteOutlined />}
            disabled={newArray.length < 1}
          />
        </Input.Group>
      </Form.Item>,
      // </Col>
      //   {/* <Col>
      //     <Button
      //       type="link"
      //       style={{ color: 'red' }}
      //       shape="circle"
      //       icon={<DeleteOutlined />}
      //       disabled={newArray.length < 1}
      //     />
      //   </Col> */}
      // {/* </Row>, */}
    );
    console.log(amountPN);
    setaAountPN(newArray);
  };
  const onSearchAC: any = debounce((searchText) => {
    setQuery(searchText);
  }, 800);

  return (
    <Form
      labelWrap
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 19 }}
      colon={false}
      onFinish={onFinish}
      // onFieldsChange={onPNChange}
    >
      <Form.Item
        initialValue={initValue?.surname ? initValue.surname : ''}
        rules={[{ required: true, message: 'Поле "Фамилия" не должно быть пустым' }]}
        label={<div className={addClass(classes, 'form-item')}>Фамилия</div>}
        name="surname"
      >
        <Input id="surname" />
      </Form.Item>
      <Form.Item
        initialValue={initValue?.name ? initValue.name : ''}
        rules={[{ required: true, message: 'Поле "Имя" не должно быть пустым' }]}
        label="Имя"
        // label={<div className={addClass(classes, 'form-item')}>Имя</div>}
        name="name"
      >
        <Input id="name" />
      </Form.Item>
      <Form.Item
        initialValue={initValue?.patronymic ? initValue.patronymic : ''}
        rules={[{ required: true, message: 'Поле "Отчество" не должно быть пустым' }]}
        label={<div className={addClass(classes, 'form-item')}>Отчество</div>}
        name="patronymic"
      >
        <Input id="patronymic" />
      </Form.Item>
      <Form.Item
        initialValue={initValue?.gender ? initValue.gender : ''}
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
        rules={[
          {
            required: true,
            message: 'Поле "Дата рождения" не должно быть пустым',
          },
        ]}
        label={<div className={addClass(classes, 'form-item')}>Дата рождения</div>}
        name="dateOfBirth"
        initialValue={initValue?.dateOfBirth ? dayjs(initValue.dateOfBirth) : undefined}
      >
        <DatePicker defaultValue={undefined} format="DD.MM.YYYY" id="dateOfBirth" />
      </Form.Item>
      <Form.Item
        rules={[{ required: true, message: 'Поле "Адрес" не должно быть пустым' }]}
        label={<div className={addClass(classes, 'form-item')}>Адрес</div>}
        name="address"
        initialValue={initValue?.address ? initValue.address : ''}
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
      <Row style={{ marginBottom: 12 }} justify="space-between">
        <Col>
          <Title style={{ margin: 0 }} level={4}>
            Номера телефонов
          </Title>
        </Col>
        <Col>
          <Button type="link" onClick={onAddPN}>
            Добавить номер
          </Button>
        </Col>
      </Row>
      {amountPN.map((item) => item)}
      {/* <Form.Item
        label={<div className={addClass(classes, 'form-item')}>Прdddимечание</div>}
        name="note"
        initialValue={initValue?.note ? initValue.note : ''}
      >
        <TextArea rows={4} id="note" />
      </Form.Item> */}
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

export default AddRepresentativeForm;

// const debounce = (callback: any, delay: number) => {
//   let timer: ReturnType<typeof setTimeout>;
//   return (...args: any[]) => {
//     clearTimeout(timer);
//     timer = setTimeout(() => callback(...args), delay);
//   };
// };
