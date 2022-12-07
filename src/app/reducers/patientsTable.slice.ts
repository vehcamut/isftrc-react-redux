import { createSlice /* , PayloadAction */, PayloadAction } from '@reduxjs/toolkit';
// import { TablePaginationConfig } from 'antd';
// import { ColumnsType } from 'antd/es/table';
// import { FilterValue } from 'antd/lib/table/interface';
// import { IPatient /* , ISpecialistType, ISpecialistTypeQuery */ } from '../../models';
// import specialistAPI from '../../services/SpecialistsService';
// import { IPost } from '../../models';

/* interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue>;
} */

interface IPatientsTableState {
  page: number;
  limit?: number;
  order?: 'descend' | 'ascend' | 'desc' | 'asc' | undefined;
  sort?: string;
  name?: string;
  filter?: string;
  // columns: ColumnsType<IPatient>;
  /* rowsCount: number;
  filter: ISpecialistTypeQuery;
  searchField: string;
  tableParams: TableParams; */
}

const initialState: IPatientsTableState = {
  page: 0,
  limit: 10,
  filter: '',
  // columns: [
  //   {
  //     title: 'Номер карты',
  //     dataIndex: 'number',
  //     key: 'number',
  //     width: '20%',
  //   },
  //   {
  //     title: 'ФИО1',
  //     dataIndex: 'name',
  //     key: 'name',
  //     width: '20%',
  //     render: (name) => `${name.first} ${name.last} ${name.patronymic}`,
  //   },
  //   {
  //     title: 'Дата рождения',
  //     dataIndex: 'dateOfBirth',
  //     key: 'dateOfBirth',
  //     width: '20%',
  //   },
  //   {
  //     title: 'Пол',
  //     dataIndex: 'gender',
  //     key: 'gender',
  //     width: '20%',
  //   },
  //   {
  //     title: 'Адрес',
  //     dataIndex: 'address',
  //     key: 'address',
  //     width: '20%',
  //   },
  // ],
  // rows: [],
  // currentData: {} as ISpecialistType,
  // rowsCount: 0,
  // filter: {
  //   limit: 10,
  //   page: 0,
  //   sort: 'name',
  //   order: undefined,
  // },
  // searchField: '',
};

export const patientTableSlice = createSlice({
  name: 'loginForm',
  initialState,
  reducers: {
    setPage(state: IPatientsTableState, action: PayloadAction<number>) {
      state.page = action.payload;
      // Object.assign(state.filter, action.payload);
    },
    setLimit(state: IPatientsTableState, action: PayloadAction<number>) {
      state.limit = action.payload;
      // Object.assign(state.filter, action.payload);
    },
    setSort(state: IPatientsTableState, action: PayloadAction<string>) {
      state.sort = action.payload;
      // Object.assign(state.filter, action.payload);
    },
    setOrder(state: IPatientsTableState, action: PayloadAction<'descend' | 'ascend' | 'desc' | 'asc'>) {
      state.order = action.payload;
      // Object.assign(state.filter, action.payload);
    },
    setFilter(state: IPatientsTableState, action: PayloadAction<string>) {
      state.filter = action.payload;
      // Object.assign(state.filter, action.payload);
    },
    // setCurrentData(state: IPatientsTableState, action: PayloadAction<ISpecialistType>) {
    //   Object.assign(state.currentData, action.payload);
    // },
    // setRowsCount(state: IPatientsTableState, action: PayloadAction<number>) {
    //   state.rowsCount = action.payload;
    // },
    // setFilter(state: IPatientsTableState, action: PayloadAction<ISpecialistTypeQuery>) {
    //   Object.assign(state.filter, action.payload);
    // },
    // setSearchField(state: IPatientsTableState, action: PayloadAction<string>) {
    //   state.searchField = action.payload;
    // },
  },
});

export const patientTableReducer = patientTableSlice.reducer;
