import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISpecialistType } from '../../../models/ISpecialistType';

interface ISpecTypesDialogState {
  data: ISpecialistType;
  type: 'UPDATE' | 'ADD' | undefined;
  isVisible: boolean;
}

const initialState: ISpecTypesDialogState = {
  data: {} as ISpecialistType,
  type: undefined,
  isVisible: false,
};

export const specTypesDialogSlice = createSlice({
  name: 'formDialog',
  initialState,
  reducers: {
    switchVisible(state: ISpecTypesDialogState) {
      state.isVisible = !state.isVisible;
    },
    setData(state: ISpecTypesDialogState, action: PayloadAction<ISpecialistType>) {
      state.data = action.payload;
    },
    setType(state: ISpecTypesDialogState, action: PayloadAction<'UPDATE' | 'ADD'>) {
      state.type = action.payload;
    },
  },
});

export const specTypesDialogReducer = specTypesDialogSlice.reducer;
