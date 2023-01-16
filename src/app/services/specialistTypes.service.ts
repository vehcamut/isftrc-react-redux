/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs';
import { createApi } from '@reduxjs/toolkit/query/react';
/* eslint-disable import/prefer-default-export */
import {
  IAdvertisingSource,
  IAdvertisingSourceData,
  IGet,
  IGetAdvertisingSource,
  IGetByID,
  IGetPerson,
  IPatient,
  IPatientChangeStatus,
  IPatientData,
} from '../../models';
import baseQuery from './baseQuery';
import { api } from './api.service';

export const specialistTypesAPI = api.injectEndpoints({
  // reducerPath: 'advertisingSourceAPI',
  // baseQuery,
  // tagTypes: ['advertisingSource'],
  endpoints: (build) => ({
    getSpecialistTypes: build.query<IAdvertisingSourceData, IGetAdvertisingSource>({
      query: (params) => ({
        url: 'specialistType/get',
        params,
        credentials: 'include',
      }),
      providesTags: ['specialistTypes'],
      transformResponse(apiRespons: IAdvertisingSource[], meta): IAdvertisingSourceData {
        return { data: apiRespons, count: Number(meta?.response?.headers.get('X-Total-Count')) };
      },
    }),

    getSpecialistTypesToSelect: build.query<any, IGetAdvertisingSource>({
      query: (params) => ({
        url: 'specialistType/get',
        params,
        credentials: 'include',
      }),
      providesTags: ['specialistTypes'],
      transformResponse(apiResponse: IAdvertisingSource[], meta): any {
        console.log(apiResponse);
        const resp = [];
        for (let i = 0; i < apiResponse.length; i += 1) {
          resp.push({ label: apiResponse[i].name, value: apiResponse[i]._id });
        }
        console.log(resp);
        return resp;
      },
    }),

    addSpecialistTypes: build.mutation<any, IAdvertisingSource>({
      query: (body) => ({
        url: 'specialistType/add',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['specialistTypes'],
    }),
    updateSpecialistTypes: build.mutation<any, IAdvertisingSource>({
      query: (body) => ({
        url: 'specialistType/update',
        method: 'PUT',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['specialistTypes'],
    }),
  }),
});
