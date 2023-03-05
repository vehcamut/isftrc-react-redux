import { Outlet } from 'react-router-dom';
import React from 'react';
import { Result } from 'antd';
import { useAppSelector } from '../../app/hooks';

const ErrorGuard = () => {
  const { serverError } = useAppSelector((state) => state.authReducer);
  if (serverError) {
    return (
      <Result
        style={{ marginTop: '75px' }}
        status="500"
        title="500"
        subTitle="Похоже что-то пошло не так, попробуйте повторить запрос позже."
      />
    );
  }
  return <Outlet />;
};
export default ErrorGuard;
