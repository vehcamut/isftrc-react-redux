import { useLocation, Navigate, Outlet } from 'react-router-dom';
import React from 'react';
// import { useSelector } from 'react-redux';
// import { selectCurrentToken } from './authSlice';
import { useAppSelector } from '../app/hooks';

const RequireAuth = () => {
  const { isAuth } = useAppSelector((state) => state.authReducer);
  // const token = useSelector(selectCurrentToken);
  const location = useLocation();

  return isAuth ? <Outlet /> : <Navigate to="/" state={{ from: location }} replace />;
};
export default RequireAuth;
