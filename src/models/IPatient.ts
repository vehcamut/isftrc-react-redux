export interface IPatient {
  _id: string;
  number: number;
  name: string;
  surname: string;
  patronymic: string;
  dateOfBirth: Date;
  gender: string;
  address: string;
  isActive: boolean;
  note?: string;
}

export interface IPatientChangeStatus {
  _id: string;
  isActive: boolean;
}

export interface IPatientData {
  data: IPatient[];
  count: number;
}

export interface IPatientd {
  _id?: string;
  number?: number;
  name?: string;
  surname?: string;
  patronymic?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  isActive?: boolean;
  note?: string;
}
