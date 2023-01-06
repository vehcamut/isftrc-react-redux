/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs';
import { createApi } from '@reduxjs/toolkit/query/react';
/* eslint-disable import/prefer-default-export */
import {
  IRepresentative,
  IGet,
  IGetByID,
  IGetPerson,
  IPatient,
  IPatientChangeStatus,
  IPatientData,
  IRepresentativeData,
} from '../../models';
import baseQuery from './baseQuery';

export const representativesAPI = createApi({
  reducerPath: 'representativesAPI',
  baseQuery,
  tagTypes: ['representative'],
  endpoints: (build) => ({
    get: build.query<IRepresentativeData, IGetPerson>({
      query: (params) => ({
        url: 'representatives/get',
        params,
        credentials: 'include',
      }),
      providesTags: ['representative'],
      transformResponse(apiRespons: IRepresentative[], meta): IRepresentativeData {
        return { data: apiRespons, count: Number(meta?.response?.headers.get('X-Total-Count')) };
      },
    }),

    add: build.mutation<any, IRepresentative>({
      query: (body) => ({
        url: 'representatives/add',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['representative'],
    }),

    getById: build.query<IRepresentative, IGetByID>({
      query: (params) => ({
        url: 'representatives/getById',
        params,
        credentials: 'include',
      }),
      providesTags: ['representative'],
    }),
    //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //   // transformResponse(apiResponse: any, meta): IPatient {
    //   //   const x = dayjs(apiResponse.dateOfBirth);
    //   //   return { ...apiResponse, dateOfBirth: x };
    //   // },
    //   // onCacheEntryAdded(arg: any, api: any) {
    //   //   console.log('API', arg, api.getCacheEntry());
    //   // },
    //   // transformResponse(apiRespons: IPatient[], meta): IPatientData {
    //   //   return { data: apiRespons, count: Number(meta?.response?.headers.get('X-Total-Count')) };
    //   // },
    // }),

    // update: build.mutation<any, IPatient>({
    //   query: (body) => ({
    //     url: 'patients/update',
    //     method: 'PUT',
    //     credentials: 'include',
    //     body,
    //   }),
    //   invalidatesTags: ['patients'],
    // }),
    // changeStatus: build.mutation<any, IPatientChangeStatus>({
    //   query: (body) => ({
    //     url: 'patients/changeStatus',
    //     method: 'PATCH',
    //     credentials: 'include',
    //     body,
    //   }),
    //   invalidatesTags: ['patients'],
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
