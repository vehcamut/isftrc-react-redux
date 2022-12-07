import { configureStore } from '@reduxjs/toolkit';
import { addPatientReducer } from './reducers/patientForm.slise';
import { specialistsAPI, authAPI, patientsAPI, dadataAPI } from './services';
import { authReducer } from './reducers/auth.slise';
import {
  specTypesDialogReducer,
  specTypesTableReducer,
  confirmDialogReducer,
  alertReducer,
  loginFormReducer,
  patientTableReducer,
} from './reducers';

export const store = configureStore({
  reducer: {
    specTypesDialogReducer,
    specTypesTableReducer,
    alertReducer,
    loginFormReducer,
    confirmDialogReducer,
    patientTableReducer,
    authReducer,
    addPatientReducer,
    [authAPI.reducerPath]: authAPI.reducer,
    [patientsAPI.reducerPath]: patientsAPI.reducer,
    [specialistsAPI.reducerPath]: specialistsAPI.reducer,
    [dadataAPI.reducerPath]: dadataAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authAPI.middleware,
      specialistsAPI.middleware,
      patientsAPI.middleware,
      dadataAPI.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
