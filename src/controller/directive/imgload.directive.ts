import { Directive, ElementRef, Input, NgZone, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { HttpClient, HttpHeaders as Headers } from '@angular/common/http';
import { Platform } from '@ionic/angular';

@Directive({
  selector: '[appImgload]'
})
export class ImgloadDirective implements OnInit, OnChanges {

  @Input() url: any;
  @Input() localurl: any = null;

  constructor(private ele: ElementRef) {
    this.ele.nativeElement.src = "assets/images/icons/nophoto.png";
  }

  ngOnInit() {
    this.onLoadData();
  }

  onLoadData() {
    if(this.url && this.url != null && this.url != '') {
      this.ele.nativeElement.style.backgroundImage = 'url('+ this.url +')';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.onLoadData();
  }

}
