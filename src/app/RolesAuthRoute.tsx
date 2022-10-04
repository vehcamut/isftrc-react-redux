import React, { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate /* Outlet */ } from 'react-router-dom';
import { /* useAppSelector, */ useUserRoles } from './hooks';
import { authSlice } from './reducers';

const RolesAuthRoute = ({ children, roles }: { children: ReactNode; roles: Array<string> }) => {
  const dispatch = useDispatch();
  const userRoles = useUserRoles();
  // const { isAuth } = useAppSelector((state) => state.authReducer);
  const { setRoles } = authSlice.actions;
  dispatch(setRoles(roles));
  const canAccess = userRoles.some((userRole) => roles.includes(userRole));
  // console.log(isAuth);
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (canAccess) return <>{children}</>;

  return <Navigate to="/" />;
};

export default RolesAuthRoute;
