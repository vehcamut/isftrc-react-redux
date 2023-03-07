/* eslint-disable import/prefer-default-export */
import { IAdvertisingSource, IAdvertisingSourceData, IGetAdvertisingSource } from '../../models';
import { api } from './api.service';

export const specialistTypesAPI = api.injectEndpoints({
  endpoints: (build) => ({
    getSpecialistTypes: build.query<IAdvertisingSourceData, IGetAdvertisingSource>({
      query: (params) => ({
        url: 'specialistType/get',
        params,
        credentials: 'include',
      }),
      providesTags: ['specialistTypes'],
      transformResponse(apiRespons: IAdvertisingSource[], meta): IAdvertisingSourceData {
        return { data: apiRespons, count: Number(meta?.response?.headers.get('X-Total-Count')) };
      },
    }),

    getSpecialistTypesToSelect: build.query<any, IGetAdvertisingSource>({
      query: (params) => ({
        url: 'specialistType/get',
        params,
        credentials: 'include',
      }),
      providesTags: ['specialistTypes'],
      transformResponse(apiResponse: IAdvertisingSource[]): any {
        const resp = [];
        for (let i = 0; i < apiResponse.length; i += 1) {
          resp.push({ label: apiResponse[i].name, value: apiResponse[i]._id });
        }
        return resp;
      },
    }),

    addSpecialistTypes: build.mutation<any, IAdvertisingSource>({
      query: (body) => ({
        url: 'specialistType/add',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['specialistTypes', 'serviceType'],
    }),
    updateSpecialistTypes: build.mutation<any, IAdvertisingSource>({
      query: (body) => ({
        url: 'specialistType/update',
        method: 'PUT',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['specialistTypes', 'serviceType'],
    }),
  }),
});
