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
} from '../../models';
import baseQuery from './baseQuery';
import { api } from './api.service';

export const appointmentsAPI = api.injectEndpoints({
  // reducerPath: 'representativesAPI',
  // baseQuery,
  // tagTypes: ['representative'],
  endpoints: (build) => ({
    getAppointments: build.query<IAppointmentWeek[], IGetAppointment>({
      query: (params) => ({
        url: 'appointments/get',
        params,
        credentials: 'include',
      }),
      providesTags: ['appointments'],
      transformResponse(apiResponse: IAppointment[], meta): IAppointmentWeek[] {
        const week: IAppointmentWeek[] = [
          {
            monday: [],
            tuesday: [],
            wensday: [],
            thursday: [],
            friday: [],
            saturday: [],
            sunday: [],
          },
        ];
        apiResponse.forEach((appointment) => {
          const date = new Date(appointment.begDate);
          switch (date.getDay()) {
            case 1:
              week[0].monday.push(appointment);
              break;
            case 2:
              week[0].tuesday.push(appointment);
              break;
            case 3:
              week[0].wensday.push(appointment);
              break;
            case 4:
              week[0].thursday.push(appointment);
              break;
            case 5:
              week[0].friday.push(appointment);
              break;
            case 6:
              week[0].saturday.push(appointment);
              break;
            case 0:
              week[0].sunday.push(appointment);
              break;
            default:
              break;
          }
        });

        return week;
      },
    }),

    // addRepresentative: build.mutation<any, IRepresentative>({
    //   query: (body) => ({
    //     url: 'representatives/add',
    //     method: 'POST',
    //     credentials: 'include',
    //     body,
    //   }),
    //   invalidatesTags: ['representative'],
    // }),

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
