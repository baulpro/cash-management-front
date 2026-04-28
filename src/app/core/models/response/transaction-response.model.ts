import { TransactionType } from "../enums/transaction-type.enum";

export interface TransactionResponse {
  transactionId: string;
  accountNumber: string;
  date: string;
  transactionType: TransactionType;
  amount: number;
  availableBalance: number;
  clientName: string;
}
