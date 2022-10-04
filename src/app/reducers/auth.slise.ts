import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IAuthState {
  isAuth: boolean;
  roles: string[];
}

const initialState: IAuthState = {
  isAuth: false,
  roles: [],
};

export const authSlice = createSlice({
  name: 'authState',
  initialState,
  reducers: {
    setIsAuth(state: IAuthState, action: PayloadAction<boolean>) {
      state.isAuth = action.payload;
    },
    setRoles(state: IAuthState, action: PayloadAction<string[]>) {
      state.roles = action.payload;
    },
  },
});

export const authReducer = authSlice.reducer;
