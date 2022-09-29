import React from 'react';
import { IPost } from '../models';
import postAPI from '../app/services/PostService';
import PostItem from './PostItem';

// type Props = {};

function PostContainer(/* props: Props */) {
  const { data: posts, error, isLoading } = postAPI.useFetchAllPostsQuery(100);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [createPost, { error: createError }] = postAPI.useCreatePostMutation();
  // eslint-disable-next-line no-empty-pattern
  const [updatePost, {}] = postAPI.useUpdatePostMutation();
  // eslint-disable-next-line no-empty-pattern
  const [deletePost, {}] = postAPI.useDeletePostMutation();
  // refetch - обновление данныз (параметр)
  // pollingInterval - обновление данных по времени - аналог websocket
  const handleCreate = async () => {
    const title = prompt('Title?');
    await createPost({ title, body: title } as IPost);
  };
  const handleRemove = async (post: IPost) => {
    await deletePost(post);
  };
  const handleUpdate = async (post: IPost) => {
    await updatePost(post);
  };
  return (
    <div>
      <div className="post__list">
        <button onClick={handleCreate} type="button">
          Add new post
        </button>
        {isLoading && <h1>Идет загрузка...</h1>}
        {error && <h1>Произошла ошибка</h1>}
        {posts &&
          posts.map((post: IPost) => (
            <PostItem remove={handleRemove} update={handleUpdate} key={post.id} post={post} color_prop={post.color} />
          ))}
      </div>
    </div>
  );
}

export default PostContainer;
