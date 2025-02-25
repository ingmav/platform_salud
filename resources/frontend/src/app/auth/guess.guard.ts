import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class GuessGuard  {
  defaultUserPage:string = "/apps";
  constructor(
    public router: Router,
    public authService: AuthService
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if(this.authService.getToken()){
        this.router.navigateByUrl(this.defaultUserPage);
        return false;
      }
    return true;
  }
  canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
    if(!this.authService.getToken()){
      this.router.navigateByUrl(this.defaultUserPage);
      return false;
    }
    return true
  }
}
