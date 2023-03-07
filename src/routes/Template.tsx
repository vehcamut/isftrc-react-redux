import React, { FunctionComponent, PropsWithChildren } from 'react';
import { Layout, ConfigProvider, theme } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import dayjs from 'dayjs';
import AppBar from '../components/Header/Header';
import classes from './style.module.scss';
import { addClass } from '../app/common';
import 'dayjs/locale/ru';

const { Header, Content } = Layout;

dayjs.locale('ru');

interface TemplateProps extends PropsWithChildren {
  activeKey: string;
}

const Template: FunctionComponent<TemplateProps> = ({ children, activeKey }) => {
  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        algorithm: [theme.defaultAlgorithm],
        token: {
          fontSize: 14,
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
            fontSize: 14,
            colorBorder: '#9f9f9f',
          },
        },
      }}
    >
      <Layout className={addClass(classes, 'page-layout')}>
        <Header className={addClass(classes, 'header')}>
          <AppBar activeKey={activeKey} />
        </Header>
        <Content className={addClass(classes, 'content')}>{children}</Content>
      </Layout>
    </ConfigProvider>
  );
};

export default Template;
