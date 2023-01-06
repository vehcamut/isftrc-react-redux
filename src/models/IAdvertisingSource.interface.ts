export interface IAdvertisingSource {
  _id: string;
  name: string;
  isActive: boolean;
}

export interface IAdvertisingSourceData {
  data: IAdvertisingSource[];
  count: number;
}

export interface IAdvertisingSourceBase {
  _id: string;
  name: string;
}
