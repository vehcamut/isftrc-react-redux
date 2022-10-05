import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IAlertState {
  visible: boolean;
  text: string;
  type: 'error' | 'info' | 'success' | 'warning';
}

const initialState: IAlertState = {
  visible: false,
  text: 'alert text',
  type: 'info',
};

export const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    switchVisible(state: IAlertState) {
      state.visible = !state.visible;
    },
    setText(state: IAlertState, action: PayloadAction<string>) {
      state.text = action.payload;
    },
    setType(state: IAlertState, action: PayloadAction<'error' | 'info' | 'success' | 'warning'>) {
      state.type = action.payload;
    },
  },
});

export const alertReducer = alertSlice.reducer;
