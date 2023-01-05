/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AutoComplete,
  Button,
  Form,
  Input,
  Radio,
  Row,
  Spin,
  Col,
  DatePicker,
  Typography,
  Divider,
  Select,
} from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import debounce from 'lodash.debounce';
import dayjs from 'dayjs';
import MaskedInput from 'antd-mask-input';
import { DeleteOutlined } from '@ant-design/icons';
import { addClass } from '../../app/common';
import { dadataAPI, advertisingSourceAPI } from '../../app/services';
import classes from './AddRepresentativeForm.module.scss';
import { IPatient, IRepresentative } from '../../models';

const { TextArea } = Input;
const { Title, Paragraph, Text, Link } = Typography;
interface AddRepresentativeFormProps extends PropsWithChildren {
  onFinish: (values: any) => void;
  onReset: () => void;
  // eslint-disable-next-line react/require-default-props
  initValue?: IRepresentative;
}

function* infinite() {
  let index = 0;

  while (true) {
    yield (index += 1);
  }
}
const generator = infinite();
const onRemovePN = (e: any) => {
  console.log(e);
};
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
  const [amountPN, setaAountPN] = useState([{ phoneNumber: '+7 (___) ___-__-__', uid: 0 }]);
  const [emails, setEmails] = useState([{ email: '', uid: 0 }]);
  const { data: options, isLoading: addressIsLoading } = dadataAPI.useGetAddressQuery(query);

  const onFinish1 = (v: any) => {
    v.phoneNumbers = [];
    v.emails = [];
    Object.keys(v).forEach((val) => {
      if (val !== 'phoneNumbers' && val.indexOf('phoneNumber') !== -1) {
        const number = v[val]
          .slice(2)
          .replaceAll(' ', '')
          .replaceAll('(', '')
          .replaceAll(')', '')
          .replaceAll('_', '')
          .replaceAll('-', '');
        v.phoneNumbers.push(number);
        delete v[val];
      }
      if (val !== 'emails' && val.indexOf('email') !== -1) {
        v.emails.push(v[val]);
        delete v[val];
      }
    });
    console.log(v);
  };
  const onAddPN = () => {
    const newArray = amountPN.slice(0);
    newArray.push({ phoneNumber: '+7 (___) ___-__-__', uid: generator.next().value || 0 });
    // console.log(amountPN);
    setaAountPN(newArray);
  };
  const onAddEmail = () => {
    const newArray = emails.slice(0);
    newArray.push({ email: '', uid: generator.next().value || 0 });
    setEmails(newArray);
  };
  const onSearchAC: any = debounce((searchText) => {
    setQuery(searchText);
  }, 800);
  const { data, isLoading } = advertisingSourceAPI.useGetToSelectQuery({ isActive: true });
  // console.log(data);
  return (
    <Form
      labelWrap
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 21 }}
      colon={false}
      onFinish={onFinish1}
      // onInvalidCapture={onInvalid}
      // onFieldsChange={onPNChange}
    >
      <Form.Item
        initialValue={initValue?.surname ? initValue.surname : ''}
        rules={[{ required: true, message: 'Поле "Фамилия" не должно быть пустым' }]}
        label="Фамилия"
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
        label="Отчество"
        name="patronymic"
      >
        <Input id="patronymic" />
      </Form.Item>
      <Form.Item
        initialValue={initValue?.gender ? initValue.gender : ''}
        rules={[{ required: true, message: 'Поле "Пол" не должно быть пустым' }]}
        label="Пол"
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
        label="Дата рождения"
        name="dateOfBirth"
        initialValue={initValue?.dateOfBirth ? dayjs(initValue.dateOfBirth) : undefined}
      >
        <DatePicker defaultValue={undefined} format="DD.MM.YYYY" id="dateOfBirth" />
      </Form.Item>
      <Form.Item
        rules={[{ required: true, message: 'Поле "Адрес" не должно быть пустым' }]}
        label="Адрес"
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
      {/* <Form.Item
        initialValue={initValue?.login ? initValue.login : ''}
        rules={[{ required: true, message: 'Поле "Логин" не должно быть пустым' }]}
        label="Логин"
        name="login"
      >
        <Input id="login" />
      </Form.Item> */}
      <Form.Item
        rules={[{ required: true, message: 'Поле "Источники рекламы" не должно быть пустым' }]}
        label="Источники рекламы"
        name="advertisingSources"
        initialValue={initValue?.advertisingSources ? initValue.advertisingSources : undefined}
      >
        <Select
          id="advertisingSources"
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          // placeholder="Please select"
          // ini={null}
          options={data}
          // onChange={handleChange}
          // options={options}
        />
      </Form.Item>

      <Divider />
      <Row style={{ marginBottom: 12 }} justify="space-between">
        <Col>
          <Title style={{ margin: 0 }} level={5}>
            Номера телефонов
          </Title>
        </Col>
        <Col>
          <Button type="link" onClick={onAddPN}>
            Добавить
          </Button>
        </Col>
      </Row>
      {amountPN.map((PNitem, index) => {
        // console.log(PNitem.uid);
        return (
          <Form.Item key={PNitem.uid} label="Номер" required>
            <Input.Group compact>
              <Form.Item
                noStyle
                initialValue={PNitem.phoneNumber}
                rules={[
                  {
                    required: true,
                    message: 'Поле "Номер" не должно быть пустым',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value: string) {
                      // console.log(value);
                      const phoneNumber = value
                        .slice(2)
                        .replaceAll(' ', '')
                        .replaceAll('(', '')
                        .replaceAll(')', '')
                        .replaceAll('_', '')
                        .replaceAll('-', '');
                      // console.log(phoneNumber);
                      if (phoneNumber.length !== 10) return Promise.reject(new Error('Введите номер'));
                      return Promise.resolve();
                    },
                  }),
                ]}
                // name="phoneNumbers"
                name={`phoneNumber${PNitem.uid}`}
              >
                <MaskedInput
                  // onChange={(e: any) => {
                  //   console.log(e);
                  // }}
                  style={{ width: 'calc(100% - 100px)', borderColor: '#9f9f9f' }}
                  id={`phoneNumber${PNitem.uid}`}
                  mask={
                    //  https://imask.js.org/guide.html#masked-pattern
                    '+7 (000) 000-00-00'
                  }
                />
              </Form.Item>
              <Form.Item noStyle>
                <Button
                  style={{ color: 'red' }}
                  icon={<DeleteOutlined />}
                  onClick={(e: any) => {
                    const newArray = amountPN.slice(0);
                    newArray.splice(index, 1);
                    // delete newArray[PNitem.index];
                    //  ({ phoneNumber: '', index: amountPN.length });
                    // console.log(amountPN);
                    setaAountPN(newArray);
                  }}
                  disabled={amountPN.length === 1}
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          // </Form.Item>
        );
      })}
      <Divider />
      <Row style={{ marginBottom: 12 }} justify="space-between">
        <Col>
          <Title style={{ margin: 0 }} level={5}>
            Адреса электронных почт
          </Title>
        </Col>
        <Col>
          <Button type="link" onClick={onAddEmail}>
            Добавить
          </Button>
        </Col>
      </Row>
      {emails.map((item, index) => {
        // console.log(item.uid);
        return (
          <Form.Item key={item.uid} label="Email" required>
            <Input.Group compact>
              <Form.Item
                noStyle
                initialValue={item.email}
                rules={[
                  {
                    required: true,
                    message: 'Поле "Email" не должно быть пустым',
                  },
                  {
                    type: 'email',
                    message: 'Адрес почты имеет неверный формат',
                  },
                ]}
                name={`email${item.uid}`}
              >
                <Input
                  // onChange={(e: any) => {
                  //   console.log(e);
                  // }}
                  style={{ width: 'calc(100% - 100px)' }}
                  id={`email${item.uid}`}
                  // mask={
                  //   //  https://imask.js.org/guide.html#masked-pattern
                  //   '+7 (000) 000-00-00'
                  // }
                />
              </Form.Item>
              <Form.Item noStyle>
                <Button
                  style={{ color: 'red' }}
                  icon={<DeleteOutlined />}
                  onClick={(e: any) => {
                    const newArray = emails.slice(0);
                    newArray.splice(index, 1);
                    // delete newArray[PNitem.index];
                    //  ({ phoneNumber: '', index: amountPN.length });
                    // console.log(amountPN);
                    setEmails(newArray);
                  }}
                  disabled={emails.length === 1}
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          // </Form.Item>
        );
      })}
      <Divider />
      <Row style={{ marginBottom: 12 }} justify="space-between">
        <Col>
          <Title style={{ margin: 0 }} level={5}>
            Данные для входа
          </Title>
        </Col>
      </Row>
      <Form.Item
        initialValue={initValue?.login ? initValue.login : ''}
        rules={[{ required: true, message: 'Поле "Логин" не должно быть пустым' }]}
        label="Логин"
        name="login"
      >
        <Input id="login" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Пароль"
        rules={[
          {
            required: true,
            message: 'Введите пароль!',
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Подтверждение пароля"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Подтвердите пароль!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Пароли не совпадают!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

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
