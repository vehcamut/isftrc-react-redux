import React from 'react';
import EnhancedTable from '../components/NewTable';
import CustomPaginationActionsTable from '../components/Table';

const Auth = () => {
  return (
    <>
      <CustomPaginationActionsTable />
      <EnhancedTable />;
    </>
  );
};

export default Auth;
