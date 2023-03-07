import React, { useState } from 'react';
import { Typography, Row, Col } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import './antd.rewrite.scss';
import ModalAppInfo from '../components/ModalAppInfo/ModalAppInfo';
import { appointmentsAPI } from '../app/services/appointments.service';
import Shedule from '../components/Shedule/Shedule';
import { useAppSelector } from '../app/hooks';
import { IAppointment } from '../models';

const SpecShedulePage = () => {
  const { id } = useAppSelector((state) => state.authReducer);
  const navigate = useNavigate();
  const [isAppInfoOpen, setIsAppInfoOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<IAppointment | undefined>(undefined);
  const params = useParams();

  const onAppointmentClick = (appointment: IAppointment) => {
    setCurrentAppointment(appointment);
    setIsAppInfoOpen(true);
  };

  return (
    <>
      <ModalAppInfo
        isPatientLink
        title="Информация о записи"
        isOpen={isAppInfoOpen}
        setIsOpen={setIsAppInfoOpen}
        appointmentId={currentAppointment?._id || ''}
      />
      <Row justify="space-between" align="middle" style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Col>
          <Typography.Title level={1} style={{ margin: 0 }}>
            Расписание
          </Typography.Title>
        </Col>
      </Row>

      <Shedule
        dataAPI={appointmentsAPI.useGetAppointmentsQuery}
        title="Продуктивной работы!"
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

export default SpecShedulePage;
