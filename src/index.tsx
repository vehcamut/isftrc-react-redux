import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { store } from './app/store';
// import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import SignIn from './routes/SignIn';
import Auth from './routes/Auth';
// import RolesAuthRoute from './app/RolesAuthRoute';
// import RequireAuth from './components/RequireAuth';
import Main from './routes/Main';
import AuthGuard from './components/guards/authGuard';
import RolesGuard from './components/guards/rolesGuard';
// import { useAppSelector } from './app/hooks';

const container = document.getElementById('root')!;
const root = createRoot(container);

const router = createBrowserRouter([
  {
    path: 'auth/signin',
    element: <SignIn />,
  },
  {
    children: [
      {
        children: [
          {
            path: '/auth',
            element: <Auth />,
          },
        ],
        element: <RolesGuard requiredRoles={['registrator']} />,
      },
      {
        path: '/',
        element: <Main />,
      },
    ],
    element: <AuthGuard />,
  },
  // {
  //   children: [
  //     {
  //       path: '/auth',
  //       element: <Auth />,
  //     },
  //   ],
  //   element: <RequireAuth requiredRoles={['registrator']} />,
  // },
  // {
  //   children: [
  //     {
  //       path: '/',
  //       element: <Main />,
  //     },
  //   ],
  // },
]);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      {/* <App /> */}
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
