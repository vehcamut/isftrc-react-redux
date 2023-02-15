/* eslint-disable @typescript-eslint/indent */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  Modal,
  Typography,
  Descriptions,
  message,
  Tooltip,
  Row,
  Col,
  DatePicker,
  Empty,
  Form,
  TimePicker,
  InputNumber,
  Select,
  Result,
  Input,
} from 'antd';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { EditOutlined, ExclamationCircleFilled, LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { DatePickerProps } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { addClass } from '../../app/common';
import classes from './ModalTextEnter.module.scss';
import { IAppointment, IPatient, IService, ISpecialist } from '../../models';
import { specialistAPI } from '../../app/services/specialists.service';
import { appointmentsAPI } from '../../app/services/appointments.service';
import './antd.rewrite.scss';
import Shedule from '../Shedule/Shedule';
import { servicesAPI } from '../../app/services';
import ModalAddAppToServ from '../ModalAddAppToServ/ModalAddAppToServ';

const { confirm } = Modal;
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
  const onReset = () => {
    setIsOpen(false);
  };
  console.log(initText);
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
          // label={label}
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
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginRight: '10px' }}
                className={addClass(classes, 'form-button')}
              >
                ОК
              </Button>
              <Button htmlType="button" onClick={() => setIsOpen(false)} className={addClass(classes, 'form-button')}>
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
