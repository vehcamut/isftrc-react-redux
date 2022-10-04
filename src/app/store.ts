import { configureStore, isRejectedWithValue } from '@reduxjs/toolkit';
import { authReducer } from './reducers/auth.slise';
/* eslint-disable @typescript-eslint/indent */
// import { useDispatch } from 'react-redux';
import {
  specTypesDialogReducer,
  specTypesTableReducer,
  confirmDialogReducer,
  alertReducer,
  regectedActionReducer,
  // regectedActionSlice,
} from './reducers';
import loginFormReducer from './reducers/LoginFormSlice';
import authApi from './services/auth.servicec';
// import userAPI from './services/UserServise';
// import postAPI from './services/PostService';
// import authAPI from './services/Auth.service';
// import specialistAPI from './services/SpecialistsService';
import backendAPI from './services/main.service';
import testAPI from './services/test.service';
// import { useAppDispatch } from './hooks';

// const { setRejectedAction } = regectedActionSlice.actions;
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, prettier/prettier
const customMiddleWare = ({ dispatch }: Record<any, any>) => (next: any) => async (action: any) => {
    // const dispatch1 = useAppDispatch();
    if (action && isRejectedWithValue(action)) {
      // Catch the authorization error and refresh the tokens
      console.warn('We got a rejected action!', action);
      // console.log({ action });
      if (action.payload.status === 401 && action.payload.data.message === 'jwt expired') {
        console.warn('403', action);
        const { endpointName, originalArgs } = action.meta.arg;

        // console.log({ type, originalArgs });
        // await dispatch(setRejectedAction({ endpointName, originalArgs }));
        // await dispatch1(authApi.util.invalidateTags(['Tokens']));
        // await dispatch1(userAPI.util.invalidateTags(['Tokens']));
        // await useDispatch(authApi.util.invalidateTags(['Tokens']));
        // await dispatch(backendAPI.util.invalidateTags(['']));
        await dispatch(authApi.endpoints.refreshToken.initiate({}));
        await dispatch(authApi.util.invalidateTags(['Tokens']));
        // setTimeout(() => {
        //   dispatch(authApi.util.invalidateTags(['Tokens']));
        // }, 10000);
        // await dispatch(testAPI.util.invalidateTags(['Token']));
        // dispatch(backendAPI.util.invalidateTags(['Tokens']));
        console.log(endpointName, originalArgs);
      }
    }

    console.log('Middleware triggered:', action, dispatch);
    next(action);
  };
// export const jwtTokenRefresher =
//   ({ dispatch }: Record<any, any>) => (next: any) => async (action: any) => {
//     if (action && isRejectedWithValue(action)) {
//       // Catch the authorization error and refresh the tokens
//       console.warn('We got a rejected action!', action.payload.status);
//       // console.log({ action });
//       if (action.payload.status === 403) {
//         const { endpointName, originalArgs } = action.meta.arg;
//         // console.log({ type, originalArgs });
//         await dispatch(setRejectedAction({ endpointName, originalArgs }));
//         await dispatch(authAPI.util.invalidateTags(['Tokens']));
//       }
//     }

//     return next(action);
//   };
// const listenerMiddleware = createListenerMiddleware();
// listenerMiddleware.startListening({
//   effect: (action, listenerApi) => {
//     console.log(action, listenerApi);
//   },
//   predicate: 'ddd',
// });

export const store = configureStore({
  reducer: {
    specTypesDialogReducer,
    specTypesTableReducer,
    alertReducer,
    loginFormReducer,
    confirmDialogReducer,
    regectedActionReducer,
    authReducer,
    [testAPI.reducerPath]: testAPI.reducer,
    [backendAPI.reducerPath]: backendAPI.reducer,
    [authApi.reducerPath]: authApi.reducer,
    // [authAPI.reducerPath]: authAPI.reducer,
    // [specialistAPI.reducerPath]: specialistAPI.reducer,
    // [postAPI.reducerPath]: postAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      // .concat(customMiddleWare)
      // .prepend(customMiddleWare)
      .concat(
        testAPI.middleware,
        /* , postAPI.middleware, authAPI.middleware, specialistAPI.middleware */
      )
      .concat(authApi.middleware)
      .concat(backendAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/* export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>; */
