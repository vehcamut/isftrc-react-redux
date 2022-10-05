import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import {
  CircularProgress,
  createTheme,
  IconButton,
  TableHead,
  TableSortLabel,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ruRU } from '@mui/material/locale';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Stack from '@mui/material/Stack';
import classes from './MyTable.module.scss';
import { ISpecialistType, ISpecialistTypeQuery } from '../../models';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { specialistsAPI } from '../../app/services';
import TablePaginationActions from '../TablePaginationActions';
import MyTableRow from './SpecTypesTableRow';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import Alert from '../Alert/Alert';
import { specTypesDialogSlice, specTypesTableSlice, confirmDialogSlice, alertSlice } from '../../app/reducers';
import SpecTypesDialog from './SpecTypesDialog';

export default function SpecTypesTable() {
  const dispatch = useAppDispatch();
  const [, startTransition] = React.useTransition();
  const { currentData, filter, searchField } = useAppSelector((state) => state.specTypesTableReducer);
  const { setCurrentData, setFilter, setSearchField } = specTypesTableSlice.actions;
  const { setType: setDialogType, switchVisible: switchDialogVisible } = specTypesDialogSlice.actions;
  const {
    switchVisible: switchConfirmDialogVisible,
    setTitle: setConfirmDialogTitle,
    setMessage: setConfirmDialogBody,
  } = confirmDialogSlice.actions;
  const { switchVisible: switchAlertVisible, setText: setAlertText, setType: setAlertType } = alertSlice.actions;

  const { data: rows, isLoading, error } = specialistsAPI.useGetTypesQuery(filter);
  const [updateType] = specialistsAPI.useEditTypeMutation();
  const [addType] = specialistsAPI.useAddTypeMutation();
  const [removeType] = specialistsAPI.useRemoveTypeMutation();

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    dispatch(setFilter({ page: newPage } as ISpecialistTypeQuery));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    dispatch(setFilter({ page: 0, limit: newRowsPerPage < 0 ? 0 : newRowsPerPage }));
  };

  const handleSave = async (type: 'UPDATE' | 'ADD' | undefined) => {
    if (type === 'UPDATE') {
      try {
        await updateType(currentData).unwrap();
        dispatch(setAlertType('success'));
        dispatch(setAlertText('Запись обновлена'));
        dispatch(switchDialogVisible());
      } catch (e) {
        dispatch(setAlertType('error'));
        dispatch(setAlertText('Запись с таким названием уже существует'));
      }
    }
    if (type === 'ADD') {
      try {
        await addType(currentData).unwrap();
        dispatch(setAlertType('success'));
        dispatch(setAlertText('Запись добавлена'));
        dispatch(switchDialogVisible());
      } catch (e) {
        dispatch(setAlertType('error'));
        dispatch(setAlertText('Запись с таким названием уже существует'));
      }
    }
    dispatch(switchAlertVisible());
  };
  const handleRemove = async () => {
    try {
      await removeType({ _id: currentData._id } as ISpecialistType);
      dispatch(setAlertType('success'));
      dispatch(setAlertText('Запись удалена'));
    } catch (e) {
      dispatch(setAlertType('error'));
      dispatch(setAlertText('Произошла непредвиденная ошибка'));
    }
    dispatch(switchAlertVisible());
  };
  const handleRemoveBtnClick = (data: ISpecialistType) => {
    dispatch(setCurrentData(data));
    dispatch(setConfirmDialogTitle('Удаление записи'));
    dispatch(setConfirmDialogBody('Вы точно хотите удалить данную запись?'));
    dispatch(switchConfirmDialogVisible());
  };
  const handleUpdateBtnClick = (data: ISpecialistType) => {
    dispatch(setCurrentData(data));
    dispatch(setDialogType('UPDATE'));
    dispatch(switchDialogVisible());
  };
  const handleAddBtnClick = () => {
    dispatch(setCurrentData({ name: '', note: '', _id: undefined }));
    dispatch(setDialogType('ADD'));
    dispatch(switchDialogVisible());
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSort = (name: string) => (event: React.MouseEvent<unknown>) => {
    if (filter.sort === name)
      dispatch(setFilter({ order: filter.order === 'asc' ? 'desc' : 'asc', page: 0 } as ISpecialistTypeQuery));
    else {
      dispatch(setFilter({ sort: name, order: 'asc', page: 0 } as ISpecialistTypeQuery));
    }
  };
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const temp = event.target.value;
    dispatch(setSearchField(temp));
    startTransition(() => {
      dispatch(setFilter({ ...filter, page: 0, name: temp, note: temp }));
    });
  };
  const theme = createTheme({}, ruRU);

  return (
    <div>
      <Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h4" component="h1">
            Справочник специальностей
          </Typography>
          <TextField
            id="spec-table-search"
            label="Поиск по таблице"
            variant="standard"
            size="small"
            onChange={onChangeHandler}
            value={searchField}
          />
        </Stack>
        <ThemeProvider theme={theme}>
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 500 }}
              className={classes['my-table']}
              size="small"
              aria-label="custom pagination table"
            >
              <TableHead>
                <TableRow style={{ height: 55, fontWeight: 'bold' }}>
                  <TableCell sx={{ fontWeight: 'bold' }} className={classes['my-table__cell']}>
                    <TableSortLabel
                      active={filter.sort === 'name'}
                      direction={filter.sort === 'name' ? filter.order : 'asc'}
                      onClick={handleSort('name')}
                    >
                      Название специальности
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} className={classes['my-table__cell']}>
                    <TableSortLabel
                      active={filter.sort === 'note'}
                      direction={filter.sort === 'note' ? filter.order : 'asc'}
                      onClick={handleSort('note')}
                    >
                      Примечание
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    style={{ textAlign: 'end' }}
                    className={[classes['my-table__cell'], classes['my-table__cell_small']].join(' ')}
                  >
                    <IconButton key="one" color="info" size="small" onClick={handleAddBtnClick}>
                      <AddBoxIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading && (
                  <TableRow className={[classes['my-table__row'], classes['my-table__row_nohover']].join(' ')}>
                    <TableCell colSpan={3} style={{ textAlign: 'center' }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                )}
                {error && (
                  <TableRow className={[classes['my-table__row'], classes['my-table__row_nohover']].join(' ')}>
                    <TableCell colSpan={3} style={{ textAlign: 'center' }}>
                      <h1>Произошла ошибка</h1>
                    </TableCell>
                  </TableRow>
                )}
                {rows &&
                  rows.data.map((row) => (
                    <MyTableRow data={row} key={row._id} update={handleUpdateBtnClick} remove={handleRemoveBtnClick} />
                  ))}
                {rows && rows.data.length < filter.limit && filter.limit < rows.count && (
                  <TableRow
                    style={{ height: 40 * (filter.limit - rows.data.length) }}
                    className={[classes['my-table__row'], classes['my-table__row_nohover']].join(' ')}
                  >
                    <TableCell colSpan={3} />
                  </TableRow>
                )}
                {rows && !rows.count && (
                  <TableRow className={[classes['my-table__row'], classes['my-table__row_nohover']].join(' ')}>
                    <TableCell colSpan={3} style={{ textAlign: 'center' }}>
                      <h1>Ничего не найдено</h1>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'Все', value: -1 }]}
                    colSpan={3}
                    count={rows?.count || 0}
                    rowsPerPage={filter?.limit === 0 ? -1 : filter?.limit}
                    labelRowsPerPage="Записей на странице:"
                    page={filter?.page}
                    SelectProps={{
                      inputProps: {
                        'aria-label': 'rows per page',
                      },
                      native: false,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </ThemeProvider>
      </Stack>

      <SpecTypesDialog onSave={handleSave} />
      <ConfirmDialog onConfirm={handleRemove} />
      <Alert />
    </div>
  );
}
