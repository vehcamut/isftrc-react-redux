import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IAppointment, IPatient } from '../../models';
import { appointmentsAPI } from '../../app/services/appointments.service';
import Shedule from '../Shedule/Shedule';
import ModalAppInfo from '../ModalAppInfo/ModalAppInfo';
import { useAppSelector } from '../../app/hooks';

interface PatientSheduleProps extends PropsWithChildren {
  patient?: IPatient;
}

const PatientShedule: FunctionComponent<PatientSheduleProps> = ({ patient }) => {
  const { roles } = useAppSelector((state) => state.authReducer);
  const isAdmin = roles.find((r) => r === 'admin');
  const navigate = useNavigate();
  const [isAppInfoOpen, setIsAppInfoOpen] = useState(false);
  const params = useParams();

  const [curAppId, setCurAppId] = useState<string>('');

  const onAppointmentClick = (appointment: IAppointment) => {
    setCurAppId(appointment._id);
    setIsAppInfoOpen(true);
  };

  return (
    <>
      <ModalAppInfo
        title="Информация о записи"
        isOpen={isAppInfoOpen}
        setIsOpen={setIsAppInfoOpen}
        appointmentId={curAppId}
        setAppointmentId={setCurAppId}
        isSpecialistLink={!!isAdmin}
      />

      <Shedule
        dataAPI={appointmentsAPI.useGetForPatientAppointmentsQuery}
        title="Расписание пациента"
        extraOptions={{ patientId: patient?._id }}
        onAppointmentClick={onAppointmentClick}
        type="Patient"
        onDateChange={(f) => {
          const path = `${Date.parse(params.date || '') ? './.' : ''}./${f}`;
          navigate(path, { replace: true });
        }}
      />
    </>
  );
};

PatientShedule.defaultProps = {
  patient: undefined,
};

export default PatientShedule;
