import React from "react";
import { IPost } from "../models";
import { postAPI } from "../services/PostService";
import PostItem from "./PostItem";

type Props = {};

const PostContainer = (props: Props) => {
  const { data: posts, error, isLoading } = postAPI.useFetchAllPostsQuery(100);
  const [createPost, { error: createError }] = postAPI.useCreatePostMutation();
  const [updatePost, {}] = postAPI.useUpdatePostMutation();
  const [deletePost, {}] = postAPI.useDeletePostMutation();
  //refetch - обновление данныз (параметр)
  //pollingInterval - обновление данных по времени - аналог websocket
  const handleCreate = async () => {
    const title = prompt("Title?");
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
        <button onClick={handleCreate}>Add new post</button>
        {isLoading && <h1>Идет загрузка...</h1>}
        {error && <h1>Произошла ошибка</h1>}
        {posts &&
          posts.map((post) => (
            <PostItem
              remove={handleRemove}
              update={handleUpdate}
              key={post.id}
              post={post}
              color_prop={post.color}
            />
          ))}
      </div>
    </div>
  );
};

export default PostContainer;
