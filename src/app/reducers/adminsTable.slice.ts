import { createSlice /* , PayloadAction */, PayloadAction } from '@reduxjs/toolkit';

interface IAdminsTableState {
  page: number;
  limit?: number;
  order?: 'descend' | 'ascend' | 'desc' | 'asc' | undefined;
  sort?: string;
  name?: string;
  filter?: string;
  isActive?: boolean;
}

const initialState: IAdminsTableState = {
  page: 0,
  limit: 10,
  filter: '',
};

export const adminsTableSlice = createSlice({
  name: 'adminsTableSlice',
  initialState,
  reducers: {
    setPage(state: IAdminsTableState, action: PayloadAction<number>) {
      state.page = action.payload;
      // Object.assign(state.filter, action.payload);
    },
    setLimit(state: IAdminsTableState, action: PayloadAction<number>) {
      state.limit = action.payload;
      // Object.assign(state.filter, action.payload);
    },
    setSort(state: IAdminsTableState, action: PayloadAction<string>) {
      state.sort = action.payload;
      // Object.assign(state.filter, action.payload);
    },
    setOrder(state: IAdminsTableState, action: PayloadAction<'descend' | 'ascend' | 'desc' | 'asc'>) {
      state.order = action.payload;
      // Object.assign(state.filter, action.payload);
    },
    setFilter(state: IAdminsTableState, action: PayloadAction<string>) {
      state.filter = action.payload;
      // Object.assign(state.filter, action.payload);
    },
    setIsActive(state: IAdminsTableState, action: PayloadAction<boolean | undefined>) {
      state.isActive = action.payload;
      // Object.assign(state.filter, action.payload);
    },
  },
});

export const adminsTableReducer = adminsTableSlice.reducer;
