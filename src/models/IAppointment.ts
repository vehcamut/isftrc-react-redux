export interface IAppointment {
  _id: string;
  begDate: Date;
  endDate: Date;
  specialist: string;
  service?: string;
}

export interface IGetAppointment {
  date: string;
  specialistId: string;
}
