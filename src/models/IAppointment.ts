// eslint-disable-next-line import/no-cycle
import { IService } from './IService';

export interface IAppointment {
  _id: string;
  begDate: Date;
  endDate: Date;
  specialist: string;
  service?: IService;
}

export interface IGetAppointment {
  begDate: string;
  endDate: string;
  personId: string;
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

export interface IAddAppointment {
  begDate: Date;
  time: Date;
  specialist: string;
  amount: number;
}
export interface IAddedAppoitmentInfo {
  begDate: Date;
  endDate: Date;
}
export interface IAddAppointmentResult {
  amount: number;
  notAdded: IAddedAppoitmentInfo[];
}

export interface IRemoveAppointment {
  _id: string;
}
