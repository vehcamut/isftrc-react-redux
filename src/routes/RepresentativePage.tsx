import React from 'react';
import { Typography, Row, Col, Button, Tabs, message, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import './antd.rewrite.scss';
import { representativesAPI } from '../app/services';
import RepresentativeInfo from '../components/RepresentativeInfo/RepresentativeInfo';

const RepresentativePage = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const params = useParams();
  const { data: representative, isLoading } = representativesAPI.useGetByIdQuery({ id: params?.id || '' });

  const onBackClick = () => {
    navigate('/representatives', { replace: true });
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
              {!isLoading && representative
                ? `Логин представителя: ${representative?.login}. ` +
                  `${representative?.surname} ${representative?.name.slice(0, 1)}.` +
                  `${representative?.patronymic.slice(0, 1)}.` +
                  ` ${new Date(representative?.dateOfBirth || '').toLocaleString('ru', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                  })} ` +
                  `(${representative?.isActive ? 'активен' : 'неактивен'})`
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
          size="small"
          onChange={onChange}
          type="line"
          tabPosition="left"
          items={[
            {
              label: 'Данные',
              key: 'info',
              children: <RepresentativeInfo representative={representative} />,
            },
            { label: 'Курсы', key: 'shedules' },
            { label: 'Расписание', key: 'patients' },
            { label: 'Документы', key: 'representatives' },
          ]}
        />
      </Spin>
    </>
  );
};

export default RepresentativePage;
