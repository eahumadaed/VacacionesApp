import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrencyClp'
})
export class CurrencyClpPipe implements PipeTransform {

  transform(value: number): string {
    if (value == null) {
      return '$0 CLP';
    }

    const formattedValue = new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);

    return formattedValue.replace(',', '.');
  }
}
