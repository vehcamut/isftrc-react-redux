// eslint-disable-next-line import/no-cycle
import { IServiceGroupWithId } from './IService';

export interface ICourse {
  number: number;
  status: boolean;
}

export interface ICourseWithId extends ICourse {
  _id: string;
}

export interface IGetCourses {
  patient: string;
}

export interface ICourseWithServices extends ICourseWithId {
  serviceGroups: IServiceGroupWithServises[];
  total: number;
}

export interface IServiceGroupWithServises extends IServiceGroupWithId {
  services: IServiceInCourse[];
  total: number;
  income: number;
  outcome: number;
}

export interface IPatientCourses {
  courses: ICourseWithServices[];
  canBeClose: boolean;
  canBeOpen: boolean;
  canBeNew: boolean;
}

export interface IServiceInCourse {
  kind: string;
  _id: string;
  name: string;
  price: number;
  cost?: number;
  specialist: string;
  payer?: string;
  number?: number;
  status: boolean;
  result?: string;
  note?: string;
  date?: string;
  patient?: string;
}
export interface IServiceTypeWithoutGroup {
  _id: string;
  name: string;
  price: number;
  isActive?: boolean;
  time?: Date;
}

export interface IPatientCourse {
  patientId: string;
}
