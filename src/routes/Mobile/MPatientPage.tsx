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

interface MPatientPageProps extends PropsWithChildren {
  activeKey: 'info' | 'representatives' | 'course' | 'shedule';
}

const MPatientPage: FunctionComponent<MPatientPageProps> = ({ activeKey }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const params = useParams();
  const { data: patient, isLoading } = patientsAPI.useGetPatientByIdQuery({ id: params?.id || '' });

  const onBackClick = () => {
    navigate('/patients', { replace: true });
  };

  const onChange: MenuProps['onClick'] = ({ key }) => {
    navigate(`/patients/${params?.id}/${key}`, { replace: true });
    // navigate(`./../${key}`, { replace: true });
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
      label: 'Курсы',
    },
    {
      key: 'shedule',
      label: 'Расписание',
    },
  ];

  return (
    <>
      {contextHolder}
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
            {/* <Dropdown
              menu={{
                items,
                selectable: true,
                defaultSelectedKeys: [activeKey],
              }}
            >
              <Typography.Link>
                Меню
                <DownOutlined />
              </Typography.Link>
            </Dropdown> */}
            {/* <Button type="primary" onClick={onBackClick}>
              К списку
            </Button> */}
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
              {/* <Typography.Link>
                Меню
                <DownOutlined />
              </Typography.Link> */}
            </Dropdown>
            {/* <Button type="link" onClick={onBackClick}>
              К списку
            </Button> */}
          </Col>
        </Row>
        {activeKey === 'info' ? <MPatinentInfo patient={patient} /> : null}
        {activeKey === 'representatives' ? <PatientRepresentatives patient={patient} /> : null}
        {/* <Radio.Group>
          <Radio.Button value="top">Данные</Radio.Button>
          <Radio.Button value="bottom">Представители</Radio.Button>
          <Radio.Button value="left">Курсы</Radio.Button>
          <Radio.Button value="right">Расписание</Radio.Button>
        </Radio.Group>
        <Tabs
          size="small"
          onChange={onChange}
          type="card"
          activeKey={activeKey}
          tabPosition="top"
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
            { label: 'Курсы', key: 'course', children: <PatinentCourse patient={patient} /> },
            { label: 'Расписание', key: 'shedule', children: <PatientShedule patient={patient} /> },
            // { label: 'Документы', key: 'documents' },
          ]}
        /> */}
      </Spin>
    </>
  );
};

export default MPatientPage;
