import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[fourDigitNumber]',
})
export class FourDigitNumberDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event.target.value'])
  // onInput(value: string) {
  //   // kiểm tra nếu giá trị không phải là số thì không xử lý
  //   if (!isNaN(parseFloat(value)) && isFinite(+value)) {
  //     // thêm số 0 vào đầu cho đến khi độ dài chuỗi là 4
  //     const newValue = value.toString().padStart(4, '0');
  //     // thiết lập giá trị mới cho input element
  //     this.el.nativeElement.value = newValue;
  //   }
  // }

  onInput(value: string) {
    setTimeout(() => {
      const num = parseInt(value, 10);
      const formattedNum = num.toString().padStart(4, '0');
      this.el.nativeElement.value = formattedNum;
    }, 300);
  }
}
