import { configureStore } from '@reduxjs/toolkit';
import { specTypesDialogReducer, specTypesTableReducer, confirmDialogReducer } from './reducers';
import formDialogReducer from './reducers/FormDialog.slice';
import loginFormReducer from './reducers/LoginFormSlice';
import notificationBarReducer from './reducers/NotificatinBar.slise';
import specialistTypesTableReducer from './reducers/SpecialistTypesTableSlice';
import postAPI from './services/PostService';
import signinAPI from './services/SignInService';
import specialistAPI from './services/SpecialistsService';
import postReducer from './reducers/PostSlice';

export const store = configureStore({
  reducer: {
    specTypesDialogReducer,
    specTypesTableReducer,
    // userReducer,
    postReducer,
    specialistTypesTableReducer,
    loginFormReducer,
    formDialogReducer,
    confirmDialogReducer,
    notificationBarReducer,
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
