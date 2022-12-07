import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IAddPatientState {
  // query: st
  query: string;
  // options: string[];
}

const initialState: IAddPatientState = {
  query: '',
  // options: [],
};

export const addPatientSlice = createSlice({
  name: 'addPatient',
  initialState,

  reducers: {
    setQuery(state: IAddPatientState, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    // reset: () => initialState,

    // setOptions(state: IAddPatientState, action: PayloadAction<string[]>) {
    //   state.options = action.payload;
    // },
  },
});

export const addPatientReducer = addPatientSlice.reducer;
