import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { build } from "@reduxjs/toolkit/dist/query/core/buildMiddleware/cacheLifecycle";
import { IPost } from '../../models';

const postAPI = createApi({
  reducerPath: 'postAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/',
  }),
  tagTypes: ['Post'],
  endpoints: (build) => ({
    fetchAllPosts: build.query<IPost[], number>({
      query: (limit = 5) => ({
        url: '/posts',
        params: {
          _limit: limit,
        },
      }),
      providesTags: ['Post'], // (result) => ['Post'],
    }),
    createPost: build.mutation<IPost, IPost>({
      query: (post) => ({
        url: '/posts',
        method: 'POST',
        body: post,
      }),
      invalidatesTags: ['Post'],
    }),
    updatePost: build.mutation<IPost, IPost>({
      query: (post) => ({
        url: `/posts/${post.id}`,
        method: 'PUT',
        body: post,
      }),
      invalidatesTags: ['Post'],
    }),
    deletePost: build.mutation<IPost, IPost>({
      query: (post) => ({
        url: `/posts/${post.id}`,
        method: 'DELETE',
        body: post,
      }),
      invalidatesTags: ['Post'],
    }),
  }),
});

export default postAPI;
