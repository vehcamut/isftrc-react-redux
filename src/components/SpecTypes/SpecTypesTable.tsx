import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import {
  CircularProgress,
  createTheme,
  IconButton,
  TableHead,
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
import specialistAPI from '../../app/services/SpecialistsService';
import TablePaginationActions from '../TablePaginationActions';
import MyTableRow from './SpecTypesTableRow';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import { notificatinBarSlice } from '../../app/reducers/NotificatinBar.slise';
import NotificationsBar from '../NotificationsBar/NotificationBar';
import { specTypesDialogSlice, specTypesTableSlice, confirmDialogSlice } from '../../app/reducers';
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
  const {
    switchVisible: switchNotBarVisible,
    setText: setNotBarText,
    setType: setNotBarType,
  } = notificatinBarSlice.actions;

  const { data: rows, isLoading, error } = specialistAPI.useGetTypesQuery(filter);
  const [updateType] = specialistAPI.useEditMutation();
  const [addType] = specialistAPI.useAddMutation();
  const [removeType] = specialistAPI.useRemoveMutation();

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
        dispatch(setNotBarType('success'));
        dispatch(setNotBarText('Запись обновлена'));
        dispatch(switchDialogVisible());
      } catch (e) {
        dispatch(setNotBarType('error'));
        dispatch(setNotBarText('Запись с таким названием уже существует'));
      }
    }
    if (type === 'ADD') {
      try {
        await addType(currentData).unwrap();
        dispatch(setNotBarType('success'));
        dispatch(setNotBarText('Запись добавлена'));
        dispatch(switchDialogVisible());
      } catch (e) {
        dispatch(setNotBarType('error'));
        dispatch(setNotBarText('Запись с таким названием уже существует'));
      }
    }
    dispatch(switchNotBarVisible());
  };
  const handleRemove = async () => {
    try {
      await removeType({ _id: currentData._id } as ISpecialistType);
      dispatch(setNotBarType('success'));
      dispatch(setNotBarText('Запись удалена'));
    } catch (e) {
      dispatch(setNotBarType('error'));
      dispatch(setNotBarText('Произошла непредвиденная ошибка'));
    }
    dispatch(switchNotBarVisible());
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
      <Typography variant="h4" component="h1">
        Справочник специальностей
      </Typography>
      <Stack alignItems="flex-end">
        <TextField
          id="spec-table-search"
          label="Поиск по таблице"
          variant="standard"
          size="small"
          onChange={onChangeHandler}
          value={searchField}
        />

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
                    Название специальности
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} className={classes['my-table__cell']}>
                    Примечание
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
      <NotificationsBar />
    </div>
  );
}
