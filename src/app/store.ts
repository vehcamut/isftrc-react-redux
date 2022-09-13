import { postAPI } from "./../services/PostService";
import { userAPI } from "./../services/UserServise";
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import userReducer from "./reducers/UserSlice";
import postReducer from "./reducers/PostSlice";

export const store = configureStore({
  reducer: {
    userReducer,
    postReducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [postAPI.reducerPath]: postAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userAPI.middleware, postAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/*export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;*/
