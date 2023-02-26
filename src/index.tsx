/* eslint-disable no-useless-escape */
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
import SpecShedulePage from './routes/SpecShedulePage';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { authSlice } from './app/reducers';
import MProfilePage from './routes/Mobile/MProfilePage';
import MTemplate from './routes/Mobile/MTemplate';
import MPatients from './routes/Mobile/MPatients';
import MAddPatient from './routes/Mobile/MAddPatients';
import MPatientPage from './routes/Mobile/MPatientPage';
import MSpecShedulePage from './routes/Mobile/MSpecShedulePage';
import MAboutPage from './routes/Mobile/MAboutPage';
import MErrorPage from './routes/Mobile/MErrorPage';
// import { useAppSelector } from './app/hooks';

let isMobile = false;
declare global {
  interface Window {
    opera: any;
  }
}

(function (a) {
  if (
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
      a,
    ) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
      a.substr(0, 4),
    )
  )
    isMobile = true;
})(navigator.userAgent || navigator.vendor || window.opera);

// (function (a) {
//   if (
//     /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
//       a,
//     ) ||
//     /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
//       a.substr(0, 4),
//     )
//   )
//     check = true;
// })(navigator.userAgent || navigator.vendor || window.opera);
// localStorage.isMobile = check;
// const dispatch = useAppDispatch();
// dispatch(authSlice.actions.setIsMobile(check));
document.documentElement.lang = 'ru';
const container = document.getElementById('root')!;
const root = createRoot(container);
// const location = useLocation();
const router = createBrowserRouter([
  {
    path: 'notauth/about',
    element: isMobile ? (
      <MTemplate activeKey="about">
        <MAboutPage />
      </MTemplate>
    ) : (
      <Template activeKey="about">
        <AboutPage />
      </Template>
    ),
    // element: (
    //   <Template activeKey="about">
    //     <AboutPage />
    //   </Template>
    // ),
  },
  {
    path: 'auth/signin',
    element: isMobile ? (
      <MTemplate activeKey="">
        <SignIn />
      </MTemplate>
    ) : (
      <Template activeKey="">
        <SignIn />
      </Template>
    ),
    // element: (
    //   <Template activeKey="">
    //     <SignIn />
    //   </Template>
    // ),
  },

  {
    path: 'auth/signup',
    element: isMobile ? (
      <MTemplate activeKey="">
        <SignUp />
      </MTemplate>
    ) : (
      <Template activeKey="">
        <SignUp />
      </Template>
    ),
    // element: (
    // <Template activeKey="">
    //   <SignUp />
    // </Template>
    // ),
  },

  {
    path: '*',
    element: <Navigate to="./" />,
  },

  {
    children: [
      // {
      //   children: [
      //     {
      //       path: '/shedule',
      //       element: (
      //         <Template activeKey="shedule">
      //           <SpecShedulePage />
      //         </Template>
      //       ),
      //     },
      //   ],
      //   element: <RolesGuard requiredRoles={['specialist']} />,
      // },
      {
        children: [
          {
            path: '/shedule',
            element: isMobile ? (
              <MTemplate activeKey="shedule">
                <MSpecShedulePage />
              </MTemplate>
            ) : (
              <Template activeKey="shedule">
                <SpecShedulePage />
              </Template>
            ),
            // element: (
            // <Template activeKey="shedule">
            //   <SpecShedulePage />
            // </Template>
            // ),
          },
        ],
        element: <RolesGuard requiredRoles={['specialist']} />,
      },
      {
        children: [
          {
            path: '/shedule/:date',
            element: isMobile ? (
              <MTemplate activeKey="shedule">
                <MSpecShedulePage />
              </MTemplate>
            ) : (
              <Template activeKey="shedule">
                <SpecShedulePage />
              </Template>
            ),
          },
        ],
        element: <RolesGuard requiredRoles={['specialist']} />,
      },
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
            element: isMobile ? (
              <MTemplate activeKey="profile">
                <MProfilePage />
              </MTemplate>
            ) : (
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
      // {
      //   children: [
      //     {
      //       path: '/admin/error',
      //       element: isMobile ? (
      //         <MTemplate activeKey="">
      //           <MErrorPage />
      //         </MTemplate>
      //       ) : (
      //         <Template activeKey="about">
      //           <AboutPage />
      //         </Template>
      //       ),
      //       // element: (
      //       //   <Template activeKey="about">
      //       //     <AboutPage />
      //       //   </Template>
      //       // ),
      //     },
      //   ],
      //   element: <RolesGuard requiredRoles={['admin']} />,
      // },
      {
        children: [
          {
            path: '/about',
            element: isMobile ? (
              <MTemplate activeKey="about">
                <MAboutPage />
              </MTemplate>
            ) : (
              <Template activeKey="about">
                <AboutPage />
              </Template>
            ),
            // element: (
            //   <Template activeKey="about">
            //     <AboutPage />
            //   </Template>
            // ),
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
            element: isMobile ? (
              <MTemplate activeKey="patients">
                <MPatients />
              </MTemplate>
            ) : (
              <Template activeKey="patients">
                <Patients />
              </Template>
            ),
            // element: (

            // ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin', 'representative', 'specialist']} />,
      },
      {
        children: [
          {
            path: '/patients/add',
            element: isMobile ? (
              <MTemplate activeKey="patients">
                <MAddPatient />
              </MTemplate>
            ) : (
              <Template activeKey="patients">
                <AddPatient />
              </Template>
            ),
            // element: (
            //   <Template activeKey="patients">
            //     <AddPatient />
            //   </Template>
            // ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin', 'representative']} />,
      },
      {
        children: [
          {
            path: '/patients/:id/info',
            element: isMobile ? (
              <MTemplate activeKey="patients">
                <MPatientPage activeKey="info" />
              </MTemplate>
            ) : (
              <Template activeKey="patients">
                <PatientPage activeKey="info" />
              </Template>
            ),
            // element: (
            //   <Template activeKey="patients">
            //     <PatientPage activeKey="info" />
            //   </Template>
            // ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin', 'representative', 'specialist']} />,
      },
      {
        children: [
          {
            path: '/patients/:id/representatives',
            element: isMobile ? (
              <MTemplate activeKey="patients">
                <MPatientPage activeKey="representatives" />
              </MTemplate>
            ) : (
              <Template activeKey="patients">
                <PatientPage activeKey="representatives" />
              </Template>
            ),
            // element: (
            //   <Template activeKey="patients">
            //     <PatientPage activeKey="representatives" />
            //   </Template>
            // ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin', 'representative', 'specialist']} />,
      },
      {
        children: [
          {
            path: '/patients/:id/course',
            element: isMobile ? (
              <MTemplate activeKey="patients">
                <MPatientPage activeKey="course" />
              </MTemplate>
            ) : (
              <Template activeKey="patients">
                <PatientPage activeKey="course" />
              </Template>
            ),
            // element: (
            //   <Template activeKey="patients">
            //     <PatientPage activeKey="course" />
            //   </Template>
            // ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin', 'representative', 'specialist']} />,
      },
      {
        children: [
          {
            path: '/patients/:id/shedule',
            element: isMobile ? (
              <MTemplate activeKey="patients">
                <MPatientPage activeKey="shedule" />
              </MTemplate>
            ) : (
              <Template activeKey="patients">
                <PatientPage activeKey="shedule" />
              </Template>
            ),
            // element: (
            //   <Template activeKey="patients">
            //     <PatientPage activeKey="shedule" />
            //   </Template>
            // ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin', 'representative', 'specialist']} />,
      },
      {
        children: [
          {
            path: '/patients/:id/shedule/:date',
            element: isMobile ? (
              <MTemplate activeKey="patients">
                <MPatientPage activeKey="shedule" />
              </MTemplate>
            ) : (
              <Template activeKey="patients">
                <PatientPage activeKey="shedule" />
              </Template>
            ),
            // element: (
            //   <Template activeKey="patients">
            //     <PatientPage activeKey="shedule" />
            //   </Template>
            // ),
          },
        ],
        element: <RolesGuard requiredRoles={['admin', 'representative', 'specialist']} />,
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
console.log(process.env.REACT_APP_API_URL);
// const { isMobile } = useAppSelector((state) => state.authReducer);
// require('dotenv').config();

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
