export interface BaseLot {
  quantity: number;
}

export interface CommonLot extends BaseLot {
  expiry: Date;
}
