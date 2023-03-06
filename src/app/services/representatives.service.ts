/* eslint-disable import/prefer-default-export */
import {
  IRepresentative,
  IGetByID,
  IGetPerson,
  IPatient,
  IPatientChangeStatus,
  IPatientData,
  IRepresentativeData,
  IAddPatientToRepresentative,
  IGetRepPatients,
} from '../../models';
import { api } from './api.service';

export const representativesAPI = api.injectEndpoints({
  endpoints: (build) => ({
    getRepresentatives: build.query<IRepresentativeData, IGetPerson>({
      query: (params) => ({
        url: 'representatives/get',
        params,
        credentials: 'include',
      }),
      providesTags: ['representative'],
      transformResponse(apiRespons: IRepresentative[], meta): IRepresentativeData {
        return { data: apiRespons, count: Number(meta?.response?.headers.get('X-Total-Count')) };
      },
    }),

    addRepresentative: build.mutation<any, IRepresentative>({
      query: (body) => ({
        url: 'representatives/add',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['representative'],
    }),

    getRepresentativeById: build.query<IRepresentative, IGetByID>({
      query: (params) => ({
        url: 'representatives/getById',
        params,
        credentials: 'include',
      }),
      providesTags: ['representative', 'advertisingSource'],
    }),

    changeRepresentativeStatus: build.mutation<any, IPatientChangeStatus>({
      query: (body) => ({
        url: 'representatives/changeStatus',
        method: 'PATCH',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['representative'],
    }),

    updateRepresentative: build.mutation<any, IRepresentative>({
      query: (body) => ({
        url: 'representatives/update',
        method: 'PUT',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['representative', 'user'],
    }),

    getRepresentativePatientsById: build.query<IPatientData, IGetRepPatients>({
      query: (params) => ({
        url: 'representatives/patients',
        params,
        credentials: 'include',
      }),
      providesTags: ['representative', 'advertisingSource', 'patients'],
      transformResponse(apiResponse: IPatient[], meta): IPatientData {
        return { data: apiResponse, count: Number(meta?.response?.headers.get('X-Total-Count')) };
      },
    }),

    addPatientToRepresentative: build.mutation<any, IAddPatientToRepresentative>({
      query: (body) => ({
        url: 'representatives/addPatient',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['representative', 'patients'],
    }),

    removePatientFromRepresentative: build.mutation<any, IAddPatientToRepresentative>({
      query: (body) => ({
        url: 'representatives/removePatient',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['representative', 'patients'],
    }),
  }),
});
