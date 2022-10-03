import { configureStore } from '@reduxjs/toolkit';
import { specTypesDialogReducer, specTypesTableReducer, confirmDialogReducer, alertReducer } from './reducers';
import loginFormReducer from './reducers/LoginFormSlice';
import postAPI from './services/PostService';
import signinAPI from './services/SignInService';
import specialistAPI from './services/SpecialistsService';

export const store = configureStore({
  reducer: {
    specTypesDialogReducer,
    specTypesTableReducer,
    alertReducer,
    loginFormReducer,
    confirmDialogReducer,
    [signinAPI.reducerPath]: signinAPI.reducer,
    [specialistAPI.reducerPath]: specialistAPI.reducer,
    [postAPI.reducerPath]: postAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(postAPI.middleware, signinAPI.middleware, specialistAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/* export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>; */
