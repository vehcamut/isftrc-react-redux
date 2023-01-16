/* eslint-disable import/prefer-default-export */
// Or from '@reduxjs/toolkit/query' if not using the auto-generated hooks
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';

// initialize an empty api service that we'll inject endpoints into later as needed
export const api = createApi({
  baseQuery,
  tagTypes: ['advertisingSource', 'representative', 'patients', 'specialistTypes'],
  endpoints: () => ({}),
});
