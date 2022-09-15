import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUserRoles } from './hooks';

const RolesAuthRoute = ({ children, roles }: { children: ReactNode; roles: Array<string> }) => {
  const userRoles = useUserRoles();

  const canAccess = userRoles.some((userRole) => roles.includes(userRole));

  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (canAccess) return <>{children}</>;

  return <Navigate to="/" />;
};

export default RolesAuthRoute;
