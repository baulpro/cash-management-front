import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) return '$ 0.00';
    return `$ ${Number(value).toFixed(2)}`;
  }
}
