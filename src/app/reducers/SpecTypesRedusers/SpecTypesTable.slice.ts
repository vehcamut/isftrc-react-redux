import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ISpecialistType, ISpecialistTypeQuery } from '../../../models';
// import specialistAPI from '../../services/SpecialistsService';
// import { IPost } from '../../models';

interface ISpecialistTypesTableState {
  // rows: ISpecialistType[];
  currentData: ISpecialistType;
  rowsCount: number;
  filter: ISpecialistTypeQuery;
  searchField: string;
}

const initialState: ISpecialistTypesTableState = {
  // rows: [],
  currentData: {} as ISpecialistType,
  rowsCount: 0,
  filter: {
    limit: 10,
    page: 0,
    sort: 'name',
    order: 0,
  },
  searchField: '',
};

export const specTypesTableSlice = createSlice({
  name: 'loginForm',
  initialState,
  reducers: {
    setCurrentData(state: ISpecialistTypesTableState, action: PayloadAction<ISpecialistType>) {
      Object.assign(state.currentData, action.payload);
    },
    setRowsCount(state: ISpecialistTypesTableState, action: PayloadAction<number>) {
      state.rowsCount = action.payload;
    },
    setFilter(state: ISpecialistTypesTableState, action: PayloadAction<ISpecialistTypeQuery>) {
      Object.assign(state.filter, action.payload);
    },
    setSearchField(state: ISpecialistTypesTableState, action: PayloadAction<string>) {
      state.searchField = action.payload;
    },
  },
});

export const specTypesTableReducer = specTypesTableSlice.reducer;
