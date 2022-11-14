import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { authAPI } from '../app/services';

const Main = () => {
  const [test] = authAPI.useTestMutation();
  useEffect(() => {
    test({});
  }, []);

  // authAPI.useTestMutation();
  const { roles } = useAppSelector((state) => state.authReducer);
  if (roles.some((userRole) => ['registrator'].includes(userRole))) return <Navigate to="/auth" />;
  return <div>MAIN</div>;
};

export default Main;
