import { ButtonGroup, IconButton, TableCell, TableRow } from '@mui/material';
import React, { FunctionComponent, PropsWithChildren /* , ReactNode */ } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import classes from './MyTable.module.scss';
import { ISpecialistType } from '../../models';

export {};

// import { useDispatch } from 'react-redux';
// import { IPost } from '../models';
// import { postSlice } from '../app/reducers/PostSlice';
// import { useAppDispatch, useAppSelector } from '../app/hooks';

// interface ISpecialistTypes {
//   name: string;
//   note?: string;
// }

// interface ITableCellProps {
//   data: ReactNode | string;
//   component: string;
// }

interface IMyTableRowProps extends PropsWithChildren {
  name: string;
  note: string;
  id: string;
  update: (data: ISpecialistType) => void;
}

// interface ITableRowProps extends PropsWithChildren {
//   cells: ITableCellProps[];
//   post: IPost;
//   color_prop: string;
//   remove: (post: IPost) => void;
//   update: (post: IPost) => void;
// }

const MyTableRow: FunctionComponent<IMyTableRowProps> = ({ name, note, update, id }) => {
  const handleRemove = (event: React.MouseEvent) => {
    event.stopPropagation();
    console.log(event);
    //
    // remove(post);
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    update({ name, note, _id: id });
    // console.log(event);
    // dispatch(colored("#ea3838"));
    // const title = prompt('Title?') || '';
    // const color = prompt('Title?', '#ea3838') || '#ea3838';
    // update({ ...post, title, color });
  };

  // const { color } = useAppSelector((state) => state.postReducer);
  // const { colored } = postSlice.actions;
  // const dispatch = useAppDispatch();

  return (
    <TableRow key={name} style={{ height: 33 }} className={classes['my-table__row']}>
      <TableCell component="th" scope="row" className={classes['my-table__cell']}>
        {name}
      </TableCell>
      <TableCell component="th" scope="row" className={classes['my-table__cell']}>
        {note}
      </TableCell>
      <TableCell
        style={{ width: 160, padding: 0 }}
        className={[classes['my-table__cell'], classes['my-table__cell_small']].join(' ')}
        align="right"
      >
        <ButtonGroup
          orientation="horizontal"
          aria-label="vertical outlined button group"
          style={{ paddingRight: '15px' }}
        >
          <IconButton onClick={handleEdit} key="one" color="info" size="small">
            <EditIcon />
          </IconButton>
          <IconButton onClick={handleRemove} key="two" color="error" sx={{ padding: 0 }}>
            <DeleteIcon />
          </IconButton>
        </ButtonGroup>
      </TableCell>
    </TableRow>
  );
};

export default MyTableRow;
