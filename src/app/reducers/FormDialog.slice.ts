import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { ISpecialistType } from '../../models/ISpecialistType';
// import { IPost } from '../../models';

interface IFormDialogState {
  visible: boolean;
  name: string;
  note: string;
  title: string;
  id: string | undefined;
  type: string;
  // onSave: (data: ISpecialistType) => void;
}

const initialState: IFormDialogState = {
  visible: false,
  title: 'FormDialog Title',
  name: '',
  note: '',
  type: '',
  id: undefined,
  // onSave: (data: ISpecialistType) => console.log(data),
};

export const formDialogSlice = createSlice({
  name: 'formDialog',
  initialState,
  reducers: {
    switchVisible(state: IFormDialogState) {
      state.visible = !state.visible;
    },
    setName(state: IFormDialogState, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setNote(state: IFormDialogState, action: PayloadAction<string>) {
      state.note = action.payload;
    },
    setId(state: IFormDialogState, action: PayloadAction<string | undefined>) {
      state.id = action.payload;
    },
    setTitle(state: IFormDialogState, action: PayloadAction<string>) {
      state.title = action.payload;
    },
    setType(state: IFormDialogState, action: PayloadAction<string>) {
      state.type = action.payload;
    },
    // setOnSave(state: IFormDialogState, action: PayloadAction<(data: ISpecialistType) => void>) {
    //   state.onSave = action.payload;
    // },
  },
});

export default formDialogSlice.reducer;
