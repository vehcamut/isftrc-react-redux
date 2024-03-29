import React, { PropsWithChildren, FunctionComponent } from 'react';
import { Typography, Row, Col, Button, Tabs, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import './antd.rewrite.scss';
import { specialistAPI } from '../app/services/specialists.service';
import SpecialistInfo from '../components/SpecialistInfo/SpecialistInfo';
import SpecialistShedule from '../components/SpecialistShedule/SpecialistShedule';
import ErrorResult from '../components/ErrorResult/ErrorResult';

interface SpecialistPageProps extends PropsWithChildren {
  activeKey: 'info' | 'shedule';
}

const SpecialistPage: FunctionComponent<SpecialistPageProps> = ({ activeKey }) => {
  const navigate = useNavigate();
  const params = useParams();
  const {
    data: specialist,
    isLoading,
    isError,
  } = specialistAPI.useGetSpecialistByIdQuery(
    {
      id: params?.id || '',
    },
    { pollingInterval: 30000 },
  );
  if (isError) return <ErrorResult />;
  // if (isError) navigate('/specialists', { replace: true });

  const onBackClick = () => {
    navigate('/specialists', { replace: true });
  };

  const onChange = (key: string) => {
    navigate(`/specialists/${params?.id}/${key}`, { replace: true });
  };

  return (
    <Spin tip={<div style={{ marginTop: '10px', width: '100%' }}>Загрузка...</div>} size="large" spinning={isLoading}>
      <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Col>
          <Typography.Title level={3} style={{ margin: 0 }}>
            {!isLoading && specialist
              ? `Логин: ${specialist?.login}. ` +
                `${specialist?.surname} ${specialist?.name.slice(0, 1)}.` +
                `${specialist?.patronymic.slice(0, 1)}.` +
                ` ${new Date(specialist?.dateOfBirth || '').toLocaleString('ru', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                })} ` +
                `(${specialist?.isActive ? 'активен' : 'неактивен'})`
              : 'Представитель'}
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
            children: <SpecialistInfo specialist={specialist} />,
          },
          {
            label: 'Расписание',
            key: 'shedule',
            children: <SpecialistShedule specialist={specialist} />,
          },
        ]}
      />
    </Spin>
  );
};

export default SpecialistPage;
