/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, Navigate, Outlet, redirect, RouterProvider } from 'react-router-dom';
import { store } from './app/store';
// import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import SignIn from './routes/SignIn';
// import Auth from './routes/Auth';
// import RolesAuthRoute from './app/RolesAuthRoute';
// import RequireAuth from './components/RequireAuth';
// import Main from './routes/Main';
import AuthGuard from './components/guards/authGuard';
import RolesGuard from './components/guards/rolesGuard';
import Patients from './routes/Patients';
import Template from './routes/Template';
import AddPatient from './routes/AddPatients';
import PatientPage from './routes/PatientPage';
import Representatives from './routes/Representatives';
import HandbooksPage from './routes/HandbooksPage';
import AdvertisingSourcePage from './routes/AdvertisingSourcePage';
import AddRepresentative from './routes/AddRepresentative';
import RepresentativePage from './routes/RepresentativePage';
import SpecialistTypePage from './routes/SpecialistTypePage';
import Specialists from './routes/Specialists';
import AddSpecialist from './routes/AddSpecialist';
import SpecialistPage from './routes/SpecialistPage';
import ServicesPage from './routes/ServicesPage';
import AboutPage from './routes/AboutPage';
import ProfilePage from './routes/ProfilePage';
import Main from './routes/Main';
import Admins from './routes/Admins';
import AdminPage from './routes/AdminPage';
import AddAdmins from './routes/AddAdmins';
import SignUp from './routes/SignUp';
// import { useAppSelector } from './app/hooks';

