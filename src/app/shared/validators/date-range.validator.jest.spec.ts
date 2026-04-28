import { FormControl, FormGroup } from '@angular/forms';
import { dateRangeValidator } from './date-range.validator';

describe('dateRangeValidator', () => {
  it('should return null when startDate is before endDate', () => {
    const group = new FormGroup(
      {
        startDate: new FormControl('2024-01-01'),
        endDate: new FormControl('2024-01-31'),
      },
      { validators: dateRangeValidator('startDate', 'endDate') }
    );

    expect(group.errors).toBeNull();
  });

  it('should return dateRangeInvalid error when startDate is after endDate', () => {
    const group = new FormGroup(
      {
        startDate: new FormControl('2024-01-31'),
        endDate: new FormControl('2024-01-01'),
      },
      { validators: dateRangeValidator('startDate', 'endDate') }
    );

    expect(group.errors).toEqual({ dateRangeInvalid: true });
  });
});
