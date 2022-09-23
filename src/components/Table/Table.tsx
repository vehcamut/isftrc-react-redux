import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { Button, createTheme, IconButton, TableHead, ThemeProvider } from '@mui/material';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ruRU } from '@mui/material/locale';
import AddBoxIcon from '@mui/icons-material/AddBox';
import classes from './MyTable.module.scss';

import { specialistTypesTableSlice } from '../../app/reducers/SpecialistTypesTableSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import specialistAPI from '../../services/SpecialistsService';
// import { /* ISpecialistType */ ISpecialistTypeQuery } from '../../models';
import TablePaginationActions from './TablePaginationActions';
import MyTableRow from './MyTableRow';
import { formDialogSlice } from '../../app/reducers/FormDialog.slice';
import FormDialog from '../FormDialog/FormDialog';
import { ISpecialistType } from '../../models';

export default function CustomPaginationActionsTable() {
  const dispatch = useAppDispatch();
  const { page, rowsPerPage, filter } = useAppSelector((state) => state.specialistTypesTableReducer);
  const { setPage, setRowsPerPage, setFilter } = specialistTypesTableSlice.actions;
  const { data: rows, isLoading, error } = specialistAPI.useGetTypesQuery(filter);
  const [updateType] = specialistAPI.useEditMutation();
  // const { visible, name, note } = useAppSelector((state) => state.formDialogReducer);
  const { switchVisible, setName, setNote, setId } = formDialogSlice.actions;
  // let name = '';
  // let note = '';
  // Avoid a layout jump when reaching the last page with empty rows.
  // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - (rows?.data.length || 0)) : 0;
  // setRowsPerPage(5);
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    dispatch(setPage(newPage));
    dispatch(setFilter({ page: newPage + 1 }));
    // console.log(filter, newPage);
    // console.log('sp', specialistTypes);
  };

  const update = (data: ISpecialistType) => {
    dispatch(switchVisible());
    // name = data.name;
    // note = data.note;
    dispatch(setNote(data.note));
    dispatch(setName(data.name));
    // eslint-disable-next-line no-underscore-dangle
    dispatch(setId(data._id));
    // eslint-disable-next-line no-underscore-dangle
    console.log(data.name, data.note, data._id);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    dispatch(setRowsPerPage(newRowsPerPage));
    dispatch(setFilter({ page: 0, limit: newRowsPerPage < 0 ? 0 : newRowsPerPage }));
    dispatch(setPage(0));
  };

  const forward = () => {
    dispatch(setFilter({ page: 2 }));
  };

  const backward = () => {
    dispatch(setFilter({ page: 1 }));
  };
  const switchVisible1 = () => {
    dispatch(switchVisible());
  };
  const handleSave = async (data: ISpecialistType) => {
    await updateType(data);
    console.log(data.name, data.note);
  };
  // console.log(dispatch(getLOL(typeFilter)));
  const theme = createTheme({}, ruRU);

  return (
    <div>
      <Button onClick={backward}>назад</Button>
      <Button onClick={forward}>вперед</Button>
      {isLoading && <h1>Идет загрузка...</h1>}
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
                    <IconButton key="one" color="info" size="small">
                      <AddBoxIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  // (rowsPerPage > 0
                  //   ? rows.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  //   : rows.data
                  // )
                  rows.data.map((row) => (
                    // eslint-disable-next-line no-underscore-dangle
                    <MyTableRow name={row.name} note={row.note} key={row._id} id={row._id} update={update} />
                  ))
                }
                {/* {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={3} />
                  </TableRow>
                )} */}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'Все', value: -1 }]}
                    colSpan={3}
                    count={rows?.count}
                    rowsPerPage={rowsPerPage}
                    labelRowsPerPage="Показано записей:"
                    page={page}
                    SelectProps={{
                      inputProps: {
                        'aria-label': 'rows per page',
                      },
                      native: false,
                    }}
                    onPageChange={handleChangePage}
                    // onChangeRowsPerPage={handleChangeRowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </ThemeProvider>
      )}
      <Button onClick={switchVisible1}>открыть</Button>
      <FormDialog
        // visible={visible}
        switchVisible1={switchVisible1}
        onSave={handleSave}
        // name={name}
        // note={note}
        title="Редатирование записи"
      />
    </div>
  );
}
