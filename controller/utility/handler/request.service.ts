import API from '../../app/data/api';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  requestor = 'http';
  defaultSpinner!: HTMLIonLoadingElement;

  constructor(private http: HttpClient,private toastr: ToastrService) {}

  async send(requestName: any, data: any = {}, successHandler: any = null, errorHandler = null, formData = false) {

    if (typeof API.endpoints[requestName] === 'undefined') {
      this.toastr.error('Endpoint not defined');
      return;
    }

    const url = () => {
      let tempurl = '';
      if (typeof API.endpoints[requestName].domain == 'undefined') {
        tempurl = API.defaultDomain() + API.endpoints[requestName].url;
      } else {
        tempurl = API.endpoints[requestName].domain + API.endpoints[requestName].url;
      }

      for (const key in data) {
        const variable = '{{' + key + '}}';
        tempurl = tempurl.replace(variable, data[key]);
      }

      return tempurl;
    };

     const errorHandlerDefault = (error: any) => {
      if (error?.error?.status !== undefined && error?.error?.status) {
        this.toastr.error(error.error.desc);
      } else {
        this.toastr.error('Something went wrong');
      }
    };

    if (API.endpoints[requestName].requestType === 'post' || API.endpoints[requestName].requestType === 'put') {
      const _url = url();

      if (formData === true) {
        const tempData = new FormData();

        for (const key in data) {
          tempData.append(key, data[key]);
        }

        data = tempData;
      }
      const requestor: HttpClient | any = (this as any)[this.requestor];
      requestor[API.endpoints[requestName].requestType]( _url, data).subscribe(
        (value: any) => {
          if (successHandler !== null) {
            successHandler(value);
          }
        },
        (error: any) => {
          if (errorHandler === null) {
            errorHandlerDefault(error);
          }
        });
    }

    if (API.endpoints[requestName].requestType === 'delete') {
      const requestor: HttpClient = (this as any)[this.requestor];
      const subscriber = requestor.delete(url(), { body: data }).subscribe(
        (value) => {
          successHandler(value);
        },
        (error) => {
          if (errorHandler === null) {
            errorHandlerDefault(error);
          }
        });
    }

    if (API.endpoints[requestName].requestType === 'get') {
      const subscriber = (this as any)[this.requestor].get(url()).subscribe(
        (value: any) => {
          successHandler(value);
        },
        (error: any) => {
          if (errorHandler === null) {
            errorHandlerDefault(error);
          }
        });
    }
  }
}
