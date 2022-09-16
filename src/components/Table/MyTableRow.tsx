// import React, { FunctionComponent, PropsWithChildren, ReactNode } from 'react';

export {};

// // import { useDispatch } from 'react-redux';
// // import { IPost } from '../models';
// // import { postSlice } from '../app/reducers/PostSlice';
// // import { useAppDispatch, useAppSelector } from '../app/hooks';

// interface ISpecialistTypes {
//   name: string;
//   note?: string;
// }

// interface ITableCellProps {
//   data: ReactNode | string;
//   component: string;
// }

// interface ITableProps {

// }

// interface ITableRowProps extends PropsWithChildren {
//   cells: ITableCellProps[];
//   post: IPost;
//   color_prop: string;
//   remove: (post: IPost) => void;
//   update: (post: IPost) => void;
// }

// const PostItem: FunctionComponent<PostItemProps> = ({ post, remove, update, color_prop }) => {
//   const handleRemove = (event: React.MouseEvent) => {
//     event.stopPropagation();
//     remove(post);
//   };

//   const handleUpdate = (event: React.MouseEvent) => {
//     event.stopPropagation();
//     // dispatch(colored("#ea3838"));
//     const title = prompt('Title?') || '';
//     const color = prompt('Title?', '#ea3838') || '#ea3838';
//     update({ ...post, title, color });
//   };

//   // const { color } = useAppSelector((state) => state.postReducer);
//   // const { colored } = postSlice.actions;
//   // const dispatch = useAppDispatch();

//   return (
//     // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
//     <div className="post" onClick={handleUpdate} style={{ backgroundColor: color_prop }}>
//       {post.id}. {post.title}
//       <button onClick={handleRemove} type="button" style={{ marginTop: '40px' }}>
//         Delete
//       </button>
//     </div>
//   );
// };

// export default PostItem;
