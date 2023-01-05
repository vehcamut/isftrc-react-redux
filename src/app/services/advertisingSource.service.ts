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

export const advertisingSourceAPI = createApi({
  reducerPath: 'advertisingSourceAPI',
  baseQuery,
  tagTypes: ['advertisingSource'],
  endpoints: (build) => ({
    get: build.query<IAdvertisingSourceData, IGetAdvertisingSource>({
      query: (params) => ({
        url: 'advertisingSource/get',
        params,
        credentials: 'include',
      }),
      providesTags: ['advertisingSource'],
      transformResponse(apiRespons: IAdvertisingSource[], meta): IAdvertisingSourceData {
        return { data: apiRespons, count: Number(meta?.response?.headers.get('X-Total-Count')) };
      },
    }),

    getToSelect: build.query<any, IGetAdvertisingSource>({
      query: (params) => ({
        url: 'advertisingSource/get',
        params,
        credentials: 'include',
      }),
      providesTags: ['advertisingSource'],
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

    add: build.mutation<any, IAdvertisingSource>({
      query: (body) => ({
        url: 'advertisingSource/add',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['advertisingSource'],
    }),
    update: build.mutation<any, IAdvertisingSource>({
      query: (body) => ({
        url: 'advertisingSource/update',
        method: 'PUT',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['advertisingSource'],
    }),
  }),
});
