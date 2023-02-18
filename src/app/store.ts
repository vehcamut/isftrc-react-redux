import { configureStore } from '@reduxjs/toolkit';
import { adminsTableReducer } from './reducers/adminsTable.slice';
import { specialistsReducer } from './reducers/specialists.slice';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { addPatientReducer } from './reducers/patientForm.slise';
import {
  // specialistsAPI,
  authAPI,
  patientsAPI,
  dadataAPI,
  advertisingSourceAPI,
  representativesAPI,
  api,
} from './services';
import { authReducer } from './reducers/auth.slise';
import {
  // specTypesDialogReducer,
  // specTypesTableReducer,
  representativesTableReducer,
  confirmDialogReducer,
  alertReducer,
  loginFormReducer,
  patientTableReducer,
} from './reducers';

export const store = configureStore({
  reducer: {
    // specTypesDialogReducer,
    // specTypesTableReducer,
    alertReducer,
    loginFormReducer,
    confirmDialogReducer,
    patientTableReducer,
    representativesTableReducer,
    specialistsReducer,
    authReducer,
    addPatientReducer,
    adminsTableReducer,
    [api.reducerPath]: api.reducer,
    // [representativesAPI.reducerPath]: representativesAPI.reducer,
    // [advertisingSourceAPI.reducerPath]: advertisingSourceAPI.reducer,
    [authAPI.reducerPath]: authAPI.reducer,
    // [patientsAPI.reducerPath]: patientsAPI.reducer,
    // [specialistsAPI.reducerPath]: specialistsAPI.reducer,
    [dadataAPI.reducerPath]: dadataAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      // advertisingSourceAPI.middleware,
      api.middleware,
      authAPI.middleware,
      // specialistsAPI.middleware,
      // patientsAPI.middleware,
      dadataAPI.middleware,
      // representativesAPI.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
