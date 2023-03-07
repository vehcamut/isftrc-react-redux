import React, { PropsWithChildren, FunctionComponent } from 'react';
import { Typography, Row, Col, Button, Tabs, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import './antd.rewrite.scss';
import { adminsAPI } from '../app/services/admins.service';
import AdminInfo from '../components/AdminInfo/AdminInfo';

interface SpecialistPageProps extends PropsWithChildren {
  activeKey: 'info';
}

const AdminPage: FunctionComponent<SpecialistPageProps> = ({ activeKey }) => {
  const navigate = useNavigate();
  const params = useParams();
  const {
    data: admin,
    isLoading,
    isError,
  } = adminsAPI.useGetAdminByIdQuery(
    {
      id: params?.id || '',
    },
    { skip: params?.id === '', pollingInterval: 30000 },
  );

  if (isError) navigate('/admins', { replace: true });

  const onBackClick = () => {
    navigate('/admins', { replace: true });
  };

  const onChange = (key: string) => {
    navigate(`/admins/${params?.id}/${key}`, { replace: true });
  };

  return (
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
  );
};

export default AdminPage;
