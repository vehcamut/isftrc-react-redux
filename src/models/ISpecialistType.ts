export interface ISpecialistType {
  _id: string;
  name: string;
  isActive: boolean;
}

export interface ISpecialistTypeData {
  data: ISpecialistType[];
  count: number;
}

export interface ISpecialistTypeBase {
  _id: string;
  name: string;
}
