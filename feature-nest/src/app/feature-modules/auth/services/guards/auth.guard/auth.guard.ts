import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authService.autoLogin().pipe(
        take(1),
        map(user => {
          const isAuth = !!Object.keys(user).length;
          if(isAuth) {
            return true;
          }

          // navigate to /auth/login if user is not logged in
          return this.router.createUrlTree(['/auth/login']);
      }));
  }
  
}
