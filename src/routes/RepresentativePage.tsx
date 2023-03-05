import React, { PropsWithChildren, FunctionComponent } from 'react';
import { Typography, Row, Col, Button, Tabs, message, Spin } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import './antd.rewrite.scss';
import { representativesAPI } from '../app/services';
import RepresentativeInfo from '../components/RepresentativeInfo/RepresentativeInfo';
import RepresentativePatients from '../components/RepresentativePatients/RepresentativePatients';

interface FormDialogProps extends PropsWithChildren {
  activeKey: 'info' | 'patients';
}

const RepresentativePage: FunctionComponent<FormDialogProps> = ({ activeKey }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const params = useParams();
  const {
    data: representative,
    isLoading,
    isError,
  } = representativesAPI.useGetRepresentativeByIdQuery({
    id: params?.id || '',
  });

  if (isError) navigate('/representatives', { replace: true });

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
            <Typography.Title level={3} style={{ margin: 0 }}>
              {!isLoading && representative
                ? `Логин: ${representative?.login}. ` +
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
          activeKey={activeKey}
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
            {
              label: 'Пациенты',
              key: 'patients',
              children: <RepresentativePatients representative={representative} />,
            },
          ]}
        />
      </Spin>
    </>
  );
};

export default RepresentativePage;
