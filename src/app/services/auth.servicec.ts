// import { ThunkAction } from '@reduxjs/toolkit';
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { IResponse } from '../models/IResonse';
// import { ThunkAction } from '@reduxjs/toolkit';
// import { ThunkAction } from '@reduxjs/toolkit';
import { IUser } from '../../models/IUser';
// import { useAppSelector } from '../hooks';
import backendAPI from './main.service';
// import specTypesAPI from './specTypes.service';

const authApiWithTag = backendAPI.enhanceEndpoints({ addTagTypes: ['Tokens'] });
const authApi = authApiWithTag.injectEndpoints({
  endpoints: (build) => ({
    signin: build.mutation<unknown, IUser>({
      query: (user) => ({
        url: 'auth/local/signin',
        method: 'POST',
        body: user,
        credentials: 'include',
      }),
      // providesTags: ['Tokens'],
    }),
    refreshToken: build.query(
      /* <any, any> */ {
        query: () => ({
          url: 'auth/refresh',
          method: 'PATCH',
          credentials: 'include',
        }),
        providesTags: ['Tokens'],
        async onQueryStarted(arg, { dispatch, getState, queryFulfilled, getCacheEntry }) {
          // console.log('ASDASDAS');
          await queryFulfilled;

          if (getCacheEntry().isSuccess) {
            const state = <Record<any, any>>getState();
            console.log(state);
            // const {
            //   app: { rejectedAction = {} },
            // } = state;
            // const { endpointName, originalArgs } = rejectedAction;
            // console.log({ rejectedAction });
            // const queryTrigger = <ThunkAction<any, any, any, any>>(
            //   specTypesAPI.endpoints.getSpecTypes.initiate({ page: 0, limit: 0 })
            // );
            // await dispatch(specTypesAPI.endpoints.getSpecTypes.initiate({ page: 0, limit: 2 }));
            await dispatch(backendAPI.util.invalidateTags(['SpecialistTypes']));
            // setTimeout(async () => {
            //   dispatch(backendAPI.util.invalidateTags(['SpecialistTypes']));
            // }, 3000);
          }
        },
      },
    ),
  }),
  overrideExisting: false,
});

// const authAPI = createApi({
//   reducerPath: 'authAPI',
//   baseQuery: fetchBaseQuery({
//     baseUrl: 'http://localhost:3333/auth',
//   }),
//   tagTypes: ['Tokens'],
// });

export default authApi;
