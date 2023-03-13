import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency',
})
export class CustomCurrencyPipe implements PipeTransform {
  transform(value: number): string | null {
    if (value) {
      return value.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });
    }
    return null;
  }
}
