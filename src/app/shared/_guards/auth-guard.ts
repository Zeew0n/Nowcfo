import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import AuthenticationService from '../../modules/user-account/services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public router: Router,
    private authService: AuthenticationService) { }

  canActivate(): boolean {
    const authToken = this.authService.getJwtToken();
    if (authToken) {
      return true;
    } else {
      this.authService.clearStorageToken();
      return false;
    }
  }
}
