import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import AuthenticationService from '../../modules/user-account/services/authentication.service';
import decode from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(public router: Router,
    private authService: AuthenticationService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const authToken = this.authService.getJwtToken();
    if (authToken) {
      const tokenPayload = decode(authToken)
      const expectedRole = route.data.expectedRole;
      if (tokenPayload.role === expectedRole) {
        return true;
      } else {
        this.clearStorageToken();
        return false;
      }
    } else {
      this.clearStorageToken();
      return false;
    }
  }

  private clearStorageToken() {
    localStorage.clear();
    this.router.navigate(['login']);
  }
}
