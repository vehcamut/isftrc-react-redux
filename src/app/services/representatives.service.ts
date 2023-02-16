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
  IAddPatientToRepresentative,
  IGetRepPatients,
} from '../../models';
import baseQuery from './baseQuery';
import { api } from './api.service';

export const representativesAPI = api.injectEndpoints({
  // reducerPath: 'representativesAPI',
  // baseQuery,
  // tagTypes: ['representative'],
  endpoints: (build) => ({
    getRepresentatives: build.query<IRepresentativeData, IGetPerson>({
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

    addRepresentative: build.mutation<any, IRepresentative>({
      query: (body) => ({
        url: 'representatives/add',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['representative'],
    }),

    getRepresentativeById: build.query<IRepresentative, IGetByID>({
      query: (params) => ({
        url: 'representatives/getById',
        params,
        credentials: 'include',
      }),
      providesTags: ['representative', 'advertisingSource'],
    }),

    changeRepresentativeStatus: build.mutation<any, IPatientChangeStatus>({
      query: (body) => ({
        url: 'representatives/changeStatus',
        method: 'PATCH',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['representative'],
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

    updateRepresentative: build.mutation<any, IRepresentative>({
      query: (body) => ({
        url: 'representatives/update',
        method: 'PUT',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['representative'],
    }),

    getRepresentativePatientsById: build.query<IPatient[], IGetRepPatients>({
      query: (params) => ({
        url: 'representatives/patients',
        params,
        credentials: 'include',
      }),
      providesTags: ['representative', 'advertisingSource', 'patients'],
    }),

    addPatientToRepresentative: build.mutation<any, IAddPatientToRepresentative>({
      query: (body) => ({
        url: 'representatives/addPatient',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['representative', 'patients'],
    }),

    removePatientFromRepresentative: build.mutation<any, IAddPatientToRepresentative>({
      query: (body) => ({
        url: 'representatives/removePatient',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['representative', 'patients'],
    }),
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
