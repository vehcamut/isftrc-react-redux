/* eslint-disable import/prefer-default-export */
// import { createApi } from '@reduxjs/toolkit/query/react';
// import baseQuery from './baseQuery';
import { IUser } from '../../models/IUser';
import { api } from './api.service';

// export const authAPI = createApi({
//   reducerPath: 'authAPI',
//   baseQuery,
//   endpoints: (build) => ({
export const authAPI = api.injectEndpoints({
  // reducerPath: 'representativesAPI',
  // baseQuery,
  // tagTypes: ['representative'],
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
        // body: user,
        credentials: 'include',
      }),
      // invalidatesTags: [
      //   'advertisingSource',
      //   'appointments',
      //   'patients',
      //   'representative',
      //   'serviceGroup',
      //   'serviceType',
      //   'specialistTypes',
      //   'specialists',
      //   'user',
      // ],
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
