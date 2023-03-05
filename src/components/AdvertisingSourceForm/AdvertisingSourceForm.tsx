import { Button, Form, Input, Row, Col, Switch } from 'antd';
import React, { FunctionComponent, PropsWithChildren } from 'react';
import { addClass } from '../../app/common';
import classes from './AdvertisingSourceForm.module.scss';
import { IAdvertisingSource } from '../../models';

interface AdvertisingSourceFormProps extends PropsWithChildren {
  onFinish: (values: any) => void;
  onReset: () => void;
  initValue?: IAdvertisingSource;
}

const AdvertisingSourceForm: FunctionComponent<AdvertisingSourceFormProps> = ({ onFinish, onReset, initValue }) => {
  return (
    <Form labelWrap labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} onFinish={onFinish}>
      <Form.Item
        initialValue={initValue?.name ? initValue.name : ''}
        rules={[{ required: true, message: 'Поле "Название" не должно быть пустым' }]}
        label="Название"
        name="name"
      >
        <Input id="name" />
      </Form.Item>
      <Form.Item
        valuePropName="checked"
        initialValue={initValue?.isActive !== undefined ? initValue?.isActive : true}
        label="Статус"
        name="isActive"
      >
        <Switch id="isActive" />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 0, span: 24 }} style={{ marginBottom: 0 }}>
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

AdvertisingSourceForm.defaultProps = {
  initValue: undefined,
};

export default AdvertisingSourceForm;
