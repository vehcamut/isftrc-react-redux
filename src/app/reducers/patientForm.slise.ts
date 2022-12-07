import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPatient } from '../../models';

interface IAddPatientState {
  data: IPatient | undefined;
  // query: st
  query: string;
  // options: string[];
}

const initialState: IAddPatientState = {
  data: undefined,
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
    setData(state: IAddPatientState, action: PayloadAction<IPatient>) {
      Object.assign(state.data ? state.data : {}, action.payload);
    },
    // reset: () => initialState,

    // setOptions(state: IAddPatientState, action: PayloadAction<string[]>) {
    //   state.options = action.payload;
    // },
  },
});

export const addPatientReducer = addPatientSlice.reducer;
