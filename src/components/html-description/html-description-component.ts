import { ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';

@Component({
  selector: 'html-description-component',
  templateUrl: 'html-description-component.html',
  styleUrls: ['html-description-component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HtmlDescriptionComponent {
  @Input() html: string;
}
