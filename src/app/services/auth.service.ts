/* eslint-disable import/prefer-default-export */
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';
import { IUser } from '../../models/IUser';

export const authAPI = createApi({
  reducerPath: 'authAPI',
  baseQuery,
  endpoints: (build) => ({
    signin: build.mutation<unknown, IUser>({
      query: (user) => ({
        url: 'auth/local/signin',
        method: 'POST',
        body: user,
        credentials: 'include',
      }),
    }),
  }),
});
