// import { PageHeader } from 'antd';
import React, { FunctionComponent, PropsWithChildren } from 'react';
// import 'antd/dist/antd.css';
// eslint-disable-next-line @typescript-eslint/no-unused-vars, import/order
import classes from './Header.module.scss';
// import { Header } from 'antd/lib/layout/layout';
// import 'antd/dist/reset.css';
// import Button from 'antd/lib/button';
import Tabs from 'antd/lib/tabs';
// import TabPane from 'antd/lib/tabs/TabPane';
import Typography from 'antd/lib/typography';
import { useNavigate } from 'react-router-dom';
import { Button /* , Col, Row */ } from 'antd';
import logo from './logo.svg';
import { addClass } from '../../app/common';

const { Text } = Typography;

interface ConfirmDialogProps extends PropsWithChildren {
  // defaultActiveKey: string;
  activeKey: string;
}

const MyHeader: FunctionComponent<ConfirmDialogProps> = ({ /* defaultActiveKey, */ activeKey }) => {
  const navigate = useNavigate();
  return (
    // style={{ backgroundColor: '#ffffff', lineHeight: '0px' }}
    // <Header className={addClass(classes, 'header')}>
    //   {/* <AppBar defaultActiveKey="patients" /> */}
    // </Header>
    <>
      <div className={addClass(classes, 'header-top')}>
        <img alt="Реацентр Астрахань" src={logo} />
        <div className={addClass(classes, 'header-top__menu')}>
          <Button key="1" type="primary">
            Справка
          </Button>
          <Button key="2" type="primary">
            Выйти
          </Button>
          <Text key="0" strong>
            Иванов И.И.
          </Text>
        </div>
      </div>
      <Tabs
        onChange={(path) => {
          navigate(`/${path}`);
        }}
        activeKey={activeKey}
        // defaultActiveKey={defaultActiveKey}
        items={[
          { label: 'Личные данные', key: 'profile' },
          // { label: 'Расписание', key: 'shedules' },
          { label: 'Пациенты', key: 'patients' },
          { label: 'Представители', key: 'representatives' },
          { label: 'Специалисты', key: 'specialists' },
          { label: 'Справочники', key: 'handbooks' },
          // { label: 'Очтеты', key: 'reports' },
        ]}
        size="small"
        tabBarStyle={{ marginBottom: '0px' }}
      />
    </>
  );
};

export default MyHeader;
