import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IPatientsTableState {
  page: number;
  limit?: number;
  order?: 'descend' | 'ascend' | 'desc' | 'asc' | undefined;
  sort?: string;
  name?: string;
  filter?: string;
  isActive?: boolean;
}

const initialState: IPatientsTableState = {
  page: 0,
  limit: 10,
  filter: '',
};

export const patientTableSlice = createSlice({
  name: 'patientTableSlice',
  initialState,
  reducers: {
    setPage(state: IPatientsTableState, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setLimit(state: IPatientsTableState, action: PayloadAction<number>) {
      state.limit = action.payload;
    },
    setSort(state: IPatientsTableState, action: PayloadAction<string>) {
      state.sort = action.payload;
    },
    setOrder(state: IPatientsTableState, action: PayloadAction<'descend' | 'ascend' | 'desc' | 'asc'>) {
      state.order = action.payload;
    },
    setFilter(state: IPatientsTableState, action: PayloadAction<string>) {
      state.filter = action.payload;
    },
    setIsActive(state: IPatientsTableState, action: PayloadAction<boolean | undefined>) {
      state.isActive = action.payload;
    },
  },
});

export const patientTableReducer = patientTableSlice.reducer;
