import { ButtonGroup, IconButton, TableCell, TableRow } from '@mui/material';
import React, { FunctionComponent, PropsWithChildren } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import classes from './MyTable.module.scss';
import { ISpecialistType } from '../../models';

interface ISpecTypesRowProps extends PropsWithChildren {
  data: ISpecialistType;
  remove: (data: ISpecialistType) => void;
  update: (data: ISpecialistType) => void;
}

const SpecTypesRow: FunctionComponent<ISpecTypesRowProps> = ({ data, update, remove }) => {
  const handleRemove = (event: React.MouseEvent) => {
    event.stopPropagation();
    remove(data);
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    update(data);
  };

  return (
    <TableRow key={data._id} style={{ height: 40 }} className={classes['my-table__row']}>
      <TableCell component="th" scope="row" className={classes['my-table__cell']}>
        {data.name}
      </TableCell>
      <TableCell component="th" scope="row" className={classes['my-table__cell']}>
        {data.note}
      </TableCell>
      <TableCell className={[classes['my-table__cell'], classes['my-table__cell_small']].join(' ')} align="right">
        <ButtonGroup
          orientation="horizontal"
          aria-label="vertical outlined button group"
          style={{ verticalAlign: 'middle' }}
        >
          <IconButton onClick={handleEdit} key="one" color="info" sx={{ padding: 0 }} size="small">
            <EditIcon />
          </IconButton>
          <IconButton onClick={handleRemove} key="two" color="error" sx={{ padding: 0 }} size="small">
            <DeleteIcon />
          </IconButton>
        </ButtonGroup>
      </TableCell>
    </TableRow>
  );
};

export default SpecTypesRow;
