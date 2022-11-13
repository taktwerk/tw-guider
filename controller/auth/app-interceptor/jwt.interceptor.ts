import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthenticationService } from '../authentication.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StateService } from 'src/controller/app/data/state.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private stateService: StateService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const token = this.stateService.token;
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(request);
  }
}
