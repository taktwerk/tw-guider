import { Directive, ElementRef, Input, NgZone, OnInit } from '@angular/core';
import { HttpClient as CustomHttpClient } from 'services/http-client';
import { HttpClient, HttpHeaders as Headers } from '@angular/common/http';
import { Platform } from '@ionic/angular';

@Directive({
  selector: '[appImgload]'
})
export class ImgloadDirective implements OnInit {

  @Input() url: any;

  constructor(private platform: Platform, private ele: ElementRef, private httpCustom: CustomHttpClient, private http: HttpClient, private zone: NgZone) {
    // this.ele.nativeElement.src = "assets/placeholder.jpg";
  }

  ngOnInit() {

    if(this.platform.is('capacitor')) {
      this.ele.nativeElement.src= this.url.changingThisBreaksApplicationSecurity;
      return;
    }
    
    if(typeof this.url != 'string' ) {
      console.log("Vfvf", this.url );
      this.ele.nativeElement.src = "assets/placeholder.jpg";
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

    console.log(this.url);
    const headers = new Headers(headerObject);

    this.http.get(this.url, { headers: headers, observe: 'response', responseType: 'blob' }).toPromise()
      .then((response) => {

        const blobToBase64 = (blob) => {
          return new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
        }
        blobToBase64(response.body).then(base64 => {
          
          this.zone.run(() => {
            this.ele.nativeElement.src = base64;
          });
        });

      })
      .catch((downloadErr) => {
        this.ele.nativeElement.src = "assets/placeholder.jpg";
        console.log('downloadErr', downloadErr);
      });
  }

}