import { PageHeader } from 'antd';
import React, { FunctionComponent, PropsWithChildren } from 'react';
// import 'antd/dist/antd.css';
// eslint-disable-next-line @typescript-eslint/no-unused-vars, import/order
import classes from './Header.module.scss';
import '~antd/dist/antd.compact.less';
import Button from 'antd/lib/button';
import Tabs from 'antd/lib/tabs';
import TabPane from 'antd/lib/tabs/TabPane';
import logo from './logo.svg';

type ConfirmDialogProps = PropsWithChildren;

const Header: FunctionComponent<ConfirmDialogProps> = () => {
  return (
    <PageHeader
      onBack={() => window.history.back()}
      className="site-page-header"
      title={<img alt="Реацентр Астрахань" src={logo} />}
      extra={[<Button key="1">Справка</Button>, <Button key="2">Выйти</Button>]}
      subTitle="Иванов И.И."
      footer={
        <Tabs defaultActiveKey="1">
          <TabPane tab="Личные данные" key="1" />
          <TabPane tab="Расписание" key="2" />
          <TabPane tab="Пациенты" key="3" />
          <TabPane tab="Представители" key="4" />
          <TabPane tab="Специалисты" key="5" />
          <TabPane tab="Справочники" key="6" />
          <TabPane tab="Очтеты" key="7" />
        </Tabs>
      }
    />
  );
};

export default Header;
