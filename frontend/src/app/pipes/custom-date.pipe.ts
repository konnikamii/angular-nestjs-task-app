import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
})
export class CustomDatePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    if (!value) return 'Not set';
    const date = new Date(value);
    return date.toLocaleDateString();
  }
}
