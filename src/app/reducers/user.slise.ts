/* eslint-disable import/no-cycle */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { authAPI } from '../services';

interface IUserState {
  isAuth: boolean;
  roles: string[];
}

const initialState: IUserState = {
  isAuth: localStorage?.roles?.split(',') ? localStorage?.isAuth || false : false,
  roles: localStorage?.roles?.split(',') || [],
};

export const userSlice = createSlice({
  name: 'authState',
  initialState,
  // : async () => {
  //   const [refesh] = authAPI.useRefreshTokenQuery({});
  //   refersh();
  //   return false;
  // },
  reducers: {
    setIsAuth(state: IUserState, action: PayloadAction<boolean>) {
      state.isAuth = action.payload;
      localStorage.isAuth = action.payload;
    },
    setRoles(state: IUserState, action: PayloadAction<string[]>) {
      state.roles = action.payload;
      if (action.payload.length === 0) localStorage.removeItem('roles');
      else localStorage.roles = action.payload;
    },
  },
});

export const userReducer = userSlice.reducer;
