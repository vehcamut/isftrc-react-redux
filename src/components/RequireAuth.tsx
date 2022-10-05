import { useLocation, Navigate, Outlet } from 'react-router-dom';
import React from 'react';
import { useAppSelector } from '../app/hooks';

const RequireAuth = ({ requiredRoles }: { requiredRoles: Array<string> }) => {
  const { isAuth, roles } = useAppSelector((state) => state.authReducer);
  const canAccess = roles.some((userRole) => requiredRoles.includes(userRole));
  const location = useLocation();
  return isAuth && canAccess ? <Outlet /> : <Navigate to="/" state={{ from: location }} replace />;
};
export default RequireAuth;
