/* eslint-disable import/prefer-default-export */
import { createApi } from '@reduxjs/toolkit/query/react';
import { ISpecialistType, ISpecialistTypeQuery, ISpecialistTypeResponse } from '../../models';
import baseQuery from './baseQuery';

export const specialistsAPI = createApi({
  reducerPath: 'specialistsAPI',
  baseQuery,
  tagTypes: ['SpecialistTypes'],
  endpoints: (build) => ({
    getTypes: build.query<ISpecialistTypeResponse, ISpecialistTypeQuery>({
      query: (user) => ({
        url: 'specialists/types/get',
        params: user,
        credentials: 'include',
      }),
      providesTags: ['SpecialistTypes'],
      transformResponse(apiRespons: ISpecialistType[], meta): ISpecialistTypeResponse {
        return { data: apiRespons, count: Number(meta?.response?.headers.get('X-Total-Count')) };
      },
    }),
    editType: build.mutation<object, ISpecialistType>({
      query: (body) => ({
        url: 'specialists/types/update',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: (result, error) => {
        return error ? [] : [{ type: 'SpecialistTypes' }];
      },
    }),
    addType: build.mutation<string, ISpecialistType>({
      query: (body) => ({
        url: 'specialists/types/add',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['SpecialistTypes'],
    }),
    removeType: build.mutation<string, ISpecialistType>({
      query: (body) => ({
        url: 'specialists/types/remove',
        method: 'DELETE',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['SpecialistTypes'],
    }),
  }),
});
