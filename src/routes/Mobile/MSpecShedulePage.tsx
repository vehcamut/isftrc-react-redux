/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { Typography, Row, Col, Button, Tabs, message, Spin, Descriptions, Divider } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import '../antd.rewrite.scss';
import { patientsAPI } from '../../app/services';
import PatinentDescription from '../../components/PatinentInfo/PatinentInfo';
import PatientRepresentatives from '../../components/PatientRepresentatives/PatientRepresentatives';
import PatinentCourse from '../../components/PatinentCourse/PatinentCourse';
import PatientShedule from '../../components/PatientShedule/PatientShedule';
import ModalAppInfo from '../../components/ModalAppInfo/ModalAppInfo';
import { appointmentsAPI } from '../../app/services/appointments.service';
import Shedule from '../../components/Shedule/Shedule';
import { useAppSelector } from '../../app/hooks';
import { IAppointment } from '../../models';
import MShedule from '../../components/Shedule/MShedule';
import MModalAppInfo from '../../components/ModalAppInfo/MModalAppInfo';

interface MSpecShedulePageProps extends PropsWithChildren {
  // eslint-disable-next-line react/require-default-props
  activeKey?: 'info' | 'representatives' | 'course' | 'shedule';
}

const { Title } = Typography;

const MSpecShedulePage: FunctionComponent<MSpecShedulePageProps> = ({ activeKey }) => {
  const { isAuth, roles, name, id } = useAppSelector((state) => state.authReducer);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [isAppInfoOpen, setIsAppInfoOpen] = useState(false);
  // current
  const [currentAppointment, setCurrentAppointment] = useState<IAppointment | undefined>(undefined);
  // form state
  const params = useParams();

  // const [currentPatient, setCurrentPatient] = useState<IService | undefined>(undefined);
  // const [currentSpecialist, setCurrentSpecialist] = useState<string | undefined>(undefined);
  // const { data, isLoading } = specialistAPI.useGetSpecificSpecialistsQuery({
  //   type: currentPatient?.type._id || '',
  // });

  const onAppInfoReset = () => {
    setCurrentAppointment(undefined);
    setIsAppInfoOpen(false);
  };

  const onAppointmentClick = (appointment: IAppointment) => {
    setCurrentAppointment(appointment);
    setIsAppInfoOpen(true);
  };

  const onAppClose = () => {
    console.log('CLOSE');
  };

  return (
    <>
      {contextHolder}
      <MModalAppInfo
        isPatientLink
        title="Информация о записи"
        isOpen={isAppInfoOpen}
        setIsOpen={setIsAppInfoOpen}
        appointmentId={currentAppointment?._id || ''}
        // setAppointmentId={setCurAppId}
      />
      <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Col style={{ textAlign: 'center', width: '100%' }}>
          <Typography.Title level={2} style={{ margin: 0 }}>
            Расписание
          </Typography.Title>
        </Col>
      </Row>

      <MShedule
        dataAPI={appointmentsAPI.useGetAppointmentsOnCurrentDateQuery}
        extraOptions={{ specialistId: id }}
        onAppointmentClick={onAppointmentClick}
        type="Specialist"
        onDateChange={(f, s) => {
          const path = `${Date.parse(params.date || '') ? './.' : ''}./${f}`;
          navigate(path, { replace: true });
        }}
      />
    </>
  );
};

export default MSpecShedulePage;
