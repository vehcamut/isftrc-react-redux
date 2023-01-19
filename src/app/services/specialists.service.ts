/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs';
import { createApi } from '@reduxjs/toolkit/query/react';
import { ISpecialistChangeStatus } from '../../models/ISpecialist';
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
  ISpecialist,
  ISpecialistData,
} from '../../models';
import baseQuery from './baseQuery';
import { api } from './api.service';

export const specialistAPI = api.injectEndpoints({
  // reducerPath: 'representativesAPI',
  // baseQuery,
  // tagTypes: ['representative'],
  endpoints: (build) => ({
    getSpecialists: build.query<ISpecialistData, IGetPerson>({
      query: (params) => ({
        url: 'specialists/get',
        params,
        credentials: 'include',
      }),
      providesTags: ['specialistTypes', 'specialists'],
      transformResponse(apiRespons: ISpecialist[], meta): ISpecialistData {
        return { data: apiRespons, count: Number(meta?.response?.headers.get('X-Total-Count')) };
      },
    }),

    addSpecialist: build.mutation<any, ISpecialist>({
      query: (body) => ({
        url: 'specialists/add',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['specialists'],
    }),

    getSpecialistById: build.query<ISpecialist, IGetByID>({
      query: (params) => ({
        url: 'specialists/getById',
        params,
        credentials: 'include',
      }),
      providesTags: ['specialistTypes', 'specialists'],
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

    updateSpecialist: build.mutation<any, ISpecialist>({
      query: (body) => ({
        url: 'specialists/update',
        method: 'PUT',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['specialists'],
    }),

    changeSpecialistStatus: build.mutation<any, ISpecialistChangeStatus>({
      query: (body) => ({
        url: 'specialists/changeStatus',
        method: 'PATCH',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['specialists'],
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
