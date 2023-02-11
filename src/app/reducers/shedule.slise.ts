/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dayjs } from 'dayjs';
import { IAppointment, IPatient, IPatientd } from '../../models';

interface ISheduleState {
  appointment: IAppointment | undefined;
}

const initialState: ISheduleState = {
  appointment: undefined,
};

export const sheduleSlice = createSlice({
  name: 'shedule',
  initialState,
  reducers: {
    setAppointment(state: ISheduleState, action: PayloadAction<IAppointment>) {
      state.appointment = JSON.parse(JSON.stringify(action.payload));
    },
  },
});

export const sheduleReducer = sheduleSlice.reducer;
