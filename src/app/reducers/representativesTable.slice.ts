import { createSlice /* , PayloadAction */, PayloadAction } from '@reduxjs/toolkit';

interface IRepresentativesTableState {
  page: number;
  limit?: number;
  order?: 'descend' | 'ascend' | 'desc' | 'asc' | undefined;
  sort?: string;
  name?: string;
  filter?: string;
  isActive?: boolean;
}

const initialState: IRepresentativesTableState = {
  page: 0,
  limit: 10,
  filter: '',
};

export const representativesTableSlice = createSlice({
  name: 'representativesTableSlice',
  initialState,
  reducers: {
    setPage(state: IRepresentativesTableState, action: PayloadAction<number>) {
      state.page = action.payload;
      // Object.assign(state.filter, action.payload);
    },
    setLimit(state: IRepresentativesTableState, action: PayloadAction<number>) {
      state.limit = action.payload;
      // Object.assign(state.filter, action.payload);
    },
    setSort(state: IRepresentativesTableState, action: PayloadAction<string>) {
      state.sort = action.payload;
      // Object.assign(state.filter, action.payload);
    },
    setOrder(state: IRepresentativesTableState, action: PayloadAction<'descend' | 'ascend' | 'desc' | 'asc'>) {
      state.order = action.payload;
      // Object.assign(state.filter, action.payload);
    },
    setFilter(state: IRepresentativesTableState, action: PayloadAction<string>) {
      state.filter = action.payload;
      // Object.assign(state.filter, action.payload);
    },
    setIsActive(state: IRepresentativesTableState, action: PayloadAction<boolean | undefined>) {
      state.isActive = action.payload;
      // Object.assign(state.filter, action.payload);
    },
  },
});

export const representativesTableReducer = representativesTableSlice.reducer;
