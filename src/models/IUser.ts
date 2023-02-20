import { IAdvertisingSourceBase } from './IAdvertisingSource.interface';
import { ISpecialistType } from './ISpecialistType';

export interface IUser {
  login: string;
  password: string;
}

export interface IUserInfo {
  _id: string;
  isActive: string;
  type: ISpecialistType[];
  name: string;
  surname: string;
  patronymic: string;
  phoneNumbers: string[];
  dateOfBirth: Date;
  emails: string[];
  login: string;
  gender: string;
  address: string;
  advertisingSources?: IAdvertisingSourceBase[];
  types?: ISpecialistType[];

  // _id: string;
  // name: string;
  // surname: string;
  // patronymic: string;
  // phoneNumbers: string[];
  // dateOfBirth: Date;
  // emails: string[];
  // login: string;
  // gender: string;
  // address: string;
  // types: ISpecialistType[];
  // hash?: string;
}
