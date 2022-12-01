import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { SpinnerService } from '../../core/ui/spinner.service';


@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];
  public isLoading = new Subject();
  public loader: any;
  public loadingStart = false;

  constructor(private spinner: SpinnerService) {
    setInterval(() => {
      if (this.requests.length < 1) {
        this.loadingStart = false;
        this.spinner.stopAll();
      }
    }, 1000);
  }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }

    if (this.requests.length < 1) {
      this.loadingStart = false;
      this.spinner.stopAll();
    }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.requests.push(req);

    if (this.loadingStart === false) {
      this.loadingStart = true;
      this.spinner.start().then((loader) => {
        this.loader = loader;
      });
    }

    return Observable.create((observer: any) => {
      const subscription = next.handle(req).subscribe(
        (event) => {
          if (event instanceof HttpResponse) {
            this.removeRequest(req);
            observer.next(event);
          }
        },
        (err) => {
          this.removeRequest(req);
          observer.error(err);
        },
        () => {
          this.removeRequest(req);
          observer.complete();
        }
      );
      return () => {
        this.removeRequest(req);
        subscription.unsubscribe();
      };
    });
  }
}
