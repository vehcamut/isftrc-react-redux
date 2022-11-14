import Container from '@mui/material/Container/Container';
import Grid from '@mui/material/Grid/Grid';
import React, { FunctionComponent, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import LoginForm from '../components/LoginForm';

const SignIn: FunctionComponent<PropsWithChildren> = () => {
  const { isAuth /* roles */ } = useAppSelector((state) => state.authReducer);

  // console.log(isAuth, isAuth);
  // eslint-disable-next-line no-constant-condition, no-self-compare, @typescript-eslint/no-unused-expressions
  // isAuth ? console.log('/authd') : console.log('/');
  return isAuth ? (
    <Navigate to="/" />
  ) : (
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
