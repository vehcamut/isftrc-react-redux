import { IAdvertisingSourceBase } from './IAdvertisingSource.interface';

export interface IRepresentative {
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
  advertisingSources: IAdvertisingSourceBase[];
  isActive?: boolean;
  hash?: string;
}

export interface IRepresentativeChangeStatus {
  _id: string;
  isActive: boolean;
}

export interface IRepresentativeData {
  data: IRepresentative[];
  count: number;
}
