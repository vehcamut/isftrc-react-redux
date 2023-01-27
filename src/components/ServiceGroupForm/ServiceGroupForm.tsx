import { Button, Form, Input, Row, Col, Switch } from 'antd';
import React, { FunctionComponent, PropsWithChildren } from 'react';
import { addClass } from '../../app/common';
import classes from './ServiceGroupForm.module.scss';
import { IServiceGroupWithId } from '../../models';

interface ServiceGroupFormProps extends PropsWithChildren {
  onFinish: (values: any) => void;
  onReset: () => void;
  initValue?: IServiceGroupWithId;
}

const ServiceGroupForm: FunctionComponent<ServiceGroupFormProps> = ({ onFinish, onReset, initValue }) => {
  return (
    <Form labelWrap labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} colon={false} onFinish={onFinish}>
      <Form.Item
        initialValue={initValue?.name ? initValue.name : ''}
        rules={[{ required: true, message: 'Поле "Название" не должно быть пустым' }]}
        label={<div className={addClass(classes, 'form-item')}>Название</div>}
        name="name"
      >
        <Input id="name" />
      </Form.Item>
      <Form.Item
        valuePropName="checked"
        initialValue={initValue?.isActive !== undefined ? initValue?.isActive : true}
        label={<div className={addClass(classes, 'form-item')}>Статус</div>}
        name="isActive"
      >
        <Switch id="isActive" />
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

ServiceGroupForm.defaultProps = {
  initValue: undefined,
};

export default ServiceGroupForm;
