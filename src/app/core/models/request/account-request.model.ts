import { AccountType } from "../enums/account-type.enum";

export interface AccountRequest {
  accountNumber: string;
  typeAccount: AccountType;
  originalBalance: number;
  status: boolean;
  clientId: string;
}
