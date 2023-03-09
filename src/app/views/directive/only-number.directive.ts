import { ToastrService } from 'ngx-toastr';
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyNumber]',
})
export class OnlyNumberDirective {
  constructor(private el: ElementRef, private toastr: ToastrService) {}

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initialValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initialValue.replace(/[^0-9]*/g, '');
    if (initialValue !== this.el.nativeElement.value) {
      this.toastr.warning('Chỉ nên nhập số !!!');

      event.stopPropagation();
    }
  }
}
