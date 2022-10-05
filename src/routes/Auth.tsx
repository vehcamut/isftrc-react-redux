import { Container } from '@mui/material';
import React from 'react';
// import RolesAuthRoute from '../components/RolesAuthRoute';
import ResponsiveAppBar from '../components/AppBar/AppBar';
import SpecTypesTable from '../components/SpecTypes/SpecTypesTable';
// import EnhancedTable from '../components/NewTable';
// import CustomPaginationActionsTable from '../components/Table/Table';

const Auth = () => {
  return (
    // <RolesAuthRoute roles={['admin', 'user']}>
    <>
      <ResponsiveAppBar />
      <Container>
        <SpecTypesTable />
      </Container>
    </>
  );
};

export default Auth;
