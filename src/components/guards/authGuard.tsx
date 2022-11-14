import { useLocation, Navigate, Outlet } from 'react-router-dom';
import React from 'react';
import { useAppSelector } from '../../app/hooks';

const AuthGuard = () => {
  const { isAuth } = useAppSelector((state) => state.authReducer);
  const location = useLocation();
  return isAuth ? <Outlet /> : <Navigate to="/auth/signin" state={{ from: location }} replace />;
};
export default AuthGuard;
