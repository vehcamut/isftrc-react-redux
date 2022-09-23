import React, { FunctionComponent, PropsWithChildren } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { alertDialogSlice } from '../../app/reducers/AlertDialog.slice';
// import { ISpecialistType } from '../../models';

interface AlertDialogProps extends PropsWithChildren {
  onConfirm: (flag: boolean, id: string) => void;
}

const AlertDialog: FunctionComponent<AlertDialogProps> = ({ onConfirm }) => {
  const { visible, title, body, id } = useAppSelector((state) => state.alertDialogReducer);
  const { switchVisible } = alertDialogSlice.actions;
  const dispatch = useAppDispatch();

  const handleClose = (event: object, reason: string) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') dispatch(switchVisible());
  };

  const handleConfirm = () => {
    dispatch(switchVisible());
    onConfirm(true, id || '');
  };

  const handleRefuse = () => {
    console.log(id);
    dispatch(switchVisible());
    onConfirm(false, id || '');
  };
  return (
    <Dialog
      open={visible}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{body}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm} color="error">
          Да
        </Button>
        <Button onClick={handleRefuse}>Нет</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
