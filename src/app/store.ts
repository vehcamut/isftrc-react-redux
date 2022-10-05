import { configureStore } from '@reduxjs/toolkit';
import { specialistsAPI, authAPI } from './services';
import { authReducer } from './reducers/auth.slise';
import {
  specTypesDialogReducer,
  specTypesTableReducer,
  confirmDialogReducer,
  alertReducer,
  regectedActionReducer,
} from './reducers';
import loginFormReducer from './reducers/LoginFormSlice';

export const store = configureStore({
  reducer: {
    specTypesDialogReducer,
    specTypesTableReducer,
    alertReducer,
    loginFormReducer,
    confirmDialogReducer,
    regectedActionReducer,
    authReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [specialistsAPI.reducerPath]: specialistsAPI.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authAPI.middleware, specialistsAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
