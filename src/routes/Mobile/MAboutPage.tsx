import React from 'react';
import { Typography, Row, Col, Divider } from 'antd';
import '../antd.rewrite.scss';

const { Title } = Typography;

const MAboutPage = () => {
  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Col>
          <Typography.Title level={2} style={{ margin: 0 }}>
            Данные о компании
          </Typography.Title>
        </Col>
      </Row>
      <Divider />
      <Title level={3}>Режим работы</Title>
      <Typography>Понедельник-Пятница с 08:00 - 18:00</Typography>
      <Typography>Выходные: суббота, воскресенье</Typography>
      <Divider />
      <Title level={3}>Адрес</Title>
      <Typography>г. Астрахань, ул. Адмирала Нахимова д. 70Г, литер А</Typography>
      <Divider />
    </>
  );
};

export default MAboutPage;
