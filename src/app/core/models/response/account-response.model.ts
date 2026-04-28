import { AccountType } from "../enums/account-type.enum";

export interface AccountResponse {
  accountId: string;
  accountNumber: string;
  typeAccount: AccountType;
  originalBalance: number;
  currentBalance: number;
  status: boolean;
  clientId: string;
  clientName: string;
}
