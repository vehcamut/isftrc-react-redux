import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IRegectedActionState {
  endpointName: any;
  originalArgs: any;
}

const initialState: IRegectedActionState = {
  endpointName: undefined,
  originalArgs: undefined,
};

export const regectedActionSlice = createSlice({
  name: 'loginForm',
  initialState,
  reducers: {
    setRejectedAction(state: IRegectedActionState, action: PayloadAction<any>) {
      state.endpointName = action.payload.endpointName;
      state.originalArgs = action.payload.originalArgs;
    },
  },
});

export const regectedActionReducer = regectedActionSlice.reducer;
