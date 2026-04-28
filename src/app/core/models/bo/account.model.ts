import { AccountType } from "../enums/account-type.enum";

export interface AccountFilters {
  accountNumber?: string;
  typeAccount?: AccountType | '';
  clientName?: string;
}
