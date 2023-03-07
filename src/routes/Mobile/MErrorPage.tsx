import React from 'react';
import { Typography, Result } from 'antd';
import '../antd.rewrite.scss';

const MErrorPage = () => {
  return (
    <Result
      style={{ paddingTop: '160px' }}
      status="warning"
      title={<Typography.Title level={4}>Мобильная версия не доступна</Typography.Title>}
      subTitle="Используйте версию для ПК"
    />
  );
};

export default MErrorPage;
