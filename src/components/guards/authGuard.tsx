/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import React from 'react';
import { Result } from 'antd';
import { useAppSelector } from '../../app/hooks';

const AuthGuard = () => {
  const { isAuth, serverError } = useAppSelector((state) => state.authReducer);
  const location = useLocation();
  // if (serverError) {
  //   console.log('dfd');
  //   return (
  //     <Result
  //       style={{ marginTop: '75px' }}
  //       status="500"
  //       title="500"
  //       subTitle="Похоже что-то пошло не так, попробуйте повторить запрос позже."
  //     />
  //   );
  // }
  return isAuth ? <Outlet /> : <Navigate to="/auth/signin" state={{ from: location }} replace />;
};
export default AuthGuard;
