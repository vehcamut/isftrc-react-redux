/* eslint-disable import/prefer-default-export */
import {
  IRepresentativeData,
  IRepresentative,
  IGetByID,
  IGetPatient,
  IGetPatientRepresentatives,
  IPatient,
  IPatientChangeStatus,
  IPatientData,
  IGetCourses,
  IPatientCourse,
  IAddService,
  IRemoveService,
  IPatientCourses,
} from '../../models';
import { api } from './api.service';

export const patientsAPI = api.injectEndpoints({
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
    getPatientCourses: build.query<IPatientCourses, IGetCourses>({
      query: (params) => ({
        url: 'patients/getCourses',
        params,
        credentials: 'include',
      }),
      providesTags: ['patients', 'representative', 'serviceGroup', 'serviceType', 'course'],
    }),
    openCourse: build.mutation<any, IPatientCourse>({
      query: (body) => ({
        url: 'patients/openCourse',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['patients', 'course'],
    }),
    newCourse: build.mutation<any, IPatientCourse>({
      query: (body) => ({
        url: 'patients/newCourse',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['patients', 'course'],
    }),
    closeCourse: build.mutation<any, IPatientCourse>({
      query: (body) => ({
        url: 'patients/closeCourse',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['patients', 'course'],
    }),
    addService: build.mutation<any, IAddService>({
      query: (body) => ({
        url: 'patients/addService',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['patients', 'course'],
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
  }),
});
