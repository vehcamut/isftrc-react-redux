import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IAlertDialogState {
  visible: boolean;
  title: string;
  body: string;
  id: string | undefined;
}

const initialState: IAlertDialogState = {
  visible: false,
  title: 'AlertDialog Title',
  body: 'AlertDialog text',
  id: undefined,
};

export const alertDialogSlice = createSlice({
  name: 'alertDialog',
  initialState,
  reducers: {
    switchVisible(state: IAlertDialogState) {
      state.visible = !state.visible;
    },
    setTitle(state: IAlertDialogState, action: PayloadAction<string>) {
      state.title = action.payload;
    },
    setBody(state: IAlertDialogState, action: PayloadAction<string>) {
      state.body = action.payload;
    },
    setId(state: IAlertDialogState, action: PayloadAction<string | undefined>) {
      state.id = action.payload;
    },
  },
});

export default alertDialogSlice.reducer;
