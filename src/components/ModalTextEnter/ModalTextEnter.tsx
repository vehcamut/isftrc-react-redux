/* eslint-disable @typescript-eslint/indent */
import { Button, Modal, Typography, Row, Col, Form, Input } from 'antd';
import React, { FunctionComponent, PropsWithChildren } from 'react';

const { TextArea } = Input;

interface ModalTextEnterProps extends PropsWithChildren {
  isOpen: boolean;
  title: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onFinish: (text: string) => void;
  required?: boolean;
  initText?: string;
  placeholder?: string;
}

const ModalTextEnter: FunctionComponent<ModalTextEnterProps> = ({
  isOpen,
  initText,
  setIsOpen,
  required,
  title,
  onFinish,
  placeholder,
}) => {
  const onBeforeFinish = (values: any) => {
    onFinish(values.textEnter);
  };

  return (
    <Modal
      destroyOnClose
      open={isOpen}
      footer={null}
      title={
        <Typography.Title level={2} style={{ margin: 0, marginBottom: '20px' }}>
          {title}
        </Typography.Title>
      }
      width="650px"
      onCancel={() => setIsOpen(false)}
    >
      <Form labelWrap labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} onFinish={onBeforeFinish}>
        <Form.Item
          wrapperCol={{ offset: 0, span: 24 }}
          initialValue={initText || ''}
          rules={required ? [{ required: true, message: 'Поле не должно быть пустым' }] : undefined}
          name="textEnter"
        >
          <TextArea
            style={{ width: '100%' }}
            id="textEnter"
            rows={4}
            placeholder={placeholder}
            autoSize={{ minRows: 4, maxRows: 8 }}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 0, span: 24 }} style={{ marginBottom: 0 }}>
          <Row>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
                ОК
              </Button>
              <Button htmlType="button" onClick={() => setIsOpen(false)}>
                Отмена
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
};

ModalTextEnter.defaultProps = {
  initText: undefined,
  placeholder: undefined,
  required: false,
};

export default ModalTextEnter;
