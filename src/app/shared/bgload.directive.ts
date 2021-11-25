import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { HttpClient as CustomHttpClient } from 'services/http-client';
import { HttpClient, HttpHeaders as Headers } from '@angular/common/http';
import { Platform } from '@ionic/angular';

@Directive({
  selector: '[appBgload]'
})
export class BgloadDirective implements OnInit {

  @Input() url: any;

  constructor(private platform: Platform, private ele: ElementRef, private httpCustom: CustomHttpClient, private http: HttpClient) {
    this.ele.nativeElement.style.backgroundImage = "url('assets/placeholder.jpg')";
    this.ele.nativeElement.style.backgroundPosition = 'center';
    this.ele.nativeElement.style.backgroundRepeat = 'no-repeat';
    this.ele.nativeElement.style.backgroundSize = 'cover';
  }

  ngOnInit() {

    if(this.platform.is('capacitor')) {
      this.ele.nativeElement.style.backgroundImage = "url(" + this.url.changingThisBreaksApplicationSecurity + ")";
      return;
    }

    if(typeof this.url != 'string') {
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

    this.http.get(this.url, { headers: headers, observe: 'response', responseType: 'blob' }).toPromise()
      .then((response) => {
        this.ele.nativeElement.style.backgroundImage = "url('" + response.url + "')";
        return;
      })
      .catch((downloadErr) => {
        console.log('downloadErr', downloadErr);
        return;
      });
  }

}
