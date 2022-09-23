import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { FunctionComponent, PropsWithChildren } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { formDialogSlice } from '../../app/reducers/FormDialog.slice';
import { ISpecialistType } from '../../models';

// import { useDispatch } from 'react-redux';
// import { IPost } from '../models';
// import { postSlice } from '../app/reducers/PostSlice';
// import { useAppDispatch, useAppSelector } from '../app/hooks';

interface FormDialogProps extends PropsWithChildren {
  // visible: boolean;
  title: string;
  // name: string;
  // note: string;
  switchVisible1: () => void;
  onSave: (data: ISpecialistType) => void;
}

const FormDialog: FunctionComponent<FormDialogProps> = ({ title, switchVisible1, onSave }) => {
  const { visible, name, note, id } = useAppSelector((state) => state.formDialogReducer);
  const { setName, setNote, switchVisible } = formDialogSlice.actions;
  // const { visible } = useAppSelector((state) => state.formDialogReducer);
  // const { switchVisible } = formDialogSlice.actions;
  const dispatch = useAppDispatch();

  // const handleRemove = (event: React.MouseEvent) => {
  //   event.stopPropagation();
  //   // remove(post);
  // };

  // const handleUpdate = (event: React.MouseEvent) => {
  //   event.stopPropagation();
  //   // dispatch(colored("#ea3838"));
  //   const title = prompt('Title?') || '';
  //   const color = prompt('Title?', '#ea3838') || '#ea3838';
  //   // update({ ...post, title, color });
  // };

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = (event: object, reason: string) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') switchVisible();
  };
  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    // eslint-disable-next-line no-param-reassign
    dispatch(setName(event.target.value));
  };
  const handleChangeNote = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setNote(event.target.value));
  };
  const handleSave = () => {
    dispatch(switchVisible());
    onSave({ _id: id, name, note });
  };
  // const handleChangeLogin = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   dispatch(setLoginHelper(''));
  //   dispatch(changedLogin(event.target.value));
  // };

  // const handleClose = () => {
  //   switchVisible();
  // };

  // const { color } = useAppSelector((state) => state.postReducer);
  // const { colored } = postSlice.actions;
  // const dispatch = useAppDispatch();

  return (
    <Dialog open={visible} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Название специальности"
          type="text"
          fullWidth
          variant="standard"
          value={name}
          onChange={handleChangeName}
        />
        <TextField
          autoFocus
          margin="dense"
          id="note"
          label="Примечание"
          type="text"
          value={note}
          fullWidth
          variant="standard"
          onChange={handleChangeNote}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={switchVisible1}>Отменить</Button>
        <Button onClick={handleSave} color="success">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    // <div className="post" onClick={handleUpdate} style={{ backgroundColor: color_prop }}>
    //   {post.id}. {post.title}
    //   <button onClick={handleRemove} type="button" style={{ marginTop: '40px' }}>
    //     Delete
    //   </button>
    // </div>
  );
};

export default FormDialog;
