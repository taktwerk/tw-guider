import { StateService } from 'src/controller/app/data/state.service';
import { Directive, Input, ElementRef } from '@angular/core';


@Directive({
    selector: '[accessControl]'
})
export class AccessControlDirective {
    isAuthorized: any;
    constructor(
        private elem: ElementRef,
        private state: StateService,
    ) { }
    @Input() roles: Array<any> = [];

    ngOnInit() {
      this.roleCheck();
    }

    roleCheck() {
        if (this.roles.includes(this.state.role) == false) {
          if(this.elem.nativeElement && this.elem.nativeElement?.parentNode) {
            this.elem.nativeElement.parentNode.removeChild(this.elem.nativeElement);
          }
        }
    }

    ngOnChanges() {
        this.roleCheck();
    }
}
