/* eslint-disable import/prefer-default-export */
import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';

export const api = createApi({
  baseQuery,
  tagTypes: [
    'advertisingSource',
    'representative',
    'patients',
    'specialistTypes',
    'specialists',
    'removeAppointment',
    'appointments',
    'serviceGroup',
    'serviceType',
    'user',
    'course',
    'admin',
  ],
  endpoints: () => ({}),
});
