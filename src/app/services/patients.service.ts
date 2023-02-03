/* eslint-disable @typescript-eslint/no-unused-vars */
import dayjs from 'dayjs';
import { createApi } from '@reduxjs/toolkit/query/react';
/* eslint-disable import/prefer-default-export */
import {
  IRepresentativeData,
  IRepresentative,
  IGet,
  IGetByID,
  IGetPatient,
  IGetPatientRepresentatives,
  IGetPerson,
  IPatient,
  IPatientChangeStatus,
  IPatientData,
  IGetCourses,
  ICourseWithServices,
  IPatientCourse,
  IAddService,
  IRemoveService,
} from '../../models';
import baseQuery from './baseQuery';
import { api } from './api.service';

export const patientsAPI = api.injectEndpoints({
  // reducerPath: 'patientsAPI',
  // baseQuery,
  // tagTypes: ['patients'],
  endpoints: (build) => ({
    getPatients: build.query<IPatientData, IGetPatient>({
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
    getPatientById: build.query<IPatient, IGetByID>({
      query: (params) => ({
        url: 'patients/getById',
        params,
        credentials: 'include',
      }),
      providesTags: ['patients'],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      // transformResponse(apiResponse: any, meta): IPatient {
      //   const x = dayjs(apiResponse.dateOfBirth);
      //   return { ...apiResponse, dateOfBirth: x };
      // },
      // onCacheEntryAdded(arg: any, api: any) {
      //   console.log('API', arg, api.getCacheEntry());
      // },
      // transformResponse(apiRespons: IPatient[], meta): IPatientData {
      //   return { data: apiRespons, count: Number(meta?.response?.headers.get('X-Total-Count')) };
      // },
    }),
    getPatientRepresentatives: build.query<IRepresentativeData, IGetPatientRepresentatives>({
      query: (params) => ({
        url: 'patients/getPatientRepresentatives',
        params,
        credentials: 'include',
      }),
      providesTags: ['patients', 'representative'],
      transformResponse(apiRespons: IRepresentative[], meta): IRepresentativeData {
        return { data: apiRespons, count: Number(meta?.response?.headers.get('X-Total-Count')) };
      },
    }),
    addPatient: build.mutation<any, IPatient>({
      query: (body) => ({
        url: 'patients/add',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['patients'],
    }),
    updatePatient: build.mutation<any, IPatient>({
      query: (body) => ({
        url: 'patients/update',
        method: 'PUT',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['patients'],
    }),
    changePatientStatus: build.mutation<any, IPatientChangeStatus>({
      query: (body) => ({
        url: 'patients/changeStatus',
        method: 'PATCH',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['patients'],
    }),
    getPatientCourses: build.query<ICourseWithServices[], IGetCourses>({
      query: (params) => ({
        url: 'patients/getCourses',
        params,
        credentials: 'include',
      }),
      providesTags: ['patients', 'representative', 'serviceGroup', 'serviceType'],
      // transformResponse(apiRespons: IRepresentative[], meta): IRepresentativeData {
      //   return { data: apiRespons, count: Number(meta?.response?.headers.get('X-Total-Count')) };
      // },
    }),
    openCourse: build.mutation<any, IPatientCourse>({
      query: (body) => ({
        url: 'patients/openCourse',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['patients'],
    }),
    addService: build.mutation<any, IAddService>({
      query: (body) => ({
        url: 'patients/addService',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['patients'],
    }),
    removeService: build.mutation<any, IRemoveService>({
      query: (body) => ({
        url: 'patients/removeService',
        method: 'DELETE',
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
