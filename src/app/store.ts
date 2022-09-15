import { configureStore } from '@reduxjs/toolkit';
import loginFormReducer from './reducers/LoginFormSlice';
import postAPI from '../services/PostService';
import signinAPI from '../services/SignInService';
// import userReducer from './reducers/UserSlice';
import postReducer from './reducers/PostSlice';

export const store = configureStore({
  reducer: {
    // userReducer,
    postReducer,
    loginFormReducer,
    [signinAPI.reducerPath]: signinAPI.reducer,
    [postAPI.reducerPath]: postAPI.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(postAPI.middleware, signinAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/* export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>; */
