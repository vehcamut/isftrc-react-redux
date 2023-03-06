/* eslint-disable import/prefer-default-export */
import { IUser } from '../../models/IUser';
import { api } from './api.service';

export const authAPI = api.injectEndpoints({
  endpoints: (build) => ({
    signin: build.mutation<unknown, IUser>({
      query: (user) => ({
        url: 'auth/local/signin',
        method: 'POST',
        body: user,
        credentials: 'include',
      }),
    }),
    refreshToken: build.mutation({
      query: () => ({
        url: 'auth/refresh',
        method: 'PATCH',
        credentials: 'include',
      }),
    }),
    logout: build.mutation<unknown, any>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
        credentials: 'include',
      }),
    }),
    test: build.mutation({
      query: () => ({
        method: 'POST',
        url: 'auth/test',
        credentials: 'include',
      }),
    }),
  }),
});
