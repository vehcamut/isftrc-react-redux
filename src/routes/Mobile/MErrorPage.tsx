/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FunctionComponent, PropsWithChildren } from 'react';
import { Typography, Row, Col, Button, Tabs, message, Spin, Descriptions, Divider, Result } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import '../antd.rewrite.scss';
import { patientsAPI } from '../../app/services';
import PatinentDescription from '../../components/PatinentInfo/PatinentInfo';
import PatientRepresentatives from '../../components/PatientRepresentatives/PatientRepresentatives';
import PatinentCourse from '../../components/PatinentCourse/PatinentCourse';
import PatientShedule from '../../components/PatientShedule/PatientShedule';

const { Title } = Typography;

const MErrorPage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const params = useParams();

  return (
    <Result
      style={{ paddingTop: '160px' }}
      status="warning"
      title={<Typography.Title level={4}>Мобильная версия не доступна</Typography.Title>}
      // title="К сожалению, мобильная версия не доступна."
      subTitle="Используйте версию для ПК"
      // extra={
      //   <Button type="primary" key="console">
      //     Выйти
      //   </Button>
      // }
    />
  );
};

export default MErrorPage;
