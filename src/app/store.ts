import { configureStore } from '@reduxjs/toolkit';
import { api } from './services';
import { authReducer } from './reducers/auth.slise';
import {
  adminsTableReducer,
  specialistsTableReducer,
  representativesTableReducer,
  patientTableReducer,
} from './reducers';

export const store = configureStore({
  reducer: {
    patientTableReducer,
    representativesTableReducer,
    specialistsTableReducer,
    authReducer,
    adminsTableReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
