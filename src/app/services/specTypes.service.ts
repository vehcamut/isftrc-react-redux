import { ISpecialistType, ISpecialistTypeQuery, ISpecialistTypeResponse } from '../../models';
import backendAPI from './main.service';

const specTypesAPI = backendAPI.injectEndpoints({
  endpoints: (build) => ({
    getSpecTypes: build.query<ISpecialistTypeResponse, ISpecialistTypeQuery>({
      query: (user) => ({
        url: 'specialists/types/get',
        params: user,
        credentials: 'include',
        responseHandler: async (response) => {
          // const res = await response.json();
          // if (res.message === 'jwt expired') console.log(res);
          // console.log(.then((e) => console.log(e)));
          // const count = Number(response.headers.get('X-Total-Count'));
          // return { data: response.json(), count } as ISpecialistTypeResponse;
          return response.json();
        },
      }),
      providesTags: ['SpecialistTypes'],
      transformResponse(apiRespons: ISpecialistType[], meta): ISpecialistTypeResponse {
        // meta?.response?.headers.forEach((h) => console.log(h));
        // console.log(apiRespons);
        // console.log();
        // console.log(meta?.response?.headers?.get('X-Total-Count'));
        return { data: apiRespons, count: Number(meta?.response?.headers.get('X-Total-Count')) };
        // return { apiResponse, totalCount: Number(meta.response.headers.get('X-Total-Count')) };
      },
    }),
    editSpecType: build.mutation<object, ISpecialistType>({
      query: (body) => ({
        url: 'specialists/types/update',
        method: 'POST',
        credentials: 'include',
        body,
        // responseHandler: (response) => {
        //   // const count = Number(response.headers.get('X-Total-Count'));
        //   return response.json().then(
        //     (e) => {
        //       console.log('F', e);
        //       e.message = e.message.split(':');
        //       return e;
        //     },
        //     (e) => {
        //       console.log('R', e);
        //       return e;
        //     },
        //   );
        // },
      }),
      invalidatesTags: (result, error) => {
        return error ? [] : [{ type: 'SpecialistTypes' }];
      },
    }),
    addSpecType: build.mutation<string, ISpecialistType>({
      query: (body) => ({
        url: 'specialists/types/add',
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['SpecialistTypes'],
    }),
    removeSpecType: build.mutation<string, ISpecialistType>({
      query: (body) => ({
        url: 'specialists/types/remove',
        method: 'DELETE',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['SpecialistTypes'],
    }),
  }),
  overrideExisting: false,
});

export default specTypesAPI;
