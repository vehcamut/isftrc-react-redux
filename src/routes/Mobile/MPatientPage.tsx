/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FunctionComponent, PropsWithChildren } from 'react';
import { Typography, Row, Col, Button, Tabs, message, Spin, Radio, Dropdown, MenuProps } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import '../antd.rewrite.scss';
import { DownOutlined } from '@ant-design/icons';
import { patientsAPI } from '../../app/services';
import PatinentDescription from '../../components/PatinentInfo/PatinentInfo';
import PatientRepresentatives from '../../components/PatientRepresentatives/PatientRepresentatives';
import PatinentCourse from '../../components/PatinentCourse/PatinentCourse';
import PatientShedule from '../../components/PatientShedule/PatientShedule';
import MPatinentInfo from '../../components/PatinentInfo/MPatinentInfo';
import MPatientRepresentatives from '../../components/PatientRepresentatives/MPatientRepresentatives';
import MPatinentCourse from '../../components/PatinentCourse/MPatinentCourse';
import MPatientShedule from '../../components/PatientShedule/MPatientShedule';
import ErrorResult from '../../components/ErrorResult/ErrorResult';

interface MPatientPageProps extends PropsWithChildren {
  activeKey: 'info' | 'representatives' | 'course' | 'shedule';
}

const MPatientPage: FunctionComponent<MPatientPageProps> = ({ activeKey }) => {
  const navigate = useNavigate();
  const params = useParams();
  const { data: patient, isLoading, isError } = patientsAPI.useGetPatientByIdQuery({ id: params?.id || '' });

  const onChange: MenuProps['onClick'] = ({ key }) => {
    navigate(`/patients/${params?.id}/${key}`, { replace: true });
  };

  const items: MenuProps['items'] = [
    {
      key: 'info',
      label: 'Данные',
    },
    {
      key: 'representatives',
      label: 'Представители',
    },
    {
      key: 'course',
      label: 'Услуги',
    },
    {
      key: 'shedule',
      label: 'Расписание',
    },
  ];

  if (isError) return <ErrorResult />;
  // navigate('/patients', { replace: true });

  return (
    <Spin tip={<div style={{ marginTop: '10px', width: '100%' }}>Загрузка...</div>} size="large" spinning={isLoading}>
      <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Col style={{ textAlign: 'center', paddingBottom: '10px' }} span={24}>
          <Typography.Title level={2} style={{ margin: 0 }}>
            {!isLoading && patient
              ? `${patient?.number} ` +
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
        <Col style={{ textAlign: 'center' }} span={24}>
          <Dropdown
            menu={{
              items,
              selectable: true,
              defaultSelectedKeys: [activeKey],
              onClick: onChange,
            }}
          >
            <Button style={{ width: '100%' }}>Меню</Button>
          </Dropdown>
        </Col>
      </Row>
      {activeKey === 'info' ? <MPatinentInfo patient={patient} /> : null}
      {activeKey === 'representatives' ? <MPatientRepresentatives patient={patient} /> : null}
      {activeKey === 'course' ? <MPatinentCourse patient={patient} /> : null}
      {activeKey === 'shedule' ? <MPatientShedule patient={patient} /> : null}
    </Spin>
  );
};

export default MPatientPage;
