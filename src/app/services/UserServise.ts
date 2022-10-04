// import { build } from "@reduxjs/toolkit/dist/query/core/buildMiddleware/cacheLifecycle";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const userAPI = createApi({
  reducerPath: 'userAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/',
  }),
  tagTypes: ['Tokens'],
  endpoints: (build) => ({
    fetchAllUsers: build.query({
      query: () => ({
        url: '/users',
      }),
      providesTags: ['Tokens'],
    }),
  }),
});

export default userAPI;
