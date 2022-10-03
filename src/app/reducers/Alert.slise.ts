import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface INotificatinBarState {
  visible: boolean;
  text: string;
  type: 'error' | 'info' | 'success' | 'warning';
}

const initialState: INotificatinBarState = {
  visible: false,
  text: 'alert text',
  type: 'info',
};

export const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    switchVisible(state: INotificatinBarState) {
      state.visible = !state.visible;
    },
    setText(state: INotificatinBarState, action: PayloadAction<string>) {
      state.text = action.payload;
    },
    setType(state: INotificatinBarState, action: PayloadAction<'error' | 'info' | 'success' | 'warning'>) {
      state.type = action.payload;
    },
  },
});

export const alertReducer = alertSlice.reducer;
