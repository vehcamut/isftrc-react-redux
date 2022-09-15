import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { IPost } from '../../models';

interface PostState {
  color: string;
}

const initialState: PostState = {
  color: '#8f9cdb',
};

export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    colored(state, action: PayloadAction<string>) {
      state.color = action.payload;
    },
  },
});

export default postSlice.reducer;
