// import { ThunkAction } from '@reduxjs/toolkit';
import { BaseQueryApi } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { authSlice } from '../reducers/auth.slise';
// import { useNavigate } from 'react-router-dom';
// import { NavigateFunction } from 'react-router-dom';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3333',
  credentials: 'include',
});
// BaseQueryExtraOptions

const baseQueryWithReauth = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401) {
    console.log('sending refresh token');
    console.log(api, extraOptions, { ...api, type: 'mutation' });
    const refreshResult = await baseQuery({ url: '/auth/refresh', method: 'PATCH' }, api, extraOptions);
    console.log(refreshResult);
    if (refreshResult.error?.status === 403) {
      // brows
      document.cookie = '';
      console.log(document.cookie);
      api.dispatch(authSlice.actions.setIsAuth(false));
      // cookies.remove("user");

      // browserHistory.push('/');
      // NavigateFunction()      // const n = useNavigate();
      // n('/');
      // return;
    }
    result = await baseQuery(args, api, extraOptions);
    // if (refreshResult?.data) {
    //   const user = api.getState().auth.user
    //   result = await baseQuery(args, api, extraOptions);
    // }
  }
  return result;
};

const backendAPI = createApi({
  reducerPath: 'backendAPI',
  tagTypes: ['SpecialistTypes'],
  baseQuery: baseQueryWithReauth,
  // fetchBaseQuery({
  //   baseUrl: 'http://localhost:3333/',
  // }),
  endpoints: () => ({}),
});

export default backendAPI;
