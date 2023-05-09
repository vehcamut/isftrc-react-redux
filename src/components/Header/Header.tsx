import React, { FunctionComponent, PropsWithChildren } from 'react';
import Typography from 'antd/lib/typography';
import { useNavigate } from 'react-router-dom';
import { Button, Tabs } from 'antd';
import { /* QuestionCircleFilled , */ QuestionOutlined } from '@ant-design/icons';
import classes from './Header.module.scss';
import logo from './logo.svg';
import { addClass } from '../../app/common';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { authAPI } from '../../app/services';
import { authSlice } from '../../app/reducers';

const { Text } = Typography;

interface ConfirmDialogProps extends PropsWithChildren {
  activeKey: string;
}

const getTabs = (isAuth: boolean, roles: string[]) => {
  if (!isAuth) return [{ label: 'О компании', key: 'notauth/about' }];
  if (roles.find((r) => r === 'admin'))
    return [
      { label: 'Личные данные', key: 'profile' },
      { label: 'Пациенты', key: 'patients' },
      { label: 'Представители', key: 'representatives' },
      { label: 'Специалисты', key: 'specialists' },
      { label: 'Администраторы', key: 'admins' },
      { label: 'Справочники', key: 'handbooks' },
      { label: 'О компании', key: 'about' },
      // { label: 'Справка', key: 'help' },
    ];
  if (roles.find((r) => r === 'specialist'))
    return [
      { label: 'Личные данные', key: 'profile' },
      { label: 'Пациенты', key: 'patients' },
      { label: 'Расписание', key: 'shedule' },
      { label: 'О компании', key: 'about' },
    ];
  return [
    { label: 'Личные данные', key: 'profile' },
    { label: 'Пациенты', key: 'patients' },
    { label: 'О компании', key: 'about' },
  ];
};

const MyHeader: FunctionComponent<ConfirmDialogProps> = ({ activeKey }) => {
  const { isAuth, roles, name, isMobile } = useAppSelector((state) => state.authReducer);
  const tabs = getTabs(isAuth, roles);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logout] = authAPI.useLogoutMutation();
  const { setIsAuth, setRoles, setName, setId } = authSlice.actions;
  const onLogout = async () => {
    logout({}).unwrap();
    dispatch(setIsAuth(false));
    dispatch(setRoles([]));
    dispatch(setName(''));
    dispatch(setId(''));
    navigate('/auth/signin');
  };
  return (
    <>
      <div className={addClass(classes, 'header-top')}>
        {isMobile && isAuth ? null : <img alt="Реацентр Астрахань" src={logo} />}
        <div
          className={addClass(classes, 'header-top__menu')}
          style={isMobile ? { justifyContent: 'flex-end', width: '100%' } : undefined}
        >
          <Button
            type="primary"
            shape="circle"
            icon={<QuestionOutlined style={{ fontWeight: 'bold', fontSize: '20px' }} />}
            onClick={() => navigate('/help')}
          />
          {isAuth ? (
            <>
              <Text key="0" strong style={{ fontSize: '14px' }}>
                {name}
              </Text>
              <Button key="2" type="primary" onClick={onLogout}>
                Выйти
              </Button>
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
        items={tabs}
        size="middle"
        tabBarStyle={{ marginBottom: '0px' }}
      />
    </>
  );
};

export default MyHeader;
