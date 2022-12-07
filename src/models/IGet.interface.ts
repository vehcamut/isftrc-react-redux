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
