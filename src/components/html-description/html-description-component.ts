import { ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';

@Component({
  selector: 'html-description-component',
  templateUrl: 'html-description-component.html',
  styleUrls: ['html-description-component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HtmlDescriptionComponent implements OnInit {

  @Input() html: string;
  @Input() isRawText: boolean;

  rawText: string;

  ngOnInit(): void {
    this.getExtractText();
  }

  getExtractText() {
    this.rawText = this.html.replace(/(<([^>]+)>)/ig, '');
    this.rawText = this.rawText.replace('&nbsp;', '');
  }
}
