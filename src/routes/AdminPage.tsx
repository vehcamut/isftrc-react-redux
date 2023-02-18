import React, { PropsWithChildren, FunctionComponent } from 'react';
import { Typography, Row, Col, Button, Tabs, message, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import './antd.rewrite.scss';
// import { representativesAPI } from '../app/services';
// import RepresentativeInfo from '../components/RepresentativeInfo/RepresentativeInfo';
// import RepresentativePatients from '../components/RepresentativePatients/RepresentativePatients';
// import { specialistAPI } from '../app/services/specialists.service';
// import SpecialistInfo from '../components/SpecialistInfo/SpecialistInfo';
// import SpecialistShedule from '../components/SpecialistShedule/SpecialistShedule';
import { adminsAPI } from '../app/services/admins.service';
import AdminInfo from '../components/AdminInfo/AdminInfo';

interface SpecialistPageProps extends PropsWithChildren {
  activeKey: 'info';
}

const AdminPage: FunctionComponent<SpecialistPageProps> = ({ activeKey }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const params = useParams();
  const { data: admin, isLoading } = adminsAPI.useGetAdminByIdQuery(
    {
      id: params?.id || '',
    },
    { skip: params?.id === '' },
  );

  const onBackClick = () => {
    navigate('/admins', { replace: true });
  };

  const onChange = (key: string) => {
    navigate(`/admins/${params?.id}/${key}`, { replace: true });
  };

  return (
    <>
      {contextHolder}
      <Spin tip={<div style={{ marginTop: '10px', width: '100%' }}>Загрузка...</div>} size="large" spinning={isLoading}>
        <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '10px' }}>
          <Col>
            <Typography.Title level={3} style={{ margin: 0 }}>
              {!isLoading && admin
                ? `Логин: ${admin?.login}. ` +
                  `${admin?.surname} ${admin?.name.slice(0, 1)}.` +
                  `${admin?.patronymic.slice(0, 1)}.` +
                  ` ${new Date(admin?.dateOfBirth || '').toLocaleString('ru', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                  })} ` +
                  `(${admin?.isActive ? 'активен' : 'неактивен'})`
                : 'Администратор'}
            </Typography.Title>
          </Col>
          <Col>
            <Button type="link" onClick={onBackClick}>
              К списку
            </Button>
          </Col>
        </Row>
        <Tabs
          activeKey={activeKey}
          size="small"
          onChange={onChange}
          type="line"
          tabPosition="left"
          items={[
            {
              label: 'Данные',
              key: 'info',
              children: <AdminInfo admin={admin} />,
            },
          ]}
        />
      </Spin>
    </>
  );
};

export default AdminPage;
