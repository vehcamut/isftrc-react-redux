/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FunctionComponent, PropsWithChildren } from 'react';
import { Typography, Row, Col, Button, Tabs, message, Spin, Descriptions, Divider } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import './antd.rewrite.scss';
import { patientsAPI } from '../app/services';
import PatinentDescription from '../components/PatinentInfo/PatinentInfo';
import PatientRepresentatives from '../components/PatientRepresentatives/PatientRepresentatives';
import PatinentCourse from '../components/PatinentCourse/PatinentCourse';
import PatientShedule from '../components/PatientShedule/PatientShedule';

interface AboutPageProps extends PropsWithChildren {
  // eslint-disable-next-line react/require-default-props
  activeKey?: 'info' | 'representatives' | 'course' | 'shedule';
}

const { Title } = Typography;

const AboutPage: FunctionComponent<AboutPageProps> = ({ activeKey }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const params = useParams();
  const { data: patient, isLoading } = patientsAPI.useGetPatientByIdQuery({ id: params?.id || '' });

  const onBackClick = () => {
    navigate('/patients', { replace: true });
  };

  const onChange = (key: string) => {
    navigate(`/patients/${params?.id}/${key}`, { replace: true });
    // navigate(`./../${key}`, { replace: true });
  };

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Col>
          <Typography.Title level={1} style={{ margin: 0 }}>
            Данные о компании
          </Typography.Title>
        </Col>
        {/* <Col>
          <Button type="link">Редактировать</Button>
        </Col> */}
      </Row>
      <Divider />
      <Title level={3}>Режим работы</Title>
      <Typography>Понедельник-Пятница с 08:00 - 18:00</Typography>
      <Typography>Выходные: суббота, воскресенье</Typography>
      <Divider />
      <Title level={3}>Адрес</Title>
      <Typography>г. Астрахань, ул. Адмирала Нахимова д. 70Г, литер А</Typography>
      <Divider />
      {/* <Descriptions column={3}>
        <Descriptions.Item label="Режим работы" span={3}>
          <p>Понедельник-Пятница с 08:00 - 18:00</p>
          <p>Выходные: суббота, воскресенье</p>
        </Descriptions.Item>
        <Descriptions.Item label="Адрес" span={3}>
          <p>г. Астрахань, ул. Адмирала Нахимова д. 70Г, литер А.</p>
        </Descriptions.Item>
      </Descriptions> */}
      {/* <p>Режим работы:</p>
       и телефоны:
:
Понедельник-Пятница с 08:00 - 18:00
Выходные: суббота, воскресенье

Адрес: г. Астрахань, ул. Адмирала Нахимова
д. 70Г, литер А. */}
      {/* {contextHolder} */}
      {/* <Spin tip={<div style={{ marginTop: '10px', width: '100%' }}>Загрузка...</div>} size="large" spinning={isLoading}>
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
            { label: 'Курсы', key: 'course', children: <PatinentCourse patient={patient} /> },
            { label: 'Расписание', key: 'shedule', children: <PatientShedule patient={patient} /> },
            // { label: 'Документы', key: 'documents' },
          ]}
        />
      </Spin> */}
    </>
  );
};

export default AboutPage;