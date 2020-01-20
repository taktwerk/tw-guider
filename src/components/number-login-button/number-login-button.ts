import {Component, Output, EventEmitter, Input} from '@angular/core';

/**
 * Generated class for the NumberLoginButton component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'number-login-button',
  template: '<button large [disabled]="isDisabled" ion-button color="light" (click)="tap()">' +
      '{{num}}' +
      '<ion-icon *ngIf="icon" name="{{icon}}"></ion-icon></button>',
})
export class NumberLoginButtonComponent {
  @Input() num: number;
  @Input() icon: string;
  @Input() isDisabled: boolean = false;
  @Output() onTap: EventEmitter<any> = new EventEmitter();

  tap(): void {
    this.onTap.emit(this.num);
  }

  constructor() {
    console.log('Hello NumberLoginButtonComponent Component');
  }

}
