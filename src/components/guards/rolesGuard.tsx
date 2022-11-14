import { useLocation, Navigate, Outlet } from 'react-router-dom';
import React from 'react';
import { useAppSelector } from '../../app/hooks';

const RolesGuard = ({ requiredRoles }: { requiredRoles: Array<string> }) => {
  const { roles } = useAppSelector((state) => state.authReducer);
  const canAccess = roles.some((userRole) => requiredRoles.includes(userRole));
  const location = useLocation();
  return canAccess ? <Outlet /> : <Navigate to="/auth/signin" state={{ from: location }} replace />;
};
export default RolesGuard;
