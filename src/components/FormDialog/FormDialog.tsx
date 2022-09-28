import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { FunctionComponent, PropsWithChildren } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { formDialogSlice } from '../../app/reducers/FormDialog.slice';
import { ISpecialistType } from '../../models';

interface FormDialogProps extends PropsWithChildren {
  onSave: (data: ISpecialistType, type: string) => void;
}

const FormDialog: FunctionComponent<FormDialogProps> = ({ onSave }) => {
  const { visible, name, note, id, title, type } = useAppSelector((state) => state.formDialogReducer);
  const { setName, setNote, switchVisible } = formDialogSlice.actions;
  const dispatch = useAppDispatch();

  const onClose = (event: object, reason: string) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') dispatch(switchVisible());
  };
  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    // eslint-disable-next-line no-param-reassign
    dispatch(setName(event.target.value));
  };
  const handleChangeNote = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setNote(event.target.value));
  };
  const handleSave = () => {
    // dispatch(switchVisible());
    onSave({ _id: id, name, note }, type);
  };
  const handleClose = () => {
    dispatch(switchVisible());
  };
  return (
    <Dialog open={visible} onClose={onClose}>
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
        <Button onClick={handleClose}>Отменить</Button>
        <Button onClick={handleSave} color="success">
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormDialog;
