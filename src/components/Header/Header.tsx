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
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { authAPI } from '../../app/services';
import { authSlice } from '../../app/reducers';

const { Text } = Typography;

interface ConfirmDialogProps extends PropsWithChildren {
  // defaultActiveKey: string;
  activeKey: string;
}

// { label: 'Личные данные', key: 'profile' },
// // { label: 'Расписание', key: 'shedules' },
// { label: 'Пациенты', key: 'patients' },
// { label: 'Представители', key: 'representatives' },
// { label: 'Специалисты', key: 'specialists' },
// { label: 'Справочники', key: 'handbooks' },
// // { label: 'Очтеты', key: 'reports' },
const notAuthTabs = [
  // { label: 'Войти', key: 'login' },
  { label: 'О компании', key: 'notauth/about' },
];
const isAuthTabs = [
  { label: 'Личные данные', key: 'profile' },
  { label: 'Пациенты', key: 'patients' },
  { label: 'Представители', key: 'representatives' },
  { label: 'Специалисты', key: 'specialists' },
  { label: 'Администраторы', key: 'admins' },
  { label: 'Справочники', key: 'handbooks' },
  { label: 'О компании', key: 'about' },
];
// isAuth
const MyHeader: FunctionComponent<ConfirmDialogProps> = ({ /* defaultActiveKey, */ activeKey }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const location = useLocation();
  const [logout] = authAPI.useLogoutMutation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isAuth, roles, name } = useAppSelector((state) => state.authReducer);
  const { setIsAuth, setRoles, setName } = authSlice.actions;
  const onLogout = async () => {
    try {
      // await signIN({ login, password }).unwrap();
      await logout({}).unwrap();
      dispatch(setIsAuth(false));
      dispatch(setRoles([]));
      dispatch(setName(''));
      // eslint-disable-next-line no-restricted-globals
      // location.reload();
      // const payload = getTokenPayload()?.roles;
      navigate(0);
    } catch (e) {
      // messageApi.open({
      //   type: 'error',
      //   content: 'Неправильный логин или пароль',
      // });
      // console.log('ERROR!');
      // dispatch(setLoginHelper('Неправильный логин или пароль'));
    }
  };
  return (
    // style={{ backgroundColor: '#ffffff', lineHeight: '0px' }}
    // <Header className={addClass(classes, 'header')}>
    //   {/* <AppBar defaultActiveKey="patients" /> */}
    // </Header>
    <>
      <div className={addClass(classes, 'header-top')}>
        <img alt="Реацентр Астрахань" src={logo} />
        <div className={addClass(classes, 'header-top__menu')}>
          {isAuth ? (
            <>
              <Button key="1" type="primary">
                Справка
              </Button>

              <Button key="2" type="primary" onClick={onLogout}>
                Выйти
              </Button>

              <Text key="0" strong>
                {name}
              </Text>
            </>
          ) : (
            <Button key="2" type="primary" onClick={() => navigate('/auth/signin')}>
              Войти
            </Button>
          )}
        </div>
      </div>
      <Tabs
        onChange={(path) => {
          navigate(`/${path}`);
        }}
        activeKey={activeKey}
        // defaultActiveKey={defaultActiveKey}
        items={isAuth ? isAuthTabs : notAuthTabs}
        // items={[
        //   { label: 'Личные данные', key: 'profile' },
        //   // { label: 'Расписание', key: 'shedules' },
        //   { label: 'Пациенты', key: 'patients' },
        //   { label: 'Представители', key: 'representatives' },
        //   { label: 'Специалисты', key: 'specialists' },
        //   { label: 'Справочники', key: 'handbooks' },
        //   // { label: 'Очтеты', key: 'reports' },
        // ]}
        size="small"
        tabBarStyle={{ marginBottom: '0px' }}
      />
    </>
  );
};

export default MyHeader;
