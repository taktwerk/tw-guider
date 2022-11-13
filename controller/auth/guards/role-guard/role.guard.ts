import { StateService } from 'src/controller/app/data/state.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private state: StateService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isAuthorized(route);
  }
  isAuthorized(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['expectedRoles'] as Array<any>;
    return expectedRoles.includes(this.state.role);
  }
}
