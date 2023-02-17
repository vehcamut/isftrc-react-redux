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
      // transformResponse(apiRespons: ISpecialist[], meta): ISpecialistData {
      //   return { data: apiRespons, count: Number(meta?.response?.headers.get('X-Total-Count')) };
      // },
    }),
    // getProfile: build.mutation<IUserInfo, any>({
    //   query: () => ({
    //     url: 'user/getProfile',
    //     method: 'POST',
    //     credentials: 'include',
    //   }),
    // }),
    // refreshToken: build.query({
    //   query: () => ({
    //     url: 'auth/refresh',
    //     method: 'PATCH',
    //     credentials: 'include',
    //   }),
    // }),
    // logout: build.mutation<unknown, any>({
    //   query: () => ({
    //     url: 'auth/logout',
    //     method: 'POST',
    //     // body: user,
    //     credentials: 'include',
    //   }),
    // }),
    // test: build.mutation({
    //   query: () => ({
    //     method: 'POST',
    //     url: 'auth/test',
    //     credentials: 'include',
    //   }),
    // }),
  }),
});
