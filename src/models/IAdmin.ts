export interface IAdmin {
  name: string;
  surname: string;
  patronymic: string;
  phoneNumbers: string[];
  dateOfBirth: Date;
  emails: string[];
  login: string;
  gender: string;
  address: string;
  isActive?: boolean;
  hash?: string;
}

export interface IAdminWithId extends IAdmin {
  _id?: string;
}

export interface IAdminChangeStatus {
  _id: string;
  isActive: boolean;
}

export interface IAdminData {
  data: IAdmin[];
  count: number;
}
