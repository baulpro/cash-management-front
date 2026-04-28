import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const dateRangeValidator =
  (startKey: string, endKey: string): ValidatorFn =>
    (group: AbstractControl): ValidationErrors | null => {
      const start = group.get(startKey)?.value;
      const end = group.get(endKey)?.value;
      if (start && end && new Date(start) > new Date(end)) {
        return { dateRangeInvalid: true };
      }
      return null;
    };
