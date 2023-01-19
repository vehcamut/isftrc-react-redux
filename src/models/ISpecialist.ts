import { ISpecialistType } from './ISpecialistType';

export interface ISpecialist {
  _id: string;
  name: string;
  surname: string;
  patronymic: string;
  phoneNumbers: string[];
  dateOfBirth: Date;
  emails: string[];
  login: string;
  gender: string;
  address: string;
  types: ISpecialistType[];
  isActive?: boolean;
  hash?: string;
}

export interface ISpecialistChangeStatus {
  _id: string;
  isActive: boolean;
}

export interface ISpecialistData {
  data: ISpecialist[];
  count: number;
}
