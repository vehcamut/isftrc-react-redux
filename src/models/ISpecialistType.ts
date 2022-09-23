export interface ISpecialistType {
  _id?: string;
  name: string;
  note: string;
}

export interface ISpecialistTypeQuery {
  page?: number;
  limit?: number;
  order?: number | string;
  sort?: string;
  name?: string;
  note?: string;
}

export interface ISpecialistTypeResponse {
  data: ISpecialistType[];
  count: number;
}
