import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IConfirmDialogState {
  visible: boolean;
  title: string;
  message: string;
}

const initialState: IConfirmDialogState = {
  visible: false,
  title: 'AlertDialog Title',
  message: 'AlertDialog text',
};

export const confirmDialogSlice = createSlice({
  name: 'confirmDialog',
  initialState,
  reducers: {
    switchVisible(state: IConfirmDialogState) {
      state.visible = !state.visible;
    },
    setTitle(state: IConfirmDialogState, action: PayloadAction<string>) {
      state.title = action.payload;
    },
    setMessage(state: IConfirmDialogState, action: PayloadAction<string>) {
      state.message = action.payload;
    },
  },
});

export const confirmDialogReducer = confirmDialogSlice.reducer;
