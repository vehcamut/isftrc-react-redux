import { BaseQueryApi } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { authSlice } from '../reducers/auth.slise';
import getTokenPayload from '../tokenHendler';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL,
  credentials: 'include',
});

export default async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401) {
    const refreshResult = await baseQuery({ url: '/auth/refresh', method: 'PATCH' }, api, extraOptions);
    if (refreshResult.error?.status === 401) {
      document.cookie = '';
      api.dispatch(authSlice.actions.setIsAuth(false));
      api.dispatch(authSlice.actions.setRoles([]));
      api.dispatch(authSlice.actions.setName(''));
      api.dispatch(authSlice.actions.setId(''));
    } else {
      api.dispatch(authSlice.actions.setIsAuth(true));
      api.dispatch(authSlice.actions.setRoles(getTokenPayload()?.roles || []));
      api.dispatch(authSlice.actions.setName(getTokenPayload()?.name || ''));
      api.dispatch(authSlice.actions.setId(getTokenPayload()?.sub || ''));
    }

    result = await baseQuery(args, api, extraOptions);
  }
  if (result.error?.status === 'FETCH_ERROR') {
    api.dispatch(authSlice.actions.setServerError(true));
    return result;
  }
  api.dispatch(authSlice.actions.setServerError(undefined));
  if (result?.error?.status === 403) {
    api.dispatch(authSlice.actions.setRoles(getTokenPayload()?.roles || []));
  }
  return result;
};
