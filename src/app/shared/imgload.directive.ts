/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-len */
import { Directive, ElementRef, Input, NgZone, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { HttpClient as CustomHttpClient } from '../../services/http-client';
import { HttpClient, HttpHeaders as Headers } from '@angular/common/http';
import { Platform } from '@ionic/angular';

@Directive({
  selector: '[appImgload]'
})
export class ImgloadDirective implements OnInit, OnChanges {

  @Input() url: any;
  @Input() localurl: any = null;

  constructor(private platform: Platform, private ele: ElementRef, private httpCustom: CustomHttpClient, private http: HttpClient, private zone: NgZone) {
    // this.ele.nativeElement.src = "assets/placeholder.jpg";
  }

  ngOnInit() {
    this.onLoadData();

  }

  isImage(base64Data) {
    if (base64Data == null) return false;

    let mimeType = base64Data?.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/);
    if (mimeType == null) return false;

    mimeType = mimeType[0]?.split('/')[0];
    if (mimeType == 'image') {
        return true
    }
    return false
}

  onLoadData() {
    console.log(this.localurl);
      
    // if (this.platform.is('capacitor')) {
    //   console.log(this.localurl);
      
    //   this.ele.nativeElement.src = this.localurl;
    //   return;
    // }

    const blobToBase64 = (blob) => new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });


    if(this.isImage(this.localurl)) {
        this.ele.nativeElement.src = this.localurl;
        return;
    }

    if (this.localurl != null) {
      fetch(this.localurl).then(r => {
        r.blob().then(blob => {
          blobToBase64(blob).then(base64 => {
            this.zone.run(() => {
              this.ele.nativeElement.src = base64;
            });
          });
        });
      });

      return;
    }

    if (typeof this.url != 'string') {
      this.ele.nativeElement.src = 'assets/placeholder.jpg';
      return;
    }

    if (this.url.includes('/api/api/')) {
      this.url = this.url.replace('/api/api/', '/api/');
    }

    const headerObject: any = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };
    if (this.httpCustom.getAuthorizationToken()) {
      headerObject['X-Auth-Token'] = this.httpCustom.getAuthorizationToken();
    }

    const headers = new Headers(headerObject);
    console.log(this.url);
    this.http.get(this.url, { headers, observe: 'response', responseType: 'blob' }).toPromise()
      .then((response) => {
        blobToBase64(response.body).then(base64 => {
          this.zone.run(() => {
            this.ele.nativeElement.src = base64;
          });
        });

      })
      .catch((downloadErr) => {
        this.ele.nativeElement.src = 'assets/placeholder.jpg';
        console.log('downloadErr', downloadErr);
      });
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.onLoadData();
  }

}
