/* eslint-disable import/prefer-default-export */
import { IUserInfo } from '../../models/IUser';
import { api } from './api.service';

export const userAPI = api.injectEndpoints({
  endpoints: (build) => ({
    getProfile: build.query<IUserInfo, any>({
      query: () => ({
        url: 'users/getProfile',
        credentials: 'include',
      }),
      providesTags: ['user'],
    }),
  }),
});
