import { createApi } from '@reduxjs/toolkit/query/react';
/* eslint-disable import/prefer-default-export */
import { IGet, IGetByID, IPatient, IPatientData } from '../../models';
import baseQuery from './baseQuery';

export const patientsAPI = createApi({
  reducerPath: 'patientsAPI',
  baseQuery,
  tagTypes: ['patients'],
  endpoints: (build) => ({
    get: build.query<IPatientData, IGet>({
      query: (params) => ({
        url: 'patients/get',
        params,
        credentials: 'include',
      }),
      providesTags: ['patients'],
      transformResponse(apiRespons: IPatient[], meta): IPatientData {
        return { data: apiRespons, count: Number(meta?.response?.headers.get('X-Total-Count')) };
      },
    }),
    getById: build.query<IPatient, IGetByID>({
      query: (params) => ({
        url: 'patients/getById',
        params,
        credentials: 'include',
      }),
      providesTags: ['patients'],
      // transformResponse(apiRespons: IPatient[], meta): IPatientData {
      //   return { data: apiRespons, count: Number(meta?.response?.headers.get('X-Total-Count')) };
      // },
    }),
    add: build.mutation<any, IPatient>({
      query: (body) => ({
        url: 'patients/add',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['patients'],
    }),
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
