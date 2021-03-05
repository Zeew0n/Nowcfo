

import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import AuthenticationService from '../../modules/user-account/services/authentication.service';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { UserAuthResponseModel } from '../../models/user/user-auth-response.model';

// @Injectable()
// export class TokenInterceptor implements HttpInterceptor {
//   private isRefreshing = false;
//   private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

//   constructor(private authService: AuthenticationService,
//     private toastr: ToastrService) {
//   }

//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     // add authorization header with jwt token if available


//     // add authorization header with jwt token if available
//     const token = localStorage.getItem('auth_token');
//     request = request.clone({
//       url: environment.API_URL + request.url
//     });
//     if (token) {
//       request = request.clone({
//         setHeaders: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//     }
//     return next.handle(request);
    
//   }

//   private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
//     if (!this.isRefreshing) {
//       this.isRefreshing = true;
//       this.refreshTokenSubject.next(null);
//       const model = { refreshToken: this.authService.getRefreshToken() };
//       return this.authService.refreshToken(model).pipe(
//         switchMap((res: UserAuthResponseModel) => {
//           const token = res.jwtToken;
//           localStorage.clear();
//           localStorage.setItem('auth_token', token);
//           localStorage.setItem('refresh_token', res.refreshToken);
//           this.isRefreshing = false;
//           this.refreshTokenSubject.next(token);
//           return next.handle(this.addToken(request, token));
//         }),
//         catchError((e) => {
//           this.authService.clearStorageToken();
//           return throwError(e);
//         })
//       );

//     } else {
//       return this.refreshTokenSubject.pipe(
//         filter(token => token != null),
//         take(1),
//         switchMap(jwt => {
//           return next.handle(this.addToken(request, jwt));
//         }));
//     }
//   }
  

//   private addToken(request: HttpRequest<any>, token: string) {
//     return request.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//   }

//   private addRequestUri(request: HttpRequest<any>) {
//     return request.clone({
//       url: environment.API_URL+"/"+ request.url
//     });
//   }

// }




@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthenticationService,
    private toastr: ToastrService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    request = this.addRequestUri(request);
    const token = this.authService.getJwtToken();
    if (token) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return this.handle401Error(request, next);
      } else if (error instanceof HttpErrorResponse && error.status === 403) {
        this.toastr.error("You don't have access for this operation please contact superadmin.", "Error!");
        return throwError(error);
      } else {
        return throwError(error);
      }
    }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      const model = { refreshToken: this.authService.getRefreshToken() };
      return this.authService.refreshToken(model).pipe(
        switchMap((res: UserAuthResponseModel) => {
          const token = res.jwtToken;
          localStorage.clear();
          localStorage.setItem('auth_token', token);
          localStorage.setItem('refresh_token', res.refreshToken);
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token);
          return next.handle(this.addToken(request, token));
        }),
        catchError((e) => {
          this.authService.clearStorageToken();
          return throwError(e);
        })
      );

    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addToken(request, jwt));
        }));
    }
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private addRequestUri(request: HttpRequest<any>) {
    return request.clone({
      url: environment.API_URL+ request.url
    });
  }

}
