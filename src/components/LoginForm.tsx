import React, { FunctionComponent, PropsWithChildren } from 'react';
import { Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { loginFormSlice } from '../app/reducers/loginForm.slice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { authAPI } from '../app/services';
import { authSlice } from '../app/reducers';
import getTokenPayload from '../app/tokenHendler';
// import extendedApi from '../app/services/auth.servicec';
// import { IUser } from '../models';

const LoginForm: FunctionComponent<PropsWithChildren> = () => {
  const navigate = useNavigate();
  // const [signIN] = extendedApi.useSigninMutation();
  const [signin] = authAPI.useSigninMutation();
  const { login, password, showPassword, loginInputHelper, passwordInputHelper } = useAppSelector(
    (state) => state.loginFormReducer,
  );
  const { switchShowedPassword, changedLogin, changedPassword, setLoginHelper, setPasswordHelper } =
    loginFormSlice.actions;
  const { setIsAuth, setRoles } = authSlice.actions;
  // const { isAuth } = useAppSelector((state) => state.authReducer);
  const dispatch = useAppDispatch();

  const handleClickShowPassword = (): void => {
    dispatch(switchShowedPassword());
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPasswordHelper(''));
    dispatch(changedPassword(event.target.value));
  };

  const handleChangeLogin = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setLoginHelper(''));
    dispatch(changedLogin(event.target.value));
  };

  const handleSignIn = async () => {
    if (!login) {
      dispatch(setLoginHelper('Это поле должно быть заполнено'));
    }
    if (!password) {
      dispatch(setPasswordHelper('Это поле должно быть заполнено'));
    }
    if (password && login) {
      try {
        // await signIN({ login, password }).unwrap();
        await signin({ login, password }).unwrap();
        // console.log('sdfdf');
        // if (!isAuth)
        dispatch(setIsAuth(true));
        dispatch(setRoles(getTokenPayload()?.roles || []));
        // const payload = getTokenPayload()?.roles;
        navigate('/auth');
      } catch (e) {
        dispatch(setLoginHelper('Неправильный логин или пароль'));
      }
      // const response: any = await signin({ email: login, password } as IUser);
      // if (response?.error?.data.statusCode === 403) dispatch(setLoginHelper('Неправильный логин или пароль'));
      // else {
      //   navigate('/auth');
      // }
    }
    // email: '1sdfdsf', password: 'asdasd'
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h2" component="h1">
        Реацентр Астрахань
      </Typography>
      <TextField
        id="login"
        label="Логин"
        variant="standard"
        required
        error={!!loginInputHelper}
        helperText={loginInputHelper}
        value={login}
        onChange={handleChangeLogin}
      />
      <TextField
        id="password"
        label="Пароль"
        type={showPassword ? 'text' : 'password'}
        variant="standard"
        required
        error={!!passwordInputHelper}
        helperText={passwordInputHelper}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        value={password}
        onChange={handleChangePassword}
      />
      <Button variant="text" style={{ marginTop: '30px' }} onClick={handleSignIn}>
        Войти
      </Button>
    </Stack>
  );
};

export default LoginForm;
