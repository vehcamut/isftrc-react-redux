// import { Box, Container } from '@mui/material';
import React, { FunctionComponent, PropsWithChildren /* useEffect, useState */ } from 'react';
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
  // defaultActiveKey: string;
  activeKey: string;
}

const Template: FunctionComponent<TemplateProps> = ({ children, activeKey /* defaultActiveKey */ }) => {
  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        algorithm: [theme.defaultAlgorithm],
        token: {
          colorFillAlter: '#1677FF', // '#25ab25', // '#a5cdff',
          colorPrimary: '#1677FF',
          colorBorder: '#9f9f9f',
          colorBgContainerDisabled: '#ffffff',
          colorTextDisabled: '#727272',
          // colorTextHeading: '#FFFFFF',
        },
        components: {
          Table: {
            colorTextHeading: '#FFFFFF',
          },
          Input: {
            colorBorder: '#9f9f9f',
          },
          // Input: {

          // }
          // Input: {
          //   colorText: '#FFFFFF',
          //   colorInfoText: '#FFFFFF',
          //   colorTextHeading: '#FFFFFF',
          //   colorTextBase: '#FFFFFF',
          //   colorTextDescription: '#FFFFFF',
          //   colorTextDisabled: '#FFFFFF',
          //   colorTextLabel: '#FFFFFF',
          //   colorTextLightSolid: '#FFFFFF',
          //   colorTextPlaceholder: '#FFFFFF',
          //   colorTextQuaternary: '#FFFFFF',
          //   colorTextSecondary: '#FFFFFF',
          //   colorTextTertiary: '#FFFFFF',
          //   colorPrimaryText: '#FFFFFF',
          // },
        },
      }}
    >
      <Layout className={addClass(classes, 'page-layout')}>
        <Header className={addClass(classes, 'header')}>
          <AppBar activeKey={activeKey} /* defaultActiveKey={defaultActiveKey} */ />
        </Header>
        <Content className={addClass(classes, 'content')}>{children}</Content>
      </Layout>
    </ConfigProvider>
    // <RolesAuthRoute roles={['admin', 'user']}>
  );
};

export default Template;
