import { HttpGenericCrudService } from "../../../services/http-generic-crud.service";
import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AppUserModel } from "../../../models/app-user.model";
import decode from 'jwt-decode';
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export default class AuthenticationService extends HttpGenericCrudService<AppUserModel>{
    errormessage = '';
    baseUrl = environment.API_URL;
    private readonly JWT_TOKEN = 'auth_token';
    private readonly Ref_TOKEN = 'refresh_token';
    private readonly Ref_ROLE = 'user_role';
    private readonly Ref_USER = 'user_name';

    private _authNavStatusSource = new BehaviorSubject<boolean>(false);
    authNavStatus$ = this._authNavStatusSource.asObservable();

    constructor(httpClient: HttpClient,
        private jwtHelper: JwtHelperService,
        public router: Router) {
        super(
            httpClient,
            environment.API_URL,
            'user',
        );

    }

    decodeToken() {
        const token = this.getJwtToken();
        const tokenPayload = decode(token);
        return tokenPayload;
    }

    checkPermission(user): boolean {
        if (user=="User"||user=="Admin") {
            return true;
        } else {
           false;
        }
    }
    login(data) {
        return this.httpClient.post('user/authenticate', data);
    }                                             

    isTokenExpired(token: string) {
        return this.jwtHelper.isTokenExpired(token);
    }

    getJwtToken() {
        return localStorage.getItem(this.JWT_TOKEN);
    }

    getUserName() {
        return localStorage.getItem(this.Ref_USER);
    }

    getUserRole() {
        return localStorage.getItem(this.Ref_ROLE);
    }

    getRefreshToken() {
        
        return localStorage.getItem(this.Ref_TOKEN);
    }

    refreshToken(model) {
        return this.httpClient.post('user/refresh-token', model);
    }

    clearStorageToken() {
        localStorage.clear();
        this.router.navigateByUrl('login');

    }

}