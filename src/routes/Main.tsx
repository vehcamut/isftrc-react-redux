/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { authAPI } from '../app/services';

const Main = () => {
  const [test] = authAPI.useTestMutation();
  useEffect(() => {
    test({});
  }, []);
  const location = useLocation();
  // console.log(<Outlet />);
  return <Navigate to="/profile" replace />;
  // // authAPI.useTestMutation();
  // const { roles } = useAppSelector((state) => state.authReducer);
  // if (roles.some((userRole) => ['registrator'].includes(userRole))) return <Navigate to="/auth" />;
  // return <div>MAIN</div>;
};

export default Main;
