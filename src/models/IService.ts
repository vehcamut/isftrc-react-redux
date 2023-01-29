import { IPatient } from './IPatient';
// eslint-disable-next-line import/no-cycle
import { IAppointment } from './IAppointment';
import { ISpecialistType } from './ISpecialistType';

export interface IService {
  _id: string;
  status: boolean;
  type: IServiceTypeWithId;
  course: string;
  result?: string;
  time: Date;
  number?: number;
  note?: string;
  appointment?: IAppointment | undefined;
  patient?: IPatient;
}

export interface IServiceInfo {
  type: string;
  status: boolean;
  course: string;
  result?: string;
  note?: string;
  number?: number;
  date?: Date;
  specialist?: string;
  patient: string;
}

export interface IServiceGroup {
  isActive: boolean;
  name: string;
}

export interface IServiceGroupWithId extends IServiceGroup {
  _id: string;
}

export interface IServiceType {
  name: string;
  specialistTypes: ISpecialistType[];
  group: string;
  isActive: boolean;
  price: number;
  time: Date;
  defaultAmountPatient?: number;
}

export interface IServiceTypeWithId extends IServiceType {
  _id: string;
}

export interface IServiceGroupWithIdAndTypes extends IServiceGroupWithId {
  types: IServiceTypeWithId[];
}

export interface IGetServiceType {
  filter: string;
}

export interface IGetServiceById {
  id: string;
}
