import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusLabel',
})
export class StatusLabelPipe implements PipeTransform {
  transform(status: boolean): string {
    return status ? 'ACTIVE' : 'INACTIVE';
  }
}
