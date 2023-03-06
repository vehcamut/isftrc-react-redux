/* eslint-disable import/prefer-default-export */
import { IGetAdvance, IPayment, IRemovePayment, IPaymentInfo } from '../../models';
import { api } from './api.service';

export const paymentAPI = api.injectEndpoints({
  endpoints: (build) => ({
    getAdvance: build.query<number, IGetAdvance>({
      query: (params) => ({
        url: 'payments/getAdvance',
        params,
        credentials: 'include',
      }),
      providesTags: ['patients'],
    }),
    addPayment: build.mutation<any, IPayment>({
      query: (body) => ({
        url: 'payments/add',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['patients'],
    }),
    removePayment: build.mutation<any, IRemovePayment>({
      query: (body) => ({
        url: 'payments/remove',
        method: 'DELETE',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['patients'],
    }),
    getPaymentById: build.query<IPaymentInfo, IRemovePayment>({
      query: (params) => ({
        url: 'payments/getById',
        params,
        credentials: 'include',
      }),
      providesTags: ['patients'],
    }),
  }),
});
