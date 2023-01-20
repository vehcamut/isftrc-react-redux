export interface IAppointment {
  _id: string;
  begDate: Date;
  endDate: Date;
  specialist: string;
  service?: string;
}

export interface IGetAppointment {
  begDate: string;
  endDate: string;
  specialistId: string;
}

export interface IAppointmentWeek {
  monday: IAppointment[];
  tuesday: IAppointment[];
  wensday: IAppointment[];
  thursday: IAppointment[];
  friday: IAppointment[];
  saturday: IAppointment[];
  sunday: IAppointment[];
}
