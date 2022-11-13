import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appInput]'
})
export class InputDirective {

  @Input() max = Infinity;
  constructor(private elementRef: ElementRef) {
  }

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initalValue = this.elementRef.nativeElement.value;
    this.elementRef.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
    if ( initalValue !== this.elementRef.nativeElement.value) {
      event.stopPropagation();
    }

    if(this.max < initalValue) {
      this.elementRef.nativeElement.value = this.max
    }
  }
}
