import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpGenericCrudService } from "../../../services/http-generic-crud.service";
import { AdminSignUpModel } from '../../../models/user/admin-signup.model';
import { AppUserModel } from '../../../models/app-user.model';


@Injectable({
    providedIn: 'root'
})
export class ForgetPasswordService{
    constructor(private httpClient: HttpClient) {
      
    }

    forgetPassword(data: AdminSignUpModel) {
        return this.httpClient.post('user/ResetPassword', data);
    }

    updatePassword(data: AdminSignUpModel) {
        return this.httpClient.put('user/updatepassword', data);
    }

    verifyToken(id, token) {
        return this.httpClient.get('user/verifyEmailToken', { params: { userId: id, token } });
    }


}
