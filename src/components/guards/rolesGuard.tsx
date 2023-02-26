import { useLocation, Navigate, Outlet } from 'react-router-dom';
import React from 'react';
import { useAppSelector } from '../../app/hooks';
import MTemplate from '../../routes/Mobile/MTemplate';
import MErrorPage from '../../routes/Mobile/MErrorPage';

const RolesGuard = ({ requiredRoles }: { requiredRoles: Array<string> }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { roles, isMobile } = useAppSelector((state) => state.authReducer);
  // if (isMobile && roles.includes('admin')) return <Navigate to="/auth/signin" replace />;
  if (isMobile && roles.includes('admin'))
    return (
      <MTemplate activeKey="">
        <MErrorPage />
      </MTemplate>
    );
  const canAccess = roles.some((userRole) => requiredRoles.includes(userRole));
  const location = useLocation();
  return canAccess ? <Outlet /> : <Navigate to="/auth/signin" state={{ from: location }} replace />;
};
export default RolesGuard;
