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
// import { useAppSelector } from './app/hooks';

const container = document.getElementById('root')!;
const root = createRoot(container);

const router = createBrowserRouter([
  {
    path: 'about',
    element: (
      <Template activeKey="about">
        <AboutPage />
      </Template>
    ),
  },
  {
    path: 'auth/signin',
    element: (
      <Template activeKey="specialists">
        <SignIn />
      </Template>
    ),
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
        element: <RolesGuard requiredRoles={['registrator']} />,
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
        element: <RolesGuard requiredRoles={['registrator']} />,
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
        element: <RolesGuard requiredRoles={['registrator']} />,
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
        element: <RolesGuard requiredRoles={['registrator']} />,
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
        element: <RolesGuard requiredRoles={['registrator']} />,
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
        element: <RolesGuard requiredRoles={['registrator']} />,
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
        element: <RolesGuard requiredRoles={['registrator']} />,
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
        element: <RolesGuard requiredRoles={['registrator']} />,
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
        element: <RolesGuard requiredRoles={['registrator']} />,
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
        element: <RolesGuard requiredRoles={['registrator']} />,
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
        element: <RolesGuard requiredRoles={['registrator']} />,
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
        element: <RolesGuard requiredRoles={['registrator']} />,
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
        element: <RolesGuard requiredRoles={['registrator']} />,
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
        element: <RolesGuard requiredRoles={['registrator']} />,
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
        element: <RolesGuard requiredRoles={['registrator']} />,
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
        element: <RolesGuard requiredRoles={['registrator']} />,
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
        element: <RolesGuard requiredRoles={['registrator']} />,
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
        element: <RolesGuard requiredRoles={['registrator']} />,
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
        element: <RolesGuard requiredRoles={['registrator']} />,
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
