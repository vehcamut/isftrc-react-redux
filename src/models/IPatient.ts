/* eslint-disable @typescript-eslint/no-unused-vars */
import { DatePickRef } from 'antd/lib/date-picker/generatePicker/interface';
// import { Dayjs } from 'dayjs';

export interface IPatient {
  _id: string;
  number: number;
  // name: {
  //   first: string;
  //   last: string;
  //   patronymic: string;
  // };
  name: string;
  surname: string;
  patronymic: string;
  dateOfBirth: Date;
  // dateOfBirth: Date;
  // dateOfBirth: string;
  gender: string;
  address: string;
  isActive: boolean;
  note?: string;
}

export interface IPatientData {
  data: IPatient[];
  count: number;
}

export interface IPatientd {
  _id?: string;
  number?: number;
  // name: {
  //   first: string;
  //   last: string;
  //   patronymic: string;
  // };
  name?: string;
  surname?: string;
  patronymic?: string;
  dateOfBirth?: Date;
  // dateOfBirth: Date;
  // dateOfBirth: string;
  gender?: string;
  address?: string;
  isActive?: boolean;
  note?: string;
}
