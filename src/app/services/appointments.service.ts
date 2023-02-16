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
  IAppointment,
  IGetAppointment,
  IAppointmentWeek,
  IAddAppointmentResult,
  IAddAppointment,
  IRemoveAppointment,
  IGetFreeAppointmetns,
  IGetForPatientAppointment,
  IGetAppointmentById,
} from '../../models';
import baseQuery from './baseQuery';
import { api } from './api.service';

export const appointmentsAPI = api.injectEndpoints({
  // reducerPath: 'representativesAPI',
  // baseQuery,
  // tagTypes: ['representative'],
  endpoints: (build) => ({
    getAppointments: build.query<IAppointment[][], IGetAppointment>({
      query: (params) => ({
        url: 'appointments/get',
        params,
        credentials: 'include',
      }),
      providesTags: ['appointments', 'specialists'],
      transformResponse(apiResponse: IAppointment[], meta): IAppointment[][] {
        console.log(apiResponse);
        const week: IAppointment[][] = [[], [], [], [], [], [], []];
        apiResponse.forEach((appointment) => {
          const date = new Date(appointment.begDate);
          switch (date.getDay()) {
            case 0:
              week[6].push(appointment);
              break;
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
              week[date.getDay() - 1].push(appointment);
              break;
            default:
              break;
          }
        });

        return week;
      },
    }),
    getForPatientAppointments: build.query<IAppointment[][], IGetForPatientAppointment>({
      query: (params) => ({
        url: 'appointments/getForPatient',
        params,
        credentials: 'include',
      }),
      providesTags: ['appointments', 'specialists'],
      transformResponse(apiResponse: IAppointment[], meta): IAppointment[][] {
        // console.log(apiResponse);
        const week: IAppointment[][] = [[], [], [], [], [], [], []];
        apiResponse.forEach((appointment) => {
          const date = new Date(appointment.begDate);
          switch (date.getDay()) {
            case 0:
              week[6].push(appointment);
              break;
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
              week[date.getDay() - 1].push(appointment);
              break;
            default:
              break;
          }
        });

        return week;
      },
    }),
    getForRecord: build.query<IAppointment[][], IGetFreeAppointmetns>({
      query: (params) => ({
        url: 'appointments/getForRecord',
        params,
        credentials: 'include',
      }),
      providesTags: ['appointments', 'specialists'],
      transformResponse(apiResponse: IAppointment[], meta): IAppointment[][] {
        console.log(apiResponse);
        const week: IAppointment[][] = [[], [], [], [], [], [], []];
        apiResponse.forEach((appointment) => {
          const date = new Date(appointment.begDate);
          switch (date.getDay()) {
            case 0:
              week[6].push(appointment);
              break;
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
              week[date.getDay() - 1].push(appointment);
              break;
            default:
              break;
          }
        });

        return week;
      },
    }),
    getAppointmentsOnCurrentDate: build.query<IAppointment[], IGetAppointment>({
      query: (params) => ({
        url: 'appointments/get',
        params,
        credentials: 'include',
      }),
      providesTags: ['appointments', 'specialists'],
    }),
    addAppointments: build.mutation<IAddAppointmentResult, IAddAppointment>({
      query: (body) => ({
        url: 'appointments/add',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['appointments'],
    }),
    removeAppointments: build.mutation<any, IRemoveAppointment>({
      query: (body) => ({
        url: 'appointments/remove',
        method: 'DELETE',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['appointments'],
    }),
    getAppointmentById: build.query<IAppointment, IGetAppointmentById>({
      query: (params) => ({
        url: 'appointments/getById',
        params,
        credentials: 'include',
      }),
      providesTags: ['appointments', 'specialists'],
    }),

    // getRepresentativeById: build.query<IRepresentative, IGetByID>({
    //   query: (params) => ({
    //     url: 'representatives/getById',
    //     params,
    //     credentials: 'include',
    //   }),
    //   providesTags: ['representative', 'advertisingSource'],
    // }),
    // //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // //   // transformResponse(apiResponse: any, meta): IPatient {
    // //   //   const x = dayjs(apiResponse.dateOfBirth);
    // //   //   return { ...apiResponse, dateOfBirth: x };
    // //   // },
    // //   // onCacheEntryAdded(arg: any, api: any) {
    // //   //   console.log('API', arg, api.getCacheEntry());
    // //   // },
    // //   // transformResponse(apiRespons: IPatient[], meta): IPatientData {
    // //   //   return { data: apiRespons, count: Number(meta?.response?.headers.get('X-Total-Count')) };
    // //   // },
    // // }),

    // updateRepresentative: build.mutation<any, IRepresentative>({
    //   query: (body) => ({
    //     url: 'representatives/update',
    //     method: 'PUT',
    //     credentials: 'include',
    //     body,
    //   }),
    //   invalidatesTags: ['representative'],
    // }),

    // getRepresentativePatientsById: build.query<IPatient[], IGetRepPatients>({
    //   query: (params) => ({
    //     url: 'representatives/patients',
    //     params,
    //     credentials: 'include',
    //   }),
    //   providesTags: ['representative', 'advertisingSource', 'patients'],
    // }),

    // addPatientToRepresentative: build.mutation<any, IAddPatientToRepresentative>({
    //   query: (body) => ({
    //     url: 'representatives/addPatient',
    //     method: 'POST',
    //     credentials: 'include',
    //     body,
    //   }),
    //   invalidatesTags: ['representative', 'patients'],
    // }),

    // removePatientFromRepresentative: build.mutation<any, IAddPatientToRepresentative>({
    //   query: (body) => ({
    //     url: 'representatives/removePatient',
    //     method: 'POST',
    //     credentials: 'include',
    //     body,
    //   }),
    //   invalidatesTags: ['representative', 'patients'],
    // }),
    // // changeStatus: build.mutation<any, IPatientChangeStatus>({
    // //   query: (body) => ({
    // //     url: 'patients/changeStatus',
    // //     method: 'PATCH',
    // //     credentials: 'include',
    // //     body,
    // //   }),
    // //   invalidatesTags: ['patients'],
    // // }),
    // // editType: build.mutation<object, ISpecialistType>({
    // //   query: (body) => ({
    // //     url: 'specialists/types/update',
    // //     method: 'POST',
    // //     credentials: 'include',
    // //     body,
    // //   }),
    // //   invalidatesTags: (result, error) => {
    // //     return error ? [] : [{ type: 'SpecialistTypes' }];
    // //   },
    // // }),
    // // addType: build.mutation<string, ISpecialistType>({
    // //   query: (body) => ({
    // //     url: 'specialists/types/add',
    // //     method: 'POST',
    // //     credentials: 'include',
    // //     body,
    // //   }),
    // //   invalidatesTags: ['SpecialistTypes'],
    // // }),
    // // removeType: build.mutation<string, ISpecialistType>({
    // //   query: (body) => ({
    // //     url: 'specialists/types/remove',
    // //     method: 'DELETE',
    // //     credentials: 'include',
    // //     body,
    // //   }),
    // //   invalidatesTags: ['SpecialistTypes'],
    // // }),
  }),
});
