/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs';
import { createApi } from '@reduxjs/toolkit/query/react';
import { IServiceType } from '../../models/IService';
/* eslint-disable import/prefer-default-export */
import {
  IServiceGroup,
  IServiceGroupWithId,
  IGetServiceType,
  IServiceGroupWithIdAndTypes,
  IAdvertisingSource,
  IAdvertisingSourceData,
  IGet,
  IGetAdvertisingSource,
  IGetByID,
  IGetPerson,
  IPatient,
  IPatientChangeStatus,
  IPatientData,
  IServiceTypeWithId,
} from '../../models';
import baseQuery from './baseQuery';
import { api } from './api.service';

export const servicesAPI = api.injectEndpoints({
  // reducerPath: 'advertisingSourceAPI',
  // baseQuery,
  // tagTypes: ['advertisingSource'],
  endpoints: (build) => ({
    getGroupsWithTypes: build.query<IServiceGroupWithIdAndTypes[], IGetServiceType>({
      query: (params) => ({
        url: 'services/getGroupsWithTypes',
        params,
        credentials: 'include',
      }),
      providesTags: ['serviceGroup', 'serviceType'],
    }),
    getGroupstoSelect: build.query({
      query: (params) => ({
        url: 'services/getGroups',
        params,
        credentials: 'include',
      }),
      providesTags: ['serviceGroup', 'serviceType'],
      transformResponse(apiResponse: IServiceGroupWithId[], meta): any {
        const resp = [];
        for (let i = 0; i < apiResponse.length; i += 1) {
          resp.push({ label: apiResponse[i].name, value: apiResponse[i]._id });
        }
        return resp;
      },
    }),

    addServiceGroup: build.mutation<any, IServiceGroup>({
      query: (body) => ({
        url: 'services/addGroup',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['serviceGroup', 'serviceType'],
    }),
    updateServiceGroup: build.mutation<any, IServiceGroupWithId>({
      query: (body) => ({
        url: 'services/updateGroup',
        method: 'PUT',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['serviceGroup', 'serviceType'],
    }),

    addServiceType: build.mutation<any, IServiceType>({
      query: (body) => ({
        url: 'services/addType',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['serviceGroup', 'serviceType'],
    }),
    updateServiceType: build.mutation<any, IServiceTypeWithId>({
      query: (body) => ({
        url: 'services/updateType',
        method: 'PUT',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['serviceGroup', 'serviceType'],
    }),
  }),
});
