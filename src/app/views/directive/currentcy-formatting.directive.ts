// import { Directive, ElementRef, HostListener } from '@angular/core';
// import { ControlValueAccessor } from '@angular/forms';

// @Directive({
//   selector: '[appCurrencyFormatting]',
// })
// export class CurrencyFormattingDirective implements ControlValueAccessor {
//   // constructor(private el: ElementRef) {}

//   private onChange: any;
//   private onTouched: any;
//   private inputElement: HTMLInputElement;

//   constructor(private el: ElementRef) {
//     this.inputElement = el.nativeElement;
//   }

//   writeValue(value: any): void {
//     // const formattedValue = formatCurrency(value); // Hàm xử lý giá trị của input
//     console.log('value', value);

//     // this.inputElement.value = formattedValue;
//   }

//   registerOnChange(fn: any): void {
//     this.onChange = fn;
//   }

//   registerOnTouched(fn: any): void {
//     this.onTouched = fn;
//   }

//   setDisabledState?(isDisabled: boolean): void {
//     this.inputElement.disabled = isDisabled;
//   }

//   @HostListener('input', ['$event']) onInput(event: any) {
//     // Get input value and replace any non-numeric characters
//     let value = event.target.value.replace(/[^0-9]/g, '');

//     // Format value as currency with comma separator
//     value = new Intl.NumberFormat('vi-VN', {
//       style: 'currency',
//       currency: 'VND',
//     }).format(value);

//     // Set input value
//     event.target.value = value;
//   }
// }

import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCurrencyFormat]',
})
export class CurrencyFormatDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    const initialValue = this.el.nativeElement.value;

    // Chỉ cho phép các ký tự số và dấu chấm
    this.el.nativeElement.value = initialValue.replace(/[^0-9.]/g, '');

    // Định dạng giá trị input thành định dạng tiền tệ
    if (this.el.nativeElement.value !== initialValue) {
      event.stopPropagation();
      this.el.nativeElement.dispatchEvent(new Event('input'));
    } else {
      this.formatCurrency();
    }
  }

  formatCurrency() {
    let value = this.el.nativeElement.value;

    // Xóa các dấu phân cách cũ (nếu có)
    value = value.replace(/,/g, '');

    // Định dạng giá trị theo định dạng tiền tệ
    if (value) {
      const parts = value.toString().split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      this.el.nativeElement.value = parts.join('.');
    }
  }
}
