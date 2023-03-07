import React, { FunctionComponent, PropsWithChildren } from 'react';
import { Layout, ConfigProvider, theme } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import dayjs from 'dayjs';
import AppBar from '../../components/Header/Header';
import classes from '../style.module.scss';
import { addClass } from '../../app/common';
import 'dayjs/locale/ru';

const { Header, Content } = Layout;

dayjs.locale('ru');

interface MTemplateProps extends PropsWithChildren {
  activeKey: string;
}

const MTemplate: FunctionComponent<MTemplateProps> = ({ children, activeKey }) => {
  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        algorithm: [theme.defaultAlgorithm],
        token: {
          colorFillAlter: '#1677FF',
          colorPrimary: '#1677FF',
          colorBorder: '#9f9f9f',
          colorBgContainerDisabled: '#ffffd8',
          colorTextDisabled: '#727272',
        },
        components: {
          Table: {
            colorTextHeading: '#FFFFFF',
          },
          Input: {
            colorBorder: '#9f9f9f',
          },
        },
      }}
    >
      <Layout className={addClass(classes, 'page-layout')}>
        <Header className={addClass(classes, 'header')} style={{ paddingRight: '10px', paddingLeft: '10px' }}>
          <AppBar activeKey={activeKey} />
        </Header>
        <Content className={addClass(classes, 'content', 'mobile-content')}>{children}</Content>
      </Layout>
    </ConfigProvider>
  );
};

export default MTemplate;
