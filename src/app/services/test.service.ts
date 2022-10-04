import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IUser } from '../../models/IUser';
// import { ThunkAction } from '@reduxjs/toolkit';

const testAPI = createApi({
  reducerPath: 'testAPI',
  tagTypes: ['Token'],
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3333/',
  }),
  endpoints: (build) => ({
    signin: build.mutation<unknown, IUser>({
      query: (user) => ({
        url: 'auth/local/signin',
        method: 'POST',
        body: user,
        credentials: 'include',
      }),
      // providesTags: ['Tokens'],
    }),
    refreshToken: build.query<object, undefined>({
      query: () => ({
        url: 'auth/refresh',
        // method: 'PATCH',
        credentials: 'include',
      }),
      providesTags: ['Token'],
    }),
  }),
});

export default testAPI;
