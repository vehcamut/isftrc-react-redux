import React from 'react';
import { Typography, Row, Col, Button, List } from 'antd';
import { useNavigate } from 'react-router-dom';
import './antd.rewrite.scss';

const HandbooksPage = () => {
  const navigate = useNavigate();

  const data = [
    {
      title: 'Источники рекламы',
      name: 'advertisingSource',
      onClick: () => navigate('./advertisingSource'),
    },
    {
      title: 'Специальности',
      name: 'advertisingSource',
      onClick: () => navigate('./specialistType'),
    },
    {
      title: 'Типы услуги',
      name: 'advertisingSource',
      onClick: () => navigate('./services'),
    },
  ];

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Col>
          <Typography.Title level={1} style={{ margin: 0 }}>
            Справочники
          </Typography.Title>
        </Col>
      </Row>
      <List
        size="small"
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item) => (
          <List.Item style={{ padding: 0, paddingBottom: 10, margin: 0 }}>
            <List.Item.Meta
              title={
                <Button id={item.name} type="link" name={item.name} onClick={item.onClick}>
                  {item.title.toLocaleUpperCase()}
                </Button>
              }
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default HandbooksPage;
