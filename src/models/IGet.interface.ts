export interface IGet {
  page?: number;
  limit?: number;
  order?: 'desc' | 'asc' | undefined;
  sort?: string;
  filter?: string;
}

export interface IGetByID {
  id: string;
}

export interface IGetRepPatients {
  id: string;
  isActive?: boolean;
}
export interface IGetPerson extends IGet {
  isActive?: boolean;
}

export interface IGetPatient extends IGetPerson {
  representativeId?: string;
}
export interface IGetAdvertisingSource extends IGet {
  isActive?: boolean;
}
