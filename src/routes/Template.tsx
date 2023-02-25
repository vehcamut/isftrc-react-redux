// import { Box, Container } from '@mui/material';
import React, { FunctionComponent, PropsWithChildren /* useEffect, useState */ } from 'react';
import { Layout, ConfigProvider, theme } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import dayjs from 'dayjs';
import AppBar from '../components/Header/Header';
import classes from './style.module.scss';
import { addClass } from '../app/common';
import 'dayjs/locale/ru';
import { useAppSelector } from '../app/hooks';
// import { useAppSelector } from '../app/hooks';

const { Header, Content } = Layout;

dayjs.locale('ru');

interface TemplateProps extends PropsWithChildren {
  // defaultActiveKey: string;
  activeKey: string;
}

const Template: FunctionComponent<TemplateProps> = ({ children, activeKey /* defaultActiveKey */ }) => {
  const { isMobile } = useAppSelector((state) => state.authReducer);
  // const { isMobile } = localStorage;
  // console.log(localStorage);
  // console.log(isMobile);
  // const { setPage, setLimit, setFilter, setIsActive } = patientTableSlice.actions;
  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        algorithm: [theme.defaultAlgorithm],
        token: {
          colorFillAlter: '#1677FF', // '#25ab25', // '#a5cdff',
          colorPrimary: '#1677FF',
          colorBorder: '#9f9f9f',
          colorBgContainerDisabled: '#ffffd8',
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
          // Descriptions: {
          //   colorBorder: '#000000',
          //   size
          // },
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
        <Content
          className={addClass(classes, 'content')}
          style={
            isMobile ? { paddingLeft: '10px', paddingRight: '10px' } : { paddingLeft: '50px', paddingRight: '50px' }
          }
        >
          {children}
        </Content>
      </Layout>
    </ConfigProvider>
    // <RolesAuthRoute roles={['admin', 'user']}>
  );
};

export default Template;
