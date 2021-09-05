export interface OrderData {
  orderType: string;
  orderId: string;
  orderDescription: string;
}

export enum OrderType {
  CREATE_ORDER = 'create-order',
  CANCEL_ORDER = 'cancel-order',
}
