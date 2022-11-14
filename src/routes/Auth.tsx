import { Box, Container } from '@mui/material';
import React from 'react';
// import RolesAuthRoute from '../components/RolesAuthRoute';
// import ResponsiveAppBar from '../components/AppBar/AppBar';
import DrawerAppBar from '../components/Header/Header';
import SpecTypesTable from '../components/SpecTypes/SpecTypesTable';
// import EnhancedTable from '../components/NewTable';
// import CustomPaginationActionsTable from '../components/Table/Table';

const Auth = () => {
  return (
    // <RolesAuthRoute roles={['admin', 'user']}>
    <>
      <DrawerAppBar />
      <Container>
        <SpecTypesTable />
        <Box sx={{ my: 2 }}>
          {[...new Array(12)]
            .map(
              () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`,
            )
            .join('\n')}
        </Box>
        <Box sx={{ my: 2 }}>
          {[...new Array(12)]
            .map(
              () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`,
            )
            .join('\n')}
        </Box>
      </Container>
    </>
  );
};

export default Auth;
