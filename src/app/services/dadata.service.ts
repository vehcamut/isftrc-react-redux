/* eslint-disable import/prefer-default-export */
import { api } from './api.service';

export const dadataAPI = api.injectEndpoints({
  endpoints: (build) => ({
    getAddress: build.query<{ value: string }[], string>({
      query: (params) => ({
        url: 'address',
        params: { query: params },
        credentials: 'include',
      }),
    }),
  }),
});
