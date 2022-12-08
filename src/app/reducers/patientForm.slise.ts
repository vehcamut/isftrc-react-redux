/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dayjs } from 'dayjs';
import { IPatient, IPatientd } from '../../models';

interface IAddPatientState {
  data: IPatient | undefined;
  // query: st
  query: string;
  // options: string[];
}

const initialState: IAddPatientState = {
  data: undefined,
  // data: {
  //   _id: '',
  //   address: '',
  //   name: '',
  //   surname: '',
  //   patronymic: '',
  //   number: 0,
  //   dateOfBirth: new Dayjs(),
  //   gender: '',
  //   isActive: false,
  // },
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
    setDataField(state: IAddPatientState, action: PayloadAction<{ [index: string]: string }>) {
      Object.keys(action.payload).forEach((key) => {
        if (state && state.data && key in state.data && action.payload[key] !== undefined) {
          state.data = { ...state.data, [key]: action.payload[key] };
        }
      });
      console.log('F:', state.data);
      // for (const key in action.payload) {
      //   if (key in state?.data && action.payload[key] !== undefined) {
      //     state.data = { ...state.data, [key]: action.payload[key] };
      //   }
      // }
    },
    setData(state: IAddPatientState, action: PayloadAction<IPatient>) {
      console.log('work');
      // state.data = Object.assign(state.data ? state.data : {}, action.payload);
      state.data = { ...state.data, ...action.payload };
      console.log('A:', state.data);
      // Object.assign(state.data, action.payload);
    },
    // reset: () => initialState,

    // setOptions(state: IAddPatientState, action: PayloadAction<string[]>) {
    //   state.options = action.payload;
    // },
  },
});

export const addPatientReducer = addPatientSlice.reducer;
