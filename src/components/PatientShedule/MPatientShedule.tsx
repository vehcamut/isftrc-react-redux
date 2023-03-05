import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IAppointment, IPatient } from '../../models';
import { appointmentsAPI } from '../../app/services/appointments.service';
import { useAppSelector } from '../../app/hooks';
import MShedule from '../Shedule/MShedule';
import MModalAppInfo from '../ModalAppInfo/MModalAppInfo';

interface MPatientSheduleProps extends PropsWithChildren {
  patient?: IPatient;
}

const MPatientShedule: FunctionComponent<MPatientSheduleProps> = ({ patient }) => {
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
      <MModalAppInfo
        title="Информация о записи"
        isOpen={isAppInfoOpen}
        setIsOpen={setIsAppInfoOpen}
        appointmentId={curAppId}
        setAppointmentId={setCurAppId}
        isSpecialistLink={!!isAdmin}
      />

      <MShedule
        dataAPI={appointmentsAPI.useGetForPatientAppointmentsOnCurrentDateQuery}
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

MPatientShedule.defaultProps = {
  patient: undefined,
};

export default MPatientShedule;
