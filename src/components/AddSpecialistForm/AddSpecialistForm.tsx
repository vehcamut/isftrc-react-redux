/* eslint-disable @typescript-eslint/indent */
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
import classes from './AddSpecialistForm.module.scss';
import { ISpecialist } from '../../models';
import { specialistTypesAPI } from '../../app/services/specialistTypes.service';

const { TextArea } = Input;
const { Title, Paragraph, Text, Link } = Typography;
interface AddSpecialistFormProps extends PropsWithChildren {
  onFinish: (values: any) => void;
  onReset: () => void;
  type: 'add' | 'update' | 'reg';
  // eslint-disable-next-line react/require-default-props
  initValue?: ISpecialist;
}

function* infinite() {
  let index = 0;
  while (true) {
    yield (index += 1);
  }
}
const generator = infinite();

const AddSpecialistForm: FunctionComponent<AddSpecialistFormProps> = ({ onFinish, onReset, initValue, type }) => {
  const [query, setQuery] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState(
    initValue?.phoneNumbers
      ? () =>
          initValue?.phoneNumbers.map((c) => {
            return {
              phoneNumber: `+7 (${c.slice(0, 3)}) ${c.slice(3, 6)}-${c.slice(6, 8)}-${c.slice(8)}`,
              uid: generator.next().value || 0,
            };
          })
      : [{ phoneNumber: '+7 (___) ___-__-__', uid: 0 }],
  );
  const [emails, setEmails] = useState(
    initValue?.emails
      ? () =>
          initValue?.emails.map((v) => {
            return { email: v, uid: generator.next().value || 0 };
          })
      : [{ email: '', uid: 0 }],
  );
  const { data: options, isLoading: addressIsLoading } = dadataAPI.useGetAddressQuery(query);

  const onBeforeFinish = (v: any) => {
    v.phoneNumbers = [];
    v.emails = [];
    if (v.password !== '') v.hash = v.password;
    delete v.password;
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
    onFinish(v);
  };
  const onAddPN = () => {
    const newArray = phoneNumbers.slice(0);
    newArray.push({ phoneNumber: '+7 (___) ___-__-__', uid: generator.next().value || 0 });
    setPhoneNumbers(newArray);
  };
  const onAddEmail = () => {
    const newArray = emails.slice(0);
    newArray.push({ email: '', uid: generator.next().value || 0 });
    setEmails(newArray);
  };
  const onSearchAC: any = debounce((searchText) => {
    setQuery(searchText);
  }, 800);
  const { data, isLoading } = specialistTypesAPI.useGetSpecialistTypesToSelectQuery({ isActive: true });

  return (
    <Form labelWrap labelCol={{ span: 4 }} wrapperCol={{ span: 21 }} colon={false} onFinish={onBeforeFinish}>
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
      <Form.Item
        rules={[{ required: true, message: 'Поле "Специальности" не должно быть пустым' }]}
        label="Специальности"
        name="types"
        initialValue={
          initValue?.types
            ? initValue.types.map((v) => {
                // return { label: v.name, value: v._id };
                return v._id;
              })
            : undefined
        }
      >
        <Select id="types" mode="multiple" allowClear style={{ width: '100%' }} options={data} />
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
      {phoneNumbers.map((PNitem, index) => {
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
                      const phoneNumber = value
                        .slice(2)
                        .replaceAll(' ', '')
                        .replaceAll('(', '')
                        .replaceAll(')', '')
                        .replaceAll('_', '')
                        .replaceAll('-', '');
                      if (phoneNumber.length !== 10) return Promise.reject(new Error('Введите номер'));
                      return Promise.resolve();
                    },
                  }),
                ]}
                name={`phoneNumber${PNitem.uid}`}
              >
                <MaskedInput
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
                    const newArray = phoneNumbers.slice(0);
                    newArray.splice(index, 1);
                    setPhoneNumbers(newArray);
                  }}
                  disabled={phoneNumbers.length === 1}
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
                <Input style={{ width: 'calc(100% - 100px)' }} id={`email${item.uid}`} />
              </Form.Item>
              <Form.Item noStyle>
                <Button
                  style={{ color: 'red' }}
                  icon={<DeleteOutlined />}
                  onClick={(e: any) => {
                    const newArray = emails.slice(0);
                    newArray.splice(index, 1);
                    setEmails(newArray);
                  }}
                  disabled={emails.length === 1}
                />
              </Form.Item>
            </Input.Group>
          </Form.Item>
        );
      })}
      <Divider />
      <Row style={{ marginBottom: 12 }} justify="space-between">
        <Col>
          <Title style={{ margin: 0 }} level={5}>
            Данные для входа
          </Title>
        </Col>
        {/* <Col>
          <Button type="link" /* onClick={onGenLogin}/>Включить автоматическую генерацию</Button>
        </Col> */}
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
          // {
          //   required: true,
          //   message: 'Введите пароль!',
          // },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('confirm') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Пароли не совпадают!'));
            },
          }),
        ]}
        hasFeedback
        dependencies={['confirm']}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="confirm"
        label="Подтверждение пароля"
        dependencies={['password']}
        hasFeedback
        rules={[
          // {
          //   required: true,
          //   message: 'Подтвердите пароль!',
          // },
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

export default AddSpecialistForm;

// const debounce = (callback: any, delay: number) => {
//   let timer: ReturnType<typeof setTimeout>;
//   return (...args: any[]) => {
//     clearTimeout(timer);
//     timer = setTimeout(() => callback(...args), delay);
//   };
// };
