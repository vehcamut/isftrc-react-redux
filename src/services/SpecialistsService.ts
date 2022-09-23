import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { IResponse } from '../models/IResonse';
import { ISpecialistType, ISpecialistTypeQuery, ISpecialistTypeResponse } from '../models';

const specialistsAPI = createApi({
  reducerPath: 'specialistsAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3333/specialists',
  }),
  tagTypes: ['SpecialistTypes'],
  endpoints: (build) => ({
    getTypes: build.query<ISpecialistTypeResponse, ISpecialistTypeQuery>({
      query: (user) => ({
        url: '/types/get',
        params: user,
        credentials: 'include',
        // responseHandler: (response) => {
        //   const count = Number(response.headers.get('X-Total-Count'));
        //   return { data: response.json(), count } as ISpecialistTypeResponse;
        // },
      }),
      providesTags: ['SpecialistTypes'],
      transformResponse(apiRespons: ISpecialistType[], meta): ISpecialistTypeResponse {
        // meta?.response?.headers.forEach((h) => console.log(h));
        // console.log(apiRespons);
        // console.log();
        // console.log(meta?.response?.headers?.get('X-Total-Count'));
        return { data: apiRespons, count: Number(meta?.response?.headers.get('X-Total-Count')) };
        // return { apiResponse, totalCount: Number(meta.response.headers.get('X-Total-Count')) };
      },
    }),
    edit: build.mutation<string, ISpecialistType>({
      query: (body) => ({
        url: '/types/update',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['SpecialistTypes'],
    }),
  }),
});

export default specialistsAPI;
