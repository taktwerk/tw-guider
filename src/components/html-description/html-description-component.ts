import { ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

/**
 * Generated class for the TodoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@Component({
  selector: 'html-description-component',
  templateUrl: 'html-description-component.html',
  styleUrls: ['html-description-component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HtmlDescriptionComponent {

  @Input() html: string;
  @Input() sliceText: boolean;
  
  constructor() {
  }
}
