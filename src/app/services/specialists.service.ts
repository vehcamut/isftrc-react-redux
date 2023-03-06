/* eslint-disable import/prefer-default-export */
import {
  IGetSpecificSpecialists,
  ISpecialistChangeStatus,
  IGetByID,
  IGetPerson,
  ISpecialist,
  ISpecialistData,
  ISpecificSpecialistToSelect,
  ISpecialistToSelect,
} from '../../models';
import { api } from './api.service';

export const specialistAPI = api.injectEndpoints({
  endpoints: (build) => ({
    getSpecialists: build.query<ISpecialistData, IGetPerson>({
      query: (params) => ({
        url: 'specialists/get',
        params,
        credentials: 'include',
      }),
      providesTags: ['specialistTypes', 'specialists'],
      transformResponse(apiRespons: ISpecialist[], meta): ISpecialistData {
        return { data: apiRespons, count: Number(meta?.response?.headers.get('X-Total-Count')) };
      },
    }),

    getSpecificSpecialists: build.query<ISpecificSpecialistToSelect[], IGetSpecificSpecialists>({
      query: (params) => ({
        url: 'specialists/getSpecific',
        params,
        credentials: 'include',
      }),
      providesTags: ['specialistTypes', 'specialists'],
      transformResponse(apiResponse: ISpecialistToSelect[]): ISpecificSpecialistToSelect[] {
        const resp = [];
        for (let i = 0; i < apiResponse.length; i += 1) {
          resp.push({ label: apiResponse[i].name, value: apiResponse[i]._id });
        }
        return resp;
      },
    }),

    addSpecialist: build.mutation<any, ISpecialist>({
      query: (body) => ({
        url: 'specialists/add',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['specialists'],
    }),

    getSpecialistById: build.query<ISpecialist, IGetByID>({
      query: (params) => ({
        url: 'specialists/getById',
        params,
        credentials: 'include',
      }),
      providesTags: ['specialistTypes', 'specialists'],
    }),

    updateSpecialist: build.mutation<any, ISpecialist>({
      query: (body) => ({
        url: 'specialists/update',
        method: 'PUT',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['specialists', 'user'],
    }),

    changeSpecialistStatus: build.mutation<any, ISpecialistChangeStatus>({
      query: (body) => ({
        url: 'specialists/changeStatus',
        method: 'PATCH',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['specialists'],
    }),
  }),
});
