/* eslint-disable import/no-cycle */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { authAPI } from '../services';

interface IAuthState {
  isAuth: boolean;
  name: string;
  roles: string[];
  id: string;
}

const initialState: IAuthState = {
  isAuth: localStorage?.roles?.split(',') ? localStorage?.isAuth || false : false,
  roles: localStorage?.roles?.split(',') || [],
  name: localStorage?.name || '',
  id: localStorage?.id || '',
};

export const authSlice = createSlice({
  name: 'authState',
  initialState,
  // : async () => {
  //   const [refesh] = authAPI.useRefreshTokenQuery({});
  //   refersh();
  //   return false;
  // },
  reducers: {
    setIsAuth(state: IAuthState, action: PayloadAction<boolean>) {
      state.isAuth = action.payload;
      localStorage.isAuth = action.payload;
    },
    setRoles(state: IAuthState, action: PayloadAction<string[]>) {
      state.roles = action.payload;
      if (action.payload.length === 0) localStorage.removeItem('roles');
      else localStorage.roles = action.payload;
    },
    setName(state: IAuthState, action: PayloadAction<string>) {
      state.name = action.payload;
      // localStorage.name = action.payload;
      if (action.payload.length === 0) localStorage.removeItem('name');
      else localStorage.name = action.payload;
      // if (action.payload.length === 0) localStorage.removeItem('roles');
      // else localStorage.roles = action.payload;
    },
    setId(state: IAuthState, action: PayloadAction<string>) {
      state.id = action.payload;
      if (action.payload.length === 0) localStorage.removeItem('id');
      else localStorage.id = action.payload;
    },
  },
});

export const authReducer = authSlice.reducer;
