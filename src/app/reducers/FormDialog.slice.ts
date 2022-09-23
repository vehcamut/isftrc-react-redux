import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { IPost } from '../../models';

interface IFormDialogState {
  visible: boolean;
  name: string;
  note: string;
  id: string;
}

const initialState: IFormDialogState = {
  visible: false,
  name: '',
  note: '',
  id: '',
};

export const formDialogSlice = createSlice({
  name: 'formDialog',
  initialState,
  reducers: {
    switchVisible(state: IFormDialogState) {
      state.visible = !state.visible;
    },
    setName(state: IFormDialogState, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setNote(state: IFormDialogState, action: PayloadAction<string>) {
      state.note = action.payload;
    },
    setId(state: IFormDialogState, action: PayloadAction<string>) {
      state.id = action.payload;
    },
  },
});

export default formDialogSlice.reducer;
