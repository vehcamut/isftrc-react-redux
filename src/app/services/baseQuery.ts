import { BaseQueryApi } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { authSlice } from '../reducers/auth.slise';
import getTokenPayload from '../tokenHendler';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3333',
  credentials: 'include',
});

export default async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401) {
    const refreshResult = await baseQuery({ url: '/auth/refresh', method: 'PATCH' }, api, extraOptions);
    console.log('refresh');
    if (refreshResult.error?.status === 401) {
      document.cookie = '';
      console.log('ERROR!');
      api.dispatch(authSlice.actions.setIsAuth(false));
      api.dispatch(authSlice.actions.setRoles([]));
    } else {
      api.dispatch(authSlice.actions.setIsAuth(true));
      api.dispatch(authSlice.actions.setRoles(getTokenPayload()?.roles || []));
    }

    result = await baseQuery(args, api, extraOptions);
  }
  if (result?.error?.status === 403) {
    api.dispatch(authSlice.actions.setRoles(getTokenPayload()?.roles || []));
  }
  return result;
};
