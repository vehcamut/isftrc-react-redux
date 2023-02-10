export interface IGetAdvance {
  patient: string;
}

export interface IPayment {
  name: string;
  groupId?: string;
  inCourse: boolean;
  patient: string;
  amount: number;
  date: Date;
  payer?: string;
  fromTheAdvance?: boolean;
}

export interface IPaymentInfo {
  id: string;
  name?: string;
  group?: string;
  amount: number;
  date: Date;
  payer?: string;
  canRemove: boolean;
}

export interface IRemovePayment {
  id: string;
}
