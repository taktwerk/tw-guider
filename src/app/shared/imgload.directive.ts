import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { HttpClient as CustomHttpClient } from 'services/http-client';
import { HttpClient, HttpHeaders as Headers } from '@angular/common/http';

@Directive({
  selector: '[appImgload]'
})
export class ImgloadDirective implements OnInit {

  @Input() url: any;

  constructor(private ele: ElementRef, private httpCustom: CustomHttpClient, private http: HttpClient) {
    this.ele.nativeElement.src = "assets/placeholder.jpg";
  }

  ngOnInit() {
    if(typeof this.url != 'string' ) {
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

    console.log('headerObject', headerObject);

    const headers = new Headers(headerObject);

    this.http.get(this.url, { headers: headers, observe: 'response', responseType: 'blob' }).toPromise()
      .then((response) => {
        console.log('download response ', response);
        this.ele.nativeElement.src = response.url;
        return;
      })
      .catch((downloadErr) => {
        console.log('downloadErr', downloadErr);
        return;
      });
  }

}