import Container from '@mui/material/Container/Container';
import Grid from '@mui/material/Grid/Grid';
import React, { FunctionComponent, PropsWithChildren } from 'react';
import LoginForm from '../components/LoginForm';

const SignIn: FunctionComponent<PropsWithChildren> = () => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }}
    >
      <Container maxWidth="xs">
        <Grid item>
          <LoginForm />
          {/* <PostContainer /> */}
        </Grid>
      </Container>
    </Grid>
  );
};

export default SignIn;
