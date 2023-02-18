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
  IAdminData,
  IAdmin,
  IAdminWithId,
  IAdminChangeStatus,
} from '../../models';
import baseQuery from './baseQuery';
import { api } from './api.service';

export const adminsAPI = api.injectEndpoints({
  // reducerPath: 'representativesAPI',
  // baseQuery,
  // tagTypes: ['representative'],
  endpoints: (build) => ({
    getAdmins: build.query<IAdminData, IGetPerson>({
      query: (params) => ({
        url: 'admins/get',
        params,
        credentials: 'include',
      }),
      providesTags: ['admin'],
      transformResponse(apiRespons: IRepresentative[], meta): IRepresentativeData {
        return { data: apiRespons, count: Number(meta?.response?.headers.get('X-Total-Count')) };
      },
    }),

    addAdmin: build.mutation<any, IAdmin>({
      query: (body) => ({
        url: 'admins/add',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['admin'],
    }),

    getAdminById: build.query<IAdminWithId, IGetByID>({
      query: (params) => ({
        url: 'admins/getById',
        params,
        credentials: 'include',
      }),
      providesTags: ['admin'],
    }),

    changeAdminStatus: build.mutation<any, IAdminChangeStatus>({
      query: (body) => ({
        url: 'admins/changeStatus',
        method: 'PATCH',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['admin'],
    }),

    updateAdmin: build.mutation<any, IAdminWithId>({
      query: (body) => ({
        url: 'admins/update',
        method: 'PUT',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['admin', 'user'],
    }),
  }),
});
