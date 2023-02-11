/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs';
import { createApi } from '@reduxjs/toolkit/query/react';
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
  IServiceType,
  IService,
  IGetServiceById,
  IServiceInfo,
  IAddAppointmentToService,
  IToSelect,
  IServiceGroupToSelect,
  IServiceTypeToSelect,
  IGetGroupServiceType,
  ICloseService,
  IOpenService,
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

    getServiseById: build.query<IServiceInfo, IGetServiceById>({
      query: (params) => ({
        url: 'services/getService',
        params,
        credentials: 'include',
      }),
      providesTags: ['serviceGroup', 'serviceType', 'appointments'],
    }),

    getAllInfoService: build.query<IService, IGetServiceById>({
      query: (params) => ({
        url: 'services/getAllInfoService',
        params,
        credentials: 'include',
      }),
      providesTags: ['serviceGroup', 'serviceType', 'appointments'],
    }),

    setAppointmentToService: build.mutation<any, IAddAppointmentToService>({
      query: (body) => ({
        url: 'services/setAppointment',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['serviceGroup', 'serviceType', 'appointments'],
    }),

    getGroups: build.query<IToSelect[], any>({
      query: (params) => ({
        url: 'services/getGroups',
        params,
        credentials: 'include',
      }),
      providesTags: ['serviceGroup', 'serviceType'],
      transformResponse(apiResponse: IServiceGroupToSelect[], meta): any {
        const resp: IToSelect[] = [];
        for (let i = 0; i < apiResponse.length; i += 1) {
          resp.push({ label: apiResponse[i].name, value: apiResponse[i]._id });
        }
        return resp;
      },
    }),

    getTypes: build.query<IToSelect[], IGetGroupServiceType>({
      query: (params) => ({
        url: 'services/getTypes',
        params,
        credentials: 'include',
      }),
      providesTags: ['serviceGroup', 'serviceType'],
      transformResponse(apiResponse: IServiceTypeToSelect[], meta): any {
        const resp: IToSelect[] = [];
        for (let i = 0; i < apiResponse.length; i += 1) {
          resp.push({ label: apiResponse[i].name, value: apiResponse[i]._id });
        }
        return resp;
      },
    }),

    closeService: build.mutation<any, ICloseService>({
      query: (body) => ({
        url: 'services/closeService',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['serviceGroup', 'serviceType', 'appointments'],
    }),

    openService: build.mutation<any, IOpenService>({
      query: (body) => ({
        url: 'services/openService',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['serviceGroup', 'serviceType', 'appointments'],
    }),
  }),
});
