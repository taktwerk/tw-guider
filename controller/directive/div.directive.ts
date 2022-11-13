import { Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[appDiv]'
})
export class DivDirective implements OnInit, OnDestroy {

  @Output() offClick = new EventEmitter();
  @Input() enableOffClick = false;

  constructor(private elementRef: ElementRef) {

  }

  ngOnInit(): void {
    if(this.enableOffClick) {
      window.addEventListener('popstate', () => {
        this.offClick.emit(null);
      }, {once: true});
      window.addEventListener('pushstate', () => {
        this.offClick.emit(null);
      },  {once: true});
    }
  }

  @HostListener('document:click', ['$event.target'])
  public onGlobalClick(targetElement: Array<any>) {

    if (!targetElement) {
      return;
    }
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.offClick.emit(null);
    }


    // if(this.enableOffClick) {
    //   let elementRefInPath = targetElementPath.find(e => e === this.elementRef.nativeElement);
    //   if (!elementRefInPath) {
    //     this.offClick.emit(null);
    //   }
    // }
  }

  ngOnDestroy(): void {

  }

}
