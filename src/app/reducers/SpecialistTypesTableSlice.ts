import { createSlice, PayloadAction, SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
// import { Serializable } from 'child_process';
import { ISpecialistType, ISpecialistTypeQuery } from '../../models';
// import specialistAPI from '../../services/SpecialistsService';
// import { IPost } from '../../models';

interface ISpecialistTypesTableState {
  specialistTypes: ISpecialistType[] | undefined;
  // rowsPerTable: number;
  page: number;
  rowsCount: number;
  typeFilter: ISpecialistTypeQuery;
  rowsPerPage: number;
  emptyRows: number;
  searchField: string;
  filter: ISpecialistTypeQuery;
  isLoading: boolean | undefined;
  error: FetchBaseQueryError | SerializedError | undefined;
}

const initialState: ISpecialistTypesTableState = {
  specialistTypes: [],
  searchField: '',
  // rowsPerTable: 0,
  page: 0,
  rowsCount: 0,
  rowsPerPage: 5,
  typeFilter: {},
  emptyRows: 0,
  filter: {
    limit: 5,
    page: 0,
    sort: 'name',
    order: 0,
  },
  isLoading: false,
  error: undefined,
};

export const specialistTypesTableSlice = createSlice({
  name: 'loginForm',
  initialState,
  reducers: {
    setPage(state: ISpecialistTypesTableState, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setRowsPerPage(state: ISpecialistTypesTableState, action: PayloadAction<number>) {
      state.rowsPerPage = action.payload;
    },
    setEmptyRows(state: ISpecialistTypesTableState, action: PayloadAction<number>) {
      state.emptyRows = action.payload;
      // = state.page > 0 ? Math.max(0, (1 + state.page) * state.rowsPerPage - (rows?.length || 0)) : 0
    },
    setFilter(state: ISpecialistTypesTableState, action: PayloadAction<ISpecialistTypeQuery>) {
      Object.assign(state.filter, action.payload);
      // = {...state.filter}
    },
    setSearchField(state: ISpecialistTypesTableState, action: PayloadAction<string>) {
      state.searchField = action.payload;
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addMatcher(specialistAPI.endpoints.getTypes.matchPending, (state: ISpecialistTypesTableState) => {
  //       state.isLoading = true;
  //     })
  //     .addMatcher(specialistAPI.endpoints.getTypes.matchFulfilled, (state: ISpecialistTypesTableState, action) => {
  //       state.specialistTypes = action.payload.data;
  //       state.rowsCount = action.payload.count;
  //       state.isLoading = false;
  //       console.log('WORK!');
  //     });
  // },
});

export default specialistTypesTableSlice.reducer;
