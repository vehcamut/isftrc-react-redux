import React, { useEffect } from "react";
import logo from "./logo.svg";
//import { Counter } from "../features/counter/Counter";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { userSlice } from "./app/reducers/UserSlice";
import { fetchUsers } from "./app/reducers/ActionCreators";
import PostContainer from "./components/PostContainer";

function App() {
  const dispatch = useAppDispatch();
  const { users, isLoading, error } = useAppSelector(
    (state) => state.userReducer
  );

  //единожды при монтировании компонента
  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  return (
    <div className="App">
      {/*{isLoading && <h1>Идет загрузка...</h1>}
      {error && <h1>{error}</h1>}
  {JSON.stringify(users, null, 2)}*/}
      <PostContainer />
    </div>
  );
}

export default App;
