import { createApi } from '@reduxjs/toolkit/query/react';
/* eslint-disable import/prefer-default-export */
// import { IGet, IPatient, IPatientData } from '../../models';
import baseQuery from './baseQuery';

export const dadataAPI = createApi({
  reducerPath: 'dadataAPI',
  baseQuery,
  endpoints: (build) => ({
    getAddress: build.query<{ value: string }[], string>({
      query: (params) => ({
        url: 'address',
        params: { query: params },
        credentials: 'include',
      }),
    }),

    // getAddress: build.mutation<string, string[]>({
    //   query: (query) => ({
    //     url: 'address',
    //     method: 'POST',
    //     credentials: 'include',
    //     body: { query },
    //   }),
    // }),
    // post: build.query<string[], string>({
    //   query: (params) => ({
    //     url: 'address',
    //     params,
    //     credentials: 'include',
    //   }),
    // }),
    // editType: build.mutation<object, ISpecialistType>({
    //   query: (body) => ({
    //     url: 'specialists/types/update',
    //     method: 'POST',
    //     credentials: 'include',
    //     body,
    //   }),
    //   invalidatesTags: (result, error) => {
    //     return error ? [] : [{ type: 'SpecialistTypes' }];
    //   },
    // }),
    // addType: build.mutation<string, ISpecialistType>({
    //   query: (body) => ({
    //     url: 'specialists/types/add',
    //     method: 'POST',
    //     credentials: 'include',
    //     body,
    //   }),
    //   invalidatesTags: ['SpecialistTypes'],
    // }),
    // removeType: build.mutation<string, ISpecialistType>({
    //   query: (body) => ({
    //     url: 'specialists/types/remove',
    //     method: 'DELETE',
    //     credentials: 'include',
    //     body,
    //   }),
    //   invalidatesTags: ['SpecialistTypes'],
    // }),
  }),
});
