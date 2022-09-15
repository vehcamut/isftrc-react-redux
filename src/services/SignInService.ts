import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { IResponse } from '../models/IResonse';
import { IUser } from '../models/IUser';

const singinAPI = createApi({
  reducerPath: 'singinAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3333/auth',
  }),
  endpoints: (build) => ({
    signin: build.mutation<unknown, IUser>({
      query: (user) => ({
        url: '/local/signin',
        method: 'POST',
        body: user,
        credentials: 'include',
      }),
    }),
  }),
});

export default singinAPI;
