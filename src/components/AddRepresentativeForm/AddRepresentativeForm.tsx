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
import classes from './AddRepresentativeForm.module.scss';
import { IRepresentative } from '../../models';

const { TextArea } = Input;
const { Title, Paragraph, Text, Link } = Typography;
interface AddRepresentativeFormProps extends PropsWithChildren {
  onFinish: (values: any) => void;
  onReset: () => void;
  type: 'add' | 'update' | 'reg';
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

const AddRepresentativeForm: FunctionComponent<AddRepresentativeFormProps> = ({
  onFinish,
  onReset,
  initValue,
  type,
}) => {
  const [query, setQuery] = useState('');
  const [isAutoGenAuthData, setIsAutoGenAuthData] = useState(false);
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
  // [{ email: '', uid: 0 }]
  const [emails, setEmails] = useState(
    initValue?.emails
      ? () =>
          initValue?.emails.map((v) => {
            return { email: v, uid: generator.next().value || 0 };
          })
      : [{ email: '', uid: 0 }],
  );
  const { data: options, isLoading: addressIsLoading } = dadataAPI.useGetAddressQuery(query);

  // const [form] = Form.useForm();
  // const onGenLogin = () => {
  //   const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  //   const converter = {
  //     ??: 'a',
  //     ??: 'b',
  //     ??: 'v',
  //     ??: 'g',
  //     ??: 'd',
  //     ??: 'e',
  //     ??: 'e',
  //     ??: 'zh',
  //     ??: 'z',
  //     ??: 'i',
  //     ??: 'y',
  //     ??: 'k',
  //     ??: 'l',
  //     ??: 'm',
  //     ??: 'n',
  //     ??: 'o',
  //     ??: 'p',
  //     ??: 'r',
  //     ??: 's',
  //     ??: 't',
  //     ??: 'u',
  //     ??: 'f',
  //     ??: 'h',
  //     ??: 'c',
  //     ??: 'ch',
  //     ??: 'sh',
  //     ??: 'sch',
  //     ??: '',
  //     ??: 'y',
  //     ??: '',
  //     ??: 'e',
  //     ??: 'yu',
  //     ??: 'ya',

  //     ??: 'A',
  //     ??: 'B',
  //     ??: 'V',
  //     ??: 'G',
  //     ??: 'D',
  //     ??: 'E',
  //     ??: 'E',
  //     ??: 'Zh',
  //     ??: 'Z',
  //     ??: 'I',
  //     ??: 'Y',
  //     ??: 'K',
  //     ??: 'L',
  //     ??: 'M',
  //     ??: 'N',
  //     ??: 'O',
  //     ??: 'P',
  //     ??: 'R',
  //     ??: 'S',
  //     ??: 'T',
  //     ??: 'U',
  //     ??: 'F',
  //     ??: 'H',
  //     ??: 'C',
  //     ??: 'Ch',
  //     ??: 'Sh',
  //     ??: 'Sch',
  //     ??: '',
  //     ??: 'Y',
  //     ??: '',
  //     ??: 'E',
  //     ??: 'Yu',
  //     ??: 'Ya',
  //   };
  //   let login = '';

  //   const surname = form.getFieldValue('surname');
  //   if (surname.length > 1) {
  //     login = login + converter[surname[0]] + converter[surname[1]];
  //   } else {
  //     const randomNumber = Math.floor(Math.random() * chars.length);
  //     login += chars.substring(randomNumber, randomNumber + 1);
  //   }
  //   console.log(form.getFieldValue('surname'));
  // };

  const onFinish1 = (v: any) => {
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
    console.log(v);
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
  const { data, isLoading } = advertisingSourceAPI.useGetAdvSourcesToSelectQuery({ isActive: true });

  return (
    <Form labelWrap labelCol={{ span: 4 }} wrapperCol={{ span: 21 }} colon={false} onFinish={onFinish1}>
      <Form.Item
        initialValue={initValue?.surname ? initValue.surname : ''}
        rules={[{ required: true, message: '???????? "??????????????" ???? ???????????? ???????? ????????????' }]}
        label="??????????????"
        name="surname"
      >
        <Input id="surname" />
      </Form.Item>
      <Form.Item
        initialValue={initValue?.name ? initValue.name : ''}
        rules={[{ required: true, message: '???????? "??????" ???? ???????????? ???????? ????????????' }]}
        label="??????"
        // label={<div className={addClass(classes, 'form-item')}>??????</div>}
        name="name"
      >
        <Input id="name" />
      </Form.Item>
      <Form.Item
        initialValue={initValue?.patronymic ? initValue.patronymic : ''}
        rules={[{ required: true, message: '???????? "????????????????" ???? ???????????? ???????? ????????????' }]}
        label="????????????????"
        name="patronymic"
      >
        <Input id="patronymic" />
      </Form.Item>
      <Form.Item
        initialValue={initValue?.gender ? initValue.gender : ''}
        rules={[{ required: true, message: '???????? "??????" ???? ???????????? ???????? ????????????' }]}
        label="??????"
        name="gender"
      >
        <Radio.Group name="radiogroup" id="gender">
          <Radio value="??????????????">??????????????</Radio>
          <Radio value="??????????????">??????????????</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        rules={[
          {
            required: true,
            message: '???????? "???????? ????????????????" ???? ???????????? ???????? ????????????',
          },
        ]}
        label="???????? ????????????????"
        name="dateOfBirth"
        initialValue={initValue?.dateOfBirth ? dayjs(initValue.dateOfBirth) : undefined}
      >
        <DatePicker defaultValue={undefined} format="DD.MM.YYYY" id="dateOfBirth" />
      </Form.Item>
      <Form.Item
        rules={[{ required: true, message: '???????? "??????????" ???? ???????????? ???????? ????????????' }]}
        label="??????????"
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
        rules={[{ required: true, message: '???????? "?????????????????? ??????????????" ???? ???????????? ???????? ????????????' }]}
        label="?????????????????? ??????????????"
        name="advertisingSources"
        initialValue={
          initValue?.advertisingSources
            ? initValue.advertisingSources.map((v) => {
                // return { label: v.name, value: v._id };
                return v._id;
              })
            : undefined
        }
      >
        <Select id="advertisingSources" mode="multiple" allowClear style={{ width: '100%' }} options={data} />
      </Form.Item>

      <Divider />
      <Row style={{ marginBottom: 12 }} justify="space-between">
        <Col>
          <Title style={{ margin: 0 }} level={5}>
            ???????????? ??????????????????
          </Title>
        </Col>
        <Col>
          <Button type="link" onClick={onAddPN}>
            ????????????????
          </Button>
        </Col>
      </Row>
      {phoneNumbers.map((PNitem, index) => {
        return (
          <Form.Item key={PNitem.uid} label="??????????" required>
            <Input.Group compact>
              <Form.Item
                noStyle
                initialValue={PNitem.phoneNumber}
                rules={[
                  {
                    required: true,
                    message: '???????? "??????????" ???? ???????????? ???????? ????????????',
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
                      if (phoneNumber.length !== 10) return Promise.reject(new Error('?????????????? ??????????'));
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
            ???????????? ?????????????????????? ????????
          </Title>
        </Col>
        <Col>
          <Button type="link" onClick={onAddEmail}>
            ????????????????
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
                    message: '???????? "Email" ???? ???????????? ???????? ????????????',
                  },
                  {
                    type: 'email',
                    message: '?????????? ?????????? ?????????? ???????????????? ????????????',
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
            ???????????? ?????? ??????????
          </Title>
        </Col>
        {/* <Col>
          <Button type="link" /* onClick={onGenLogin}/>???????????????? ???????????????????????????? ??????????????????</Button>
        </Col> */}
      </Row>
      <Form.Item
        initialValue={initValue?.login ? initValue.login : ''}
        rules={[{ required: true, message: '???????? "??????????" ???? ???????????? ???????? ????????????' }]}
        label="??????????"
        name="login"
      >
        <Input id="login" />
      </Form.Item>
      <Form.Item
        name="password"
        label="????????????"
        rules={[
          // {
          //   required: true,
          //   message: '?????????????? ????????????!',
          // },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('confirm') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('???????????? ???? ??????????????????!'));
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
        label="?????????????????????????? ????????????"
        dependencies={['password']}
        hasFeedback
        rules={[
          // {
          //   required: true,
          //   message: '?????????????????????? ????????????!',
          // },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('???????????? ???? ??????????????????!'));
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
              ??????????????????
            </Button>
            <Button htmlType="button" onClick={onReset} className={addClass(classes, 'form-button')}>
              ????????????????
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
