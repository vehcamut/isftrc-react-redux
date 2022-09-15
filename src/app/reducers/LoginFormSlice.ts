import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { IPost } from '../../models';

interface ILoginFormState {
  login: string;
  // loginInputError: boolean;
  loginInputHelper: string;
  password: string;
  // passwordInputError: boolean;
  passwordInputHelper: string;
  showPassword: boolean;
}

const initialState: ILoginFormState = {
  login: '',
  loginInputHelper: '',
  password: '',
  showPassword: false,

  passwordInputHelper: '',
};

export const loginFormSlice = createSlice({
  name: 'loginForm',
  initialState,
  reducers: {
    switchShowedPassword(state: ILoginFormState) {
      state.showPassword = !state.showPassword;
    },
    changedPassword(state: ILoginFormState, action: PayloadAction<string>) {
      state.password = action.payload;
    },
    changedLogin(state: ILoginFormState, action: PayloadAction<string>) {
      state.login = action.payload;
    },
    setLoginHelper(state: ILoginFormState, action: PayloadAction<string>) {
      state.loginInputHelper = action.payload;
    },
    setPasswordHelper(state: ILoginFormState, action: PayloadAction<string>) {
      state.passwordInputHelper = action.payload;
    },
  },
});

export default loginFormSlice.reducer;
