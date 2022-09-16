import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { IResponse } from '../models/IResonse';
import { ISpecialistType, ISpecialistTypeQuery } from '../models';

const specialistsAPI = createApi({
  reducerPath: 'specialistsAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3333/specialists',
  }),
  endpoints: (build) => ({
    getTypes: build.query<ISpecialistType[], ISpecialistTypeQuery>({
      query: (user) => ({
        url: '/types/get',
        params: user,
        credentials: 'include',
      }),
    }),
  }),
});

export default specialistsAPI;
