import { TransactionType } from "../enums/transaction-type.enum";

export interface TransactionRequest {
  accountNumber: string;
  transactionType: TransactionType;
  amount: number;
}
