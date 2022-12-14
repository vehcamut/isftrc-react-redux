import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import React, { FunctionComponent, PropsWithChildren } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { alertSlice } from '../../app/reducers';

type FormDialogProps = PropsWithChildren;

const NotificationsBar: FunctionComponent<FormDialogProps> = () => {
  const { visible, text, type } = useAppSelector((state) => state.alertReducer);
  const { switchVisible } = alertSlice.actions;
  const dispatch = useAppDispatch();
  const onClose = () => {
    dispatch(switchVisible());
  };

  return (
    <Snackbar open={visible} autoHideDuration={4000} onClose={onClose}>
      <Alert variant="filled" onClose={onClose} severity={type} sx={{ width: '100%' }}>
        {text}
      </Alert>
    </Snackbar>
  );
};

export default NotificationsBar;
