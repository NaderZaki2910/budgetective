export type Wallet = {
  id?: number;
  name: string;
  description?: string;
  owner?: string;
  amount: number;
  date_created?: Date;
  last_edited?: Date;
};
