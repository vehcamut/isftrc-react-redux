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
