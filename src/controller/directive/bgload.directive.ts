/* eslint-disable @typescript-eslint/naming-convention */
import { Directive, ElementRef, Input, OnInit, SimpleChanges } from '@angular/core';
import { HttpClient, HttpHeaders as Headers } from '@angular/common/http';
import { Platform } from '@ionic/angular';

@Directive({
  selector: '[appBgload]'
})
export class BgloadDirective implements OnInit {

  @Input() url: any;

  constructor(private platform: Platform, private ele: ElementRef) {
    this.ele.nativeElement.style.backgroundImage = 'url(\'assets/images/icons/emptyphoto.png\')';
    this.ele.nativeElement.style.backgroundPosition = 'center';
    this.ele.nativeElement.style.backgroundRepeat = 'no-repeat';
    this.ele.nativeElement.style.backgroundSize = 'cover';
  }

  ngOnInit() {
    this.onLoadData();
  }


  onLoadData() {
    if (this.url && this.url != null && this.url != '') {
      this.ele.nativeElement.style.backgroundImage = 'url(' + this.url + ')';
    } else {
      this.ele.nativeElement.style.backgroundImage = 'url(\'assets/images/icons/emptyphoto.png\')';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.onLoadData();
  }


}