document.documentElement.lang = 'ru';
const container = document.getElementById('root')!;
const root = createRoot(container);
// const location = useLocation();
const router = createBrowserRouter([
  {
    // children: [
    //   {
    //     path: '/about',
    //     element: (
    //       <Template activeKey="about">
    //         <AboutPage />
    //       </Template>
    //     ),
    //   },
    // ],
    // element: <RolesGuard requiredRoles={['admin']} />,
    path: 'notauth/about',
    element: (
      <Template activeKey="about">
        <AboutPage />
      </Template>
    ),
  },
  // {
  //   path: '/about',
  //   element: (
  //     <Template activeKey="about">
  //       <AboutPage />
  //     </Template>
  //   ),
  // },
  {
    path: 'auth/signin',
    element: (
      <Template activeKey="">
        <SignIn />
      </Template>
    ),
  },

  {
    path: 'auth/signup',
    element: (
      <Template activeKey="">
        <SignUp />
      </Template>
    ),
  },

  {
    path: '*',
    element: <Navigate to="./" />,
  },

  {
    children: [
      {
        children: [
          {
            path: '/admins',
            element: (
              <Template activeKey="admins">
                <Admins />
              </Template>
            ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin']} />,
      },
      {
        children: [
          {
            path: '/admins/add',
            element: (
              <Template activeKey="admins">
                <AddAdmins />
              </Template>
            ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin']} />,
      },
      {
        children: [
          {
            path: '/admins/:id/info',
            element: (
              <Template activeKey="admins">
                <AdminPage activeKey="info" />
              </Template>
            ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin']} />,
      },
      {
        children: [
          {
            path: '/profile',
            element: (
              <Template activeKey="profile">
                <ProfilePage />
              </Template>
            ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin', 'specialist', 'representative']} />,
      },
      {
        children: [
          {
            path: '/',
            element: <Main />,
          },
        ],
        element: <RolesGuard requiredRoles={['admin', 'specialist', 'representative']} />,
      },
      // {
      //   children: [
      //     {
      //       path: '/auth',
      //       element: <Auth />,
      //     },
      //   ],
      //   element: <RolesGuard requiredRoles={['admin']} />,
      // },
      {
        children: [
          {
            path: '/about',
            element: (
              <Template activeKey="about">
                <AboutPage />
              </Template>
            ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin', 'specialist', 'representative']} />,
      },
      {
        children: [
          {
            path: '/specialists',
            element: (
              <Template activeKey="specialists">
                <Specialists />
              </Template>
            ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin']} />,
      },
      {
        children: [
          {
            path: '/specialists/add',
            element: (
              <Template activeKey="specialists">
                <AddSpecialist />
              </Template>
            ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin']} />,
      },
      {
        children: [
          {
            path: '/specialists/:id/info',
            element: (
              <Template activeKey="specialists">
                <SpecialistPage activeKey="info" />
              </Template>
            ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin']} />,
      },
      {
        children: [
          {
            path: '/specialists/:id/shedule/:date',
            element: (
              <Template activeKey="specialists">
                <SpecialistPage activeKey="shedule" />
              </Template>
            ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin']} />,
      },
      {
        children: [
          {
            path: '/specialists/:id/shedule',
            element: (
              <Template activeKey="specialists">
                <SpecialistPage activeKey="shedule" />
              </Template>
            ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin']} />,
      },
      {
        children: [
          {
            path: '/representatives',
            element: (
              <Template activeKey="representatives">
                <Representatives />
              </Template>
            ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin']} />,
      },
      {
        children: [
          {
            path: '/representatives/add',
            element: (
              <Template activeKey="representatives">
                <AddRepresentative />
              </Template>
            ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin']} />,
      },
      {
        children: [
          {
            path: '/representatives/:id/info',
            element: (
              <Template activeKey="representatives">
                <RepresentativePage activeKey="info" />
              </Template>
            ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin']} />,
      },
      {
        children: [
          {
            path: '/representatives/:id/patients',
            element: (
              <Template activeKey="representatives">
                <RepresentativePage activeKey="patients" />
              </Template>
            ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin']} />,
      },
      {
        children: [
          {
            path: '/patients',
            element: (
              <Template activeKey="patients">
                <Patients />
              </Template>
            ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin', 'representative']} />,
      },
      {
        children: [
          {
            path: '/patients/add',
            element: (
              <Template activeKey="patients">
                <AddPatient />
              </Template>
            ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin', 'representative']} />,
      },
      {
        children: [
          {
            path: '/patients/:id/info',
            element: (
              <Template activeKey="patients">
                <PatientPage activeKey="info" />
              </Template>
            ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin', 'representative']} />,
      },
      {
        children: [
          {
            path: '/patients/:id/representatives',
            element: (
              <Template activeKey="patients">
                <PatientPage activeKey="representatives" />
              </Template>
            ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin', 'representative']} />,
      },
      {
        children: [
          {
            path: '/patients/:id/course',
            element: (
              <Template activeKey="patients">
                <PatientPage activeKey="course" />
              </Template>
            ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin', 'representative']} />,
      },
      {
        children: [
          {
            path: '/patients/:id/shedule',
            element: (
              <Template activeKey="patients">
                <PatientPage activeKey="shedule" />
              </Template>
            ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin', 'representative']} />,
      },
      {
        children: [
          {
            path: '/patients/:id/shedule/:date',
            element: (
              <Template activeKey="patients">
                <PatientPage activeKey="shedule" />
              </Template>
            ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin', 'representative']} />,
      },
      {
        children: [
          {
            path: '/handbooks',
            element: (
              <Template activeKey="handbooks">
                <HandbooksPage />
              </Template>
            ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin']} />,
      },
      {
        children: [
          {
            path: '/handbooks/advertisingSource',
            element: (
              <Template activeKey="handbooks">
                <AdvertisingSourcePage />
              </Template>
            ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin']} />,
      },
      {
        children: [
          {
            path: '/handbooks/specialistType',
            element: (
              <Template activeKey="handbooks">
                <SpecialistTypePage />
              </Template>
            ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin']} />,
      },
      {
        children: [
          {
            path: '/handbooks/services',
            element: (
              <Template activeKey="handbooks">
                <ServicesPage />
              </Template>
            ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin']} />,
      },
      // {
      //   path: '/',
      //   element: <Patients />,
      // },
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
  //   element: <RequireAuth requiredRoles={['admin']} />,
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
