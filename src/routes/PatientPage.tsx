import React, { FunctionComponent, PropsWithChildren } from 'react';
import { Typography, Row, Col, Button, Tabs, message, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import './antd.rewrite.scss';
import { patientsAPI } from '../app/services';
import PatinentDescription from '../components/PatinentInfo/PatinentInfo';
import PatientRepresentatives from '../components/PatientRepresentatives/PatientRepresentatives';

interface FormDialogProps extends PropsWithChildren {
  activeKey: 'info' | 'representatives';
}

const PatientPage: FunctionComponent<FormDialogProps> = ({ activeKey }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const params = useParams();
  const { data: patient, isLoading } = patientsAPI.useGetPatientByIdQuery({ id: params?.id || '' });

  const onBackClick = () => {
    navigate('/patients', { replace: true });
  };

  const onChange = (key: string) => {
    navigate(`./../${key}`, { replace: true });
  };

  return (
    <>
      {contextHolder}
      <Spin tip={<div style={{ marginTop: '10px', width: '100%' }}>Загрузка...</div>} size="large" spinning={isLoading}>
        <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '10px' }}>
          <Col>
            <Typography.Title level={2} style={{ margin: 0 }}>
              {!isLoading && patient
                ? `Пациент №${patient?.number}. ` +
                  `${patient?.surname} ${patient?.name.slice(0, 1)}.` +
                  `${patient?.patronymic.slice(0, 1)}.` +
                  ` ${new Date(patient?.dateOfBirth || '').toLocaleString('ru', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                  })} ` +
                  `(${patient?.isActive ? 'активен' : 'неактивен'})`
                : 'Пациент'}
            </Typography.Title>
          </Col>
          <Col>
            <Button type="link" onClick={onBackClick}>
              К списку
            </Button>
          </Col>
        </Row>
        <Tabs
          size="small"
          onChange={onChange}
          type="line"
          activeKey={activeKey}
          tabPosition="left"
          items={[
            {
              label: 'Данные',
              key: 'info',
              children: <PatinentDescription patient={patient} />,
            },
            {
              label: 'Представители',
              key: 'representatives',
              children: <PatientRepresentatives patient={patient} />,
            },
            { label: 'Курсы', key: 'shedules' },
            { label: 'Расписание', key: 'patients' },
            { label: 'Документы', key: 'documents' },
          ]}
        />
      </Spin>
    </>
  );
};

export default PatientPage;
