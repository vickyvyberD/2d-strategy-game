export interface ITransaction {
  description: string;
  amount: number;
  type: string;
  date: string;
}

export interface IFinancialTrackerState {
  transactions: ITransaction[];
  amount: string;
  description: string;
  type: string;
  loading: boolean;
} 