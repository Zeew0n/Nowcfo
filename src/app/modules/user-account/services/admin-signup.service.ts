import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpGenericCrudService } from "../../../services/http-generic-crud.service";
import { AdminSignUpModel } from '../../../models/user/admin-signup.model';
import { AppUserModel } from '../../../models/app-user.model';


@Injectable({
    providedIn: 'root'
})
export class AdminRegistrationService{
    constructor(private httpClient: HttpClient) {
      
    }

    signUpAdmin(data: AdminSignUpModel) {
        return this.httpClient.post('user/signup', data);
    }

}
