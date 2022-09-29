import React, { FunctionComponent, PropsWithChildren } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { confirmDialogSlice } from '../../app/reducers';
// import { ISpecialistType } from '../../models';

interface ConfirmDialogProps extends PropsWithChildren {
  onConfirm: () => void;
}

const ConfirmDialog: FunctionComponent<ConfirmDialogProps> = ({ onConfirm }) => {
  const { visible, title, message } = useAppSelector((state) => state.confirmDialogReducer);
  const { switchVisible } = confirmDialogSlice.actions;
  const dispatch = useAppDispatch();

  const handleClose = (event: object, reason: string) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') dispatch(switchVisible());
  };

  const handleConfirm = () => {
    dispatch(switchVisible());
    onConfirm();
  };

  const handleRefuse = () => {
    dispatch(switchVisible());
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
        <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
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

export default ConfirmDialog;
