// import { IAppointment } from './IAppointment';
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
}

export interface IServiceGroupWithServises extends IServiceGroupWithId {
  services: IServiceInCourse[];
}

export interface IServiceInCourse {
  kind: string;
  _id: string;
  name: string;
  price: number;
  specialist: string;
  // type: IServiceTypeWithoutGroup;
  status: boolean;
  result?: string;
  note?: string;
  date?: string;
  // appointment?: IAppointment;
  patient?: string;
}
export interface IServiceTypeWithoutGroup {
  _id: string;
  name: string;
  price: number;
  isActive?: boolean;
  time?: Date;
}
