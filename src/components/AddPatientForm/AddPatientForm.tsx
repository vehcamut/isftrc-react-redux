import { AutoComplete, Button, Form, Input, Radio, Row, Spin, Col, DatePicker } from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import debounce from 'lodash.debounce';
import dayjs from 'dayjs';
import { addClass } from '../../app/common';
import { dadataAPI } from '../../app/services';
import classes from './AddPatientForm.module.scss';
import { IPatient } from '../../models';
import { useAppSelector } from '../../app/hooks';

const { TextArea } = Input;
interface FormDialogProps extends PropsWithChildren {
  onFinish: (values: any) => void;
  onReset: () => void;
  initValue?: IPatient;
}

const AddPatientForm: FunctionComponent<FormDialogProps> = ({ onFinish, onReset, initValue }) => {
  const { roles, isMobile } = useAppSelector((state) => state.authReducer);
  const isRepres = roles.find((r) => r === 'representative');
  const [query, setQuery] = useState('');
  const { data: options, isLoading: addressIsLoading } = dadataAPI.useGetAddressQuery(query);

  const onSearchAC: any = debounce((searchText) => {
    setQuery(searchText);
  }, 800);

  return (
    <Form
      labelWrap
      labelCol={{ span: isMobile ? 24 : 3 }}
      wrapperCol={{ span: isMobile ? 24 : 21 }}
      onFinish={onFinish}
      layout={isMobile ? 'vertical' : undefined}
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
        <DatePicker defaultValue={undefined} format="DD.MM.YYYY" id="dateOfBirth" inputReadOnly={isMobile} />
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
      {!isRepres ? (
        <Form.Item label="Примечание" name="note" initialValue={initValue?.note ? initValue.note : ''}>
          <TextArea rows={4} id="note" autoSize={{ minRows: 4, maxRows: 8 }} />
        </Form.Item>
      ) : null}

      <Form.Item wrapperCol={{ offset: 0, span: isMobile ? 24 : 24 }} style={{ marginBottom: 0 }}>
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
              Назад
            </Button>
          </Col>
        </Row>
      </Form.Item>
    </Form>
  );
};

AddPatientForm.defaultProps = {
  initValue: undefined,
};

export default AddPatientForm;
