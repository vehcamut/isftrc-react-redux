/* eslint-disable no-underscore-dangle */
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { CircularProgress, createTheme, IconButton, TableHead, TextField, ThemeProvider } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ruRU } from '@mui/material/locale';
import AddBoxIcon from '@mui/icons-material/AddBox';
import classes from './MyTable.module.scss';
import { ISpecialistType, ISpecialistTypeQuery } from '../../models';
import { specialistTypesTableSlice } from '../../app/reducers/SpecialistTypesTableSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import specialistAPI from '../../app/services/SpecialistsService';
import TablePaginationActions from './TablePaginationActions';
import MyTableRow from './MyTableRow';
import { formDialogSlice } from '../../app/reducers/FormDialog.slice';
import FormDialog from '../FormDialog/FormDialog';
import { alertDialogSlice } from '../../app/reducers/AlertDialog.slice';
import AlertDialog from '../AletrtDialog.tsx/AlertDialog';
import { notificatinBarSlice } from '../../app/reducers/NotificatinBar.slise';
import NotificationsBar from '../NotificationsBar/NotificationBar';

export default function CustomPaginationActionsTable() {
  const dispatch = useAppDispatch();
  const [, startTransition] = React.useTransition();
  const { page, rowsPerPage, filter, searchField } = useAppSelector((state) => state.specialistTypesTableReducer);
  const { setPage, setRowsPerPage, setFilter, setSearchField } = specialistTypesTableSlice.actions;
  const {
    switchVisible: switchFormDialogVisible,
    setName,
    setNote,
    setId: setFormDialogId,
    setTitle: setFormDialogTitle,
    setType,
  } = formDialogSlice.actions;
  const {
    switchVisible: switchAlertDialogVisible,
    setTitle: setAlertDialogTitle,
    setId: setAlertDialogId,
    setBody: setAlertDialogBody,
  } = alertDialogSlice.actions;
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
    dispatch(setPage(newPage));
    dispatch(setFilter({ page: newPage + 1 } as ISpecialistTypeQuery));
    // console.log(filter, newPage);
    // console.log('sp', specialistTypes);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    dispatch(setRowsPerPage(newRowsPerPage));
    dispatch(setFilter({ page: 0, limit: newRowsPerPage < 0 ? 0 : newRowsPerPage }));
    dispatch(setPage(0));
  };

  const handleSave = async (data: ISpecialistType, type: string) => {
    if (type === 'EDIT') {
      try {
        await updateType(data).unwrap();
        dispatch(setNotBarType('success'));
        dispatch(setNotBarText('Запись обновлена'));
        dispatch(switchFormDialogVisible());
      } catch (e) {
        dispatch(setNotBarType('error'));
        dispatch(setNotBarText('Запись с таким названием уже существует'));
      }
    }
    if (type === 'ADD') {
      try {
        await addType({ name: data.name, note: data.note }).unwrap();
        dispatch(setNotBarType('success'));
        dispatch(setNotBarText('Запись добавлена'));
        dispatch(switchFormDialogVisible());
      } catch (e) {
        dispatch(setNotBarType('error'));
        dispatch(setNotBarText('Запись с таким названием уже существует'));
      }
    }
    dispatch(switchNotBarVisible());
  };
  const handleRemoveBtnClick = (data: ISpecialistType) => {
    console.log(data._id);
    dispatch(setAlertDialogTitle('Удаление записи'));
    dispatch(setAlertDialogId(data._id));
    dispatch(setAlertDialogBody('Вы точно хотите удалить данную запись?'));
    dispatch(switchAlertDialogVisible());
    // removeType(data);
  };
  const remove = async (flag: boolean, id: string) => {
    if (flag) {
      try {
        await removeType({ _id: id } as ISpecialistType);
        dispatch(setNotBarType('success'));
        dispatch(setNotBarText('Запись удалена'));
      } catch (e) {
        dispatch(setNotBarType('error'));
        dispatch(setNotBarText('Произошла непредвиденная ошибка'));
      }
      dispatch(switchNotBarVisible());
    }
  };
  const update = (data: ISpecialistType) => {
    dispatch(switchFormDialogVisible());
    dispatch(setNote(data.note));
    dispatch(setName(data.name));
    dispatch(setFormDialogTitle('Редатирование записи'));
    dispatch(setType('EDIT'));
    dispatch(setFormDialogId(data._id));
    console.log(data.name, data.note, data._id);
  };
  const handleAdd = () => {
    dispatch(switchFormDialogVisible());
    dispatch(setNote(''));
    dispatch(setName(''));
    dispatch(setFormDialogId(undefined));
    dispatch(setType('ADD'));
    dispatch(setFormDialogTitle('Добавление записи'));
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const temp = event.target.value;
    dispatch(setSearchField(temp));
    startTransition(() => {
      dispatch(setFilter({ ...filter, page: 0, name: temp }));
      dispatch(setPage(0));
    });
  };
  const theme = createTheme({}, ruRU);

  return (
    <div>
      <TextField id="table-search" label="Поиск" variant="standard" onChange={onChangeHandler} value={searchField} />
      {isLoading && <CircularProgress />}
      {error && <h1>Произошла ошибка</h1>}
      {rows && (
        <ThemeProvider theme={theme}>
          <TableContainer component={Paper} sx={{ overflowX: 'hidden' }}>
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
                    <IconButton key="one" color="info" size="small" onClick={handleAdd}>
                      <AddBoxIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.data.map((row) => (
                  <MyTableRow
                    name={row.name}
                    note={row.note}
                    key={row._id}
                    id={row._id || row.name}
                    update={update}
                    remove={handleRemoveBtnClick}
                  />
                ))}
                {rows.data.length < rowsPerPage && rowsPerPage < rows.count && (
                  <TableRow
                    style={{ height: 40 * (rowsPerPage - rows.data.length) }}
                    className={[classes['my-table__row'], classes['my-table__row_nohover']].join(' ')}
                  >
                    <TableCell colSpan={3} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'Все', value: -1 }]}
                    colSpan={3}
                    count={rows?.count}
                    rowsPerPage={rowsPerPage}
                    labelRowsPerPage="Записей на странице:"
                    page={page}
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
      )}
      <FormDialog onSave={handleSave} />
      <AlertDialog onConfirm={remove} />
      <NotificationsBar />
    </div>
  );
}
