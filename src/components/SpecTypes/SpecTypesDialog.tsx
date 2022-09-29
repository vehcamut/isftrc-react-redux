import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { FunctionComponent, PropsWithChildren } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { specTypesDialogSlice, specTypesTableSlice } from '../../app/reducers';
import { ISpecialistType } from '../../models';

interface SpecTypesDialogProps extends PropsWithChildren {
  onSave: (type: 'UPDATE' | 'ADD' | undefined) => void;
}

const SpecTypesDialog: FunctionComponent<SpecTypesDialogProps> = ({ onSave }) => {
  const { type, isVisible } = useAppSelector((state) => state.specTypesDialogReducer);
  const { currentData } = useAppSelector((state) => state.specTypesTableReducer);
  const { setCurrentData } = specTypesTableSlice.actions;
  const { switchVisible } = specTypesDialogSlice.actions;
  const dispatch = useAppDispatch();

  const handleSave = () => {
    onSave(type);
  };
  const handleClose = () => {
    dispatch(switchVisible());
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    switch (id) {
      case 'specTypesName':
        dispatch(setCurrentData({ name: value } as ISpecialistType));
        break;
      case 'specTypesNote':
        dispatch(setCurrentData({ note: value } as ISpecialistType));
        break;
      default:
        break;
    }
  };
  const title = () => {
    switch (type) {
      case 'ADD':
        return 'Добавление записи';
      case 'UPDATE':
        return 'Редактирование записи';
      default:
        return 'SpecTypesDialog Title';
    }
  };
  const onClose = (event: object, reason: string) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') handleClose();
  };
  return (
    <Dialog open={isVisible} onClose={onClose}>
      <DialogTitle>{title()}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="specTypesName"
          label="Название специальности"
          type="text"
          fullWidth
          variant="standard"
          value={currentData.name}
          onChange={handleChange}
        />
        <TextField
          autoFocus
          margin="dense"
          id="specTypesNote"
          label="Примечание"
          type="text"
          value={currentData.note}
          fullWidth
          variant="standard"
          onChange={handleChange}
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

export default SpecTypesDialog;
