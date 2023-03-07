import React, { useState } from 'react';
import { Typography, Row, Col } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import '../antd.rewrite.scss';
import { appointmentsAPI } from '../../app/services/appointments.service';
import { useAppSelector } from '../../app/hooks';
import { IAppointment } from '../../models';
import MShedule from '../../components/Shedule/MShedule';
import MModalAppInfo from '../../components/ModalAppInfo/MModalAppInfo';

const MSpecShedulePage = () => {
  const { id } = useAppSelector((state) => state.authReducer);
  const navigate = useNavigate();
  const [isAppInfoOpen, setIsAppInfoOpen] = useState(false);
  // current
  const [currentAppointment, setCurrentAppointment] = useState<IAppointment | undefined>(undefined);
  // form state
  const params = useParams();

  const onAppointmentClick = (appointment: IAppointment) => {
    setCurrentAppointment(appointment);
    setIsAppInfoOpen(true);
  };

  return (
    <>
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
        onDateChange={(f) => {
          const path = `${Date.parse(params.date || '') ? './.' : ''}./${f}`;
          navigate(path, { replace: true });
        }}
      />
    </>
  );
};

export default MSpecShedulePage;
