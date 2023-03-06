/* eslint-disable import/prefer-default-export */
import {
  IServiceGroup,
  IServiceGroupWithId,
  IGetServiceType,
  IServiceGroupWithIdAndTypes,
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
  IChangeNote,
} from '../../models';
import { api } from './api.service';

export const servicesAPI = api.injectEndpoints({
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
      transformResponse(apiResponse: IServiceGroupWithId[]): any {
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
      providesTags: ['serviceGroup', 'serviceType', 'appointments', 'removeAppointment'],
    }),

    getAllInfoService: build.query<IService, IGetServiceById>({
      query: (params) => ({
        url: 'services/getAllInfoService',
        params,
        credentials: 'include',
      }),
      providesTags: ['serviceGroup', 'serviceType', 'appointments', 'course', 'removeAppointment'],
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
      transformResponse(apiResponse: IServiceGroupToSelect[]): any {
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
      transformResponse(apiResponse: IServiceTypeToSelect[]): any {
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

    changeServNote: build.mutation<any, IChangeNote>({
      query: (body) => ({
        url: 'services/changeNote',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['serviceGroup', 'serviceType', 'appointments'],
    }),
  }),
});
