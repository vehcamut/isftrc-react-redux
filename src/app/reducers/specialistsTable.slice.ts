import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ISpecialistsTableState {
  page: number;
  limit?: number;
  order?: 'descend' | 'ascend' | 'desc' | 'asc' | undefined;
  sort?: string;
  name?: string;
  filter?: string;
  isActive?: boolean;
}

const initialState: ISpecialistsTableState = {
  page: 0,
  limit: 10,
  filter: '',
};

export const specialistsTableSlice = createSlice({
  name: 'specialistsTableSlice',
  initialState,
  reducers: {
    setPage(state: ISpecialistsTableState, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setLimit(state: ISpecialistsTableState, action: PayloadAction<number>) {
      state.limit = action.payload;
    },
    setSort(state: ISpecialistsTableState, action: PayloadAction<string>) {
      state.sort = action.payload;
    },
    setOrder(state: ISpecialistsTableState, action: PayloadAction<'descend' | 'ascend' | 'desc' | 'asc'>) {
      state.order = action.payload;
    },
    setFilter(state: ISpecialistsTableState, action: PayloadAction<string>) {
      state.filter = action.payload;
    },
    setIsActive(state: ISpecialistsTableState, action: PayloadAction<boolean | undefined>) {
      state.isActive = action.payload;
    },
  },
});

export const specialistsTableReducer = specialistsTableSlice.reducer;
